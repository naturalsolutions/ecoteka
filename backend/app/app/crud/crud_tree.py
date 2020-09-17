from typing import Any, Dict, Optional, Union
from pathlib import Path

from sqlalchemy.orm import Session

from app.db.session import engine
from app.crud.base import CRUDBase
from app.models import Tree, GeoFile
from app.schemas import TreeCreate, TreeUpdate


class CRUDTree(CRUDBase[Tree, TreeCreate, TreeUpdate]):
    def remove_from_geofile(self, db: Session, *, geofile_id: int):
        db.query(Tree).filter(Tree.geofile_id == geofile_id).delete()
        db.commit()
        return


tree = CRUDTree(Tree)
