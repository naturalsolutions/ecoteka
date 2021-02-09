import os
import shutil
import logging
import sys

from typing import List
import pandas as pd
import geopandas as gpd
from sqlalchemy.orm import Session

from app.models import Organization
from app.crud import crud_organization


def create_mbtiles(db: Session, organization: Organization):
    try:
        geojson = f"/app/tiles/private/{organization.slug}.geojson"
        target_tmp = f"/app/tiles/private/{organization.slug}_tmp.mbtiles"
        target = target_tmp.replace("_tmp", "")
        db.execute("update tree set properties = '{}' where properties = 'null'")
        db.commit()
        sql = f"SELECT * FROM public.tree WHERE organization_id = {organization.id}"
        df = gpd.read_postgis(sql, db.bind)

        if not df.empty:
            properties = pd.DataFrame(df['properties'].tolist())
            properties.columns = [f"properties_{col}" for col in properties.columns]
            df = pd.concat([df, properties], axis=1)
            df.to_file(geojson, driver="GeoJSON")
            cmd = "/opt/tippecanoe/tippecanoe"
            os.system(
                f"{cmd} -P -l {organization.slug} -o {target_tmp} -B10 --force --generate-ids --maximum-zoom=g --extend-zooms-if-still-dropping {geojson}"
            )
            shutil.move(target_tmp, target)
            os.remove(geojson)
            db.execute(f"update tree set status = 'frozen' where organization_id = {organization.id}")
            db.commit()
        else:
            os.remove(target)
    except:
        logging.error(sys.exc_info()[0])
        raise

def update_mbtiles(db: Session, organization_id: int, filter: List[int] = []):
    try:
        organization = crud_organization.organization.get(db, id=organization_id)
        geojson = f"/app/tiles/private/{organization.id}.geojson"
        db.execute("update tree set properties = '{}' where properties = 'null'")
        db.commit()
        sql = f"SELECT * FROM public.tree WHERE organization_id = {organization.id} and status not in ('frozen', 'import')"
        df = gpd.read_postgis(sql, db.bind)

        if not df.empty:
            properties = pd.DataFrame(df['properties'].tolist())
            properties.columns = [f"properties_{col}" for col in properties.columns]
            df = pd.concat([df, properties], axis=1)
            df.to_file(geojson, driver="GeoJSON")
            os.system(
                f"/opt/tippecanoe/tippecanoe -l {organization.slug} -o /app/tiles/private/{organization.id}_tmp.mbtiles --force --generate-ids --drop-densest-as-needed -d12 -z12 --extend-zooms-if-still-dropping {geojson}"
            )
            os.system(
                f"/opt/tippecanoe/tile-join -o /app/tiles/private/{organization.id}_combined.mbtiles /app/tiles/private/{organization.id}_tmp.mbtiles /app/tiles/private/{organization.slug}.mbtiles"
            )
            os.system(
                f"mv /app/tiles/private/{organization.id}_combined.mbtiles /app/tiles/private/{organization.slug}.mbtiles"
            )
            os.system(
                f"rm {geojson} /app/tiles/private/{organization.id}_tmp.mbtiles"
            )
    except:
        logging.error(sys.exc_info()[0])
        raise