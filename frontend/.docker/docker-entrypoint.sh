#!/bin/sh

if [[ ! -z "${NS_ECOTEKA_FRONTEND_BACKEND_API_URL}" ]]; then
    sed -i "s|%api_url%|${NS_ECOTEKA_FRONTEND_BACKEND_API_URL}|g" /usr/share/nginx/html/index.html
    sed -i "s|%api_url%|${NS_ECOTEKA_FRONTEND_BACKEND_API_URL}|g" /usr/share/nginx/html/404.html
fi 

nginx -g "daemon off;"