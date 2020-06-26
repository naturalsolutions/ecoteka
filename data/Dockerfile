# Download and process open data sources
FROM python as download

WORKDIR /app
COPY . .
RUN pip install .
RUN python create_tiles_from_sources.py sources.yml

# Create tiles with tippecanoe
FROM registry.gitlab.com/natural-solutions/tippecanoe as tippecanoe

RUN mkdir data
COPY --from=download /app/data data
RUN tippecanoe --output-to-directory tiles --force -l ecoteka-data --no-tile-compression --maximum-zoom=g --drop-densest-as-needed --extend-zooms-if-still-dropping data/*

# Create nginx server with the tiles created with tippecanoe
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=tippecanoe /home/tippecanoe/tiles /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]