from pydantic import (
    BaseModel
)
from typing import Optional


class TaxrefPrimaryKey(BaseModel):
    CD_NOM: int


class TaxrefBase(BaseModel):
    LB_NOM: str
    NOM_VERN: Optional[str] = None
    REGNE: Optional[str] = None
    PHYLUM: Optional[str] = None
    CLASSE: Optional[str] = None
    ORDRE: Optional[str] = None
    FAMILLE: Optional[str] = None
    SOUS_FAMILLE: Optional[str] = None
    TRIBU: Optional[str] = None
    GROUP1_INPN: Optional[str] = None
    GROUP2_INPN: Optional[str] = None
    CD_TAXSUP: Optional[int] = None
    CD_SUP: Optional[int] = None
    CD_REF: Optional[int] = None
    RANG: Optional[str] = None
    LB_AUTEUR: Optional[str] = None
    NOM_COMPLET: Optional[str] = None
    NOM_COMPLET_HTML: Optional[str] = None
    NOM_VALIDE: Optional[str] = None
    NOM_VERN_ENG: Optional[str] = None
    HABITAT: Optional[int] = None
    FR: Optional[str] = None
    GF: Optional[str] = None
    MAR: Optional[str] = None
    GUA: Optional[str] = None
    SM: Optional[str] = None
    SB: Optional[str] = None
    SPM: Optional[str] = None
    MAY: Optional[str] = None
    EPA: Optional[str] = None
    REU: Optional[str] = None
    SA: Optional[str] = None
    TA: Optional[str] = None
    TAAF: Optional[str] = None
    PF: Optional[str] = None
    NC: Optional[str] = None
    WF: Optional[str] = None
    CLI: Optional[str] = None
    URL: Optional[str] = None


class TaxrefCreate(TaxrefBase):
    pass


class TaxrefUpdate(TaxrefCreate):
    pass


class TaxrefForTrees(TaxrefPrimaryKey):
    LB_NOM: str
    NOM_VERN: Optional[str] = None


class TaxrefForTreesOut(TaxrefForTrees):

    class Config:
        orm_mode = True


class TaxrefOut(TaxrefPrimaryKey, TaxrefBase):

    class Config:
        orm_mode = True


class TaxrefDB(TaxrefPrimaryKey, TaxrefCreate):

    class Config:
        orm_mode = True
