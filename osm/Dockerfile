FROM osgeo/gdal:alpine-normal-latest

RUN apk add --no-cache sudo git g++ make libgcc libstdc++ sqlite-libs sqlite-dev zlib-dev bash curl \
  && addgroup -S tippecanoe && adduser -S -G tippecanoe tippecanoe \
  && cd /root \
  && git clone https://github.com/mapbox/tippecanoe.git tippecanoe \
  && cd tippecanoe \
  && make \
  && make install \
  && rm -rf /root/tippecanoe \
  && apk del git g++ make sqlite-dev

COPY ./get_data_and_process.sh /etc/periodic/scripts/get_data_and_process
COPY ./startup.sh /startup.sh

ENTRYPOINT [ "/startup.sh" ]
