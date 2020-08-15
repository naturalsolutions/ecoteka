import os
import datetime
import enum
from typing import TYPE_CHECKING
from pathlib import Path

from sqlalchemy import Boolean, Column, Integer, String, DateTime, Enum
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
    count = Column(Integer, nullable=False, default=0)
    driver = Column(String, nullable=True)
    crs = Column(String, nullable=True)
    status = Column(Enum(GeoFileStatus,
                         values_callable=lambda obj: [e.value for e in obj]),
                    nullable=False,
                    default=GeoFileStatus.UPLOADED.value)
    uploaded_date = Column(DateTime, nullable=True, default=datetime.datetime.utcnow)
    imported_date = Column(DateTime, nullable=True)
    importing_start = Column(DateTime, nullable=True)
    public = Column(Boolean, nullable=False, default=False)

    def __init__(self, name: str, extension: str, original_name: str):
        self.name = name
        self.extension = extension
        self.original_name = original_name
        self.get_metadata()
        super().__init__()

    def get_filepath(self):
        if self.extension == 'zip':
            return f'zip://{settings.UPLOADED_FILES_FOLDER}/{self.name}.{self.extension}'
        else:
            return f'{settings.UPLOADED_FILES_FOLDER}/{self.name}.{self.extension}'

    def get_metadata(self):
        if self.extension in ['geojson', 'zip']:
            with fiona.open(self.get_filepath()) as c:
                self.count = len(c)
                self.driver = c.driver
                self.crs = c.crs["init"]

    def is_valid(self):
        try:
            if self.extension == 'geojson':
                return self.driver == 'GeoJSON'

            if self.extension == 'zip':
                return self.driver == 'ESRI Shapefile'

            if self.extension == 'csv':
                df = pd.read_csv(self.get_filepath())
                return len(df.columns) > 0 and not df.empty

            if self.extension == 'xls' or self.extension == 'xlsx':
                df = pd.read_excel(self.get_filepath())
                return len(df.columns) > 0 and not df.empty
        except:
            return False
