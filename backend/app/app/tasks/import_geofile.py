import fiona
import logging

from sqlalchemy.orm import Session

from app.models import GeoFile, Tree


def import_geofile(db: Session, geofile: GeoFile):
    with fiona.open(geofile.get_filepath()) as source:
        for i, feature in enumerate(source):
            x, y = feature["geometry"]["coordinates"]
            tree = Tree(
                geofile_id=geofile.id,
                geom=f'POINT({x} {y})'
            )

            db.add(tree)

            if i % 1000 == 0 and i > 0:
                print('i', i)
                db.commit()
        db.commit()
    logging.info(f"imported {geofile.name} geofile")
