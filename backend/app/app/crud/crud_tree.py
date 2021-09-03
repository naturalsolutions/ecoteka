from app.crud.base import CRUDBase
from app.models import Tree
from app.schemas import TreeCreate, TreeUpdate
from sqlalchemy.orm import Session
from typing import Dict, List



class CRUDTree(CRUDBase[Tree, TreeCreate, TreeUpdate]):
    def get_planted(self, db: Session, organization_id: int, year: int):
        return db.execute(f"""
            select count(*) from tree 
            where ("properties"->>'plantationDate')::text is not null 
            and trim(("properties"->>'plantationDate')::text) <> ''
            and extract(year from ("properties"->>'plantationDate')::date) = {year} 
            and organization_id = {organization_id};
        """).first()[0]



    def get_count_by_intervention_type(self, db: Session, organization_id: int, intervention_type: str):
        return (
            db.query(self.model)
            .filter(self.model.organization_id == organization_id)
            .filter(self.model.interventions.any(intervention_type=intervention_type))
            .all()
        )

    def get_filters(self, db: Session, organization_id: int):
        filter: Dict = {}
        fields = ["canonicalName", "vernacularName", "diameter", "height"]

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


    def get_properties_completion_ratio(self, db: Session, organization_id: int, fields: List[str]):
        ratio: Dict = {}
        # fields = ["canonicalName", "vernacularName", "diameter", "height"]

        total_rows = db.execute(f'select count(*) from tree where organization_id = {organization_id};').first()[0]

        for field in fields:
            non_empty_count = db.execute(f"""
                select count(*) from tree 
                where properties->>'{field}' != '' 
                and organization_id = {organization_id};""").first()[0]
            ratio[field] = (non_empty_count / total_rows * 100) if total_rows > 0 else 0

        return ratio

    def get_properties_aggregates(sellf, db: Session, organization_id: int, fields: List[str]):
        aggregate: Dict = {}
        for field in fields:
            rows = db.execute(f"""
                select distinct properties ->> '{field}' as value, count(properties) as total
                from tree
                where organization_id = {organization_id}
                group by properties ->> '{field}'
                order by total desc;""")
            
            aggregate[field] = [{ 
            'value': row.value, 
            'total': row.total
        } for i, row in enumerate(rows) if row[0] not in ["", None]]

        return aggregate


tree = CRUDTree(Tree)
