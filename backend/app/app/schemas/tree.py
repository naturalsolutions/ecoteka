from typing import Optional, Any, Dict, List
import enum

from pydantic import BaseModel

class TreeStatus(enum.Enum):
    NEW = "new"
    EDIT = "edit"
    DELETE = "delete"
    IMPORT = "import"
    FROZEN = "frozen"

class Metrics(BaseModel):
    ratio: Dict
    aggregates: Dict


class TreeProperties(BaseModel):
    address: Optional[str]
    aerianConstraint: Optional[bool]
    allergens: Optional[int]
    cultivar: Optional[str]
    diameter: Optional[float]
    etkRegistrationNumber: Optional[str]
    family: Optional[str]
    gender: Optional[str]
    habit: Optional[str]
    height: Optional[float]
    lightning: Optional[bool]
    plantingDate: Optional[str]
    protected: Optional[bool]
    remarks: Optional[str]
    rootType: Optional[str]
    soilConstraints: Optional[str]
    soilType: Optional[str]
    specie: Optional[str]
    townshipCode: Optional[int]
    vernacularName: Optional[str]
    watering: Optional[str]
    zipCode: Optional[int]
    zone: Optional[str]


class TreeDBMeta(BaseModel):
    properties: Any
    geofile_id: Optional[int]
    user_id: int
    organization_id: int


class TreePost(TreeProperties):
    """ Schema for tree creation post request data"""
    x: float
    y: float
    properties: Any


class TreePatch(TreeProperties):
    x: Optional[float]
    y: Optional[float]
    properties: Any


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
