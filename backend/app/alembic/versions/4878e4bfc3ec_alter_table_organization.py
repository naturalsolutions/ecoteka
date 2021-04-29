"""alter_table_organization

Revision ID: 4878e4bfc3ec
Revises: 7cdd5dc1a281
Create Date: 2021-04-28 12:28:17.664740

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4878e4bfc3ec'
down_revision = '7cdd5dc1a281'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('organization','slug', nullable=True)
    op.alter_column('organization','path', nullable=True)


def downgrade():
    # migrate datas
    # if we downgrade we need first to set value in slug et path for all rows in db
    # then slug and path could be required
    op.execute("UPDATE organization SET slug = '' WHERE slug IS NULL")
    op.execute("UPDATE organization SET path = '' WHERE path IS NULL")
    op.alter_column('organization','slug', nullable=False)
    op.alter_column('organization','path', nullable=False)
