#!/bin/bash

# Exit in case of error
set -e

ACME_FILE=acme.json

# Create acme.json if it doesn't exist
if [ ! -f "$ACME_FILE" ]; then
  touch acme.json
  chmod 600 acme.json
fi

# Create the traefik network and if it exists continues
docker network create traefik || true

# Pull docker images
docker-compose -f docker-compose.yml \
               -f docker-compose.prod.yml \
               pull

# Start the stack
docker-compose -f docker-compose.yml \
               -f docker-compose.prod.yml \
               up -d