FROM node:15-buster-slim as builder
WORKDIR /app
RUN apt-get update \
    && apt-get install -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
COPY package.json .
RUN npm install 
COPY . .
RUN npx next telemetry disable
RUN npm run build && npm run export

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/out /usr/share/nginx/html
COPY .docker/docker-entrypoint.sh /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT [ "./docker-entrypoint.sh" ]
