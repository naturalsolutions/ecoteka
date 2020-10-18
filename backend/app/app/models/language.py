from sqlalchemy import (
    Column,
    String
)

from app.db.base_class import Base


class Language(Base):
    id = Column(
        String(2),
        primary_key=True,
        index=True
    )
    label = Column(
        String,
        nullable=False
    )
