FROM debian:10-slim as tippecanoe

RUN apt-get -y update \
  && apt-get -y install git build-essential libsqlite3-dev zlib1g-dev

RUN git clone https://github.com/mapbox/tippecanoe.git \
  && cd tippecanoe \
  && make -j

FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get -y update && apt-get -y install npm

COPY --from=tippecanoe [ \
  "/tippecanoe/tippecanoe", \
  "/tippecanoe/tippecanoe-decode", \
  "/tippecanoe/tippecanoe-enumerate", \
  "/tippecanoe/tippecanoe-json-tool", \
  "/tippecanoe/tile-join", \
  "/opt/tippecanoe/" \
  ]

RUN pip install --no-cache-dir fastapi==0.61.0 pyjwt SQLAlchemy geoalchemy2 alembic \
  passlib[bcrypt] pydantic[email] emails tenacity psycopg2 python-jose \
  python-multipart pytest pytest-cov jinja2 geopandas xlrd slug celery redis

COPY ./app /app

COPY ./datas /data
# will unzip the file and remove the archive
RUN gunzip /data/TAXREFv13.txt.gz