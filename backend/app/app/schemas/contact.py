from typing import Optional

from pydantic import BaseModel, EmailStr


# Shared properties
class ContactBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone_number: Optional[str]
    township: str
    position: Optional[str]
    contact_request: str


# Properties to receive via API on creation
class ContactCreate(ContactBase):
    pass


class ContactUpdate(BaseModel):
    pass


# Additional properties to return via API
class Contact(ContactBase):
    id: int

    class Config:
        orm_mode = True
