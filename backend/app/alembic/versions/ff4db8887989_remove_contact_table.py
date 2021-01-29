"""remove contact table

Revision ID: ff4db8887989
Revises: f3924b140fc2
Create Date: 2021-01-29 12:51:24.720849

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ff4db8887989'
down_revision = 'f3924b140fc2'
branch_labels = None
depends_on = None


def upgrade():
    op.drop_index(op.f("ix_contact_id"), table_name="contact")
    op.drop_index(op.f("ix_contact_email"), table_name="contact")
    op.drop_table("contact")


def downgrade():
    op.create_table(
        "contact",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("first_name", sa.String(), nullable=False),
        sa.Column("last_name", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=True),
        sa.Column("phone_number", sa.String(), nullable=True),
        sa.Column("township", sa.String(), nullable=False),
        sa.Column("position", sa.String(), nullable=True),
        sa.Column("contact_request", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(op.f("ix_contact_id"), "contact", ["id"], unique=True)
    op.create_index(op.f("ix_contact_email"), "contact", ["email"])