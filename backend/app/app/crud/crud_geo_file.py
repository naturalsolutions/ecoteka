from typing import Any, Dict, Optional, Union, List
from uuid import UUID

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.user import User
from app.models.geo_file import GeoFile
from app.schemas.geo_file import GeoFileCreate, GeoFileUpdate


class CRUDGeoFile(CRUDBase[GeoFile, GeoFileCreate, GeoFileUpdate]):
    def get_by_name(self, db: Session, *, name: str) -> Optional[GeoFile]:
        return db.query(GeoFile).filter(GeoFile.name == name).first()

    def get_by_checksum(self, db: Session, *, checksum: str) -> Optional[GeoFile]:
        return db.query(GeoFile).filter(GeoFile.checksum == checksum).first()

    def get_multi(
        self, db: Session, *, user: User, skip: int = 0, limit: int = 100
    ) -> List[GeoFile]:
        return (
            db.query(GeoFile)
            .filter(GeoFile.user_id == user.id)
            .offset(skip)
            .limit(limit)
            .all()
        )


geo_file = CRUDGeoFile(GeoFile)
