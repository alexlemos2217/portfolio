"""Compare a portrait model; refine alpha and contour color, preserve the face.

Run with --model birefnet-portrait (network required once for model weights).
Production selection is separate, following visual inspection of the contact sheet.
"""
import os, argparse, json
from pathlib import Path
os.environ['U2NET_HOME'] = str(Path('.tools/models').resolve())
os.environ['OMP_NUM_THREADS'] = '4'
import numpy as np
from PIL import Image, ImageDraw
from rembg import new_session
from pymatting import estimate_alpha_cf, estimate_foreground_ml
from scipy.ndimage import binary_erosion, binary_dilation

parser = argparse.ArgumentParser()
parser.add_argument('--model', default='birefnet-portrait')
parser.add_argument('--reuse-mask', action='store_true')
args = parser.parse_args()
output = Path('artifacts/v2/portrait')
output.mkdir(parents=True, exist_ok=True)
source = Image.open('img/alex.jpg').convert('RGB')
previous = Image.open('img/alex-cutout.png').convert('RGBA')
if args.reuse_mask and (output / f'{args.model}-mask.png').exists():
    raw = Image.open(output / f'{args.model}-mask.png').convert('L')
else:
    session = new_session(args.model, providers=['CPUExecutionProvider'])
    raw = session.predict(source)[0]
raw.save(output / f'{args.model}-mask.png')
pred = np.asarray(raw, dtype=np.float64) / 255
rgb = np.asarray(source, dtype=np.float64) / 255
# A narrow trimap preserves fine hair rather than globally shrinking the silhouette.
foreground = binary_erosion(pred > .97, iterations=2)
background = ~binary_dilation(pred > .04, iterations=2)
trimap = np.full(pred.shape, .5)
trimap[foreground] = 1
trimap[background] = 0
alpha = estimate_alpha_cf(rgb, trimap)
# The face is confidently opaque; keep exact source pixels and original proportions.
alpha[foreground] = 1
alpha[background] = 0
# Localized fringe cleanup: suppress pale, low-alpha wall remnants only near the contour.
edge = (alpha > 0) & (alpha < 1)
luminance = rgb.mean(axis=2)
neutral = rgb.max(axis=2) - rgb.min(axis=2) < .12
fringe = edge & neutral & (luminance > .55) & (alpha < .75)
alpha[fringe] *= np.clip((.85 - luminance[fringe]) / .3, 0, 1)
alpha = np.clip(alpha, 0, 1)
alpha[alpha < .015] = 0
alpha[alpha > .985] = 1
mask = Image.fromarray(np.uint8(np.rint(alpha * 255)))
# Recover foreground color only in the partial-alpha contour. Interior skin, face,
# expression and clothing pixels stay exactly as photographed; no generative step.
foreground_rgb = estimate_foreground_ml(rgb, alpha)
refined_rgb = rgb.copy()
transition = (alpha > 0) & (alpha < .995)
refined_rgb[transition] = foreground_rgb[transition]
cutout = Image.fromarray(np.uint8(np.rint(np.clip(refined_rgb,0,1)*255))).convert('RGBA')
cutout.putalpha(mask)
cutout.save(output / f'{args.model}-refined.png', optimize=True)
mask.save(output / f'{args.model}-alpha.png')

backgrounds = ['#000000', '#808080', '#ffffff', '#0a0a09']
sheet = Image.new('RGB', (460 * 3, 500 * 4), '#252522')
draw = ImageDraw.Draw(sheet)
for row, color in enumerate(backgrounds):
    for col, (label, image) in enumerate([('ORIGINAL',source.convert('RGBA')),('V1 / U2NETP',previous),(f'V2 / {args.model}',cutout)]):
        composite = Image.new('RGBA',source.size,color)
        composite.alpha_composite(image)
        sheet.paste(composite.convert('RGB'), (col * 460,row * 500 + 40))
        draw.text((col * 460 + 12,row * 500 + 12),f'{label} / {color}',fill='white')
sheet.save(output / f'comparison-{args.model}.jpg', quality=95)
# Hair and ear inspection at 3x; no image synthesis or face alteration.
for name, box in [('hair',(80,0,355,125)),('left-ear',(75,170,150,315)),('right-ear',(300,170,375,315)),('shoulders',(0,350,460,460))]:
    crop = cutout.crop(box)
    canvas = Image.new('RGBA',crop.size,'#0a0a09')
    canvas.alpha_composite(crop)
    canvas.convert('RGB').resize((crop.width*3,crop.height*3)).save(output/f'{args.model}-{name}.png')
interior = alpha >= .995
assert np.array_equal(np.asarray(cutout.convert('RGB'))[interior], np.asarray(source)[interior])
assert np.array_equal(np.asarray(cutout.convert('RGB'))[100:290,150:290], np.asarray(source)[100:290,150:290])
print(json.dumps({'model':args.model,'size':source.size,'alpha':mask.getextrema(),'opaque_interior_rgb_exact':True,'face_region_rgb_exact':True,'comparison':str(output/f'comparison-{args.model}.jpg')}))
