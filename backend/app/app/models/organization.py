from sqlalchemy import (
    Column,
    Integer,
    String,
    func,
)
from app.db.base_class import Base
from geoalchemy2 import Geometry
from sqlalchemy_utils import LtreeType, Ltree
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import (
    relationship,
    foreign,
    remote,
)


def strfltee(s:str, replacements=(' ', '-')):
    result = s

    for repl in replacements:
        result = result.replace(repl, '')

    return Ltree(result)

class Organization(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    slug = Column(String, nullable=False, index=True)
    
    working_area = Column('working_area', Geometry('MULTIPOLYGON'), nullable=True)

    path = Column(LtreeType, nullable=False)
    config = Column(JSONB, nullable=True)
    parent = relationship(
        'Organization',
        primaryjoin=remote(path) == foreign(func.subpath(path, 0, -1)),
        backref='teams',
        viewonly=True,
    )

    def __init__(self, name, slug:str, working_area=None, parent=None):
        self.name = name
        self.slug = slug
        self.working_area = working_area
        _path = strfltee(slug)
        self.path = _path if parent is None else parent.path + _path


