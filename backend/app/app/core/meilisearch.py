from sqlalchemy.orm import Session
import meilisearch

from app.core.config import settings

client = meilisearch.Client(
    settings.MEILI_API_URL,
    apiKey=settings.MEILI_MASTER_KEY,
    timeout=3600
    )


def init_taxa(db: Session) -> None:
    index = client.index('taxa')
    rows = db.execute("SELECT json_agg(t) FROM taxa as t")
    index.add_documents(rows.first()[0])

def init_osmname(db: Session) -> None:
    index = client.index('osmname')
    nbRows = db.execute("SELECT COUNT(*) FROM osmname").scalar()
    offset = 0
    limit = 100

    index.update_searchable_attributes([
        'name',
        'alternative_names',
        'country',
        'state'
    ])
    index.update_ranking_rules([
        'typo',
        'words',
        'proximity',
        'attribute',
        'wordsPosition',
        'exactness',
        'desc(importance)',
        'asc(place_rank)'
    ])

    while offset < nbRows:
        rows = db.execute(f'SELECT json_agg(o) FROM (select * from osmname limit {limit} offset {offset}) as o')
        res = rows.first()
        index.add_documents(res[0])
        offset += limit

def init_indices(db: Session) -> None:
    init_taxa(db)
    init_osmname(db)