from typing import Any, Dict, Optional, Union
from pathlib import Path
from shapely import wkt

from sqlalchemy.orm import Session
from geoalchemy2 import Geometry
import geopandas as gpd

from app.db.session import engine
from app.crud.base import CRUDBase
from app.models.tree import Tree
from app.models.geo_file import GeoFile
from app.schemas.tree import TreeCreate, TreeUpdate


class CRUDTree(CRUDBase[Tree, TreeCreate, TreeUpdate]):
    def import_from_geo_file(self, db: Session, geofile: GeoFile):
        df = gpd.read_file(geofile.get_filepath())

        for i, row in df.iterrows():
            obj_in = {
                "geofile_id": geofile.id,
                "geom": wkt.dumps(row['geometry'])
            }
            super().create(db, obj_in=obj_in)

        return geofile


tree = CRUDTree(Tree)
