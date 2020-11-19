"""drop user_organization_column

Revision ID: cfc56b69ef20
Revises: f8cb04c99a4f
Create Date: 2020-11-19 15:09:21.422581

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cfc56b69ef20'
down_revision = 'f8cb04c99a4f'
branch_labels = None
depends_on = None

def create_organization_column() -> sa.Column:
    return sa.Column(
        'organization_id',
        sa.Integer(),
        sa.ForeignKey('organization.id', ondelete="CASCADE"),
        nullable=False,
        server_default="1"
    )

def upgrade():
    op.drop_column("user", "organization_id")


def downgrade():
    op.add_column("user", create_organization_column())
