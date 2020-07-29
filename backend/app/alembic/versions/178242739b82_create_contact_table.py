"""create contact table

Revision ID: 178242739b82
Revises: d4867f3a4c0a
Create Date: 2020-07-28 11:44:28.918866

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '178242739b82'
down_revision = 'd4867f3a4c0a'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "contact",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("first_name", sa.String(), nullable=False),
        sa.Column("last_name", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=True),
        sa.Column("phone_number",sa.String(), nullable=True),
        sa.Column("township", sa.String(), nullable=False),
        sa.Column("position", sa.String(), nullable=True),
        sa.Column("contact_request", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(op.f("ix_contact_id"), "contact", ["id"], unique=True)
    op.create_index(op.f("ix_contact_email"), "contact", ["email"])


def downgrade():
    op.drop_index(op.f("ix_contact_id"), table_name="contact")
    op.drop_index(op.f("ix_contact_email"), table_name="contact")
    op.drop_table("contact")
