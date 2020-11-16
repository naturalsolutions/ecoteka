"""update organization model to ltree

Revision ID: f8cb04c99a4f
Revises: 011e8614a185
Create Date: 2020-11-16 14:53:34.680480

"""
from alembic import op
import sqlalchemy as sa
import geoalchemy2 as ga


# revision identifiers, used by Alembic.
revision = 'f8cb04c99a4f'
down_revision = '011e8614a185'
branch_labels = None
depends_on = None

from sqlalchemy_utils import LtreeType


def upgrade():
    op.execute('CREATE EXTENSION ltree')
    op.add_column(
        'organization',
        sa.Column('working_area', ga.Geometry('MULTIPOLYGON'), nullable=True),
    )
    op.add_column(
        'organization',
        sa.Column('path', LtreeType()),
    )
    op.add_column(
        'organization',
        sa.Column("config", sa.dialects.postgresql.JSONB(), nullable=True),
    )

    op.create_index(op.f("ix_organization_path"), "organization", ["path"], unique=True)



def downgrade():
    op.drop_index(op.f("ix_organization_path"), table_name="organization")
    op.drop_column('organization', 'working_area')
    op.drop_column('organization', 'path')
    op.drop_column('organization', 'config')

    op.execute('DROP EXTENSION ltree')
