from app.core import settings
from app.utils import (
    send_email,
    send_new_account_email,
    send_reset_password_email, 
    send_new_registration_email,
    send_new_registration_link_email,
    send_new_invitation_email,
    generate_password_reset_token,
    verify_password_reset_token
)

def test_generate_password_reset_token(faker):
    email = faker.email()
    token = generate_password_reset_token(email)
    assert email == verify_password_reset_token(token=token)

def test_send_email(faker):
    settings.SMTP_TLS = True
    response = send_email(faker.email(), subject_template=faker.sentence(), html_template=faker.sentence(), environment={})
    
    assert response.status_code == 250
    
def test_send_new_account_email(faker):
    response = send_new_account_email(faker.email(), faker.user_name(), faker.password())
    assert response.status_code == 250

def test_send_new_registration_email(faker):
    response = send_new_registration_email(faker.email(), faker.name(), faker.password())
    assert response.status_code == 250

def test_send_reset_password_email(faker):
    email = faker.email()
    token = generate_password_reset_token(email)
    response = send_reset_password_email(email, faker.user_name(), token)
    assert response.status_code == 250

def test_send_new_registration_link_email(faker):
    response = send_new_registration_link_email(faker.email(), faker.name(), faker.uri())
    assert response.status_code == 250

def test_send_new_invitation_email(faker):
    response = send_new_invitation_email(faker.email(), faker.name(), faker.company(), "role")
    assert response.status_code == 250