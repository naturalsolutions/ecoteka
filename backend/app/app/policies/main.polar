
allow(_: User, "get", _: User);

allow(user: User, "get", tree: Tree) if
    user.is_superuser and tree.organization.mode == "private";

allow(user: User, "get_one", organization: Organization) if
    user.is_superuser and organization.mode == "private";

allow(user, "get_one", organization: Organization) if
    user == nil  and organization.mode == "open";

# ROLE-PERMISSION RELATIONSHIPS
# Organization Permissions

### All organization roles let users read the organization
role_allow(_role: OrganizationRole, "get_one", _org: Organization);

### The member role can list repos in the org
role_allow(_role: OrganizationRole{name: "reader"}, "get_geojson", _org: Organization);



# ROLE-ROLE RELATIONSHIPS

## Role Hierarchies

### Specify organization role order (most senior on left)
organization_role_order(["owner", "manager", "contributor", "reader", "guest"]);

