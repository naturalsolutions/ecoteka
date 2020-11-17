from datetime import datetime
from uuid import UUID
from typing import Optional, Any

from pydantic import BaseModel, Field
from sqlalchemy_utils import LtreeType, Ltree


# Shared properties
class OrganizationBase(BaseModel):
    name: str = ''
    slug: str = ''
    working_area : Optional[Any]
    config: Optional[Any]

class OrganizationCreate(OrganizationBase):
    parent_id: Optional[int]

class OrganizationUpdate(OrganizationBase):
    pass


# Additional properties to return via API


class Organization(OrganizationBase):
    id: int
    path: Optional[Any]
    total_trees: Optional[int] = 0

    class Config:
        orm_mode = True
