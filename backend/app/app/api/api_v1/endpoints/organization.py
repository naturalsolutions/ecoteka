import os
import io
import uuid
import json
from typing import Any, List, Optional
from pydantic import Json
import geopandas as gpd
from fastapi import (
    APIRouter,
    Body,
    Depends,
    HTTPException
)
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings
from app.core import security

router = APIRouter()

@router.post('/', response_model=schemas.Organization)
def create_organization (
    *,
    db: Session = Depends(deps.get_db),
    organization: schemas.OrganizationCreate,
    current_user: models.User = Depends(deps.get_current_active_user)
):
    return crud.organization.create(db, obj_in=organization).to_schema()

@router.patch("/{id}", response_model=schemas.Organization)
def update_organization(
    id: int,
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
    organization: schemas.OrganizationUpdate
):
    org = crud.organization.get(db, id=id)

    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    return crud.organization.update(
        db,
        db_obj=org,
        obj_in=jsonable_encoder(organization, exclude_unset=True)
    )

@router.get("/{id}")
def get_organization_by_id(
    *,
    id: int,
    db: Session = Depends(deps.get_db)
) -> Optional[schemas.Organization]:
    """
    get one organization by id
    """
    organization_in_db = crud.organization.get(db, id=id)

    if not organization_in_db:
        raise HTTPException(status_code=404, detail="Organization not found")

    total_trees = crud.organization.get_total_tree_by_id(
        db, id=id)

    if not total_trees:
        total_trees = 0

    organization_response = schemas.Organization(
        **jsonable_encoder(organization_in_db.to_schema(), exclude=['total_trees']),
        total_trees = total_trees
    )

    return organization_response

@router.get("/{id}/teams", response_model=List[schemas.Organization])
def get_teams(
    id: int,
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    return [
        org.to_schema() for org in crud.organization.get_teams(db, parent_id=id)
    ]

@router.get("/geojson/{organization_id}")
def generate_style(
    *,
    organization_id: int,
    db: Session = Depends(deps.get_db)
) -> Any:
    """
    generate geojson from organization
    """
    organization_in_db = crud.organization.get(db, id=organization_id)

    if not organization_in_db:
        raise HTTPException(status_code=404, detail="Organization not found")

    sql = f'SELECT * FROM public.tree WHERE organization_id = {organization_in_db.id}'
    df = gpd.read_postgis(sql, db.bind)
    data = df.to_json()
    geojson = json.loads(data)

    return geojson
