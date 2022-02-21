#!/bin/bash

set -e

sh ./scripts/setup_dev.sh
sleep 30
docker-compose -f docker-compose.yml -f docker-compose.override.yml exec -T e2e npx cypress run --project /app
docker-compose -f docker-compose.yml -f docker-compose.override.yml down -v --remove-orphans
