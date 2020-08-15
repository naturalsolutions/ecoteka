import os
import datetime
import enum
from typing import TYPE_CHECKING
from pathlib import Path

from sqlalchemy import Boolean, Column, Integer, String, DateTime, Enum, null
from sqlalchemy.orm import relationship
import fiona
import pandas as pd

from app.db.base_class import Base
from app.core.config import settings


class GeoFileStatus(enum.Enum):
    UPLOADED = 'uploaded'
    IMPORTED = 'imported'
    IMPORTING = 'importing'


class GeoFile(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, unique=True, nullable=False)
    original_name = Column(String, nullable=False)
    extension = Column(String, nullable=False)
    status = Column(Enum(GeoFileStatus,
                         values_callable=lambda obj: [e.value for e in obj]),
                    nullable=False,
                    default=GeoFileStatus.UPLOADED.value)
    uploaded_date = Column(DateTime, nullable=True, default=datetime.datetime.utcnow)
    imported_date = Column(DateTime, nullable=True)
    importing_start = Column(DateTime, nullable=True)
    public = Column(Boolean, nullable=False, default=False)

    def get_filepath(self):
        return f'{settings.UPLOADED_FILES_FOLDER}/{self.name}.{self.extension}'

    def is_valid(self, path: Path):
        try:
            filename_parts = os.path.splitext(path)
            extension = filename_parts[1][1:]

            if extension == 'geojson':
                with fiona.open(path) as c:
                    return c.driver == 'GeoJSON'

            if extension == 'zip':
                with fiona.open(f'zip://{path}') as c:
                    return c.driver == 'ESRI Shapefile'

            if extension == 'csv':
                df = pd.read_csv(path)
                return len(df.columns) > 0 and not df.empty

            if extension == 'xls' or extension == 'xlsx':
                df = pd.read_excel(path)
                return len(df.columns) > 0 and not df.empty
        except:
            return False
