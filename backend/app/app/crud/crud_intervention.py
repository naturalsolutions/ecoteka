from app.models import Intervention
from app.schemas import (
    InterventionCreate,
    InterventionUpdate
)
from app.crud.base import CRUDBase
import sqlalchemy as sa
from sqlalchemy.orm import Session


class CRUDIntervention (CRUDBase[Intervention, InterventionCreate, InterventionUpdate]):
    def get_by_year(
        self, db: Session, year: int, *, skip: int = 0, limit: int = 100
    ):
        return db.query(self.model).filter(sa.or_(sa.extract('year', self.model.intervention_start_date) == year, sa.extract('year', self.model.intervention_end_date) == year)).offset(skip).limit(limit).all()


intervention = CRUDIntervention(Intervention)
