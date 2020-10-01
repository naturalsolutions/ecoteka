FROM debian:10-slim as tippecanoe

RUN apt-get -y update \
  && apt-get -y install git build-essential libsqlite3-dev zlib1g-dev

RUN git clone https://github.com/mapbox/tippecanoe.git \
  && cd tippecanoe \
  && make -j

FROM node:alpine as email-templates

COPY ./app/app/email-templates/src /email-templates

RUN mkdir -p /email-templates/build \
  && npx mjml /email-templates/*.mjml -o /email-templates/build

FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8-slim as builder

RUN apt-get -y update && apt-get -y install libpq-dev build-essential

RUN mkdir /install
WORKDIR /install

RUN pip install --prefix=/install --no-cache-dir \
  fastapi==0.61.0 pyjwt SQLAlchemy geoalchemy2 alembic \
  passlib[bcrypt] pydantic[email] emails tenacity psycopg2-binary python-jose \
  python-multipart pytest pytest-cov jinja2 geopandas xlrd slug celery redis

FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8-slim

ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY --from=email-templates /email-templates/build /app/app/email-templates/build
COPY --from=builder /install /usr/local
COPY --from=tippecanoe [ \
  "/tippecanoe/tippecanoe", \
  "/tippecanoe/tippecanoe-decode", \
  "/tippecanoe/tippecanoe-enumerate", \
  "/tippecanoe/tippecanoe-json-tool", \
  "/tippecanoe/tile-join", \
  "/opt/tippecanoe/" \
  ]

COPY ./app /app

COPY ./datas /data
# will unzip the file and remove the archive
RUN gunzip /data/TAXREFv13.txt.gz