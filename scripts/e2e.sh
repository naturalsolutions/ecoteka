#!/bin/bash

set -e

docker-compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml pull
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml build --no-cache
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml up -d
sleep 30
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml exec -T e2e npx cypress run --project /app
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml down -v --remove-orphans
