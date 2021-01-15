"""Added taxon table

Revision ID: 9bfab68222a8
Revises: f3924b140fc2
Create Date: 2021-01-13 16:05:07.491414

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy.sql import expression
from sqlalchemy_utils.types import TSVectorType

# revision identifiers, used by Alembic.
revision = '9bfab68222a8'
down_revision = 'f3924b140fc2'
branch_labels = None
depends_on = None


def upgrade():

    taxon_table = op.create_table(
        "taxon",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("scientific_name", sa.Text(), nullable= True),
        sa.Column("canonical_name", sa.Text(), nullable= True),
        sa.Column(
            "rank",
            sa.Enum("undefined", "family", "genus", "species", "subspecies", "variety", "forma", "cultivar", name="taxon_rank"),
            nullable=False,
            default="undefined",
            server_default="undefined",
        ),
        sa.Column("search_vector", TSVectorType('scientific_name', 'common_name')),
        sa.Column("family", sa.String(), nullable= True),
        sa.Column("genus", sa.String(), nullable= True),
        sa.Column("specific_epithet", sa.String(), nullable= True),
        sa.Column("common_name", sa.String(), nullable= True),
        sa.Column("vernacular_names", postgresql.ARRAY(sa.String()), nullable= True),
        sa.Column("gbif_id", sa.String(), nullable= True),
        sa.Column("gbif_link", sa.String(), nullable= True),
        sa.Column("eol_id", sa.String(), nullable= True),
        sa.Column("eol_link", sa.String(), nullable= True),
        sa.Column("wikispecies_id", sa.String(), nullable= True),
        sa.Column("wikispecies_link", sa.String(), nullable= True),
        sa.Column("cover", sa.Text(), nullable= True),
        sa.Column("images", postgresql.ARRAY(sa.Text()), nullable= True),
        sa.Column("traits", sa.String(), nullable= True),
        sa.Column("created_at", sa.DateTime(), nullable= True),
        sa.Column("updated_at", sa.DateTime(), nullable= True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.add_column(
        "tree",
        sa.Column(
            "taxon_id",
            sa.Integer(),
            sa.ForeignKey("taxon.id"),
            nullable=True,
        ),
    )
    op.create_index(op.f("tree_taxon_id_idx"), "tree", ["taxon_id"])
    op.create_index(op.f("ix_taxon_id"), "taxon", ["id"], unique=True)
    op.create_index('ix_taxon_fts', 'taxon',
            [sa.text("to_tsvector('english', scientific_name)")],
            postgresql_using='gin')

    



def downgrade():
    op.drop_column("tree", "taxon_id")
    op.drop_index(op.f("tree_taxon_id_idx"), "tree")
    op.drop_table("taxon")
    op.execute('DROP TYPE taxon_rank')
    op.drop_index(op.f("ix_taxon_id"), "taxon")
    op.drop_index(op.f("ix_taxon_fts"), "taxon")
