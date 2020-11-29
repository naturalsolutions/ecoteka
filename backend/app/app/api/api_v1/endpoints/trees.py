from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import get_db
from app.core import set_policies, authorization, get_current_active_user
from app.worker import import_geofile_task, create_mbtiles_task
from starlette.responses import FileResponse
import geopandas as gpd
import json
import tempfile

router = APIRouter()
policies = {
    "trees:get": ["owner", "manager", "contributor", "reader"],
    "trees:add": ["owner", "manager", "contributor"],
    "trees:update": ["owner", "manager", "contributor"],
    "trees:delete": ["owner", "manager", "contributor"],
    "trees:get_interventions": ["owner", "manager", "contributor"],
    "trees:import": ["owner", "manager", "contributor"],
    "trees:export": ["owner", "manager", "contributor"],
    "trees:bulk_delete": ["owner", "manager", "contributor"],
}
set_policies(policies)

@router.post("/import", response_model=schemas.GeoFile)
def trees_import(
    organization_id: int,
    *,
    auth=Depends(authorization("trees:import")),
    db: Session = Depends(get_db),
    name: str,
    current_user: models.User = Depends(get_current_active_user),
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
            raise HTTPException(status_code=415, detail="longitude_column not found")

        if not geofile.latitude_column:
            raise HTTPException(status_code=415, detail="latitude_column not found")

    if geofile.status == models.GeoFileStatus.IMPORTING:
        raise HTTPException(
            status_code=409,
            detail=f"{geofile.name} has already started an import process",
        )

    import_geofile_task.delay(name)

    return geofile

@router.get("/export")
def trees_export(
    organization_id: int,
    format: str = "geojson",
    auth=Depends(authorization("trees:export")),
    db: Session = Depends(get_db),
) -> Any:
    """Export the trees from one organization"""
    sql = f"SELECT * FROM public.tree WHERE organization_id = {organization_id}"
    df = gpd.read_postgis(sql, db.bind)
    tempfile_name = tempfile.mkstemp()[1]

    if df.empty:
        return HTTPException(
            status_code=404,
            detail="this organization has no trees"
        )
    
    if format == 'geojson':
        df.to_file(tempfile_name, driver="GeoJSON")
        filename="export.geojson"
        return FileResponse(tempfile_name, media_type='application/octet-stream',filename=filename)
    else:
        return HTTPException(
            status_code=404,
            detail="format not found"
        )


@router.get("/{tree_id}", response_model=schemas.tree.Tree_xy)
def get(
    tree_id: int,
    auth=Depends(authorization("trees:get")),
    db: Session = Depends(get_db),
) -> Any:
    """Gets a tree"""
    tree = crud.tree.get(db, tree_id)

    if not tree:
        raise HTTPException(status_code=404, detail=f"{tree_id} not found")

    return tree.to_xy()


@router.post("/", response_model=schemas.tree.Tree_xy)
def add(
    organization_id: int,
    *,
    auth=Depends(authorization("trees:add")),
    db: Session = Depends(get_db),
    tree: schemas.TreePost,
    current_user: models.User = Depends(get_current_active_user),
) -> Any:
    """Add one tree"""
    tree_with_user_info = schemas.TreeCreate(
        geom=f"POINT({tree.x} {tree.y})",
        properties=tree.properties,
        user_id=current_user.id,
        organization_id=organization_id,
    )

    response = crud.crud_tree.tree.create(db, obj_in=tree_with_user_info).to_xy()

    create_mbtiles_task.delay(organization_id)
    return response


@router.put("/{tree_id}", response_model=schemas.tree.Tree_xy)
def update(
    tree_id: int,
    *,
    auth=Depends(authorization("trees:update")),
    db: Session = Depends(get_db),
    payload: schemas.tree.TreeUpdate
) -> Any:
    """Update one tree"""
    tree_in_db = crud.tree.get(db, id=tree_id)

    if tree_in_db is None:
        return HTTPException(
            status_code=404,
            detail=f"Tree {tree_id} not found"
        )

    properties = {k: v for (k,v) in payload.properties.items() if v is not ''}
    tree_in_db.properties = properties
    db.commit()
    create_mbtiles_task.delay(tree_in_db.organization_id)
    return tree_in_db.to_xy()

@router.delete("/bulk_delete")
def bulk_delete(
    organization_id: int,
    trees: List[int],
    db: Session = Depends(get_db),
    auth=Depends(authorization("trees:bulk_delete")),
) -> Any:
    """Bulk delete"""
    for tree_id in trees:
        crud.crud_tree.tree.remove(db, id=tree_id)

    create_mbtiles_task.delay(organization_id)
    
    return trees

@router.delete("/{tree_id}", response_model=schemas.tree.Tree_xy)
def delete(
    organization_id: int,
    tree_id: int,
    auth=Depends(authorization("trees:delete")),
    db: Session = Depends(get_db),
) -> Any:
    """Deletes a tree"""
    response = crud.crud_tree.tree.remove(db, id=tree_id).to_xy()
    create_mbtiles_task.delay(organization_id)
        
    return response

@router.get("/{tree_id}/interventions", response_model=List[schemas.Intervention])
def get_interventions(
    tree_id: int,
    *,
    auth=Depends(authorization("trees:export")),
    db: Session = Depends(get_db),
):
    """Get all interventions from a tree"""
    return crud.intervention.get_by_tree(db, tree_id)
