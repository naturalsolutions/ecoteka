"""create table osmname

Revision ID: 087aa7580c8e
Revises: e3b6e581857d
Create Date: 2021-04-07 16:32:39.605307

"""
from alembic import op
import sqlalchemy as sa
import os
import gzip

# revision identifiers, used by Alembic.
revision = '087aa7580c8e'
down_revision = 'e3b6e581857d'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "osmname",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(114), nullable=True),
        sa.Column("alternative_names", sa.String(3335), nullable=True),
        sa.Column("osm_type", sa.String(8), nullable=False),
        sa.Column("osm_id", sa.BigInteger(), nullable=False),
        sa.Column("class", sa.String(8), nullable=False),
        sa.Column("type", sa.String(71), nullable=False),
        sa.Column("lon", sa.Numeric(9,6), nullable=True),
        sa.Column("lat", sa.Numeric(8,6), nullable=True),
        sa.Column("place_rank", sa.Integer(), nullable=False),
        sa.Column("importance", sa.Numeric(7,6), nullable=False),
        sa.Column("street", sa.String(62), nullable=True),
        sa.Column("city", sa.String(114), nullable=True),
        sa.Column("county", sa.String(91), nullable=True),
        sa.Column("state", sa.String(86), nullable=True),
        sa.Column("country", sa.String(40), nullable=True),
        sa.Column("country_code", sa.String(2), nullable=True),
        sa.Column("display_name", sa.String(244), nullable=False),
        sa.Column("west", sa.Numeric(9,6), nullable=False),
        sa.Column("south", sa.Numeric(8,6), nullable=False),
        sa.Column("east", sa.Numeric(9,6), nullable=False),
        sa.Column("north", sa.Numeric(8,6), nullable=False),
        sa.Column("wikidata", sa.String(10), nullable=True),
        sa.Column("wikipedia", sa.String(90), nullable=True),
        sa.Column("housenumbers", sa.Boolean(), nullable=True),
        sa.PrimaryKeyConstraint("id")
    )
    op.create_index(op.f("ix_osmname_name"), "osmname", ["name"])
    op.create_index(op.f("ix_osmname_osm_type_usm_id_uq"), "osmname", ["osm_type","osm_id"], unique=True)

def downgrade():
    op.drop_index(op.f("ix_osmname_osm_type_usm_id_uq"), table_name="osmname")
    op.drop_index(op.f("ix_osmname_name"), table_name="osmname")
    op.drop_table("osmname")
