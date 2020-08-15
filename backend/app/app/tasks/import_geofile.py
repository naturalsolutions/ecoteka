import fiona
import logging
import datetime

from sqlalchemy.orm import Session

from app.models import GeoFile, GeoFileStatus, Tree


def import_geofile(db: Session, geofile: GeoFile):
    geofile.status = GeoFileStatus.IMPORTING.value
    geofile.importing_start = datetime.datetime.utcnow()
    db.commit()

    with fiona.open(geofile.get_filepath()) as source:
        for i, feature in enumerate(source):
            x, y = feature["geometry"]["coordinates"]
            tree = Tree(
                geofile_id=geofile.id,
                geom=f'POINT({x} {y})'
            )

            db.add(tree)

            if i % 1000 == 0 and i > 0:
                db.commit()
        db.commit()

    geofile.imported_date = datetime.datetime.utcnow()
    geofile.status = GeoFileStatus.IMPORTED.value
    db.commit()
    logging.info(f"imported {geofile.name} geofile")
