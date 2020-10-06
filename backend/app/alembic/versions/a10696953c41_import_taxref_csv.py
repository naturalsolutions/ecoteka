"""import taxref csv

Revision ID: a10696953c41
Revises: c9b68ad69472
Create Date: 2020-09-30 21:30:57.374710

"""
from alembic import op
import sqlalchemy as sa
import os
import gzip


# revision identifiers, used by Alembic.
revision = 'a10696953c41'
down_revision = 'c9b68ad69472'
branch_labels = None
depends_on = None

tableTarget = 'taxref'


def upgrade():
    connectionObj = op.get_bind()
    rawCursor = connectionObj.connection.cursor()
    filenameZip = os.path.join('/data', 'TAXREFv13.txt.gz')

    with gzip.open(filenameZip, 'rb') as csvFile:
        rawCursor.copy_expert(fr"COPY {tableTarget} FROM STDIN DELIMITER E'\t' CSV HEADER;", csvFile)


def downgrade():
    op.execute(f"TRUNCATE TABLE {tableTarget};", execution_options=None)
