from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import get_db
from app.core import set_policies, authorization, get_current_active_user
from app.worker import import_geofile_task, create_mbtiles_task
from starlette.responses import FileResponse

import json

router = APIRouter()
policies = {
    "trees:get": ["owner", "manager", "contributor", "reader"],
    "trees:add": ["owner", "manager", "contributor"],
    "trees:update": ["owner", "manager", "contributor"],
    "trees:delete": ["owner", "manager", "contributor"],
    "trees:import_from_geofile": ["owner", "manager", "contributor"],
    "trees:export": ["owner", "manager", "contributor"],
}
set_policies(policies)


@router.post("/import-from-geofile", response_model=schemas.GeoFile)
def import_from_geofile(
    organization_id: int,
    *,
    auth=Depends(authorization("trees:import_from_geofile")),
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


@router.get("/{tree_id}", response_model=schemas.tree.Tree_xy)
def get(
    organization_id: int,
    tree_id: int,
    auth=Depends(authorization("trees:get")),
    db: Session = Depends(get_db),
    current_user: models = Depends(get_current_active_user),
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
    """Manual tree registration"""
    tree_with_user_info = schemas.TreeCreate(
        geom=f"POINT({tree.x} {tree.y})",
        properties=json.dumps(jsonable_encoder(tree)),
        user_id=current_user.id,
        organization_id=current_user.organization_id,
    )

    response = crud.crud_tree.tree.create(db, obj_in=tree_with_user_info).to_xy()

    create_mbtiles_task.delay(current_user.organization_id)
    return response


@router.patch("/{tree_id}", response_model=schemas.tree.Tree_xy)
def update(
    organization_id: int,
    tree_id: int,
    *,
    auth=Depends(authorization("trees:update")),
    db: Session = Depends(get_db),
    update_data: schemas.tree.TreePatch,
    current_user: models = Depends(get_current_active_user),
) -> Any:
    """Update tree info"""
    tree_in_db = get_tree_if_authorized(db, current_user, tree_id)
    properties = json.loads(tree_in_db.properties)

    request_data: dict = dict(jsonable_encoder(update_data, exclude_unset=True))
    request_properties = {
        key: request_data[key] for key in request_data if key not in ("x", "y")
    }

    properties.update(request_properties)
    response = crud.crud_tree.tree.update(
        db,
        db_obj=tree_in_db,
        obj_in=dict(
            {"properties": properties},
            **(
                dict(geom=f"POINT({request_data['x']} {request_data['y']})")
                if request_data["x"] is not None and request_data["y"] is not None
                else dict()
            ),
        ),
    ).to_xy()

    create_mbtiles_task.delay(current_user.organization_id)
    return response


@router.delete("/{tree_id}", response_model=schemas.tree.Tree_xy)
def delete(
    organization_id: int,
    tree_id: int,
    auth=Depends(authorization("trees:delete")),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
) -> Any:
    """Deletes a tree"""
    if get_tree_if_authorized(db, current_user, tree_id):
        response = crud.crud_tree.tree.remove(db, id=tree_id).to_xy()

        create_mbtiles_task.delay(current_user.organization_id)
        return response


@router.get("/export")
def trees_export(
    format: str = "geojson",
    auth=Depends(authorization("trees:export")),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
) -> Any:
    """Export the trees from one organization"""

    print(auth)

    return True

    # return FileResponse(file_location, media_type='application/octet-stream',filename=file_name)
