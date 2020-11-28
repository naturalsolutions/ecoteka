"""create taxref table

Revision ID: c9b68ad69472
Revises: 4231989b78d5
Create Date: 2020-09-22 23:58:44.324471

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "c9b68ad69472"
down_revision = "4231989b78d5"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "taxref",
        sa.Column("REGNE", sa.String(18), nullable=True),
        sa.Column("PHYLUM", sa.String(50), nullable=True),
        sa.Column("CLASSE", sa.String(50), nullable=True),
        sa.Column("ORDRE", sa.String(60), nullable=True),
        sa.Column("FAMILLE", sa.String(72), nullable=True),
        sa.Column("SOUS_FAMILLE", sa.String(50), nullable=True),
        sa.Column("TRIBU", sa.String(44), nullable=True),
        sa.Column("GROUP1_INPN", sa.String(34), nullable=True),
        sa.Column("GROUP2_INPN", sa.String(54), nullable=True),
        sa.Column("CD_NOM", sa.Integer(), nullable=False),
        sa.Column("CD_TAXSUP", sa.Integer(), nullable=True),
        sa.Column("CD_SUP", sa.Integer(), nullable=True),
        sa.Column("CD_REF", sa.Integer(), nullable=True),
        sa.Column("RANG", sa.String(8), nullable=True),
        sa.Column("LB_NOM", sa.String(174), nullable=False),
        sa.Column("LB_AUTEUR", sa.String(952), nullable=True),
        sa.Column("NOM_COMPLET", sa.String(980), nullable=True),
        sa.Column("NOM_COMPLET_HTML", sa.String(980), nullable=True),
        sa.Column("NOM_VALIDE", sa.String(980), nullable=True),
        sa.Column("NOM_VERN", sa.String(1248), nullable=True),
        sa.Column("NOM_VERN_ENG", sa.String(282), nullable=True),
        sa.Column("HABITAT", sa.SmallInteger(), nullable=True),
        sa.Column("FR", sa.String(2), nullable=True),
        sa.Column("GF", sa.String(2), nullable=True),
        sa.Column("MAR", sa.String(2), nullable=True),
        sa.Column("GUA", sa.String(2), nullable=True),
        sa.Column("SM", sa.String(2), nullable=True),
        sa.Column("SB", sa.String(2), nullable=True),
        sa.Column("SPM", sa.String(2), nullable=True),
        sa.Column("MAY", sa.String(2), nullable=True),
        sa.Column("EPA", sa.String(2), nullable=True),
        sa.Column("REU", sa.String(2), nullable=True),
        sa.Column("SA", sa.String(2), nullable=True),
        sa.Column("TA", sa.String(2), nullable=True),
        sa.Column("TAAF", sa.String(2), nullable=True),
        sa.Column("PF", sa.String(2), nullable=True),
        sa.Column("NC", sa.String(2), nullable=True),
        sa.Column("WF", sa.String(2), nullable=True),
        sa.Column("CLI", sa.String(2), nullable=True),
        sa.Column("URL", sa.String(82), nullable=True),
        sa.PrimaryKeyConstraint("CD_NOM"),
    )
    op.create_index(op.f("ix_taxref_CD_NOM"), "taxref", ["CD_NOM"], unique=True)
    op.create_index(op.f("ix_taxref_LB_NOM"), "taxref", ["LB_NOM"])
    op.create_index(op.f("ix_taxref_NOM_VERN"), "taxref", ["NOM_VERN"])


def downgrade():
    op.drop_index(op.f("ix_taxref_CD_NOM"), table_name="taxref")
    op.drop_index(op.f("ix_taxref_LB_NOM"), table_name="taxref")
    op.drop_index(op.f("ix_taxref_NOM_VERN"), table_name="taxref")
    op.drop_table("taxref")
