"""Add column archived and archived_at to Organization model

Revision ID: 35d1666263c4
Revises: cfc56b69ef20
Create Date: 2020-12-01 11:27:33.549727

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy.sql import expression

# revision identifiers, used by Alembic.
revision = "35d1666263c4"
down_revision = "cfc56b69ef20"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "organization",
        sa.Column(
            "archived", sa.Boolean(), nullable=False, server_default=expression.false()
        ),
    )
    op.add_column(
        "organization", sa.Column("archived_at", sa.DateTime(), nullable=True)
    )


def downgrade():
    op.drop_column("organization", "archived")
    op.drop_column("organization", "archived_at")
