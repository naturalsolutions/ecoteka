from app.core.config import  settings
from celery import Celery

celery_app = Celery("worker", backend='redis://redis', broker=settings.CELERY_BROKER_URL)

celery_app.conf.task_routes = {
    "app.worker.*": "main-queue"
}