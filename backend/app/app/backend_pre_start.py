import logging
import os

from tenacity import after_log, before_log, retry, stop_after_attempt, wait_fixed

from app.db.session import SessionLocal
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

max_tries = 60 * 5  # 5 minutes
wait_seconds = 1


def create_uploaded_files_folder(path):
    try:
        os.makedirs(path)
    except OSError:
        logger.error(f"Creation of the directory {path} failed")
    else:
        logger.info(f'Successfully created the directory {path}')


@retry(
    stop=stop_after_attempt(max_tries),
    wait=wait_fixed(wait_seconds),
    before=before_log(logger, logging.INFO),
    after=after_log(logger, logging.WARN),
)
def init() -> None:
    try:
        db = SessionLocal()
        # Try to create session to check if DB is awake
        db.execute("SELECT 1")

        if not os.path.isdir(settings.UPLOADED_FILES_FOLDER):
            create_uploaded_files_folder(settings.UPLOADED_FILES_FOLDER)

    except Exception as e:
        logger.error(e)
        raise e


def main() -> None:
    logger.info("Initializing service")
    init()
    logger.info("Service finished initializing")


if __name__ == "__main__":
    main()
