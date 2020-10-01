"""add error to GeoFileStatus

Revision ID: 4231989b78d5
Revises: ed182660c635
Create Date: 2020-09-18 11:17:54.345395

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '4231989b78d5'
down_revision = 'ed182660c635'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("COMMIT")
    op.execute("ALTER TYPE geofilestatus ADD VALUE 'error'")


def downgrade():
    op.execute("UPDATE geofile SET status='importing' WHERE status='error'")
    op.execute(
        "DELETE FROM pg_enum WHERE enumtypid='geofilestatus'::regtype AND enumlabel='error'")
