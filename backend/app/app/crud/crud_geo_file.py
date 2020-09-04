from typing import Any, Dict, Optional, Union
from uuid import UUID

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.geo_file import GeoFile
from app.schemas.geo_file import GeoFileCreate, GeoFileUpdate


class CRUDGeoFile(CRUDBase[GeoFile, GeoFileCreate, GeoFileUpdate]):
    def get_by_name(self, db: Session, *, name: str) -> Optional[GeoFile]:
        return db.query(GeoFile).filter(GeoFile.name == name).first()

    def get_by_checksum(self, db: Session, *, checksum: str) -> Optional[GeoFile]:
        return db.query(GeoFile).filter(GeoFile.checksum == checksum).first()


geo_file = CRUDGeoFile(GeoFile)
