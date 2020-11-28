"""update tree schema

Revision ID: 03b1736791f4
Revises: a10696953c41
Create Date: 2020-10-14 14:06:40.392783

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "03b1736791f4"
down_revision = "a10696953c41"
branch_labels = None
depends_on = None


def upgrade():
    op.drop_index(op.f("ix_tree_scientific_name"), table_name="tree")
    op.drop_column("tree", "scientific_name")


def downgrade():
    op.add_column("tree", sa.Column("scientific_name", sa.String(), nullable=True))
    op.create_index(op.f("ix_tree_scientific_name"), "tree", ["scientific_name"])
