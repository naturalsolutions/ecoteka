#!/bin/bash

# Create the traefik network and if it exists continues
docker network create traefik 2> /dev/null

# Create .env from .env.example
docker run --rm -v $(pwd):/data vikingco/jinja2cli .env.example > .env

# Start
docker-compose up -d --build
