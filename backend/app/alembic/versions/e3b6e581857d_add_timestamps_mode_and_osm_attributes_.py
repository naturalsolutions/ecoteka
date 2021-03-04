"""Add timestamps mode and osm attributes to organization

Revision ID: e3b6e581857d
Revises: e0a690db226b
Create Date: 2021-03-04 14:21:39.402106

"""
from typing import Tuple
from alembic import op
import sqlalchemy as sa
import geoalchemy2 as ga
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = 'e3b6e581857d'
down_revision = 'e0a690db226b'
branch_labels = None
depends_on = None

def create_updated_at_trigger() -> None:
    op.execute(
        """
        CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS
        $$
        BEGIN
            NEW.updated_at = now();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
        """
    )


def upgrade():
    create_updated_at_trigger()
    organization_mode = postgresql.ENUM("private", "open", "participatory", name='organizationmode')
    organization_mode.create(op.get_bind())
    op.add_column(
        "organization",
        sa.Column("boundary", ga.Geometry(geometry_type='MULTIPOLYGON', srid=4326), nullable=True),
    )
    op.add_column(
        "organization",
        sa.Column("coords", ga.Geometry(geometry_type='POINT', srid=4326), nullable=True),
    )
    op.add_column(
        "organization",
        sa.Column(
            "created_at",
            sa.TIMESTAMP(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
            index=False,
        ),
    )
    op.add_column(
        "organization",
         sa.Column(
            "updated_at",
            sa.TIMESTAMP(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
            index=False,
        ),
    )
    op.add_column(
        "organization",
         sa.Column(
            "mode",
            sa.Enum("private", "open", "participatory", name="organizationmode"),
            nullable=False,
            default="private",
            server_default="private",
        ),
    )
    op.add_column(
        "organization",
         sa.Column("osm_id", sa.Integer(), nullable=True),
    )
    op.add_column(
        "organization",
         sa.Column("osm_place_id", sa.Integer(), nullable=True),
    )
    op.add_column(
        "organization",
         sa.Column("osm_type", sa.String(), nullable=True),
    )
    op.add_column(
        "organization",
        sa.Column('boundary_bbox_coords',
           postgresql.ARRAY(sa.Float()), nullable=True),
    )
    op.execute(
        """
        CREATE TRIGGER update_organization_modtime
            BEFORE UPDATE
            ON organization
            FOR EACH ROW
        EXECUTE PROCEDURE update_updated_at_column();
        """
    )
    op.create_unique_constraint("uq_organization_slug", "organization", ["slug"])


def downgrade():
    op.drop_column("organization", "boundary")
    op.drop_column("organization", "coords")
    op.drop_column("organization", "created_at")
    op.drop_column("organization", "updated_at")
    op.drop_column("organization", "mode")
    op.drop_column("organization", "osm_id")
    op.drop_column("organization", "osm_place_id")
    op.drop_column("organization", "osm_type")
    op.drop_column("organization", "boundary_bbox_coords")
    op.execute("DROP TRIGGER IF EXISTS update_organization_modtime ON organization;")
    op.execute("DROP FUNCTION update_updated_at_column;")
    op.execute("ALTER TABLE IF EXISTS organization DROP CONSTRAINT IF EXISTS uq_organization_slug;")
    organization_mode = postgresql.ENUM("private", "open", "participatory", name='organizationmode')
    organization_mode.drop(op.get_bind())
    pass
