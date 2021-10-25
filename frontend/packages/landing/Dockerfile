FROM node:current-alpine

WORKDIR /app
COPY . .
RUN yarn
RUN yarn workspace @ecoteka/core build
RUN yarn workspace @ecoteka/landing build

CMD ["yarn", "workspace", "@ecoteka/landing", "start"]
EXPOSE 3000