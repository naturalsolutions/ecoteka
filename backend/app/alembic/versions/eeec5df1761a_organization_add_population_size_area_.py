"""Organization Add population size area and featured cols

Revision ID: eeec5df1761a
Revises: 4878e4bfc3ec
Create Date: 2021-06-04 22:17:53.929586

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'eeec5df1761a'
down_revision = '4878e4bfc3ec'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "organization",
         sa.Column("population_size", sa.Integer(), nullable=True),
    )
    op.add_column(
        "organization",
         sa.Column("area_sq_km", sa.Float(), nullable=True),
    )
    op.add_column(
        "organization",
         sa.Column("featured", sa.Boolean(), nullable=True, server_default='f', default=False),
    )


def downgrade():
    op.drop_column("organization", "population_size")
    op.drop_column("organization", "area_sq_km")
    op.drop_column("organization", "featured")
