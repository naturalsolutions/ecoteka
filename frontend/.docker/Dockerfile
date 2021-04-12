FROM node:alpine

RUN \
  apk add --no-cache python make g++ && \
  apk add vips-dev fftw-dev --update-cache \
  --repository http://dl-3.alpinelinux.org/alpine/edge/community \
  --repository http://dl-3.alpinelinux.org/alpine/edge/main \
  && rm -fR /var/cache/apk/*

RUN mkdir -p /usr/src/app

ENV PORT 3000
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

RUN npm install --production --legacy-peer-deps

COPY . /usr/src/app

RUN npm run build

EXPOSE 3000
CMD [ "npm", "start" ]
