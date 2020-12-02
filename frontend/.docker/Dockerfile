FROM node:alpine

ARG ASSET_PREFIX_ARG=''
ARG API_URL_ARG='http://localhost:8000/api/v1'
ARG TOKEN_STORAGE_ARG='ecoteka_access_token'
ARG REFRESH_TOKEN_STORAGE_ARG='ecoteka_refresh_token'

RUN mkdir -p /usr/src/app

ENV PORT 3000
ENV ASSET_PREFIX=$ASSET_PREFIX_ARG
ENV API_URL=$API_URL_ARG
ENV TOKEN_STORAGE=$TOKEN_STORAGE_ARG
ENV REFRESH_TOKEN_STORAGE=$REFRESH_TOKEN_STORAGE_ARG

RUN echo $API_URL

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

RUN npm install --production

COPY . /usr/src/app

RUN npm run build

EXPOSE 3000
CMD [ "npm", "start" ]
