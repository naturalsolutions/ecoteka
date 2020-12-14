import logging
from typing import Optional
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
)

router = APIRouter()


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

        style["sources"]["osm"] = {
            "type": "vector",
            "tiles": [
                f"{settings.TILES_SERVER}/osm/{{z}}/{{x}}/{{y}}.pbf?scope=public"
            ],
            "minzoom": 0,
            "maxzoom": 13,
        }

        style["layers"].insert(
            len(style["layers"]),
            {
                "id": "osm",
                "type": "circle",
                "source": "osm",
                "source-layer": "ecoteka-data",
                "paint": {
                    "circle-radius": {"base": 1.75, "stops": [[12, 2], [22, 180]]},
                    "circle-color": "#6F8F72",
                },
            },
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
