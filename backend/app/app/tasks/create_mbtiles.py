import os
import logging
import sys

import geopandas as gpd
import sqlite3
from sqlalchemy.orm import Session


from app.models import Organization
from app.crud import user


def create_mbtiles(db: Session, organization: Organization):
    try:
        geojson = f"/app/tiles/private/{organization.slug}.geojson"
        target = f"/app/tiles/private/{organization.slug}.mbtiles"
        sql = f'SELECT * FROM public.tree WHERE organization_id = {organization.id}'
        df = gpd.read_postgis(sql, db.bind)

        if not df.empty:
            df.to_file(geojson, driver="GeoJSON")
            cmd = "/opt/tippecanoe/tippecanoe"
            os.system(
                f"{cmd} -P -l {organization.slug} -o {target} --force --maximum-zoom=g --drop-densest-as-needed --extend-zooms-if-still-dropping {geojson}")
            os.remove(geojson)
        else:
            os.remove(target)
    except:
        logging.error(sys.exc_info()[0])
        raise
