import pytest

from app.tests.utils.test_db import TestingSessionLocal
from app.crud import crud_organization
from app.models.organization import Organization
from app.models.user import User
from app.schemas.organization import (
    OrganizationMode,
    OrganizationCreate,
    OrganizationCreateRoot,
    OrganizationUpdate,
)

@pytest.fixture(scope="function", autouse=True)
def remove_data(db):
    db.query(Organization).delete()
    db.query(User).delete()
    db.commit()

def test_get_by_id_or_slug(db: TestingSessionLocal, faker) -> None:
    organization_in = OrganizationCreate()
    organization = crud_organization.organization.create(
        db, obj_in=organization_in
    )

    result = crud_organization.organization.get_by_id_or_slug(
        db, id=organization.id
    )

    assert result.id == organization.id

    result = crud_organization.organization.get_by_id_or_slug(
        db, id=organization.slug
    )

    assert result.id == organization.id

    result = crud_organization.organization.get_by_id_or_slug(
        db, id="non"
    )

    assert result == None


def test_get_open_featured(db: TestingSessionLocal) -> None:
    organization_in = OrganizationCreate(
        mode=OrganizationMode.OPEN, 
        featured=True
    )
    organization = crud_organization.organization.create(
        db, 
        obj_in=organization_in
    )

    featured = crud_organization.organization.get_open_featured(db)

    assert [organization] == featured

def test_create(db: TestingSessionLocal) -> None:
    obj_in = OrganizationCreate(
        mode=OrganizationMode.PRIVATE,
        name="org"
    )

    organization = crud_organization.organization.create(
        db,
        obj_in=obj_in
    )

    assert organization.mode == obj_in.mode
    assert organization.name == obj_in.name
    assert organization.slug == Organization.initiate_unique_slug(
        name=obj_in.name, 
        id=organization.id, 
        path=organization.path
    )
    assert organization.total_trees == 0

def test_create_root(db: TestingSessionLocal) -> None:
    obj_in = OrganizationCreateRoot(
        mode=OrganizationMode.PRIVATE,
        name="org"
    )

    organization = crud_organization.organization.create_root(
        db=db,
        obj_in=obj_in
    )

    assert organization.mode == obj_in.mode
    assert organization.name == obj_in.name
    assert organization.slug == Organization.initiate_unique_slug(
        name=obj_in.name, 
        id=organization.id, 
        path=organization.path
    )
    assert organization.total_trees == 0

def test_update(db: TestingSessionLocal) -> None:
    obj_in = OrganizationCreateRoot(
        mode=OrganizationMode.PRIVATE,
        name="org"
    )

    organization = crud_organization.organization.create_root(
        db=db,
        obj_in=obj_in
    )

    obj_in = OrganizationUpdate(
        archived = False,
        featured = True,
        mode = OrganizationMode.OPEN,
        osm_id = 11,
        osm_place_id = 11,
        osm_type = 'city'
    )

    organization_updated = crud_organization.organization.update(
        db=db,
        db_obj=organization,
        obj_in=obj_in
    )

    assert organization.id == organization_updated.id
    assert organization_updated.archived == obj_in.archived
    assert organization_updated.featured == obj_in.featured
    assert organization_updated.mode == obj_in.mode
    assert organization_updated.osm_id == obj_in.osm_id
    assert organization_updated.osm_place_id == obj_in.osm_place_id
    assert organization_updated.osm_type == obj_in.osm_type

    organization_updated = crud_organization.organization.update(
        db=db,
        db_obj=organization,
        obj_in=obj_in.dict()
    )

    assert organization.id == organization_updated.id

def test_get_by_name(db):
    obj_in = OrganizationCreateRoot(
        mode=OrganizationMode.PRIVATE,
        name="org"
    )

    organization = crud_organization.organization.create_root(
        db=db,
        obj_in=obj_in
    )

    organization_filtered = crud_organization.organization.get_by_name(
        db=db,
        name="org"
    )

    assert organization.id == organization_filtered.id

def test_get_by_slug(db):
    obj_in = OrganizationCreateRoot(
        mode=OrganizationMode.PRIVATE,
        name="org"
    )

    organization = crud_organization.organization.create_root(
        db=db,
        obj_in=obj_in
    )

    organization_filtered = crud_organization.organization.get_by_slug(
        db=db,
        slug="org"
    )

    assert organization.id == organization_filtered.id

def test_get_by_path(db):
    obj_in = OrganizationCreateRoot(
        mode=OrganizationMode.PRIVATE,
        name="org"
    )

    organization = crud_organization.organization.create_root(
        db=db,
        obj_in=obj_in
    )

    organization_filtered = crud_organization.organization.get_by_path(
        db=db,
        path=str(organization.id)
    )

    assert organization.id == organization_filtered.id

def test_get_root_nodes(db):
    obj_in_root = OrganizationCreateRoot(
        mode=OrganizationMode.PRIVATE,
        name="org"
    )

    organization_root = crud_organization.organization.create_root(
        db=db,
        obj_in=obj_in_root
    )

    obj_in = OrganizationCreate(
        mode=OrganizationMode.PRIVATE,
        name="team",
        parent_id = organization_root.id
    )

    organization = crud_organization.organization.create(
        db=db,
        obj_in=obj_in
    )

    organization_filtered = crud_organization.organization.get_root_nodes(
        db=db
    )

    assert [organization_root] == organization_filtered

def test_get_get_teams(db):
    obj_in_root = OrganizationCreateRoot(
        mode=OrganizationMode.PRIVATE,
        name="org"
    )

    organization_root = crud_organization.organization.create_root(
        db=db,
        obj_in=obj_in_root
    )

    obj_in = OrganizationCreate(
        mode=OrganizationMode.PRIVATE,
        name="team",
        parent_id = organization_root.id
    )

    team = crud_organization.organization.create(
        db=db,
        obj_in=obj_in
    )

    organization_filtered = crud_organization.organization.get_teams(
        db=db,
        parent_id=organization_root.id
    )

    assert [team] == organization_filtered

    organization_filtered = crud_organization.organization.get_teams(
        db=db,
        parent_id=1200
    )

    assert [] == organization_filtered 

def test_get_archived_teams(db):
    obj_in_root = OrganizationCreateRoot(
        mode=OrganizationMode.PRIVATE,
        name="org"
    )

    organization_root = crud_organization.organization.create_root(
        db=db,
        obj_in=obj_in_root
    )

    obj_in = OrganizationCreate(
        mode=OrganizationMode.PRIVATE,
        name="team_a",
        parent_id = organization_root.id,
        archived = True
    )

    team_a = crud_organization.organization.create(
        db=db,
        obj_in=obj_in
    )

    obj_in = OrganizationCreate(
        mode=OrganizationMode.PRIVATE,
        name="team_b",
        parent_id = organization_root.id,
        archived = False
    )

    team_b = crud_organization.organization.create(
        db=db,
        obj_in=obj_in
    )

    organization_filtered = crud_organization.organization.get_archived_teams(
        db=db,
        parent_id=organization_root.id
    )

    assert [team_a] == organization_filtered

    organization_filtered = crud_organization.organization.get_archived_teams(
        db=db,
        parent_id=1200
    )

    assert [] == organization_filtered 

def test_get_path(db):
    obj_in_root = OrganizationCreateRoot(
        mode=OrganizationMode.PRIVATE,
        name="org"
    )

    organization_root = crud_organization.organization.create_root(
        db=db,
        obj_in=obj_in_root
    )

    obj_in = OrganizationCreate(
        mode=OrganizationMode.PRIVATE,
        name="team",
        parent_id = organization_root.id,
        archived = True
    )

    team = crud_organization.organization.create(
        db=db,
        obj_in=obj_in
    )

    organization_filtered = crud_organization.organization.get_path(
        db=db,
        id=team.id
    )

    ids_organization_filtered = [i.id for i in organization_filtered]

    assert sorted([organization_root.id, team.id]) == sorted(ids_organization_filtered) 

    organization_filtered = crud_organization.organization.get_path(
        db=db,
        id=1200
    )

    assert [] == organization_filtered 

def test_get_members(db, create_user, add_user_to_organization):
    obj_in_root = OrganizationCreateRoot(
        mode=OrganizationMode.PRIVATE,
        name="org"
    )

    organization_root = crud_organization.organization.create_root(
        db=db,
        obj_in=obj_in_root
    )

    members = [
        create_user(),
        create_user(),
    ]

    add_user_to_organization(
        user_id=members[0].id,
        organization_id=organization_root.id,
        role="owner"
    )

    add_user_to_organization(
        user_id=members[1].id,
        organization_id=organization_root.id,
        role="reader"
    )

    emails_members = [m.email for m in members]

    members_filtered = crud_organization.organization.get_members(
        db=db,
        id=organization_root.id
    )

    emails_members_filtered = [m["email"] for m in members_filtered]

    assert emails_members.sort() == emails_members_filtered.sort()

    members_filtered = crud_organization.organization.get_members(
        db=db,
        id=1200
    )

    assert [] == members_filtered 
