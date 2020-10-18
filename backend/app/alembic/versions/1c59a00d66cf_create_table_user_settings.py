"""create_table_user_settings

Revision ID: 1c59a00d66cf
Revises: eccabfe4cd54
Create Date: 2020-10-05 00:39:47.117721

"""
from alembic import op
import sqlalchemy as sa
import geoalchemy2 as ga


# revision identifiers, used by Alembic.
revision = '1c59a00d66cf'
down_revision = 'eccabfe4cd54'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "user_settings",
        sa.Column(
            "fk_user",
            sa.Integer(),
            sa.ForeignKey("user.id", ondelete="CASCADE"),
            primary_key=True
        ),
        sa.Column(
            "fk_language",
            sa.String(2),
            sa.ForeignKey("language.id")
        ),
        sa.Column(
            "center",
            ga.Geometry('POINT')
        )
    )
    op.create_index(
        op.f("ix_user_settings_fk_user"),
        "user_settings",
        ["fk_user"],
        unique=True
    )


def downgrade():

    op.drop_index(
        index_name=op.f('ix_user_settings_fk_user'),
        table_name='user_settings'
    )
    op.drop_table('user_settings')

    pass
