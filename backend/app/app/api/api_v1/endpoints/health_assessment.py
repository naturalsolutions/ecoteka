from fastapi import APIRouter, Depends, HTTPException
from app.schemas import HealthAssessment, HealthAssessmentCreate, HealthAssessmentUpdate
from app import crud
from app.api import get_db
from app.core import authorization, settings

from sqlalchemy.orm import Session
from typing import List

router = APIRouter()

settings.policies["health_assessment"] = {
    "health_assessment:read": ["admin", "owner", "manager", "contributor", "reader"],
    "health_assessment:create": ["admin", "owner", "manager", "contributor"],
    "health_assessment:update": ["admin", "owner", "manager", "contributor"],
    "health_assessment:delete": ["admin", "owner", "manager"],
}


@router.get("/", response_model=List[HealthAssessment])
def index(
    organization_id: int,
    tree_id: int,
    *,
    auth=Depends(authorization("health_assessment:read")),
    db: Session = Depends(get_db),
):
    """Get all Tree Health Assessment from a given tree"""
    organization = crud.organization.get(db, id=organization_id)
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")

    tree = crud.tree.get(db, tree_id)
    if not tree:
        raise HTTPException(status_code=404, detail=f"Organization not found")

    return tree.health_assessments


@router.get("/{health_assessment_id}", response_model=HealthAssessment)
def read(
    health_assessment_id: int,
    *,
    auth=Depends(authorization("health_assessment:read")),
    db: Session = Depends(get_db),
):
    health_assessment = crud.health_assessment.get(db, health_assessment_id)
    if not health_assessment:
        raise HTTPException(status_code=404, detail=f"Health assesment with id *{health_assessment_id}* not found")
    return health_assessment


@router.post(
    "", 
    response_model=HealthAssessment,
    dependencies=[Depends(authorization("health_assessment:create"))]
)
def create(
    organization_id: int,
    tree_id: int,
    *,
    request_health_assessment: HealthAssessmentCreate,
    db: Session = Depends(get_db),
):
    organization_in_db = crud.organization.get(db, id=organization_id)
    if not organization_in_db:
        raise HTTPException(status_code=404, detail="Organization not found")

    tree_in_db = crud.tree.get(db, id=tree_id)
    if not tree_in_db:
        raise HTTPException(status_code=404, detail="Tree not found")

    request_health_assessment.organization_id = organization_id
    request_health_assessment.tree_id = tree_id
    
    return crud.health_assessment.create(db, obj_in=request_health_assessment)


@router.patch("/{health_assessment_id}", response_model=HealthAssessment)
def update(
    organization_id: int,
    tree_id: int,
    health_assessment_id: int,
    *,
    auth=Depends(authorization("health_assessment:update")),
    request_health_assessment: HealthAssessmentUpdate,
    db: Session = Depends(get_db),
):
    organization_in_db = crud.organization.get(db, id=organization_id)
    if not organization_in_db:
        raise HTTPException(status_code=404, detail="Organization not found")

    tree_in_db = crud.tree.get(db, id=tree_id)
    if not tree_in_db:
        raise HTTPException(status_code=404, detail="Tree not found")

    health_assessment_in_db = crud.health_assessment.get(db, id=health_assessment_id)
    if not health_assessment_in_db:
        raise HTTPException(status_code=404, detail="Health Assessment not found")

    return crud. health_assessment.update(
        db, db_obj=health_assessment_in_db, obj_in=request_health_assessment
    )

@router.delete("/{health_assessment_id}", response_model=HealthAssessment)
def delete(
    health_assessment_id: int,
    *,
    auth=Depends(authorization("health_assessment:delete")),
    db: Session = Depends(get_db),
):
    return crud.health_assessment.remove(db, id=health_assessment_id)


