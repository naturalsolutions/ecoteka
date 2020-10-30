"""add intervention date

Revision ID: cdf536f4cc53
Revises: 75ecf480f5d3
Create Date: 2020-10-30 16:11:55.680454

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cdf536f4cc53'
down_revision = '75ecf480f5d3'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        'intervention',
        sa.Column('date', sa.Date(), nullable=True)
    )


def downgrade():
    op.drop_column('intervention', 'date')
