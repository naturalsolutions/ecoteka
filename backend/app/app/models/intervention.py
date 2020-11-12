from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    Float,
    String,
    Boolean,
    Date,
    DateTime,
    ForeignKey
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import (relationship)
from app.db.base_class import Base


class Intervention(Base):
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey('organization.id'))

    intervention_type = Column(String)
    tree_id = Column(Integer)
    intervenant = Column(String)
    intervention_start_date = Column(DateTime)
    intervention_end_date = Column(DateTime)
    date = Column(DateTime)
    done = Column(Boolean)
    estimated_cost = Column(Float)
    required_documents = Column(JSONB)
    required_material = Column(JSONB)
    properties = Column(JSONB)
