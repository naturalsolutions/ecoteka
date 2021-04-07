from sqlalchemy import Column, Integer, ForeignKey, Enum, inspect
from sqlalchemy.dialects.postgresql import JSONB
from geoalchemy2 import Geometry
from geoalchemy2.shape import to_shape
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import Boolean
from app.schemas.tree import Tree_xy, TreeStatus
from app.db.base_class import Base


class Tree(Base):
    id = Column(Integer, primary_key=True, index=True)
    geofile_id = Column(Integer, ForeignKey("geofile.id"))
    user_id = Column(Integer, ForeignKey("user.id"))
    organization_id = Column(Integer, ForeignKey("organization.id"))
    geom = Column("geom", Geometry("POINT"))
    properties = Column(JSONB, nullable=True)
    status = Column(
        Enum(TreeStatus, values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        default=TreeStatus.NEW.value,
    )
    interventions = relationship("Intervention", back_populates="tree")
    health_assessments = relationship("HealthAssessment", back_populates="tree")
    organization = relationship("Organization", back_populates="trees")

    def to_xy(self):
        coords = to_shape(self.geom)
        tree = Tree_xy(
            **{
                c.key: getattr(self, c.key)
                for c in inspect(self).mapper.column_attrs
                if c.key != "geom"
            },
            x=coords.x,
            y=coords.y
        )

        return tree
