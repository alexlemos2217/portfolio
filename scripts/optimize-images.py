from pathlib import Path
from PIL import Image
for path in Path('img').glob('rumbo-*.jpg'):
    with Image.open(path) as image:
        image.thumbnail((1440, 1440), Image.Resampling.LANCZOS)
        image.save(path.with_suffix('.webp'), quality=82, method=6)
