from fastapi import APIRouter, Body, Depends, HTTPException
from app.schemas import Intervention, InterventionCreate, InterventionUpdate
from app.models import User
from app import crud
from app.api import get_db
from app.core import authorization, set_policies, get_current_active_user

from sqlalchemy.orm import Session
from typing import List, Any

router = APIRouter()

policies = {
    "interventions:create": ["owner", "manager", "contributor"],
    "interventions:get": ["owner", "manager", "contributor", "reader"],
    "interventions:get_year": ["owner", "manager", "contributor", "reader"],
    "interventions:update": ["owner", "manager", "contributor"],
    "interventions:delete": ["owner", "manager", "contributor"],
}
set_policies(policies)


@router.post("/", response_model=Intervention)
def create(
    organization_id: int,
    *,
    auth=Depends(authorization("interventions:create")),
    request_intervention: InterventionCreate,
    db: Session = Depends(get_db),
):
    request_intervention.organization_id = organization_id
    return crud.intervention.create(db, obj_in=request_intervention)


@router.get("/{intervention_id}", response_model=Intervention)
def get(
    organization_id: int,
    intervention_id: int,
    *,
    auth=Depends(authorization("interventions:get")),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return crud.intervention.get(db, id=intervention_id)


@router.get("/year/{year}", response_model=List[Intervention])
def get_year(
    organization_id: int,
    year: int,
    *,
    auth=Depends(authorization("interventions:get_year")),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return crud.intervention.get_by_year(db, organization_id, year)


@router.patch("/{intervention_id}", response_model=Intervention)
def update(
    intervention_id: int,
    *,
    auth=Depends(authorization("interventions:update")),
    request_intervention: InterventionUpdate,
    db: Session = Depends(get_db),
):
    intervention_in_db = crud.intervention.get(db, id=intervention_id)

    if not intervention_in_db:
        raise HTTPException(status_code=404, detail="Intervention not found")

    return crud.intervention.update(
        db, db_obj=intervention_in_db, obj_in=request_intervention
    )


@router.delete("/{intervention_id}", response_model=Intervention)
def delete(
    organization_id: int,
    id: int,
    *,
    auth=Depends(authorization("interventions:delete")),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return crud.intervention.remove(db, id=id)
