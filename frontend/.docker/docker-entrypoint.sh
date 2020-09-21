#!/bin/sh

if [[ ! -z "${API_URL}" ]]; then
    sed -i "s|%api_url%|${API_URL}|g" /usr/share/nginx/html/index.html
    sed -i "s|%api_url%|${API_URL}|g" /usr/share/nginx/html/imports/index.html
    sed -i "s|%api_url%|${API_URL}|g" /usr/share/nginx/html/registration-link/index.html
    sed -i "s|%api_url%|${API_URL}|g" /usr/share/nginx/html/treeedition/index.html
    sed -i "s|%api_url%|${API_URL}|g" /usr/share/nginx/html/404.html
fi 

if [[ ! -z "${TOKEN_STORAGE}" ]]; then
    sed -i "s|%token_storage%|${TOKEN_STORAGE}|g" /usr/share/nginx/html/index.html
    sed -i "s|%token_storage%|${TOKEN_STORAGE}|g" /usr/share/nginx/html/imports/index.html
    sed -i "s|%token_storage%|${TOKEN_STORAGE}|g" /usr/share/nginx/html/registration-link/index.html
    sed -i "s|%token_storage%|${TOKEN_STORAGE}|g" /usr/share/nginx/html/treeedition/index.html
    sed -i "s|%token_storage%|${TOKEN_STORAGE}|g" /usr/share/nginx/html/404.html
fi 

nginx -g "daemon off;"