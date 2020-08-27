#!/usr/bin/env bash

set -e
set -x

pytest -s -v --cov=app --cov-report=term-missing app/tests "${@}"
