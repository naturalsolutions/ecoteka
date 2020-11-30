from app.models import Intervention
from app.schemas import InterventionCreate, InterventionUpdate
from app.crud.base import CRUDBase
import sqlalchemy as sa
from sqlalchemy.orm import Session


class CRUDIntervention(CRUDBase[Intervention, InterventionCreate, InterventionUpdate]):
    def get_by_year(self, db: Session, organization_id: int, year: int):
        return (
            db.query(self.model)
            .filter(self.model.organization_id == organization_id)
            .filter(
                sa.or_(
                    sa.extract("year", self.model.intervention_start_date) == year,
                    sa.extract("year", self.model.intervention_end_date) == year,
                )
            )
            .all()
        )

    def get_by_tree(self, db: Session, tree_id: int):
        return db.query(self.model).filter(self.model.tree_id == tree_id).all()


intervention = CRUDIntervention(Intervention)
