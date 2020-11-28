import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Dict, Optional
from pydantic import EmailStr

import emails
from emails.template import JinjaTemplate
from jose import jwt
from app.core import settings
import uuid


def send_email(
    email_to: str,
    subject_template: str = "",
    html_template: str = "",
    environment: Dict[str, Any] = {},
) -> None:
    assert settings.EMAILS_ENABLED, "no provided configuration for email variables"
    message = emails.Message(
        subject=JinjaTemplate(subject_template),
        html=JinjaTemplate(html_template),
        mail_from=(settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL),
    )
    smtp_options = {"host": settings.SMTP_HOST, "port": settings.SMTP_PORT}
    if settings.SMTP_TLS:
        smtp_options["tls"] = True
    if settings.SMTP_USER:
        smtp_options["user"] = settings.SMTP_USER
    if settings.SMTP_PASSWORD:
        smtp_options["password"] = settings.SMTP_PASSWORD
    logging.info((f"sending email to {email_to} with smtp config {smtp_options}"))
    response = message.send(to=email_to, render=environment, smtp=smtp_options)
    logging.info(f"send email result: {response}")


def send_test_email(email_to: str) -> None:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Test email"
    with open(Path(settings.EMAIL_TEMPLATES_DIR) / "test_email.html") as f:
        template_str = f.read()
    send_email(
        email_to=email_to,
        subject_template=subject,
        html_template=template_str,
        environment={"project_name": settings.PROJECT_NAME, "email": email_to},
    )


def send_reset_password_email(email_to: str, email: str, token: str) -> None:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Password recovery for user {email}"
    with open(Path(settings.EMAIL_TEMPLATES_DIR) / "reset_password.html") as f:
        template_str = f.read()
    external_path = settings.EXTERNAL_PATH
    link = f"{external_path}/reset-password?token={token}"
    send_email(
        email_to=email_to,
        subject_template=subject,
        html_template=template_str,
        environment={
            "project_name": settings.PROJECT_NAME,
            "username": email,
            "email": email_to,
            "valid_hours": settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS,
            "link": link,
        },
    )


def send_new_account_email(email_to: str, username: str, password: str) -> None:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - New account for user {username}"
    path = Path(settings.EMAIL_TEMPLATES_DIR) / "new_account.html"

    if path.is_file():
        f = open(path)
        template_str = f.read()
        link = settings.EXTERNAL_PATH
        send_email(
            email_to=email_to,
            subject_template=subject,
            html_template=template_str,
            environment={
                "project_name": settings.PROJECT_NAME,
                "username": username,
                "password": password,
                "email": email_to,
                "link": link,
            },
        )


def generate_password_reset_token(email: str) -> str:
    delta = timedelta(hours=settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS)
    now = datetime.utcnow()
    expires = now + delta
    exp = expires.timestamp()
    encoded_jwt = jwt.encode(
        {"exp": exp, "nbf": now, "sub": email}, settings.SECRET_KEY, algorithm="HS256"
    )
    return encoded_jwt


def verify_password_reset_token(token: str) -> Optional[str]:
    try:
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return decoded_token["email"]
    except jwt.JWTError:
        return None


def send_contact_request_confirmation(
    email_to: str, first_name: str, last_name: str
) -> None:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - contact request"
    pathToTemplate = Path(settings.EMAIL_TEMPLATES_DIR) / "contact_request.html"
    with open(pathToTemplate) as f:
        template_str = f.read()
    send_email(
        email_to=email_to,
        subject_template=subject,
        html_template=template_str,
        environment={
            "project_name": settings.PROJECT_NAME,
            "first_name": first_name,
            "last_name": last_name,
        },
    )


def send_new_contact_notification(
    email_to: str,
    contactId: int,
    first_name: str,
    last_name: str,
    email: EmailStr,
    phone_number: Optional[str],
    township: Optional[str],
    position: Optional[str],
    contact_request: str,
) -> None:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - New contact request"
    pathToTemplate = (
        Path(settings.EMAIL_TEMPLATES_DIR) / "new_contact_notification.html"
    )
    with open(pathToTemplate) as f:
        template_str = f.read()
    send_email(
        email_to=email_to,
        subject_template=subject,
        html_template=template_str,
        environment={
            "project_name": settings.PROJECT_NAME,
            "contactId": contactId,
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "phone_number": phone_number,
            "township": township,
            "position": position,
            "contact_request": contact_request,
        },
    )


def send_new_registration_email(email_to: str, full_name: str, password: str):
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Welcome {full_name}"
    pathToTemplate = Path(settings.EMAIL_TEMPLATES_DIR) / "new_registration_email.html"
    with open(pathToTemplate) as f:
        template_str = f.read()
    send_email(
        email_to=email_to,
        subject_template=subject,
        html_template=template_str,
        environment={
            "project_name": settings.PROJECT_NAME,
            "full_name": full_name,
            "email": email_to,
            "password": password,
        },
    )


def send_new_registration_link_email(email_to: str, full_name: str, link: str) -> None:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Welcome to ecoteka {full_name}"
    pathToTemplate = Path(settings.EMAIL_TEMPLATES_DIR) / "new_registration_link.html"

    full_link = settings.EXTERNAL_PATH.replace(
        "/api/v1", f"/registration-link?value={link}"
    )

    with open(pathToTemplate) as f:
        template_str = f.read()
    send_email(
        email_to=email_to,
        subject_template=subject,
        html_template=template_str,
        environment={
            "project_name": settings.PROJECT_NAME,
            "email": email_to,
            "link": full_link,
        },
    )


def generate_registration_link_value() -> str:
    return str(uuid.uuid4())
