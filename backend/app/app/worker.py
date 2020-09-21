from app.core.celery_app import celery_app
from app.core.config import settings
from app.tasks.import_geofile import import_geofile
from app.tasks.create_mbtiles import create_mbtiles
from fastapi import Depends
from app.api import deps
from app import crud
import logging
from app.utils import send_new_registration_email
from app.utils import send_new_registration_link_email
from app.utils import send_new_contact_notification
from app.utils import send_contact_request_confirmation

@celery_app.task(acks_late=True)
def test_celery(word: str) -> str:
    return f"test task return {word}"

@celery_app.task
def import_geofile_task (geofilename:str):
    with deps.dbcontext() as db:
        geofile = crud.geo_file.get_by_name(db, name=geofilename)

        import_geofile(db, geofile)
        return 'import completed'

@celery_app.task
def create_mbtiles_task (organization_id: int):
    with deps.dbcontext() as db:
        print(f'creating tiles for organization {organization_id}')
        organization = crud.organization.get(db, organization_id)

        create_mbtiles(db, organization)
        return f'organization {organization_id} tiles generated'

@celery_app.task
def send_new_registration_email_task(email_to:str, full_name:str, password:str):
    send_new_registration_email(email_to, full_name, password)
    return 'ok'

@celery_app.task
def send_new_registration_link_email_task(email_to:str, full_name: str, link:str):
    send_new_registration_link_email(email_to, full_name, link)
    return 'ok'

@celery_app.task
def generate_and_insert_registration_link_task(user_id: int):
    with deps.dbcontext() as db:
        crud.registration_link.generate_and_insert(db, user_id)
        return 'ok'

@celery_app.task
def send_new_contact_notification_task(contact_id):
    with deps.dbcontext() as db:
        contact_in_db = crud.contact.get(db, contact_id)
        send_new_contact_notification(
            email_to=settings.SUPERUSERS_CONTACT_LIST,
            contactId=contact_in_db.id,
            first_name=contact_in_db.first_name,
            last_name=contact_in_db.last_name,
            email=contact_in_db.email,
            phone_number=contact_in_db.phone_number,
            township=contact_in_db.township,
            position=contact_in_db.position,
            contact_request=contact_in_db.contact_request,
        )
        return 'contact notification sent'

@celery_app.task
def send_contact_request_confirmation_task(contact_id: int):
    with deps.dbcontext() as db:
        contact_in_db = crud.contact.get(db, contact_id)
        send_contact_request_confirmation(
            contact_in_db.email,
            contact_in_db.first_name,
            contact_in_db.last_name
        )

    return 'contact request confirmation task completed'


