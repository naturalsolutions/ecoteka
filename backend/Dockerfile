FROM node:lts-alpine as email-templates

COPY ./app/app/email-templates/src /email-templates

RUN mkdir -p /email-templates/build
RUN npx mjml /email-templates/*.mjml -o /email-templates/build

FROM registry.gitlab.com/natural-solutions/ecoteka:backend-base as builder

FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8-slim

ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY --from=builder /install /usr/local
COPY --from=builder [ \
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