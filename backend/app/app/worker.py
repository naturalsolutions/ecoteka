from app.core.celery_app import celery_app
from app.tasks.import_geofile import import_geofile
from app.api import deps
from app import crud
from app.utils import send_new_registration_email
from app.utils import send_new_registration_link_email
from app.utils import send_new_invitation_email


@celery_app.task
def import_geofile_task(geofilename: str):
    with deps.dbcontext() as db:
        geofile = crud.geo_file.get_by_name(db, name=geofilename)

        if geofile is None:
            return

        import_geofile(db, geofile)
        return "import completed"


@celery_app.task
def send_new_registration_email_task(email_to: str, full_name: str, password: str):
    send_new_registration_email(email_to, full_name, password)
    return "ok"


@celery_app.task
def send_new_registration_link_email_task(email_to: str, full_name: str, link: str):
    send_new_registration_link_email(email_to, full_name, link)
    return "ok"

@celery_app.task
def send_new_invitation_email_task(email_to: str, full_name: str, organization: str, role: str):
    send_new_invitation_email(email_to, full_name, organization, role)
    return "ok"


@celery_app.task
def generate_and_insert_registration_link_task(user_id: int):
    with deps.dbcontext() as db:
        crud.registration_link.generate_and_insert(db, user_id)
        return "ok"

