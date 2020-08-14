from enum import Enum
from typing import Optional

from pydantic import BaseModel


class TreeBase(BaseModel):
    name: str
    geo_file: int


class TreeCreate(TreeBase):
    pass


class TreeUpdate(BaseModel):
    pass


class TreeImportFromGeofile(BaseModel):
    name: str


class Tree(TreeBase):
    id: int

    class Config:
        orm_mode = True
