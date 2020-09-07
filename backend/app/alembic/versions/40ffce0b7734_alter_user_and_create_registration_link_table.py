"""alter user

Revision ID: 40ffce0b7734
Revises: 178242739b82
Create Date: 2020-08-03 05:23:27.860879

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '40ffce0b7734'
down_revision = '1468c7086ae4'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "registration_link",
        sa.Column(
            "fk_user",
            sa.Integer(),
            sa.ForeignKey("user.id", ondelete="CASCADE"),
            primary_key=True),
        sa.Column("value", sa.String(), nullable=True),
        sa.Column(
            "creation_date",
            sa.DateTime(),
            nullable=False
        )
    )
    op.create_index(
        index_name=op.f('ix_registration_link'),
        table_name="registration_link",
        columns=["value"],
        unique=True
    )

    op.drop_column('user', 'is_active')
    op.add_column(
        'user',
        sa.Column(
            'status',
            sa.String(),
            nullable=False,
            server_default='Pending'
        )
    )
    op.add_column(
        'user',
        sa.Column(
            'is_verified',
            sa.Boolean(),
            nullable=False,
            default=False,
            server_default='0'
        )
    )


def downgrade():
    op.drop_index(
        index_name=op.f('ix_registration_link'),
        table_name="registration_link"
    )
    op.drop_table('registration_link')
    op.add_column(
        'user',
        sa.Column(
            "is_active",
            sa.Boolean(),
            nullable=True
        )
    )
    op.drop_column('user', 'status')
    op.drop_column('user', 'is_verified')
