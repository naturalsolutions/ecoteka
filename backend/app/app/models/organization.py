from sqlalchemy import Column, Integer, Index, String, Boolean, DateTime, func, inspect


from app.db.base_class import Base
from app.db.session import engine
from geoalchemy2 import Geometry
from sqlalchemy_utils import LtreeType, Ltree
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship, foreign, remote, column_property, Session
from sqlalchemy import Sequence, select, func, event
from sqlalchemy.sql import expression
from sqlalchemy import Column, Integer, Index, String, Boolean, DateTime, func, inspect
import slug as slugmodule
from app.db.base_class import Base
from app.db.session import engine
from app import schemas
from app.models.tree import Tree
from app.core import enforcer
from functools import reduce
from slugify import slugify
from nanoid import generate


id_seq = Sequence("organization_id_seq")


def strfltee(s: str, replacements=(" ", "-")):
    result = s

    for repl in replacements:
        result = result.replace(repl, "")

    return Ltree(result)


class Organization(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    slug = Column(String, nullable=False, index=True)
    working_area = Column("working_area", Geometry("MULTIPOLYGON"), nullable=True)
    path = Column(LtreeType, nullable=False)
    config = Column(JSONB, nullable=True)
    archived = Column(Boolean, nullable=False, server_default=expression.false())
    archived_at = Column(DateTime, nullable=True)
    total_trees = column_property(
        select([func.count(Tree.id)])
        .where(Tree.organization_id == id)
        .correlate_except(Tree)
    )
    parent = relationship(
        "Organization",
        primaryjoin=remote(path) == foreign(func.subpath(path, 0, -1)),
        backref="teams",
        sync_backref=False,
        viewonly=True,
    )
    health_assessments = relationship("HealthAssessment", back_populates="organization")

    __table_args__ = (Index("ix_organization_path", path, postgresql_using="gist"),)

    def __init__(
        self,
        name: str,
        archived: bool,
        archived_at=None,
        config=None,
        working_area=None,
        parent=None,
    ):
        _id = engine.execute(id_seq)
        self.id = _id
        self.name = name
        self.config = config
        self.working_area = working_area
        self.archived = archived
        self.archived_at = archived_at
        self.path = (
            Ltree(str(_id))
            if parent is None
            else (parent.path or Ltree("_")) + Ltree(str(_id))
        )
        self.slug = Organization.initiate_unique_slug(name, _id, 
            (Ltree(str(_id))
            if parent is None
            else (parent.path or Ltree("_")) + Ltree(str(_id))
            )
        )

    @property
    def total_members(self):
        get_users = enforcer.model.model["g"]["g"].rm.get_users
        all_users = [get_users(role, str(self.id)) for role in enforcer.get_all_roles()]
        return reduce(lambda total, users: total + len(users), all_users, 0)

    def to_current_user_schema(self):
        return self.to_schema()
    

    def to_schema(self):
        return schemas.Organization(
            **{
                c.key: getattr(self, c.key)
                for c in inspect(self).mapper.column_attrs
                if not c.key in ["path", "working_area", "config"]
            },
            total_members=self.total_members,
            has_working_area=bool(self.working_area),
            path=str(self.path)
        )

    @staticmethod

    def initiate_unique_slug(name, id, path):
        root_slug = Organization.get_root_slug(path)
        if root_slug:
            slug = slugify(f"{root_slug} {name}")
            return slug if Organization.is_slug_available(slug) else slugify(f"{slug} {id}")
        else:
            slug = slugify(f"{name}")
            return slug if Organization.is_slug_available(slug) else slugify(f"{slug} {target.id}")

    def is_slug_available(value):
        # Avoid collusions with frontend routes
        restricted_domains = ['home' , 'about', 'admin'] #should be set dynamically, not harcoded

        result = engine.execute(f"select * from public.organization where slug = '{value}';")
        return True if result.rowcount == 0 and value not in restricted_domains else False

    def get_root_slug(path):
        if path: 
            if len(path) > 1:
                path_ids = path.path.split('.')
                root_id = path_ids[0]
                result = engine.execute(f"select * from public.organization where id = '{root_id}';")
                root_organization = result.first()
                return root_organization.slug if root_organization else None
            else:
                return None
        else:
            return None
    
    def on_name_change_rehydrate_slug(target, value, oldvalue, initiator):
        print("generate_unique_slug")
        if value and (not target.slug or value != oldvalue):
            root_slug = Organization.get_root_slug(target.path)
            if root_slug:
                slug = slugify(f"{root_slug} {value}")
                target.slug = slug if Organization.is_slug_available(slug) else slugify(f"{slug} {target.id}")
            else:
                slug = slugify(f"{value}")
                target.slug = slug if Organization.is_slug_available(slug) else slugify(f"{slug} {target.id}")

    def on_path_change_rehydrate_slug(target, value, oldvalue, initiator):
        print("rehydrate_slug")
        if value and (not target.slug or value != oldvalue):
            root_slug = Organization.get_root_slug(target.path)
            if root_slug:
                slug = slugify(f"{root_slug} {target.name}")
                target.slug = slug if Organization.is_slug_available(slug) else slugify(f"{slug} {target.id}")
            else:
                slug = slugify(f"{target.name}")
                target.slug = slug if Organization.is_slug_available(slug) else slugify(f"{slug} {target.id}")

    def randomize_slug(target, value, oldvalue, initiator):
        print("randomize_slug")
        if value and (not target.slug or value != oldvalue):
            target.slug = generate('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-', 21)
        else:
            print("Archived set to False")
            Organization.on_name_change_rehydrate_slug(target, target.name, oldvalue, initiator)

event.listen(Organization.name, 'set', Organization.on_name_change_rehydrate_slug, retval=False)
event.listen(Organization.path, 'set', Organization.on_path_change_rehydrate_slug, retval=False)
event.listen(Organization.archived, 'set', Organization.randomize_slug, retval=False)