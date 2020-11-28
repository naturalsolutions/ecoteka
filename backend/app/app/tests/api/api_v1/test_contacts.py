from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.tests.utils.utils import random_email, random_lower_string
from app.crud import contact


def test_contact_request(client: TestClient, db: Session):
    email = random_email()
    first_name = random_lower_string()
    last_name = random_lower_string()
    township = random_lower_string()
    contact_request = random_lower_string()

    data = dict(
        email=email,
        first_name=first_name,
        last_name=last_name,
        township=township,
        contact_request=contact_request,
    )

    r = client.post("/contacts/", json=data)
    response = r.json()

    print("contact_request_test", r)
    assert r.status_code == 200

    c = contact.get(db, response["id"])
    fields = ("email", "first_name", "last_name", "township", "contact_request")

    for field in fields:
        assert c.__getattribute__(field) == response[field]
