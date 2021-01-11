from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
    Text,
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Enum,
)
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from app.schemas import HealthAssessmentOrgan


class HealthAssessment(Base):
    id = Column(Integer, primary_key=True, index=True)
    tree_id = Column(Integer, ForeignKey("tree.id"), index=True)
    organization_id = Column(Integer, ForeignKey("organization.id"), index=True)
    date = Column(DateTime)
    organ = Column(
        Enum(HealthAssessmentOrgan, values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        default=HealthAssessmentOrgan.UNDEFINED.value,
    )
    score = Column(Integer)
    intervention_needed = Column(Boolean)
    problem = Column(Text)
    recommendation = Column(Text)
    comment = Column(Text)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    tree = relationship("Tree", back_populates="health_assessments")
    organization = relationship("Organization", back_populates="health_assessments")
 