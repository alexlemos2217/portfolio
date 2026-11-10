"""Local segmentation; original RGB pixels are retained, only alpha is changed."""
import os
from pathlib import Path
os.environ['U2NET_HOME'] = str(Path('.tools/models').resolve())
from PIL import Image, ImageFilter
from rembg import remove, new_session

original = Image.open('img/alex.jpg').convert('RGB')
mask = remove(original, session=new_session('u2netp'), only_mask=True,
              alpha_matting=True, alpha_matting_foreground_threshold=240,
              alpha_matting_background_threshold=15, alpha_matting_erode_size=5)
mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.3))
mask = mask.point(lambda alpha: 255 if alpha >= 250 else alpha)
cutout = original.convert('RGBA')
cutout.putalpha(mask)
cutout.save('img/alex-cutout.png', optimize=True)
cutout.save('img/alex-cutout.webp', lossless=True, method=6)
preview = Image.new('RGBA', cutout.size, '#0a0a09')
preview.alpha_composite(cutout)
preview.convert('RGB').save('.tools/cutout-preview.jpg')
print({'size': cutout.size, 'alpha_extrema': mask.getextrema(), 'original_rgb_preserved': True})
