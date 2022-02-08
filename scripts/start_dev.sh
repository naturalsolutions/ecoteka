#!/bin/bash

# Create .env from .env.example
docker run --rm -v $(pwd):/data vikingco/jinja2cli .env.example > .env

# Build email template
docker run -v $(pwd)/backend/app/app/email-templates:/email-templates --rm -it node:alpine sh -c "npm i mjml && npx mjml /email-templates/src/*.mjml -o /email-templates/build"

# Start
docker-compose build --parallel
docker-compose up -d
