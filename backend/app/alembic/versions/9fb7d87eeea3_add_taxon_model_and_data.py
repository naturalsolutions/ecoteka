"""Add Taxon model and data

Revision ID: 9fb7d87eeea3
Revises: e3b6e581857d
Create Date: 2021-04-07 12:18:53.503063

"""
from alembic import op
import sqlalchemy as sa
import os
import gzip


# revision identifiers, used by Alembic.
revision = '9fb7d87eeea3'
down_revision = 'e3b6e581857d'
branch_labels = None
depends_on = None


tableTarget = "taxa"

def upgrade():
    op.create_table("taxa", 
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("canonical_name", sa.String(), nullable=True),
        sa.Column("author", sa.String(), nullable=True),
        sa.PrimaryKeyConstraint("id")
    )
    op.create_index(op.f("ix_taxa_id"), "taxa", ["id"], unique=True)
    connectionObj = op.get_bind()
    rawCursor = connectionObj.connection.cursor()
    filenameZip = os.path.join("/data", "global_tree_search_trees_1_5.csv.gz")

    with gzip.open(filenameZip, "rb") as csvFile:
        rawCursor.copy_expert(
            fr"COPY {tableTarget} (canonical_name, author) FROM STDIN DELIMITER ',' CSV;", csvFile
        )


def downgrade():
    op.drop_index(op.f("ix_taxa_id"), "taxa")
    op.drop_table("taxa")
