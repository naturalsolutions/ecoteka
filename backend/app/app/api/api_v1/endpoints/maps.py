from typing import Dict, Optional, List
import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from shapely import wkt

from app.api import get_db
from app.core import (
    authorization,
    set_policies
)

router = APIRouter()

policies = {
    "maps:get_filters": ["owner", "manager", "contributor", "reader"],
    "maps:get_bbox": ["owner", "manager", "contributor", "reader"]
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

@router.get("/bbox", dependencies=[Depends(authorization("maps:get_bbox"))])
def get_bbox(
    organization_id: int,
    db: Session = Depends(get_db)
) -> List:
    """
    Get the bounding box of all active trees within a organization
    """

    rows = db.execute(f"""
        SELECT 
            ST_XMin(geom) as xmin, ST_YMin(geom) as ymin, ST_XMax(geom) as xmax, ST_YMax(geom) as ymax
        FROM tree 
        WHERE organization_id = {organization_id}
        AND status IN ('new', 'edit', 'frozen');
    """)

    return rows.first()
