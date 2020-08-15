from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.models.geo_file import GeoFileStatus


# Shared properties
class GeoFileBase(BaseModel):
    name: str
    original_name: str
    extension: str
    status: GeoFileStatus
    uploaded_date: datetime
    imported_date: datetime = None
    importing_start: datetime = None
    public: bool = False

    # Properties to receive via API on creation


class GeoFileCreate(GeoFileBase):
    pass


class GeoFileUpdate(BaseModel):
    pass

# Additional properties to return via API


class GeoFile(GeoFileBase):
    id: int

    class Config:
        orm_mode = True
