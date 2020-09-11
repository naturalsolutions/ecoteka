import os
import uuid
import json
from typing import Any, List

from fastapi import (
    APIRouter,
    Body,
    Depends,
    HTTPException,
    File,
    UploadFile
)

from sqlalchemy.orm import Session
from pydantic import Json

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings

router = APIRouter()


@router.post("/upload", response_model=schemas.GeoFile)
async def upload_geo_file(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
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
            f.write(copy_file)  # type: ignore

        geofile = models.GeoFile(
            name=str(unique_name),
            original_name=file.filename,
            extension=extension,
            user_id=current_user.id
        )

        geofile_exists = crud.geo_file.get_by_checksum(db, checksum=geofile.checksum)

        if geofile_exists:
            os.remove(geofile.get_filepath(extended=False))
            raise HTTPException(
                status_code=400,
                detail=f"The geofile with the {geofile.checksum} checksum already exists in the system.")

        if not geofile.is_valid():
            raise HTTPException(status_code=415, detail="File corrupt")

        db.add(geofile)
        db.commit()

    finally:
        await file.close()

    return geofile


@router.put("/", response_model=schemas.GeoFile)
def update_geo_file(
    *,
    db: Session = Depends(deps.get_db),
    geofile_in: schemas.GeoFileUpdate,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Update geo file.
    """
    name = geofile_in.name.__str__()
    geofile = crud.geo_file.get_by_name(db, name=name)

    if not geofile:
        raise HTTPException(
            status_code=404,
            detail=f"The geofile with name {name} does not exist in the system",
        )

    geofile = crud.geo_file.update(db, db_obj=geofile, obj_in=geofile_in)

    return geofile


@router.get("/", response_model=List[schemas.GeoFile])
def read_geo_files(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Retrieve geo files.
    """
    geo_files = crud.geo_file.get_multi(db,
                                        user=current_user,
                                        skip=skip,
                                        limit=limit)
    return geo_files
