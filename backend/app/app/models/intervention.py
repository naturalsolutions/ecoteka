from sqlalchemy import (
    Boolean,
    Column,
    Integer,
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

    tree_id = Column(Integer, ForeignKey('tree.id'))
    done    = Column(Boolean)
    plan_date_from  = Column(Date)
    plan_date_to    = Column(Date)
    properties      = Column(JSONB)