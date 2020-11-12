FROM node:14-alpine as builder

WORKDIR /app
COPY package.json .
RUN npm install 
COPY . .
RUN npx next telemetry disable
RUN npm run build && npm run export

FROM nginx:14-alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/out /usr/share/nginx/html
COPY .docker/docker-entrypoint.sh /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT [ "./docker-entrypoint.sh" ]
