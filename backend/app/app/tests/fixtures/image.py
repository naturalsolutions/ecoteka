import io
import pytest
import numpy
from PIL import Image

@pytest.fixture
def generate_image():
    def decorator(width: int, height: int):
        rgb_array = numpy.random.rand(height,width,3) * 255
        image = Image.fromarray(rgb_array.astype('uint8')).convert('RGB')
        bytes = io.BytesIO()
        image.save(bytes, format='jpeg')

        return bytes

    return decorator

