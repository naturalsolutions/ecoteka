from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    status = Column(String, default="Pending", nullable=False)
    is_superuser = Column(Boolean(), default=False, nullable=False)
    is_verified = Column(Boolean(), default=True, nullable=False)
