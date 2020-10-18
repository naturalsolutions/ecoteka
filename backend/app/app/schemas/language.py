from pydantic import BaseModel, constr


class LanguagePrimaryKey(BaseModel):
    id: str


# Shared properties
class LanguageBase(BaseModel):
    label: str


class LanguageCreate(LanguagePrimaryKey, LanguageBase):
    pass


class LanguageUpdate(LanguagePrimaryKey, LanguageBase):
    pass


class LanguageOut(LanguagePrimaryKey, LanguageBase):
    pass


# Additional properties to return via API
class LanguageDB(LanguagePrimaryKey, LanguageBase):

    class Config:
        orm_mode = True
