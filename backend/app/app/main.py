from fastapi import FastAPI
from pydantic import BaseSettings

class Settings(BaseSettings):
    root_path: str = "/api/v1"

settings = Settings()
app = FastAPI(root_path=settings.root_path, openapi_prefix=settings.root_path)

@app.get("/aaa")
def read_root():
    return {"Hello": "monde"}