from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pandas as pd
import geopandas as gpd
import os
import shutil


class Organization:
    id: int
    slug: str

    def __init__(self, id: int, slug: str):
        self.id = id
        self.slug = slug

engine = create_engine('postgres://postgres:password@db:5432/ecoteka', pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()
organization = Organization(id=1, slug="natural-solutions")
geojson = f"/app/tiles/private/{organization.slug}.geojson"
target_tmp = f"/app/tiles/private/{organization.slug}_tmp.mbtiles"
target = target_tmp.replace("_tmp", "")

db.execute("update tree set properties = '{}' where properties = 'null'")
db.commit()
db.execute(f"update tree set status = 'frozen' where organization_id = {organization.id};")
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
        f"{cmd} -P -l {organization.slug} -o {target_tmp} --force --generate-ids --maximum-zoom=g --drop-densest-as-needed --extend-zooms-if-still-dropping {geojson}"
    )
    shutil.move(target_tmp, target)
    os.remove(geojson)
else:
    os.remove(target)