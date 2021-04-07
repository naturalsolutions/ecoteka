from sqlalchemy import inspect
from typing import Any
import re

from sqlalchemy.ext.declarative import as_declarative, declared_attr


@as_declarative()
class Base:
    id: Any
    __name__: str

    @declared_attr
    # Generate __tablename__ automatically
    def __tablename__(cls) -> str:
        def camel_to_snake(name):
            # camel_to_snake('camel2_camel2_case') ->  'camel2_camel2_case'
            # camel_to_snake('getHTTPResponseCode') ->  'get_http_response_code'
            # camel_to_snake('HTTPResponseCodeXYZ') ->  'http_response_code_xyz'
            name = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
            return re.sub('([a-z0-9])([A-Z])', r'\1_\2', name).lower()
        # return cls.__name__.lower()
        return camel_to_snake(cls.__name__)

    def as_dict(self) -> dict:
        return {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}
