from enum import Enum
import json
from typing import Optional, Any, List

from pydantic import BaseModel, Json
from sqlalchemy import inspect


class TreeJsonBProperties(BaseModel):
    family: Optional[str]
    gender: Optional[str]
    specie: Optional[str]
    cultivar: Optional[str]
    vernacularName: Optional[str]
    townshipCode: Optional[int]
    zipCode: Optional[int]
    address: Optional[str]
    zone: Optional[str]
    etkRegistrationNumber: Optional[str]
    plantingDate: Optional[str]
    height: Optional[float]
    diameter: Optional[float]
    soilType: Optional[str]
    rootType: Optional[str]
    habit: Optional[str]
    protected: Optional[bool]
    soilConstraints: Optional[str]
    aerianConstraint: Optional[bool]
    lightning: Optional[bool]
    watering: Optional[str]
    allergens: Optional[int]
    remarks: Optional[str]


class TreeDBMeta(BaseModel):
    properties: Any
    geofile_id: Optional[int]
    user_id: int
    organization_id: int


class TreePost(TreeJsonBProperties):
    """ Schema for tree creation post request data"""
    x: float
    y: float


class TreePatch(TreePost):
    x: Optional[int]
    y: Optional[int]


class Tree_xy(TreeDBMeta):
    """Representation of Tree with (x,y) coords instead of geoalchemy.geom-point"""
    id: int
    x: float
    y: float


class TreeBase(TreeDBMeta):
    geom: Any


class TreeCreate(TreeBase):
    pass


class TreeUpdate(BaseModel):
    properties: Any
    pass


class TreeImportFromGeofile(BaseModel):
    name: str


class Tree(TreeBase):
    id: int

    class Config:
        orm_mode = True
