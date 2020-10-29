from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    Float,
    String,
    Boolean,
    Date,
    ForeignKey
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import (relationship)
from app.db.base_class import Base


class Intervention(Base):
    id  = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey('organization.id'))

    intervention_type = Column(String)
    intervention_period = Column(JSONB)
    x = Column(Float)
    y = Column(Float)
    intervenant = Column(String)
    done = Column(Boolean)
    estimated_cost = Column(Float)
    required_documents = Column(JSONB)
    required_material = Column(JSONB)
    properties = Column(JSONB)