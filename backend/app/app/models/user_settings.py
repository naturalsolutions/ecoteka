from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    func
)

from app.db.base_class import Base


class User_Settings(Base):
    fk_user = Column(
        Integer,
        ForeignKey("user.id"),
        primary_key=True,
        index=True
    )
    fk_lang = Column(
        Integer,
        ForeignKey("lang.id"),
        primary_key=True,
        index=True
    )
    value = Column(
        String,
        nullable=False,
        index=True
    )
    creation_date = Column(
        DateTime,
        nullable=False,
        server_default=func.current_timestamp()
    )
