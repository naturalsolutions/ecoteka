"""organization

Revision ID: 1f6cb7b78029
Revises: 40ffce0b7734
Create Date: 2020-09-15 22:04:51.697638

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "1f6cb7b78029"
down_revision = "40ffce0b7734"
branch_labels = None
depends_on = None


def create_organization_column() -> sa.Column:
    return sa.Column(
        "organization_id",
        sa.Integer(),
        sa.ForeignKey("organization.id", ondelete="CASCADE"),
        nullable=False,
        server_default="1",
    )


def upgrade():
    organization_table = op.create_table(
        "organization",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("slug", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(op.f("ix_organization_id"), "organization", ["id"], unique=True)
    op.create_index(op.f("ix_organization_name"), "organization", ["name"])
    op.create_index(op.f("ix_organization_slug"), "organization", ["slug"])

    organization_data = {"name": "Ecoteka", "slug": "ecoteka"}

    op.bulk_insert(organization_table, [organization_data])

    op.add_column("user", create_organization_column())
    op.add_column("geofile", create_organization_column())
    op.add_column("tree", create_organization_column())

    op.add_column(
        "tree",
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("user.id", ondelete="CASCADE"),
            nullable=False,
            server_default="1",
        ),
    )


def downgrade():
    op.drop_column("user", "organization_id")
    op.drop_column("geofile", "organization_id")
    op.drop_column("tree", "organization_id")

    op.drop_column("tree", "user_id")

    op.drop_index(op.f("ix_organization_id"), table_name="organization")
    op.drop_index(op.f("ix_organization_name"), table_name="organization")
    op.drop_table("organization")
