from fastapi import (
    APIRouter,
    Body,
    Depends,
    HTTPException
)
from app.schemas import (
    Intervention,
    InterventionCreate,
    InterventionUpdate
)
from app.models import (
    User
)
from app.crud import (
    intervention
)
from app.api import get_db
from app.core import (
    get_current_active_user
)

from sqlalchemy.orm import Session
from typing import List

router = APIRouter()


@router.post('/', response_model=Intervention)
def create(
    *,
    request_intervention: InterventionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return intervention.create(
        db,
        obj_in=dict(request_intervention,
                    organization_id=current_user.organization_id)
    )


@router.get('/{intervention_id}', response_model=Intervention)
def get(
    intervention_id: int,
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return intervention.get(db, id=intervention_id)


@router.get('/year/{year}', response_model=List[Intervention])
def get_year(
    year: int,
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return intervention.get_by_year(db, year)


@router.patch('/{intervention_id}', response_model=Intervention)
def update(
    intervention_id: int,
    *,
    request_intervention: InterventionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return intervention.update(
        db,
        db_obj=intervention.get(db, id=intervention_id),
        obj_in=request_intervention
    )


@router.delete('/{intervention_id}', response_model=Intervention)
def delete(
    id: int,
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return intervention.remove(db, id=id)
