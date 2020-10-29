from datetime import datetime
from uuid import UUID
from typing import Optional, Any

from pydantic import BaseModel, Field, Json

from app.models.geo_file import GeoFileStatus


# Shared properties
class GeoFileBase(BaseModel):
    user_id: int
    organization_id: int
    name: UUID
    original_name: str
    extension: str
    checksum: str
    count: int = 0
    crs: Optional[str] = Field(...)
    driver: str = ''
    longitude_column: Optional[str] = Field(...)
    latitude_column: Optional[str] = Field(...)
    properties: Optional[Any] = Field(...)
    mapping_fields: Optional[Any] = Field(...)
    status: GeoFileStatus
    uploaded_date: Optional[datetime] = Field(...)
    imported_date: Optional[datetime] = Field(...)
    importing_start: Optional[datetime] = Field(...)
    public: bool = False

    # Properties to receive via API on creation


class GeoFileCreate(GeoFileBase):
    pass


class GeoFileUpdate(GeoFileBase):
    pass


# Additional properties to return via API


class GeoFile(GeoFileBase):
    id: int

    class Config:
        orm_mode = True
