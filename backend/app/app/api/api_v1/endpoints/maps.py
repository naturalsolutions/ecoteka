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
    *,
    db: Session = Depends(get_db),
    token: Optional[str] = "",
    theme: Optional[str] = "dark",
    organization_id: Optional[int] = -1,
) -> Json:
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

        user_in_db = None

        if token:
            try:
                Authorize = AuthJWT()
                Authorize._token = token
                current_user_id = Authorize.get_jwt_subject()
                user_in_db = crud.user.get(db, id=current_user_id)
            except Exception as e:
                pass

        if user_in_db is None:
            return style

        conn = None

        try:
            organization_in_db = crud.organization.get(db, organization_id)

            if organization_in_db is None:
                return style

            target = f"/app/tiles/private/{organization_in_db.slug}.mbtiles"

            conn = sqlite3.connect(target)
            sql = """
                SELECT * FROM metadata
                WHERE name IN ('minzoom', 'maxzoom')
                ORDER BY name DESC
            """
            cur = conn.cursor()
            cur.execute(sql)
            minzoom, maxzoom = cur.fetchall()

            style["sources"][f"{organization_in_db.slug}"] = {
                "type": "vector",
                "tiles": [
                    f"{settings.TILES_SERVER}/{organization_in_db.slug}/{{z}}/{{x}}/{{y}}.pbf?scope=private&token={token}"
                ],
                "minzoom": int(minzoom[1]),
                "maxzoom": int(maxzoom[1]),
            }

            style["layers"].insert(
                len(style["layers"]),
                {
                    "id": f"ecoteka-{organization_in_db.slug}",
                    "type": "circle",
                    "source": organization_in_db.slug,
                    "source-layer": organization_in_db.slug,
                    "paint": {
                        "circle-stroke-width": 1,
                        "circle-stroke-color": "#fff",
                        "circle-radius": {
                            "base": 1.75,
                            "stops": [[12, 2], [22, 180]],
                        },
                        "circle-color": [
                            "case",
                            ["boolean", ["feature-state", "active"], False],
                            "red",
                            "#2597e4",
                        ],
                    },
                },
            )
        except Exception as e:
            logging.error(e)
        finally:
            if conn is not None:
                conn.close()
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