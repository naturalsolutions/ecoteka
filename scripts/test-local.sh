#! /usr/bin/env bash

# Exit in case of error
set -e

docker-compose down -v --remove-orphans # Remove possibly previous broken stacks left hanging after an error

# if [ $(uname -s) = "Linux" ]; then
#     echo "Remove __pycache__ files"
#     find . -type d -name __pycache__ -exec rm -r {} \+
# fi

docker-compose build --parallel backend
docker-compose up -d
sleep 60
docker-compose exec -T backend bash /app/tests-start.sh "$@"