from typing import Dict, Optional, List
import json
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from bokeh import palettes
import geopandas as gpd
from shapely.geometry import box

from app.api import get_db
from app.core import (
    authorization,
    set_policies
)

from app.crud import organization

router = APIRouter()

policies = {
    "maps:get_geojson": ["owner", "manager", "contributor", "reader"],
    "maps:get_geojson": ["owner", "manager", "contributor", "reader"],
    "maps:get_bbox": ["owner", "manager", "contributor", "reader"]
}

set_policies(policies)


@router.get("/style/")
def generate_style(
    db: Session = Depends(get_db),
    theme: Optional[str] = "dark",
    background: Optional[str] = "map"
) -> Dict:
    """
    Generate style
    """
    with open(f"/app/app/assets/styles/{theme}.json") as style_json:
        style = json.load(style_json)

        if background == "satellite":
            satellite = [index for index, layer in enumerate(style["layers"]) if layer["id"] == "satellite"]
            
            if len(satellite) > 0:
                style["layers"][satellite[0]]["layout"]["visibility"] = "visible"


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

def hex_to_rgb(hex):
    hex = hex.lstrip('#')
    hlen = len(hex)
    return tuple(int(hex[i:i + hlen // 3], 16) for i in range(0, hlen, hlen // 3))

def complementaryColor(my_hex):
    if my_hex[0] == '#':
        my_hex = my_hex[1:]
    rgb = (my_hex[0:2], my_hex[2:4], my_hex[4:6])
    comp = ['%02X' % (255 - int(a, 16)) for a in rgb]
    
    return ''.join(comp)

@router.get("/geojson", dependencies=[Depends(authorization("maps:get_geojson"))])
def get_geojson(
    organization_id: int,
    mode: Optional[str] = "geopandas",
    db: Session = Depends(get_db)
) -> Dict: 
    """
    Get Organization GeoJSON
    """
    organization_in_db = organization.get(db, id=organization_id)

    if not organization_in_db:
        raise HTTPException(status_code=404, detail="Organization not found")

    response = None
    if mode == 'geopandas':
        sql = f"""SELECT t.id as id, t.properties, geom, 
                        COALESCE(json_agg(json_build_object('id', i.id,
                                                    'date', i.date,
                                                    'intervention_end_date', i.intervention_end_date,
                                                    'intervention_start_date', i.intervention_start_date,
                                                    'intervenant', i.intervenant,
                                                    'required_documents', i.required_documents,
                                                    'required_material', i.required_material,
                                                    'estimated_cost', i.estimated_cost, 
                                                    'intervention_type', i."intervention_type", 
                                                    'properties', i."properties"
                                                    )) FILTER (WHERE i.id IS NOT NULL), '[]'
                                    ) as interventions  
                    FROM public.tree t LEFT JOIN intervention i 
                    ON i.tree_id = t.id
                    WHERE t.organization_id = {organization_in_db.id}
                    GROUP BY t.id, i.id
                """
        df = gpd.read_postgis(sql, db.bind)
        data = df.to_json()
        response = json.loads(data)
    else:
        sql = f"""SELECT jsonb_build_object('type','FeatureCollection', 'features', jsonb_agg(features.feature))
                   FROM (
                       SELECT jsonb_build_object(
                           'type',       'Feature',
                           'id',         id,
                           'geometry',   ST_AsGeoJSON(geom)::jsonb,
                           'properties', to_jsonb(selected_trees) - 'geom'
                   ) AS feature
                   FROM (
                       SELECT t.id as id, t.properties, geom, 
                        COALESCE(json_agg(json_build_object('id', i.id,
                                                    'date', i.date,
                                                    'intervention_end_date', i.intervention_end_date,
                                                    'intervention_start_date', i.intervention_start_date,
                                                    'intervenant', i.intervenant,
                                                    'required_documents', i.required_documents,
                                                    'required_material', i.required_material,
                                                    'estimated_cost', i.estimated_cost, 
                                                    'intervention_type', i."intervention_type", 
                                                    'properties', i."properties"
                                                    )) FILTER (WHERE i.id IS NOT NULL), '[]'
                                    ) as interventions  
                    FROM public.tree t LEFT JOIN intervention i 
                    ON i.tree_id = t.id
                    WHERE t.organization_id = {organization_in_db.id}
                    GROUP BY t.id, i.id
                       ) 
                       selected_trees) 
                   features;
            """
        res = db.execute(sql)
        row = res.first()
        response = dict(row.jsonb_build_object)
    return response

@router.get("/geobuf", dependencies=[Depends(authorization("maps:get_geojson"))])
def get_geobuff(
    organization_id: int,
    db: Session = Depends(get_db)
)-> Dict:
    """
    Generate a compressed Feature Collection for Organization trees
    """

    organization_in_db = organization.get(db, id=organization_id)

    if not organization_in_db:
        raise HTTPException(status_code=404, detail="Organization not found")

    sql = f"""

        WITH selection AS (
            SELECT t.id as id, t.properties, geom, 
                        COALESCE(json_agg(json_build_object('id', i.id,
                                                    'date', i.date,
                                                    'intervention_end_date', i.intervention_end_date,
                                                    'intervention_start_date', i.intervention_start_date,
                                                    'intervenant', i.intervenant,
                                                    'required_documents', i.required_documents,
                                                    'required_material', i.required_material,
                                                    'estimated_cost', i.estimated_cost, 
                                                    'intervention_type', i."intervention_type", 
                                                    'properties', i."properties"
                                                    )) FILTER (WHERE i.id IS NOT NULL), '[]'
                                    ) as interventions  
                    FROM public.tree t LEFT JOIN intervention i 
                    ON i.tree_id = t.id
                    WHERE t.organization_id = {organization_in_db.id}
                    GROUP BY t.id, i.id
        )
        SELECT encode(ST_AsGeobuf(selection.*), 'base64') AS pbf
        FROM  selection;
    """

    res = db.execute(sql)
    row = res.first()
    # return Response(content=row, media_type="application/vnd.google.protobuf")
    return row


@router.get("/{organization_id}/tree_tiles/{z}/{x}/{y}/.pbf", dependencies=[Depends(authorization("maps:get_geojson"))])
def get_tree_tiles(
    z: int,
    x: float,
    y: float,
    *,
    organization_id: int,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Generate Trees MVT for a given organization
    """
    organization_in_db = organization.get(db, id=organization_id)

    if not organization_in_db:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    sql = f"""
        WITH mvtgeom AS (
            SELECT
                ST_AsMVTGeom(ST_SetSRID(geom, 4326), ST_Transform(ST_TileEnvelope({z},{x},{y}), 4326)) AS geom,
                id,
                properties
            FROM public.tree AS t
            WHERE ST_Intersects(ST_SetSRID(geom, 4326), ST_Transform(ST_TileEnvelope({z},{x},{y}), 4326)) AND t.organization_id = {organization_in_db.id}
            )
        SELECT ST_AsMVT(mvtgeom.*) AS mvt
        FROM mvtgeom;
    """
    result_proxy = db.execute(sql)
    return result_proxy.first()



@router.get("/filter", dependencies=[Depends(authorization("maps:get_filters"))])
def get_filters(
    organization_id: int,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Get filters 
    """
    fields = ["canonicalName", "vernacularName"]
    filter: Dict = {}

    for field in fields:
        rows = db.execute(f"""
            select distinct properties ->> '{field}' as value, count(properties) as total
            from tree
            where organization_id = {organization_id}
            group by properties ->> '{field}'
            order by total desc;""")
        colors = palettes.viridis(rows.rowcount)
        filter[field] = [{ 
            'value': row.value, 
            'total': row.total, 
            'background': hex_to_rgb(colors[i]),
            'color': hex_to_rgb(complementaryColor(colors[i]))
        } for i, row in enumerate(rows) if row[0] not in ["", None]]
    
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
            ST_XMIN(ST_EXTENT(geom)) as xmin, 
            ST_YMIN(ST_EXTENT(geom)) as ymin, 
            ST_XMAX(ST_EXTENT(geom)) as xmax, 
            ST_YMAX(ST_EXTENT(geom)) as ymax
        FROM tree 
        WHERE organization_id = {organization_id}
        AND status NOT IN ('delete', 'import');
    """)

    return rows.first()
