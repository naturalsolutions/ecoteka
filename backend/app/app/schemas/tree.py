from enum import Enum
from typing import Optional, Any

from pydantic import BaseModel, Json
from sqlalchemy import inspect

class TreePost(BaseModel):
    ''' Schema for tree creation post request data'''
    x: int
    y: int
    scientific_name: Optional[str]
    taxref_id: Optional[int]

class TreePatch(BaseModel):
    x: Optional[int]
    y: Optional[int]
    scientific_name: Optional[str]
    taxref_id: Optional[int]

class TreeMeta(BaseModel):
    scientific_name: Optional[str]
    taxref_id: Optional[int]
    properties: Any
    geofile_id: Optional[int]
    user_id: int
    organization_id: int

class Tree_xy(TreePost, TreeMeta):
    '''Representation of Tree with (x,y) coords instead of geoalchemy.geom-point'''
    id: int

class TreeBase(TreeMeta):
    geom: Any

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
