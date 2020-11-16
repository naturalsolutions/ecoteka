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
        parent = self.get_by_path(db, path=obj_in.parent_path) if obj_in.parent_path else None
        
        obj_in_data = jsonable_encoder(obj_in, exclude=['parent_path'])
        db_obj = Organization(
            **obj_in_data,
            parent = parent
        )  # type: ignore db_obj
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_name(self, db: Session, *, name: str) -> Optional[Organization]:
        return db.query(Organization).filter(Organization.name == name).first()

    def get_by_path(self, db: Session, *, path: str) -> Optional[Organization]:
        return db.query(Organization).filter(Organization.path == Ltree(path)).one()

    def get_teams (self, db: Session, *, path: str) -> List[Organization]:
        return db.query(Organization).filter(and_(
            func.nlevel(Organization.path) == (func.nlevel(path) + 1),
            Organization.path.descendant_of(Ltree(path))
        )).all()

    def get_total_tree_by_id(self, db: Session, *, id: int) -> Optional[int]:
        return db.query(Tree).filter(Tree.organization_id == id).count()


organization = CRUDOrganization(Organization)
