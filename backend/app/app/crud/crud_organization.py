from typing import Any, Dict, Optional, Union, List
from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy import func, and_

from app.crud.base import CRUDBase
from app.models.organization import Organization
from app.models.tree import Tree
from app.schemas.organization import OrganizationCreate, OrganizationUpdate

from fastapi.encoders import jsonable_encoder
from sqlalchemy_utils import Ltree, LtreeType


class CRUDOrganization(CRUDBase[Organization, OrganizationCreate, OrganizationUpdate]):
    def create(self, db: Session, *, obj_in: OrganizationCreate) -> Organization:
        parent = (
            self.get(db, id=obj_in.parent_id)
            if obj_in.parent_id
            else None
        )

        obj_in_data = jsonable_encoder(obj_in, exclude=["parent_id"])
        org = Organization(**obj_in_data, parent=parent)

        db.add(org)
        db.commit()
        db.refresh(org)
        return org

    def get_by_name(self, db: Session, *, name: str) -> Optional[Organization]:
        return db.query(Organization).filter(Organization.name == name).first()

    def get_by_path(self, db: Session, *, path: str) -> Optional[Organization]:
        return db.query(Organization).filter(Organization.path == Ltree(path)).one()

    def get_teams(self, db: Session, *, parent_id: int) -> List[Organization]:
        '''returns sub-organization (teams) given the the parent'''
        # positble alternative: select * from organization o where o.path ~ 'planet.*{1}';
        
        parent = self.get(db, id = parent_id)

        if not parent:
            return []
        
        return (
            db.query(Organization)
            .filter(
                and_(
                    func.nlevel(Organization.path) == (func.nlevel(str(parent.path)) + 1),
                    Organization.path.descendant_of(parent.path),
                )
            )
            .all()
        )

    def get_total_tree_by_id(self, db: Session, *, id: int) -> Optional[int]:
        return db.query(Tree).filter(Tree.organization_id == id).count()

    def get_path(self, db: Session, *, id: int):
        org = self.get(db, id=id)

        if not org:
            return []

        return (
            db.query(Organization)
            .filter(Organization.path.ancestor_of(org.path))
            .order_by(Organization.path.asc())
        )


organization = CRUDOrganization(Organization)
