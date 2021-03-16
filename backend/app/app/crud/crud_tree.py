from app.crud.base import CRUDBase
from app.models import Tree
from app.schemas import TreeCreate, TreeUpdate
from sqlalchemy.orm import Session
from typing import Dict



class CRUDTree(CRUDBase[Tree, TreeCreate, TreeUpdate]):
    def get_count_by_intervention_type(self, db: Session, organization_id: int, intervention_type: str):
        return (
            db.query(self.model)
            .filter(self.model.organization_id == organization_id)
            .filter(self.model.interventions.any(intervention_type=intervention_type))
            .all()
        )

    def get_filters(self, db: Session, organization_id: int):
        filter: Dict = {}
        fields = ["canonicalName", "vernacularName"]

        for field in fields:
            rows = db.execute(f"""
                select distinct properties ->> '{field}' as value, count(properties) as total
                from tree
                where organization_id = {organization_id}
                group by properties ->> '{field}'
                order by total desc;""")
            
            filter[field] = [{ 
            'value': row.value, 
            'total': row.total, 
            'background': [0, 0, 0]
        } for i, row in enumerate(rows) if row[0] not in ["", None]]

        return filter

tree = CRUDTree(Tree)
