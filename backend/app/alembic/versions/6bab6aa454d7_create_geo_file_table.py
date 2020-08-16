"""create geo_file table

Revision ID: 6bab6aa454d7
Revises: 178242739b82
Create Date: 2020-08-12 11:15:32.317531

"""
import datetime
from alembic import op
import sqlalchemy as sa

from app.models.geo_file import GeoFileStatus


# revision identifiers, used by Alembic.
revision = '6bab6aa454d7'
down_revision = '178242739b82'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "geofile",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(42), nullable=False),
        sa.Column("original_name", sa.String(), nullable=False),
        sa.Column("extension", sa.String(7), nullable=False),
        sa.Column("checksum", sa.String(32), nullable=False),
        sa.Column("count", sa.Integer(), nullable=False),
        sa.Column("driver", sa.String(), nullable=True),
        sa.Column("crs", sa.String(), nullable=True),
        sa.Column("properties", sa.JSON(), nullable=True),
        sa.Column("status",
                  sa.Enum(GeoFileStatus,
                          values_callable=lambda obj: [e.value for e in obj]),
                  nullable=False,
                  default=GeoFileStatus.UPLOADED.value,
                  server_default=GeoFileStatus.UPLOADED.value),
        sa.Column("uploaded_date",
                  sa.DateTime,
                  nullable=False),
        sa.Column("imported_date", sa.DateTime, nullable=True),
        sa.Column("importing_start", sa.DateTime, nullable=True),
        sa.Column("public", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.UniqueConstraint("name"),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(op.f("ix_geofile_id"), "geofile", ["id"], unique=True)
    op.create_index(op.f("ix_geofile_name"), "geofile", ["name"], unique=True)
    op.create_index(op.f("ix_geofile_checksum"), "geofile", ["checksum"], unique=True)


def downgrade():
    op.drop_index(op.f("ix_geofile_id"), table_name="geofile")
    op.drop_index(op.f("ix_geofile_name"), table_name="geofile")
    op.drop_index(op.f("ix_geofile_checksum"), table_name="geofile")
    op.drop_table("geofile")
    op.execute('DROP TYPE geofilestatus')
