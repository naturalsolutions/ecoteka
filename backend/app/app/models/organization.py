from sqlalchemy import Column, Integer, Index, String, func, inspect
from app.db.base_class import Base
from app.db.session import engine
from geoalchemy2 import Geometry
from sqlalchemy_utils import LtreeType, Ltree
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship, foreign, remote
from sqlalchemy import Sequence
from fastapi.encoders import jsonable_encoder
from app import schemas
import slug as slugmodule
import logging

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
    parent = relationship(
        "Organization",
        primaryjoin=remote(path) == foreign(func.subpath(path, 0, -1)),
        backref="teams",
        sync_backref=False,
        viewonly=True,
    )

    __table_args__ = (Index("ix_organization_path", path, postgresql_using="gist"),)

    def __init__(self, name: str, config=None, working_area=None, parent=None):
        _id = engine.execute(id_seq)
        self.id = _id
        self.name = name
        self.slug = slugmodule.slug(name)
        self.config = config
        self.working_area = working_area
        self.path = Ltree(str(_id)) if parent is None else parent.path + Ltree(self.slug) if parent.path else Ltree('_') + Ltree(str(_id))

    def to_schema(self):
        return schemas.Organization(
            **{
                c.key: getattr(self, c.key)
                for c in inspect(self).mapper.column_attrs
                if not c.key in ["path", "working_area"]
            },
            has_working_area=bool(self.working_area),
            path=str(self.path)
        )
