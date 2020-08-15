import os
import uuid
from typing import Any, List

from fastapi import (
    APIRouter,
    Body,
    Depends,
    HTTPException,
    File,
    UploadFile
)
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings

router = APIRouter()


@router.post("/upload", response_model=schemas.GeoFile)
async def upload_geo_file(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db)
):
    """
    Upload a geo file
    """
    try:
        filename_parts = os.path.splitext(file.filename)
        extension = filename_parts[1][1:]

        if not extension in settings.GEO_FILES_ALLOWED:
            raise HTTPException(status_code=415, detail="File format unsupported")

        unique_name = uuid.uuid4()
        unique_filename = f"{unique_name}.{extension}"
        copy_filename = f"{settings.UPLOADED_FILES_FOLDER}/{unique_filename}"
        copy_file = await file.read()

        with open(copy_filename, "wb") as f:
            f.write(copy_file)

        geofile = models.GeoFile(
            name=unique_name,
            original_name=file.filename,
            extension=extension
        )

        if not geofile.is_valid():
            raise HTTPException(status_code=415, detail="File corrupt")

        db.add(geofile)
        db.commit()

    finally:
        await file.close()

    return geofile


@router.get("/", response_model=List[schemas.GeoFile])
def read_geo_files(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Retrieve geo files.
    """
    geo_files = crud.geo_file.get_multi(db, skip=skip, limit=limit)
    return geo_files
