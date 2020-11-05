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


@router.get("/{organization_id}")
def get_organization_by_id(
    *,
    organization_id: int,
    db: Session = Depends(deps.get_db)
) -> Optional[schemas.Organization]:
    """
    get one organization by id
    """
    organization_in_db = crud.organization.get(db, id=organization_id)

    if not organization_in_db:
        raise HTTPException(status_code=404, detail="Organization not found")

    total_trees = crud.organization.get_total_tree_by_id(
        db, id=organization_id)

    if not total_trees:
        total_trees = 0

    organization_response = schemas.Organization(
        id=organization_in_db.id,
        name=organization_in_db.name,
        slug=organization_in_db.slug,
        total_trees=total_trees
    )

    return organization_response


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
