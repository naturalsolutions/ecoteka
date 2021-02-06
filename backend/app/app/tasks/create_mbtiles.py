import os
import shutil
import logging
import sys

import pandas as pd
import geopandas as gpd
from sqlalchemy.orm import Session

from app.models import Organization


def create_mbtiles(db: Session, organization: Organization):
    try:
        geojson = f"/app/tiles/private/{organization.slug}.geojson"
        target_tmp = f"/app/tiles/private/{organization.slug}_tmp.mbtiles"
        target = target_tmp.replace("_tmp", "")
        sql = f"SELECT * FROM public.tree WHERE organization_id = {organization.id}"
        df = gpd.read_postgis(sql, db.bind)

        if not df.empty:
            properties = df['properties'].apply(pd.Series)
            properties.columns = [f"properties_{col}" for col in properties.columns]
            df = pd.concat([df, properties], axis=1)
            df.to_file(geojson, driver="GeoJSON")
            cmd = "/opt/tippecanoe/tippecanoe"
            os.system(
                f"{cmd} -P -l {organization.slug} -o {target_tmp} --force --generate-ids --maximum-zoom=g --drop-densest-as-needed --extend-zooms-if-still-dropping {geojson}"
            )
            shutil.move(target_tmp, target)
            os.remove(geojson)
            db.execute(f"update tree set status = 'frozen' where organization_id = {organization.id}")
        else:
            os.remove(target)
    except:
        logging.error(sys.exc_info()[0])
        raise
