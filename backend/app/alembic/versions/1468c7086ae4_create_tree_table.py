"""create tree table

Revision ID: 1468c7086ae4
Revises: 6bab6aa454d7
Create Date: 2020-08-13 20:44:17.135196

"""
from alembic import op
import sqlalchemy as sa
import geoalchemy2 as ga


# revision identifiers, used by Alembic.
revision = '1468c7086ae4'
down_revision = '6bab6aa454d7'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "tree",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("geofile_id", sa.Integer(), nullable=True),
        sa.Column("geom", ga.Geometry('POINT')),
        sa.ForeignKeyConstraint(['geofile_id'], ['geofile.id']),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_tree_id"), "tree", ["id"], unique=True)


def downgrade():
    op.drop_index(op.f("ix_tree_id"), table_name="tree")
    op.drop_table("tree")
