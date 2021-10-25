FROM node:alpine

RUN \
  apk add --no-cache python3 make g++ && \
  apk add ripgrep vips-dev fftw-dev --update-cache \
  --repository http://dl-3.alpinelinux.org/alpine/edge/community \
  --repository http://dl-3.alpinelinux.org/alpine/edge/main \
  && rm -fR /var/cache/apk/*

RUN mkdir -p /usr/src/app

ENV PORT 3000
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm install --production

COPY . /usr/src/app/

RUN npm run build
RUN mkdir -p /usr/src/app/node_modules/vscode-ripgrep/bin
RUN cp /usr/bin/rg /usr/src/app/node_modules/vscode-ripgrep/bin/rg
EXPOSE 3000
CMD [ "npm", "start" ]
