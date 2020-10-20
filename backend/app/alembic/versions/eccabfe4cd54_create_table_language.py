"""add table language

Revision ID: eccabfe4cd54
Revises: 03b1736791f4
Create Date: 2020-10-04 22:42:33.100116

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'eccabfe4cd54'
down_revision = '03b1736791f4'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "language",
        sa.Column(
            "id",
            sa.String(2),
            nullable=False,
            primary_key=True
        ),
        sa.Column(
            "label",
            sa.String(),
            nullable=True
        )
    )
    op.create_index(op.f("ix_language_id"), "language", ["id"], unique=True)


def downgrade():
    op.drop_index(
        index_name=op.f('ix_language_id'),
        table_name="language"
    )
    op.drop_table('language')
