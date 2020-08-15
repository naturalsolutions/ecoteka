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
    background_tasks: BackgroundTasks
) -> Any:
    """
    import trees from geofile 
    """
    geofile = crud.geo_file.get_by_name(db, name=name)

    background_tasks.add_task(
        import_geofile,
        db=db,
        geofile=geofile
    )

    return geofile
