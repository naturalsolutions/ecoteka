"""create scientific name column

Revision ID: ed182660c635
Revises: 1f6cb7b78029
Create Date: 2020-09-17 10:33:21.100029

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ed182660c635'
down_revision = '1f6cb7b78029'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        'tree',
        sa.Column('scientific_name', sa.String(), nullable=True)
    )
    op.add_column(
        'tree',
        sa.Column('taxref_id', sa.Integer(), nullable=True)
    )
    op.create_index(op.f("ix_tree_scientific_name"), "tree", ["scientific_name"])
    op.create_index(op.f("ix_tree_taxref_id"), "tree", ["taxref_id"])


def downgrade():
    op.drop_index(op.f("ix_tree_taxref_id"), table_name="tree")
    op.drop_index(op.f("ix_tree_scientific_name"), table_name="tree")
    op.drop_column('tree', 'scientific_name')
    op.drop_column('tree', 'taxref_id')
