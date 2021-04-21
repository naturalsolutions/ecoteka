from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    Numeric,
    String
)
from app.db.base_class import Base


class OSMName(Base):
    name = Column(String(115), nullable=True)
    alternative_names = Column(String(3260), nullable=True)
    osm_type = Column(String(8), nullable=False)
    osm_id = Column(Integer(), primary_key=True, nullable=False)
    _class = Column('class', String(8), nullable=False)
    _type = Column('type', String(14), nullable=False)
    lon = Column(Numeric(9,6), nullable=True)
    lat = Column(Numeric(8,6), nullable=True)
    place_rank = Column(Integer(), nullable=False)
    importance = Column(Numeric(7,6), nullable=False)
    street = Column(Boolean(), nullable=True)
    city = Column(String(114), nullable=True)
    county = Column(String(91), nullable=True)
    state = Column(String(115), nullable=True)
    country = Column(String(40), nullable=True)
    country_code = Column(String(2), nullable=True)
    display_name = Column(String(233), nullable=False)
    west = Column(Numeric(9,6), nullable=False)
    south = Column(Numeric(8,6), nullable=False)
    east = Column(Numeric(9,6), nullable=False)
    north = Column(Numeric(8,6), nullable=False)
    wikidata = Column(String(35), nullable=True)
    wikipedia = Column(String(120), nullable=True)
    housenumbers = Column(Boolean(), nullable=True)

