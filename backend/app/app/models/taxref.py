from sqlalchemy import (
    Column,
    Integer,
    SmallInteger,
    String
)

from app.db.base_class import Base


class Taxref(Base):
    REGNE = Column(String(18), nullable=True)
    PHYLUM = Column(String(50), nullable=True)
    CLASSE = Column(String(50), nullable=True)
    ORDRE = Column(String(60), nullable=True)
    FAMILLE = Column(String(72), nullable=True)
    SOUS_FAMILLE = Column(String(50), nullable=True)
    TRIBU = Column(String(44), nullable=True)
    GROUP1_INPN = Column(String(34), nullable=True)
    GROUP2_INPN = Column(String(54), nullable=True)
    CD_NOM = Column(Integer(), nullable=False, primary_key=True, index=True)
    CD_TAXSUP = Column(Integer(), nullable=True)
    CD_SUP = Column(Integer(), nullable=True)
    CD_REF = Column(Integer(), nullable=True)
    RANG = Column(String(8), nullable=True)
    LB_NOM = Column(String(174), nullable=False, index=True)
    LB_AUTEUR = Column(String(952), nullable=True)
    NOM_COMPLET = Column(String(980), nullable=True)
    NOM_COMPLET_HTML = Column(String(980), nullable=True)
    NOM_VALIDE = Column(String(980), nullable=True)
    NOM_VERN = Column(String(1248), nullable=True, index=True)
    NOM_VERN_ENG = Column(String(282), nullable=True)
    HABITAT = Column(SmallInteger(), nullable=True)
    FR = Column(String(2), nullable=True)
    GF = Column(String(2), nullable=True)
    MAR = Column(String(2), nullable=True)
    GUA = Column(String(2), nullable=True)
    SM = Column(String(2), nullable=True)
    SB = Column(String(2), nullable=True)
    SPM = Column(String(2), nullable=True)
    MAY = Column(String(2), nullable=True)
    EPA = Column(String(2), nullable=True)
    REU = Column(String(2), nullable=True)
    SA = Column(String(2), nullable=True)
    TA = Column(String(2), nullable=True)
    TAAF = Column(String(2), nullable=True)
    PF = Column(String(2), nullable=True)
    NC = Column(String(2), nullable=True)
    WF = Column(String(2), nullable=True)
    CLI = Column(String(2), nullable=True)
    URL = Column(String(82), nullable=True)
