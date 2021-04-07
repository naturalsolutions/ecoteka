"""Add OrganizationRole

Revision ID: 0b6889fae04d
Revises: e3b6e581857d
Create Date: 2021-04-06 21:55:01.159255

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0b6889fae04d'
down_revision = 'e3b6e581857d'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "organization_roles",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(50), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("organization_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["user.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["organization_id"], ["organization.id"], ondelete="CASCADE"),
    )
    sa.PrimaryKeyConstraint("id"),
    op.create_index(op.f("ix_organization_roles_id"), "organization_roles", ["id"], unique=True)
    op.create_index(op.f("ix_organization_roles_user_id"), "organization_roles", ["user_id"], unique=False)
    op.create_index(op.f("ix_organization_roles_organization_id"), "organization_roles", ["organization_id"], unique=False)

def downgrade():
    op.drop_index(op.f("ix_organization_roles_id"), table_name="organization_roles")
    op.drop_index(op.f("ix_organization_roles_user_id"), table_name="organization_roles")
    op.drop_index(op.f("ix_organization_roles_organization_id"), table_name="organization_roles")
    op.drop_table("organization_roles")
