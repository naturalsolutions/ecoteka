"""merge create osmname and add taxon model

Revision ID: 7cdd5dc1a281
Revises: 9fb7d87eeea3, 087aa7580c8e
Create Date: 2021-04-08 10:36:42.673464

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7cdd5dc1a281'
down_revision = ('9fb7d87eeea3', '087aa7580c8e')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
