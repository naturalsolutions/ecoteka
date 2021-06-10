FROM node:lts-alpine as email-templates

COPY ./app/app/email-templates/src /email-templates

RUN mkdir -p /email-templates/build
RUN npx mjml /email-templates/*.mjml -o /email-templates/build

FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8-slim

ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt update && apt-get install -y build-essential libsqlite3-dev zlib1g-dev

COPY --from=registry.gitlab.com/natural-solutions/ecoteka:backend-base /install /usr/local
COPY --from=registry.gitlab.com/natural-solutions/tippecanoe /usr/local/bin /opt/tippecanoe/
COPY --from=email-templates /email-templates/build /app/app/email-templates/build

COPY ./app /app
COPY ./data /data