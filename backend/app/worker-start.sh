#! /usr/bin/env bash
set -e
celery -A app.worker worker -l INFO -Q main-queue -c 1