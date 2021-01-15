from sqlalchemy import Column, Integer, ForeignKey, inspect
from sqlalchemy.dialects.postgresql import JSONB
from geoalchemy2 import Geometry
from geoalchemy2.shape import to_shape
from sqlalchemy.orm import relationship
from app.schemas.tree import Tree_xy
from app.db.base_class import Base


class Tree(Base):
    id = Column(Integer, primary_key=True, index=True)
    geofile_id = Column(Integer, ForeignKey("geofile.id"))
    user_id = Column(Integer, ForeignKey("user.id"))
    organization_id = Column(Integer, ForeignKey("organization.id"))
    geom = Column("geom", Geometry("POINT"))
    properties = Column(JSONB, nullable=True)
    interventions = relationship("Intervention", back_populates="tree")
    health_assessments = relationship("HealthAssessment", back_populates="tree")
    # taxon = relationship("Taxon", back_populates="tree")

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
