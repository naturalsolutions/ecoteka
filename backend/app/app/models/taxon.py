from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
    Text,
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Enum,
    func
)
from sqlalchemy.sql.operators import op
from sqlalchemy.dialects.postgresql import JSONB, ARRAY
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from app.schemas import TaxonomicRank


CONFIG = 'english'

def create_tsvector(*args):
    field, weight = args[0]
    exp = func.setweight(func.to_tsvector(CONFIG, field), weight)
    for field, weight in args[1:]:
        exp = op(exp, '||', func.setweight(func.to_tsvector(CONFIG, field), weight))
    return exp

class Taxon(Base):
    id = Column(Integer, primary_key=True, index=True)
    tree_id = Column(Integer, ForeignKey("tree.id"), index=True)
    parent_id = Column(Integer, ForeignKey('taxon.id'))
    scientific_name = Column(Text)
    canonical_name = Column(Text)
    rank = Column(
        Enum(HealthAssessmentOrgan, values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        default=TaxonomicRank.UNDEFINED.value,
    )
    family = Column(Text)
    genus = Column(Text)
    specific_epithet = Column(Text)
    common_name = Column(Text)
    vernacular_names = Column(JSONB, nullable=True)
    gbif_id = Column(Integer)
    gbif_link = Column(String)
    eol_id = Column(Integer)
    eol_link = Column(String)
    wikispecies_id = Column(String)
    wikispecies_link = Column(String)
    cover = Column(String)
    images = Column(ARRAY(String))
    traits = Column(JSONB, nullable=True)
    children = relationship("Taxon",
                backref=backref('parent', remote_side=[id])
            )
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    trees = relationship("Tree", back_populates="taxon")
    __ts_vector__ = create_tsvector(
        (scientific_name, 'A'),
        (common_name, 'B')
    )
    __table_args__ = (
        Index('taxon_ts_vector_idx', __ts_vector__, postgresql_using='gin'),
    )
    