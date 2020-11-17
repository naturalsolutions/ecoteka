FROM registry.gitlab.com/natural-solutions/tippecanoe:latest as tippecanoe

FROM node:lts-alpine as email-templates

COPY ./app/app/email-templates/src /email-templates

RUN mkdir -p /email-templates/build
RUN npx mjml /email-templates/*.mjml -o /email-templates/build

FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8-slim as builder

RUN apt-get -y update && apt-get -y install libpq-dev build-essential

RUN mkdir /install
WORKDIR /install

RUN pip install --no-warn-script-location --prefix=/install --no-cache-dir \
  fastapi==0.61.0 fastapi-jwt-auth SQLAlchemy geoalchemy2 alembic \
  passlib[bcrypt] pydantic[email] emails tenacity psycopg2-binary python-jose \
  python-multipart pytest pytest-cov jinja2 geopandas xlrd slug celery redis

FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8-slim

ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY --from=builder /install /usr/local
COPY --from=tippecanoe [ \
  "/usr/local/bin/tippecanoe", \
  "/usr/local/bin/tippecanoe-decode", \
  "/usr/local/bin/tippecanoe-enumerate", \
  "/usr/local/bin/tippecanoe-json-tool", \
  "/usr/local/bin/tile-join", \
  "/opt/tippecanoe/" \
  ]

COPY ./app /app

COPY ./data /data
COPY --from=email-templates /email-templates/build /app/app/email-templates/build