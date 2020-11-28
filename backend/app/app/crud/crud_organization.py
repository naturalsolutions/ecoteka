from typing import Any, Dict, Optional, Union, List
from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy import func, and_

from app.crud.base import CRUDBase
from app.models.organization import Organization
from app.models.tree import Tree
from app import crud
from app.schemas.organization import OrganizationCreate, OrganizationUpdate
from sqlalchemy.sql import text

from fastapi.encoders import jsonable_encoder
from sqlalchemy_utils import Ltree, LtreeType

import slug as slugmodule


class CRUDOrganization(CRUDBase[Organization, OrganizationCreate, OrganizationUpdate]):
    def create(self, db: Session, *, obj_in: OrganizationCreate) -> Organization:
        parent = self.get(db, id=obj_in.parent_id) if obj_in.parent_id else None

        obj_in_data = jsonable_encoder(obj_in, exclude=["parent_id"])
        org = Organization(**obj_in_data, parent=parent)

        db.add(org)
        db.commit()
        db.refresh(org)
        return org

    def update(
        self,
        db: Session,
        *,
        db_obj: Organization,
        obj_in: Union[OrganizationUpdate, Dict[str, Any]]
    ) -> Organization:
        obj_data = db_obj.as_dict()
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])

        db_obj.slug = slugmodule.slug(db_obj.name)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_name(self, db: Session, *, name: str) -> Optional[Organization]:
        return db.query(Organization).filter(Organization.name == name).first()

    def get_by_path(self, db: Session, *, path: str) -> Optional[Organization]:
        return db.query(Organization).filter(Organization.path == Ltree(path)).one()

    def get_teams(self, db: Session, *, parent_id: int) -> List[Organization]:
        """returns sub-organization (teams) given the the parent"""
        # positble alternative: select * from organization o where o.path ~ 'planet.*{1}';

        parent = self.get(db, id=parent_id)

        if not parent:
            return []

        return (
            db.query(Organization)
            .filter(
                and_(
                    func.nlevel(Organization.path)
                    == (func.nlevel(str(parent.path)) + 1),
                    Organization.path.descendant_of(parent.path),
                )
            )
            .all()
        )

    def get_path(self, db: Session, *, id: int):
        org = self.get(db, id=id)

        if not org:
            return []

        return (
            db.query(Organization)
            .filter(Organization.path.ancestor_of(org.path))
            .order_by(Organization.path.asc())
        )

    def get_members(self, db: Session, *, id: int):
        t = text("SELECT v0 AS user_id, v1 as role FROM casbin_rule WHERE v2 = :org_id")
        user_ids = db.execute(t, {"org_id": str(id)})

        members = []

        for (user_id, role) in user_ids:
            user_in_db = crud.user.get(db, id=int(user_id))

            if user_in_db:
                members.append(dict(user_in_db.as_dict(), role=role))

        return members


organization = CRUDOrganization(Organization)
