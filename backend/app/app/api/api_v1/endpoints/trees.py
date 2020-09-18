import os
import uuid
from typing import Any, List

from fastapi import (
    APIRouter,
    Body,
    Depends,
    HTTPException,
    BackgroundTasks
)
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
import geopandas as gpd
import numpy as np

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings
from app.tasks import (
    import_geofile,
    create_mbtiles
)

router = APIRouter()


@router.post("/import-from-geofile", response_model=schemas.GeoFile)
def import_from_geofile(
    *,
    db: Session = Depends(deps.get_db),
    name: str,
    current_user: models.User = Depends(deps.get_current_active_user),
    background_tasks: BackgroundTasks
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

    background_tasks.add_task(
        import_geofile,
        db=db,
        geofile=geofile
    )

    return geofile


@router.post('/add', response_model=schemas.tree.Tree_xy)
def add(
    *,
    db: Session = Depends(deps.get_db),
    tree: schemas.TreePost,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Manual tree registration"""
    tree_with_user_info = schemas.TreeCreate(
        geom=f'POINT({tree.x} {tree.y})',
        properties=None,
        user_id=current_user.id,
        organization_id=current_user.organization_id)

    return crud.crud_tree.tree.create(db, obj_in=tree_with_user_info).to_xy()


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
