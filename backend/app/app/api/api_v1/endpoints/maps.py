import logging
from typing import Dict, Optional
from pydantic import Json
from fastapi_jwt_auth import AuthJWT
import json
import sqlite3
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import crud
from app.api import get_db
from app.core import (
    settings,
    authorization,
    set_policies
)

router = APIRouter()

policies = {
    "maps:get_filters": ["owner", "manager", "contributor", "reader"]
}

set_policies(policies)


@router.get("/style/")
def generate_style(
    db: Session = Depends(get_db),
    theme: Optional[str] = "dark",
) -> Dict:
    """
    Generate style
    """
    with open(f"/app/app/assets/styles/{theme}.json") as style_json:
        style = json.load(style_json)

        style["sources"]["cadastre-france"] = {
            "type": "vector",
            "tiles": [
                "https://openmaptiles.geo.data.gouv.fr/data/cadastre/{z}/{x}/{y}.pbf"
            ],
            "minzoom": 11,
            "maxzoom": 16,
        }

        style["layers"].insert(
            len(style["layers"]),
            {
                "id": "cadastre-france-parcelles",
                "type": "fill",
                "source": "cadastre-france",
                "source-layer": "parcelles",
                "paint": {
                    "fill-color": "#5a3fc0",
                    "fill-opacity": 0.3
                },
                "layout": {"visibility": "none"}
            }
        )

        style["layers"].insert(
            len(style["layers"]),
            {
                "id": "cadastre-france-batiments",
                "type": "fill",
                "source": "cadastre-france",
                "source-layer": "batiments",
                "paint": {
                    "fill-color": "#5a3fc0",
                    "fill-opacity": 0.3
                },
                "layout": {"visibility": "none"}
            }
        )

        style["layers"].insert(
            len(style["layers"]),
            {
                "id": "cadastre-france-sections",
                "type": "fill",
                "source": "cadastre-france",
                "source-layer": "sections",
                "paint": {
                    "fill-color": "#5a3fc0",
                    "fill-opacity": 0.3
                },
                "layout": {"visibility": "none"}
            }
        )

        return style


@router.get("/filter", dependencies=[Depends(authorization("maps:get_filters"))])
def get_filters(
    organization_id: int,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Get filters 
    """
    fields = ["canonicalName", "vernacularName"]
    filter = {}

    for field in fields:
        rows = db.execute(f"""
            select distinct properties ->> '{field}' as value
            from tree
            where organization_id = {organization_id}
            order by value;""")
        filter[field] = [dict(row) for row in rows if row[0] not in ["", None]]
    
    return filter