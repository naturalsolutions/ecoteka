FROM node as builder

WORKDIR /app
COPY package.json .
RUN npm install 
COPY . .
RUN npm run build && npx next export

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
