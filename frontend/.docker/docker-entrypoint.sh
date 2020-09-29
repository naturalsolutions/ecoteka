#!/bin/sh

if [[ ! -z "${API_URL}" ]]; then
    sed -i "s|%api_url%|${API_URL}|g" ${OUT_FOLDER}/index.html
    sed -i "s|%api_url%|${API_URL}|g" ${OUT_FOLDER}/imports/index.html
    sed -i "s|%api_url%|${API_URL}|g" ${OUT_FOLDER}/registration-link/index.html
    sed -i "s|%api_url%|${API_URL}|g" ${OUT_FOLDER}/treeedition/index.html
    sed -i "s|%api_url%|${API_URL}|g" ${OUT_FOLDER}/404.html
fi 

if [[ ! -z "${TOKEN_STORAGE}" ]]; then
    sed -i "s|%token_storage%|${TOKEN_STORAGE}|g" ${OUT_FOLDER}/index.html
    sed -i "s|%token_storage%|${TOKEN_STORAGE}|g" ${OUT_FOLDER}/imports/index.html
    sed -i "s|%token_storage%|${TOKEN_STORAGE}|g" ${OUT_FOLDER}/registration-link/index.html
    sed -i "s|%token_storage%|${TOKEN_STORAGE}|g" ${OUT_FOLDER}/treeedition/index.html
    sed -i "s|%token_storage%|${TOKEN_STORAGE}|g" ${OUT_FOLDER}/404.html
fi 

nginx -g "daemon off;"