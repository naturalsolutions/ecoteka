from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from geoalchemy2 import Geometry
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Tree(Base):
    id = Column(Integer, primary_key=True, index=True)
    geofile_id = Column(Integer, ForeignKey('geofile.id'))
    geom = Column('geom', Geometry('POINT'))
    properties = Column(JSON, nullable=True)
