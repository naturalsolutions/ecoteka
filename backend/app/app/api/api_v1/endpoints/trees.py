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

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings
from app.tasks import import_geofile

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
