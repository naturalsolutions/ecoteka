from typing import Any, Optional, List, Type
from sqlalchemy.orm import Session

from app.models import Taxref
from app.crud import CRUDBase
from app.schemas import TaxrefForTreesOut, TaxrefCreate, TaxrefUpdate


class CRUDTaxref(CRUDBase[Taxref, TaxrefCreate, TaxrefUpdate]):
    def get(self, db: Session, id: Any) -> Optional[Taxref]:
        return db.query(self.model).filter(self.model.CD_NOM == id).first()

    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[Taxref]:
        return db.query(self.model).offset(skip).limit(limit).all()

    def get_trees(
        self,
        db: Session,
    ) -> List[TaxrefForTreesOut]:
        mandatoryFilter = (
            self.model.REGNE == "Plantae",
            self.model.CD_NOM == Taxref.CD_REF,
            self.model.RANG == "ES",
        )
        query = db.query(self.model.CD_NOM, self.model.LB_NOM, self.model.NOM_VERN)
        query = query.filter(*mandatoryFilter)
        query = query.order_by(self.model.LB_NOM.asc())
        return query.all()


taxref = CRUDTaxref(Taxref)
