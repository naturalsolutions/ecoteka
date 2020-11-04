ARG BACKEND_BASE_IMAGE

FROM $BACKEND_BASE_IMAGE

ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY ./app /app

COPY ./data /data
