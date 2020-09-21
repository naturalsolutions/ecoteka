from app.core.config import  settings
from celery import Celery

celery_app = Celery("worker", broker=settings.CELERY_BROKER_URL)

celery_app.conf.task_routes = {"app.worker.test_celery": "main-queue"}