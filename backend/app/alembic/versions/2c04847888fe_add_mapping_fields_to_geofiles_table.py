"""add mapping_fields to geofiles table

Revision ID: 2c04847888fe
Revises: 03b1736791f4
Create Date: 2020-10-29 11:52:14.324132

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2c04847888fe'
down_revision = '03b1736791f4'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        'geofile',
        sa.Column('mapping_fields',
                  sa.JSON(),
                  nullable=True)
    )
    pass


def downgrade():
    op.drop_column('geofile', 'mapping_fields')
    pass
