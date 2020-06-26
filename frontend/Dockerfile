FROM node as builder

ARG asset_prefix
WORKDIR /app
COPY package.json .
RUN npm install 
COPY . .
RUN ASSET_PREFIX=${asset_prefix} npm run build && npm run export

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
