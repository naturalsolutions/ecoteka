FROM registry.gitlab.com/natural-solutions/ecoteka:frontend-base as builder
RUN npm run build && npm run export

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/out /usr/share/nginx/html
COPY .docker/docker-entrypoint.sh /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT [ "./docker-entrypoint.sh" ]
