from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field, Json

from app.models.geo_file import GeoFileStatus


# Shared properties
class GeoFileBase(BaseModel):
    name: UUID
    original_name: str
    extension: str
    checksum: str
    count: int = 0
    crs: str = ''
    driver: str = ''
    properties: Optional[Json] = Field(...)
    status: GeoFileStatus
    uploaded_date: Optional[datetime] = Field(...)
    imported_date: Optional[datetime] = Field(...)
    importing_start: Optional[datetime] = Field(...)
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
