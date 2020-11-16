from datetime import datetime
from uuid import UUID
from typing import Optional, Any

from pydantic import BaseModel, Field


# Shared properties
class OrganizationBase(BaseModel):
    name: str = ''
    slug: str = ''
    working_area : Optional[Any]

class OrganizationCreate(OrganizationBase):
    parent_path: Optional[str]

class OrganizationUpdate(OrganizationBase):
    pass


# Additional properties to return via API


class Organization(OrganizationBase):
    id: int
    path: Optional[str]
    total_trees: Optional[int] = 0

    class Config:
        orm_mode = True
