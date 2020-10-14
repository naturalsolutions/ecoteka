# For your information
The backend use the docker image
[tiangolo/uvicorn-gunicorn-fastapi:python3.8](https://github.com/tiangolo/uvicorn-gunicorn-fastapi-docker)
and this image use [tiangolo/uvicorn-gunicorn:python3.8](https://github.com/tiangolo/uvicorn-gunicorn-docker)

# Warning
Every time you save your code and run
```bash
docker-compose up -d
```
The [prestart.sh](/backend/app/prestart.sh) will be executed and migration to head will be done
```bash
alembic upgrade head
```


# Commands

Don't forget this command must be executed in the container
## Directly
```bash
docker-compose exec backend alembic current
docker-compose exec backend alembic history --verbose
```
## Take control of bash container
```bash
docker-compose exec backend bash
```

## Create new revision file
```bash
alembic revision -m "new table"
```

## Upgrade to head
```bash
alembic upgrade head
```

## Partial revision identifiers
```bash
alembic upgrade ae1
```

## Relative migration
```bash
alembic upgrade +2
```

## Undo last migration
```bash
alembic downgrade -1
```

## Undo all and redo all
```bash
alembic downgrade base
alembic upgrade head
```
