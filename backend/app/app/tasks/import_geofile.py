import os
import sys
import fiona
import logging
import datetime
from pathlib import Path

import sqlite3
import numpy as np
from sqlalchemy.orm import Session
import pandas as pd
import geopandas as gpd

from app.models import GeoFile, GeoFileStatus, Tree
from app.crud import organization


def import_from_fiona(db: Session, path: Path, geofile: GeoFile):
    with fiona.open(path) as c:
        for i, feature in enumerate(c):
            x, y = feature["geometry"]["coordinates"]
            properties = feature["properties"]

            tree = Tree(
                geofile_id=geofile.id,
                user_id=geofile.user_id,
                organization_id=geofile.organization_id,
                geom=f'POINT({x} {y})',
                properties=properties
            )  # type: ignore

            db.add(tree)

            if i % 1000 == 0 and i > 0:
                db.commit()
        db.commit()


def import_from_dataframe(db: Session, df: pd.DataFrame, path: Path, geofile: GeoFile):
    if not geofile.longitude_column:
        raise Exception(f"unknow longitude_column in {geofile.name} file")

    if not geofile.latitude_column:
        raise Exception(f"unknow latitude_column in {geofile.name} file")

    for i in df.index:
        x = df.loc[i, geofile.longitude_column]
        y = df.loc[i, geofile.latitude_column]

        if np.isnan(x) or np.isnan(y):
            continue

        point_columns = [geofile.longitude_column, geofile.latitude_column]
        columns = df.columns.difference(point_columns).to_list()
        properties = {}

        for column in columns:
            properties[column] = df.loc[i, column]

        tree = Tree(
            geofile_id=geofile.id,
            user_id=geofile.user_id,
            organization_id=geofile.organization_id,
            geom=f'POINT({x} {y})',
            properties=properties
        )  # type: ignore

        db.add(tree)

        if i % 1000 == 0 and i > 0:
            db.commit()
    db.commit()


def import_geofile(db: Session, geofile: GeoFile):
    geofile.status = GeoFileStatus.IMPORTING.value
    geofile.importing_start = datetime.datetime.utcnow()
    db.commit()

    if geofile.extension in ['geojson', 'zip']:
        import_from_fiona(db, geofile.get_filepath(), geofile)

    if geofile.extension in ['xlsx', 'xls']:
        df = pd.read_excel(geofile.get_filepath())
        import_from_dataframe(db, df, geofile.get_filepath(), geofile)

    if geofile.extension == 'csv':
        df = pd.read_csv(geofile.get_filepath())
        import_from_dataframe(db, df, geofile.get_filepath(), geofile)

    geofile.imported_date = datetime.datetime.utcnow()
    geofile.status = GeoFileStatus.IMPORTED.value
    db.commit()

    create_mbtiles(db, geofile=geofile)
    logging.info(f"imported {geofile.name} geofile")


def create_mbtiles(db: Session, geofile: GeoFile):
    try:
        organization_geofile = organization.get(db, geofile.organization_id)
        geojson = f"/app/tiles/private/{organization_geofile.slug}.geojson"
        sql = f'SELECT * FROM public.tree WHERE organization_id = {organization_geofile.id}'
        df = gpd.read_postgis(sql, db.bind)
        df.to_file(geojson, driver="GeoJSON")

        cmd = "/opt/tippecanoe/tippecanoe"
        target = f"/app/tiles/private/{organization_geofile.slug}.mbtiles"
        os.system(f"{cmd} -P -l {organization_geofile.slug} -o {target} {geojson}")
        os.remove(geojson)

        conn = sqlite3.connect(target)
        sql = '''
            INSERT INTO metadata(name, value) 
            VALUES(?, ?)
        '''
        cur = conn.cursor()
        cur.execute(sql, ["allowed_users", geofile.user_id])
        conn.commit()
        conn.close()
    except:
        logging.error(sys.exc_info()[0])
        raise
