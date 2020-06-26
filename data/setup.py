#!/usr/bin/env python

from distutils.core import setup

setup(name='ecoteka-data',
      version='0.1',
      description='Natural Solution - Geo Data',
      author='Javier Blanco',
      author_email='javier_blanco@natural-solutions.eu',
      url='https://gitlab.com/natural-solutions/geo-data',
      scripts=[
        'create_tiles_from_sources.py'
      ],
      install_requires=[
        'pyyaml',
        'geopandas',
        'typer'
      ]
)
