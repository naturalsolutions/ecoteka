"""create health_assessment table

Revision ID: f3924b140fc2
Revises: 35d1666263c4
Create Date: 2021-01-06 23:02:01.900037

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f3924b140fc2'
down_revision = '35d1666263c4'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "healthassessment",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("tree_id", sa.Integer(), nullable=False),
        sa.Column("organization_id", sa.Integer(), nullable=False),
        sa.Column("date", sa.Date(), nullable=True),
        sa.Column(
            "organ",
            sa.Enum("undefined", "crown", "branches", "trunk", "trunkflare", "roots", name="healthassessment_organ"),
            nullable=False,
            default="undefined",
            server_default="undefined",
        ),
        sa.Column("score", sa.Integer(), nullable=False, default="1", server_default="1"),
        sa.Column("intervention_needed", sa.Boolean, nullable=True, default="0", server_default="0"),
        sa.Column("problem", sa.Text(), nullable=True),
        sa.Column("recommendation", sa.Text(), nullable=True),
        sa.Column("comment", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["tree_id"], ["tree.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(
            ["organization_id"], ["organization.id"], ondelete="CASCADE"
        ),
    )
    op.create_index(op.f("ix_healthassessment_id"), "healthassessment", ["id"], unique=True)
    op.create_index(op.f("ix_healthassessment_tree_id"), "healthassessment", ["tree_id"], unique=False)
    op.create_index(op.f("ix_healthassessment_organization_id"), "healthassessment", ["organization_id"], unique=False)

def downgrade():
    op.drop_index(op.f("ix_healthassessment_id"), table_name="healthassessment")
    op.drop_index(op.f("ix_healthassessment_tree_id"), table_name="healthassessment")
    op.drop_index(op.f("ix_healthassessment_organization_id"), table_name="healthassessment")
    op.drop_table("healthassessment")
    op.execute('DROP TYPE healthassessment_organ')
