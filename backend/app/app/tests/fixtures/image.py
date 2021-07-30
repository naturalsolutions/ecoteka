import io
import pytest
from PIL import Image


@pytest.fixture
def generate_image():
    def decorator(width: int, height: int):
        image = Image.new("RGB", (width, height), color="red")
        data = None
        with io.BytesIO() as bytes:
            image.save(bytes, format="png")
            data = bytes.getvalue()

        return data

    return decorator
