
from sqlalchemy.ext.declarative import declarative_base
from app.models import (User, Organization)
from sqlalchemy_oso.roles import resource_role_class

from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


## ROLE MODELS ##

OrganizationRoleMixin = resource_role_class(
    Base, User, Organization, ["owner", "manager", "contributor", "reader"]
)


class OrganizationRole(Base, OrganizationRoleMixin):
    def repr(self):
        return {"id": self.id, "name": str(self.name)}