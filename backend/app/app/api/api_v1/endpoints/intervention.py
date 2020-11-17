from fastapi import (
    APIRouter,
    Body,
    Depends,
    HTTPException
)

from app import crud, models, schemas
from app.api import get_db
from app.core import (
    get_current_active_user,
    get_current_user
)

from sqlalchemy.orm import Session
from typing import List
import sqlalchemy as sa
router = APIRouter()


@router.post('/', response_model=schemas.Intervention)
def create(
    *,
    request_intervention: schemas.InterventionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    return crud.intervention.create(
        db,
        obj_in=dict(request_intervention,
                    organization_id=current_user.organization_id)
    )


@router.get('/{intervention_id}', response_model=schemas.Intervention)
def get(
    intervention_id: int,
    *,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    return crud.intervention.get(db, id=intervention_id)


@router.get('/year/{year}', response_model=List[schemas.Intervention])
def get_year(
    year: int,
    *,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    return crud.intervention.get_by_year(db, year)


@router.patch('/{intervention_id}', response_model=schemas.Intervention)
def update(
    intervention_id: int,
    *,
    request_intervention: schemas.InterventionUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    return crud.intervention.update(
        db,
        db_obj=crud.intervention.get(db, id=intervention_id),
        obj_in=request_intervention
    )


@router.delete('/{intervention_id}', response_model=schemas.Intervention)
def delete(
    id: int,
    *,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    return crud.intervention.remove(db, id=id)
