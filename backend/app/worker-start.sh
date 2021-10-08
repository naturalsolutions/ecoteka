#! /usr/bin/env bash
set -e
celery -A app.worker worker --pool=prefork -l INFO -Q main-queue -c 1
