import os
import uuid
from typing import Any, List

from fastapi import (
    APIRouter,
    Body,
    Depends,
    HTTPException
)
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
import geopandas as gpd
import numpy as np

from app import crud, models, schemas
from app.api import deps
from app.core import (
    celery_app
)
from app.worker import celery_app
import json
import logging
router = APIRouter()


def get_tree_if_authorized(db: Session, current_user: models.User, tree_id: int):
    '''Returns a tree if it exists and the user has access rights to it'''
    tree_in_db = crud.crud_tree.tree.get(db, tree_id)
    
    if not tree_in_db:
        raise HTTPException(status_code=404, detail='Tree does not exist')

    if tree_in_db.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail='Cannot request a tree that does not belong to your organization')

    return tree_in_db


@router.post("/import-from-geofile", response_model=schemas.GeoFile)
def import_from_geofile(
    *,
    db: Session = Depends(deps.get_db),
    name: str,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    import trees from geofile
    """
    geofile = crud.geo_file.get_by_name(db, name=name)

    if not geofile:
        raise HTTPException(status_code=404, detail=f"{name} not found")

    if not geofile.crs:
        raise HTTPException(status_code=415, detail='crs not found')

    if geofile.driver in ['xlsx', 'xls', 'csv']:
        if not geofile.longitude_column:
            raise HTTPException(status_code=415, detail='longitude_column not found')

        if not geofile.latitude_column:
            raise HTTPException(status_code=415, detail='latitude_column not found')

    if geofile.status == models.GeoFileStatus.IMPORTING:
        raise HTTPException(
            status_code=409,
            detail=f"{geofile.name} has already started an import process")

    celery_app.import_geofile_task.delay(name)

    return geofile

@router.get('/{tree_id}', response_model=schemas.tree.Tree_xy)
def get(
    tree_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models = Depends(deps.get_current_active_user)
) -> Any:
    """Gets a tree"""
    return get_tree_if_authorized(db, current_user, tree_id).to_xy()

@router.post('/', response_model=schemas.tree.Tree_xy)
def add(
    *,
    db: Session = Depends(deps.get_db),
    tree: schemas.TreePost,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Manual tree registration"""
    tree_with_user_info = schemas.TreeCreate(
        geom=f'POINT({tree.x} {tree.y})',
        properties=json.dumps(jsonable_encoder(tree)),
        user_id=current_user.id,
        organization_id=current_user.organization_id)
    
    response = crud.crud_tree.tree.create(db, obj_in=tree_with_user_info).to_xy()
    
    celery_app.create_mbtiles_task.delay(current_user.organization_id)
    return response

@router.patch('/{tree_id}', response_model=schemas.tree.Tree_xy)
def update(
    tree_id: int,
    *,
    db: Session = Depends(deps.get_db),
    update_data: schemas.tree.TreePatch,
    current_user: models = Depends(deps.get_current_active_user)
) -> Any:
    """Update tree info"""
    tree_in_db = get_tree_if_authorized(db, current_user, tree_id)
    properties = json.loads(tree_in_db.properties)

    request_data: dict = dict(jsonable_encoder(update_data, exclude_unset=True))
    request_properties = {
        key: request_data[key] for key in request_data if key not in ('x','y')
    }

    properties.update(request_properties)
    response = crud.crud_tree.tree.update(
        db,
        db_obj=tree_in_db,
        obj_in=dict(
            { 'properties': properties },
            **(dict(geom = f"POINT({request_data['x']} {request_data['y']})") if request_data['x'] is not None and request_data['y'] is not None else dict())
        )
    ).to_xy()

    celery_app.create_mbtiles_task.delay(current_user.organization_id)
    return response

@router.delete('/{tree_id}', response_model=schemas.tree.Tree_xy)
def delete(
    tree_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """Deletes a tree"""
    if get_tree_if_authorized(db, current_user, tree_id):
        response = crud.crud_tree.tree.remove(db, id = tree_id).to_xy()

        celery_app.create_mbtiles_task.delay(current_user.organization_id)
        return response

@router.get("/get-centroid-organization/{organization_id}", response_model=schemas.Coordinate)
def get_center_from_organization(
    *,
    db: Session = Depends(deps.get_db),
    organization_id: int,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    find centroid of Organization
    """
    sql = f'SELECT * FROM public.tree WHERE organization_id = {organization_id}'
    df = gpd.read_postgis(sql, db.bind)

    X = df.geom.apply(lambda p: p.x)
    Y = df.geom.apply(lambda p: p.y)
    xCenter = np.sum(X) / len(X)
    yCenter = np.sum(Y) / len(Y)

    coordinate = schemas.Coordinate(
        longitude=xCenter,
        latitude=yCenter,
    )

    return coordinate
