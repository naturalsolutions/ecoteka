from casbin import enforcer
import slug
from sqlalchemy.orm import Session
from sqlalchemy.sql import insert
from sqlalchemy import (
    func,
    case,
    desc
)
from app.core.config import settings
from app.core.security import set_policies
from app.schemas import UserCreate, OrganizationCreate, OrganizationMode
from app.crud import user, organization
from app.db import base  # noqa: F401
from app.models import OSMName, Organization

# make sure all SQL Alchemy models
# are imported (app.db.base) before initializing DB
# otherwise, SQL Alchemy might fail to initialize relationships properly
# for more details:
#  https://github.com/tiangolo/full-stack-fastapi-postgresql/issues/28


def init_db(db: Session, enforcer) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next line
    # Base.metadata.create_all(bind=engine)

    # insert_organizations(db=db)

    organization_in_db = organization.get_by_name(db, name=settings.ORGANIZATION)

    if not organization_in_db:
        organization_in = OrganizationCreate(
            name=settings.ORGANIZATION, slug=slug.slug(settings.ORGANIZATION), mode="private"
        )
        organization_in_db = organization.create(db, obj_in=organization_in)


    user_in_db = user.get_by_email(db, email=settings.FIRST_SUPERUSER)

    if not user_in_db:
        user_in = UserCreate(
            full_name=settings.FIRST_SUPERUSER_FULLNAME,
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
        )

        user_in_db = user.create(db, obj_in=user_in)  # noqa: F841
        user_in_db.is_superuser = True
        user_in_db.is_verified = True
        db.add(user_in_db)
        db.commit()
        db.refresh(user_in_db)


    for policies in settings.policies.values():
        set_policies(policies, enforcer)

    if len(enforcer.get_roles_for_user_in_domain("1", "1")) == 0:
        enforcer.add_role_for_user_in_domain("1", "admin", "1")


def insert_organizations(db:Session):
    '''
        This method will insert all osm objects into organization
        if the osm_id is not yet inserted
    '''
    # sub-request for select osm_id,name,name_normalized,importance
    # name_normalized is for removing trailling space and replace white-space by dash
    query_normalized_name = db.query(
        OSMName.osm_id.label('osm_id'),
        OSMName.name.label('name'),
        func.replace(func.trim(OSMName.name, ' '), ' ', '-').label("name_normalized"),
        OSMName.importance.label('importance')
    )
    query_normalized_name = query_normalized_name.subquery('normalized_name')

    # sub-request for select osm_id, name, name_normalized, row_number
    # row_number will be used for generate the slug in the next request
    # the row number is partition_by name_normalized
    # and order by "importance" DESC
    # src: https://osmnames.readthedocs.io/en/latest/introduction.html
    # "importance" :Importance of the feature, ranging [0.0-1.0], 1.0 being the most important.
    query_unique_slug = db.query(
        query_normalized_name.c.osm_id.label('osm_id'),
        query_normalized_name.c.name.label('name'),
        query_normalized_name.c.name_normalized.label('name_normalized'),
        func.row_number().over(
            partition_by=query_normalized_name.c.name_normalized,
            order_by=desc(query_normalized_name.c.importance)
        ).label("row_number")
    )
    query_unique_slug = query_unique_slug.subquery('unique_slug')

    # request for filtering what we insert
    where_query = db.query(Organization.osm_id.label('osm_id'))
    # final request for build the slug
    # example
    # we could have many name_normalized
    # name     | name_normalized | osm_id | row_number
    # new york | new-york        | 1254   | 1
    # new-york | new-york        | 215486 | 2
    # will generate
    # name     | osm_id | slug
    # new york | 1254   | new-york
    # new-york | 215486 | new-york-215486
    query = db.query(
        query_unique_slug.c.name.label('name'),
        query_unique_slug.c.osm_id.label('osm_id'),
        case(
            [(query_unique_slug.c.row_number == 1, query_unique_slug.c.name_normalized)],
            else_=func.concat(
                query_unique_slug.c.name_normalized,
                '-',
                query_unique_slug.c.osm_id
            )
        ).label('slug')
    )
    query = query.filter(
        query_unique_slug.c.osm_id.notin_(where_query)
    )

    insert_query = insert(Organization)
    insert_query = insert_query.from_select(
        (
            Organization.name,
            Organization.osm_id,
            Organization.slug
        ),
        query
    )

    try:
        db.execute(insert_query)
        db.commit()
        db.close()
    finally:
        pass
