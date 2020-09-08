from sqlalchemy import (
    Column,
    Integer,
    String
)
from app.db.base_class import Base


class Contact(Base):
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone_number = Column(String, nullable=True)
    township = Column(String, nullable=True)
    position = Column(String, nullable=True)
    contact_request = Column(String, nullable=False)
