#! /usr/bin/env bash

# Let the DB start
python /app/app/backend_pre_start.py

# Run migrations
alembic upgrade head

# Create initial data in DB
python /app/app/initial_data.py

mkdir -p /app/app/email-templates/build/
npx mjml /app/app/email-templates/src/*.mjml -o /app/app/email-templates/build/
