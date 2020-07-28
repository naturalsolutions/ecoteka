FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

RUN pip install --no-cache-dir fastapi==0.60.1 pyjwt SQLAlchemy alembic \
  passlib[bcrypt] pydantic[email] emails tenacity psycopg2 python-jose \
  python-multipart
COPY ./app /app