import io
from typing import Any, List, Union
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Body,
)
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import get_db
from app.core import (
    authorization,
    permissive_authorization,
    get_current_user,
    settings,
)
from app.worker import import_geofile_task

from fastapi.responses import StreamingResponse
import geopandas as gpd

router = APIRouter()
settings.policies["trees"] = {
    "trees:get": ["admin", "owner", "manager", "contributor", "reader"],
    "trees:add": ["admin", "owner", "manager", "contributor"],
    "trees:update": ["admin", "owner", "manager", "contributor"],
    "trees:delete": ["admin", "owner", "manager", "contributor"],
    "trees:bulk_delete": ["admin", "owner", "manager", "contributor"],
    "trees:get_interventions": [
        "admin",
        "owner",
        "manager",
        "contributor",
        "reader",
    ],
    "trees:import": ["admin", "owner", "manager", "contributor"],
    "trees:export": ["admin", "owner", "manager", "contributor"],
}


@router.post(
    "/import",
    response_model=schemas.GeoFile,
    dependencies=[Depends(authorization("trees:import"))],
)
def trees_import(
    *,
    db: Session = Depends(get_db),
    name: str,
) -> Any:
    """
    import trees from geofile
    """
    geofile = crud.geo_file.get_by_name(db, name=name)

    if not geofile:
        raise HTTPException(status_code=404, detail=f"{name} not found")

    if not geofile.crs:
        raise HTTPException(status_code=415, detail="crs not found")

    if geofile.driver in ["xlsx", "xls", "csv"]:
        if not geofile.longitude_column:
            raise HTTPException(
                status_code=415, detail="longitude_column not found"
            )

        if not geofile.latitude_column:
            raise HTTPException(
                status_code=415, detail="latitude_column not found"
            )

    if geofile.status == models.GeoFileStatus.IMPORTING:
        raise HTTPException(
            status_code=409,
            detail=f"{geofile.name} has already started an import process",
        )

    import_geofile_task.delay(name)

    return geofile


@router.get("/export", dependencies=[Depends(authorization("trees:export"))])
def trees_export(
    organization_id: int,
    format: str = "geojson",
    db: Session = Depends(get_db),
) -> Any:
    sql = f"SELECT * FROM public.tree WHERE organization_id = {organization_id}"
    df = gpd.read_postgis(sql, db.bind)

    if df.empty:
        raise HTTPException(
            status_code=404, detail="this organization has no trees"
        )

    if format not in ["geojson", "csv", "xlsx"]:
        raise HTTPException(status_code=404, detail="format not found")

    stream: Union[io.BytesIO, io.StringIO] = io.BytesIO()

    if format == "geojson":
        df.to_file(stream, driver="GeoJSON")
        media_type = "application/geo+json"

    if format in ["csv", "xlsx"]:
        df["lat"] = df.geom.y
        df["lng"] = df.geom.x
        df_properties = gpd.pd.DataFrame(df["properties"].values.tolist())
        col = df.columns.difference(["properties"])
        df = gpd.pd.concat([df[col], df_properties], axis=1)
        df = df.drop(columns=["geom"])

    if format == "csv":
        stream = io.StringIO(df.to_csv())
        media_type = "text/csv"

    if format == "xlsx":
        df.to_excel(stream, engine="xlsxwriter")
        media_type = "application/xlsx"

    response = StreamingResponse(
        iter([stream.getvalue()]), media_type=media_type
    )
    response.headers[
        "Content-Disposition"
    ] = f"attachment; filename=export.{format}"

    return response


@router.get(
    "/metrics",
    dependencies=[Depends(permissive_authorization("trees:get"))],
    response_model=schemas.tree.Metrics,
)
def get_metrics(
    organization_id: int, fields: str, db: Session = Depends(get_db)
) -> Any:
    """Get Trees properties metrics"""
    requested_fields = fields.split(",")
    ratio = crud.tree.get_properties_completion_ratio(
        db, organization_id, requested_fields
    )
    aggregates = crud.tree.get_properties_aggregates(
        db, organization_id, requested_fields
    )
    metrics = schemas.tree.Metrics(ratio=ratio, aggregates=aggregates)
    return metrics


@router.get(
    "/{tree_id}",
    dependencies=[Depends(permissive_authorization("trees:get"))],
    response_model=schemas.tree.Tree_xy,
)
def get(
    tree_id: int,
    db: Session = Depends(get_db),
) -> Any:
    """Gets a tree"""
    tree = crud.tree.get(db, tree_id)

    if not tree:
        raise HTTPException(status_code=404, detail=f"{tree_id} not found")

    return tree.to_xy()


@router.post(
    "",
    response_model=schemas.tree.Tree_xy,
    dependencies=[Depends(authorization("trees:add"))],
)
async def add(
    organization_id: int,
    *,
    db: Session = Depends(get_db),
    tree: schemas.TreePost,
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """Add one tree"""
    try:
        tree_with_user_info = schemas.TreeCreate(
            geom=f"POINT({tree.x} {tree.y})",
            properties=tree.properties,
            user_id=current_user.id,
            organization_id=organization_id,
        )

        tree_in_db = crud.crud_tree.tree.create(db, obj_in=tree_with_user_info)

        return tree_in_db.to_xy()
    except Exception as error:
        return HTTPException(status_code=500, detail=error)


@router.put(
    "/{tree_id}",
    response_model=schemas.tree.Tree_xy,
    dependencies=[Depends(authorization("trees:update"))],
)
def update(
    tree_id: int,
    *,
    db: Session = Depends(get_db),
    payload: schemas.tree.TreeUpdate,
) -> Any:
    """Update one tree"""
    tree_in_db = crud.tree.get(db, id=tree_id)

    if tree_in_db is None:
        return HTTPException(
            status_code=404, detail=f"Tree {tree_id} not found"
        )

    properties = {k: v for (k, v) in payload.properties.items() if v != ""}
    tree_in_db.properties = properties
    db.commit()
    return tree_in_db.to_xy()


@router.delete(
    "/bulk_delete", dependencies=[Depends(authorization("trees:bulk_delete"))]
)
async def bulk_delete(
    trees: List[int] = Body(..., embed=True),
    db: Session = Depends(get_db),
) -> Any:
    """Bulk delete"""
    for tree_id in trees:
        crud.crud_tree.tree.remove(db, id=tree_id)

    return trees


@router.delete(
    "/{tree_id}",
    response_model=schemas.tree.Tree_xy,
    dependencies=[Depends(authorization("trees:delete"))],
)
def delete(
    tree_id: int,
    db: Session = Depends(get_db),
) -> Any:
    """Deletes a tree"""
    response = crud.crud_tree.tree.remove(db, id=tree_id).to_xy()

    return response


@router.get(
    "/{tree_id}/interventions",
    response_model=List[schemas.Intervention],
    dependencies=[Depends(authorization("trees:get_interventions"))],
)
def get_interventions(
    tree_id: int,
    *,
    db: Session = Depends(get_db),
):
    """Get all interventions from a tree"""
    return crud.intervention.get_by_tree(db, tree_id)
