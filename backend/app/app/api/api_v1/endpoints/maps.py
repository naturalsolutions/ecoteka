from typing import Dict, Optional, List
import json
from fastapi import APIRouter, Depends, Response, HTTPException
from sqlalchemy.orm import Session
import geopandas as gpd
from app import crud

from app.api import get_db
from app.core import (
    authorization,
    permissive_authorization,
    get_optional_current_active_user,
    settings
)

from app.schemas import (
    FeatureCollection
)

from app.models import (
    User
)

from app.crud import organization

router = APIRouter()

settings.policies["maps"] = {
    "maps:get_geojson": ["admin", "owner", "manager", "contributor", "reader"],
    "maps:get_geobuf": ["admin", "owner", "manager", "contributor", "reader"],
    "maps:get_filter": ["admin", "owner", "manager", "contributor", "reader"],
    "maps:get_bbox": ["admin", "owner", "manager", "contributor", "reader"]
}


@router.get("/style")
def generate_style(
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
        
        return style

@router.get("/geojson", dependencies=[Depends(authorization("maps:get_geojson"))], response_model=FeatureCollection)
def get_geojson(
    organization_id: int,
    mode: Optional[str] = "geopandas",
    db: Session = Depends(get_db)
) -> Optional[FeatureCollection]: 
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

@router.get("/geobuf", dependencies=[Depends(permissive_authorization("maps:get_geobuf"))])
def get_geobuff(
    organization_id: int,
    db: Session = Depends(get_db),
):
    """
    Generate a compressed Feature Collection for Organization trees
    """
    organization_in_db = organization.get_by_id_or_slug(db, id=organization_id)

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
        SELECT ST_AsGeobuf(selection.*) AS pbf
        FROM  selection;
    """

    res = db.execute(sql)
    row = res.first()

    if row['pbf']:
        return Response(bytes(row['pbf']))
    
    return row['pbf']


# @router.get("/{organization_id}/tree_tiles/{z}/{x}/{y}.pbf", dependencies=[Depends(authorization("maps:get_geojson"))])
# def get_tree_tiles(
#     z: int,
#     x: float,
#     y: float,
#     *,
#     organization_id: int,
#     db: Session = Depends(get_db)
# ) -> Dict:
#     """
#     Generate Trees MVT for a given organization
#     """
#     organization_in_db = organization.get(db, id=organization_id)

#     if not organization_in_db:
#         raise HTTPException(status_code=404, detail="Organization not found")
    
#     sql = f"""
#         WITH mvtgeom AS (
#             SELECT
#                 ST_AsMVTGeom(ST_SetSRID(geom, 4326), ST_Transform(ST_TileEnvelope({z},{x},{y}), 4326)) AS geom,
#                 id,
#                 properties
#             FROM public.tree AS t
#             WHERE ST_Intersects(ST_SetSRID(geom, 4326), ST_Transform(ST_TileEnvelope({z},{x},{y}), 4326)) AND t.organization_id = {organization_in_db.id}
#             )
#         SELECT ST_AsMVT(mvtgeom.*) AS mvt
#         FROM mvtgeom;
#     """
#     result_proxy = db.execute(sql)
#     return result_proxy.first()



@router.get("/filter", dependencies=[Depends(permissive_authorization("maps:get_filter"))])
def get_filters(
    organization_id: int,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Get filters 
    """
    palettes = [200, 400, 600, 800, 1000]
    filters = crud.tree.get_filters(db, organization_id)

    for filter in filters:
        total_rows = len(filters[filter])
        selected_palette = [palette for palette in palettes if palette > total_rows][0]
        palette = open(f'/app/app/data/palettes/{selected_palette}.txt').read().splitlines()

        for i in enumerate(filters[filter]):
            filters[filter][i[0]]["background"] = palette[i[0]]
        
    return filters

@router.get("/bbox", dependencies=[Depends(permissive_authorization("maps:get_bbox"))])
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
        WHERE organization_id = {organization_id};
    """)

    return rows.first()
