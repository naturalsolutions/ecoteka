from decimal import Decimal
import pytest
from faker import Faker
from pydantic.error_wrappers import ValidationError
from app.tests.utils.test_db import TestingSessionLocal
from app.crud import crud_organization
from app.models.organization import Organization
from app.schemas.organization import (
    OrganizationMode,
    OrganizationCreate,
    OrganizationCreateRoot,
    OrganizationUpdate,
)


def test_get_by_id_or_slug(db: TestingSessionLocal, faker) -> None:
    organization_in = OrganizationCreate()
    organization = crud_organization.organization.create(
        db, obj_in=organization_in
    )

    result = crud_organization.organization.get_by_id_or_slug(
        db, id=organization.id
    )

    if result:
        assert result.id == organization.id

    result = crud_organization.organization.get_by_id_or_slug(
        db, id=organization.slug
    )

    if result:
        assert result.id == organization.id

    crud_organization.organization.remove(db, id=organization.id)


def test_get_open_features(db: TestingSessionLocal) -> None:
    organization_in = OrganizationCreate(
        mode=OrganizationMode.OPEN, featured=True
    )
    organization = crud_organization.organization.create(
        db, obj_in=organization_in
    )
    featured = crud_organization.organization.get_open_featured(db)

    assert [organization] == featured
    crud_organization.organization.remove(db, id=organization.id)


def test_get_by_name(db: TestingSessionLocal, faker: Faker) -> None:
    organization_in = OrganizationCreate(
        mode=OrganizationMode.OPEN, name=faker.name()
    )
    organization = crud_organization.organization.create(
        db, obj_in=organization_in
    )
    founded = crud_organization.organization.get_by_name(
        db, name=organization.name
    )
    if founded:
        assert founded.name == organization.name
    crud_organization.organization.remove(db, id=organization.id)


def test_get_by_slug(db: TestingSessionLocal, faker: Faker) -> None:
    organization_in = OrganizationCreate(
        mode=OrganizationMode.OPEN, name=faker.name()
    )
    organization = crud_organization.organization.create(
        db, obj_in=organization_in
    )
    founded = crud_organization.organization.get_by_slug(
        db, slug=organization.slug
    )
    if founded:
        assert founded.slug == organization.slug
    crud_organization.organization.remove(db, id=organization.id)


def test_get_by_path(db: TestingSessionLocal, faker: Faker) -> None:
    organization_in = OrganizationCreate(
        mode=OrganizationMode.OPEN, name=faker.name()
    )
    organization = crud_organization.organization.create(
        db, obj_in=organization_in
    )
    founded = crud_organization.organization.get_by_path(
        db, path=organization.path
    )
    if founded:
        assert founded.path == organization.path
    crud_organization.organization.remove(db, id=organization.id)


def test_get_root_nodes(db: TestingSessionLocal, faker: Faker) -> None:
    organization_in = OrganizationCreateRoot(
        owner_email=faker.email(), mode=OrganizationMode.PRIVATE
    )
    organization = crud_organization.organization.create_root(
        db, obj_in=organization_in
    )
    root_nodes = crud_organization.organization.get_root_nodes(db)

    for node in root_nodes:
        assert node.parent == None

    crud_organization.organization.remove(db, id=organization.id)


def test_get_teams(db: TestingSessionLocal, faker: Faker) -> None:
    organization_in = OrganizationCreateRoot(
        owner_email=faker.email(), mode=OrganizationMode.PRIVATE
    )
    organization_root = crud_organization.organization.create_root(
        db, obj_in=organization_in
    )
    team_a = crud_organization.organization.create(
        db,
        obj_in=OrganizationCreate(
            mode=OrganizationMode.PRIVATE,
            name=faker.name(),
            parent_id=organization_root.id,
        ),
    )
    team_b = crud_organization.organization.create(
        db,
        obj_in=OrganizationCreate(
            mode=OrganizationMode.PRIVATE,
            name=faker.name(),
            parent_id=organization_root.id,
        ),
    )
    teams = crud_organization.organization.get_teams(
        db, parent_id=organization_root.id
    )

    assert teams[1].id == team_a.id
    assert teams[0].id == team_b.id

    crud_organization.organization.remove(db, id=organization_root.id)
    crud_organization.organization.remove(db, id=team_a.id)
    crud_organization.organization.remove(db, id=team_b.id)


# def test_get_archived_teams(db: TestingSessionLocal, faker: Faker) -> None:
#     organization_in = OrganizationCreateRoot(
#         owner_email=faker.email(),
#         mode=OrganizationMode.PRIVATE
#     )
#     organization_root = crud_organization.organization.create_root(db, obj_in=organization_in)
#     team_a = crud_organization.organization.create(db, obj_in=OrganizationCreate(
#         mode=OrganizationMode.PRIVATE,
#         name=faker.name(),
#         parent_id=organization_root.id,
#         archived=True
#     ))
#     team_b = crud_organization.organization.create(db, obj_in=OrganizationCreate(
#         mode=OrganizationMode.PRIVATE,
#         name=faker.name(),
#         parent_id=organization_root.id,
#         archived=True
#     ))
#     teams = crud_organization.organization.get_archived_teams(db, parent_id=organization_root.id)

#     assert [team_a, team_b] == teams

#     crud_organization.organization.remove(db, id=organization_root.id)
#     crud_organization.organization.remove(db, id=team_a.id)
#     crud_organization.organization.remove(db, id=team_b.id)


def test_get_path(db: TestingSessionLocal, faker: Faker) -> None:
    organization_in = OrganizationCreate(
        mode=OrganizationMode.OPEN, name=faker.name()
    )
    organization = crud_organization.organization.create(
        db, obj_in=organization_in
    )
    team = crud_organization.organization.create(
        db,
        obj_in=OrganizationCreate(
            mode=OrganizationMode.PRIVATE,
            name=faker.name(),
            parent_id=organization.id,
            archived=True,
        ),
    )
    path = crud_organization.organization.get_path(db, id=team.id).all()
    assert [organization, team] == path
    crud_organization.organization.remove(db, id=organization.id)
    crud_organization.organization.remove(db, id=team.id)


# def test_create_organization(db: TestingSessionLocal) -> None:
#     organization_in = OrganizationCreate()
#     organization = crud_organization.organization.create(db, obj_in=organization_in)
#     assert organization_in.name == organization.name
#     crud_organization.organization.remove(db, id=organization.id)

# def test_create_organization_root(db: TestingSessionLocal, faker: Faker) -> None:
#     with pytest.raises(ValidationError):
#         OrganizationCreateRoot()

#     organization_in = OrganizationCreateRoot(
#         owner_email=faker.email(),
#         mode=OrganizationMode.PRIVATE
#     )
#     organization = crud_organization.organization.create_root(db, obj_in=organization_in)

#     assert organization_in.name == organization.name
#     assert organization_in.mode == organization.mode
#     crud_organization.organization.remove(db, id=organization.id)

# def test_update_organization(db: TestingSessionLocal, faker) -> None:
#     organization_in = OrganizationCreate()
#     organization = crud_organization.organization.create(db, obj_in=organization_in)
#     organization_update = OrganizationUpdate(
#         mode=organization.mode,
#         name=faker.name()
#     )
#     organization_updated = crud_organization.organization.update(db, db_obj=organization, obj_in=organization_update)
#     organization_updated = crud_organization.organization.update(db, db_obj=organization, obj_in=organization_update.dict())

#     assert organization_updated.name == organization_update.name

#     crud_organization.organization.remove(db, id=organization.id)
