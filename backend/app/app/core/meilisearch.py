from sqlalchemy.orm import Session
import meilisearch

from app.core.config import settings

client = meilisearch.Client(settings.MEILI_API_URL, settings.MEILI_MASTER_KEY)


def init_taxa(db: Session) -> None:
    index = client.index('taxa')
    rows = db.execute("SELECT json_agg(t) FROM taxa as t")
    index.add_documents(rows.first()[0])


def init_indices(db: Session) -> None:
    init_taxa(db)