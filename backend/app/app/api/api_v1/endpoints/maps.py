import os
import uuid
import json
from typing import Any, List, Optional
from pydantic import Json

import sqlite3

from fastapi import (
    APIRouter,
    Body,
    Depends,
    HTTPException,
    BackgroundTasks
)
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings

router = APIRouter()


@router.get("/style")
def generate_style(
    *,
    db: Session = Depends(deps.get_db),
    current_user: Optional[models.User] = Depends(deps.get_optional_current_active_user)
) -> Json:
    """
    Generate style
    """
    with open("/app/app/assets/style.json") as style_json:
        style = json.load(style_json)
        style["sources"]["osm"] = {
            "type": "vector",
            "tiles": [
                f"{settings.TILES_SERVER}/osm/{{z}}/{{x}}/{{y}}.pbf"
            ],
            "minzoom": 0,
            "maxzoom": 13
        }

        style["layers"].insert(len(style["layers"]), {
            "id": "ecoteka-data",
            "type": "circle",
            "source": "osm",
            "source-layer": "ecoteka-data"
        })

        if current_user is not None:
            geofiles = crud.geo_file.get_multi(db, user=current_user)

            for geofile in geofiles:
                target = f"/app/tiles/public/{geofile.name}.mbtiles"
                conn = sqlite3.connect(target)
                sql = '''
                    SELECT * FROM metadata 
                    WHERE name IN ('minzoom', 'maxzoom') 
                    ORDER BY name DESC
                '''
                cur = conn.cursor()
                cur.execute(sql)
                minzoom, maxzoom = cur.fetchall()
                conn.close()

                style["sources"][f"{geofile.name}"] = {
                    "type": "vector",
                    "tiles": [
                        f"{settings.TILES_SERVER}/{geofile.name}/{{z}}/{{x}}/{{y}}.pbf"
                    ],
                    "minzoom": int(minzoom[1]),
                    "maxzoom": int(maxzoom[1])
                }

                style["layers"].insert(len(style["layers"]), {
                    "id": f"ecoteka-{geofile.name}",
                    "type": "circle",
                    "source": f"{geofile.name}",
                    "source-layer": f"{geofile.name}"
                })

        return style
