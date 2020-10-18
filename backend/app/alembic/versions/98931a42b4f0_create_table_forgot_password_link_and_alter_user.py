"""create table forgot password link

Revision ID: 98931a42b4f0
Revises: 1c59a00d66cf
Create Date: 2020-10-06 14:23:08.556906

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '98931a42b4f0'
down_revision = '1c59a00d66cf'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "forgot_password_link",
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
        index_name=op.f('ix_forgot_password_link_value'),
        table_name="forgot_password_link",
        columns=["value"],
        unique=True
    )


def downgrade():
    op.drop_index(
        index_name=op.f('ix_forgot_password_link_value'),
        table_name="forgot_password_link"
    )
    op.drop_table('forgot_password_link')
