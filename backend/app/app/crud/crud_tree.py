from app.crud.base import CRUDBase
from app.models import Tree
from app.schemas import TreeCreate, TreeUpdate
from sqlalchemy.orm import Session



class CRUDTree(CRUDBase[Tree, TreeCreate, TreeUpdate]):
    def get_count_by_intervention_type(self, db: Session, organization_id: int, intervention_type: str):
        return (
            db.query(self.model)
            .filter(self.model.organization_id == organization_id)
            .filter(self.model.interventions.any(intervention_type=intervention_type))
            .all()
        )

tree = CRUDTree(Tree)
