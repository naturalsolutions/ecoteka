FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

RUN pip install --no-cache-dir fastapi==0.61.0 pyjwt SQLAlchemy geoalchemy2 alembic \
  passlib[bcrypt] pydantic[email] emails tenacity psycopg2 python-jose \
  python-multipart pytest pytest-cov jinja2 geopandas

RUN apt update && apt install -y npm


COPY ./app /app