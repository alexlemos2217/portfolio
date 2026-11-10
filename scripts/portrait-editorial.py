"""Conservative photographic finishing and spatially varying COLOR halftone.

Uses the original JPEG, locally inferred SR candidates, and the reviewed alpha
mask only. AI pixels are excluded from the protected face. No face reconstruction.
"""
import argparse, hashlib, json
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from pymatting import estimate_foreground_ml
from scipy.ndimage import distance_transform_edt

parser = argparse.ArgumentParser()
parser.add_argument('--select', choices=['esrgan2','esrnet4'], default='esrgan2')
parser.add_argument('--preview-only', action='store_true')
args = parser.parse_args()
folder = Path('artifacts/portrait-editorial')
folder.mkdir(parents=True, exist_ok=True)
original = Image.open('img/alex.jpg').convert('RGB')
size = 920
scale = size / original.width
baseline_image = original.resize((size,size),Image.Resampling.LANCZOS)
# Moderate deterministic sharpening, not a skin smoother or face restoration model.
baseline_image = baseline_image.filter(ImageFilter.UnsharpMask(radius=1.2,percent=24,threshold=3))
baseline = np.asarray(baseline_image,dtype=np.float64)/255
alpha = np.asarray(Image.open('img/alex-portrait-v2-alpha.png').resize((size,size),Image.Resampling.LANCZOS),dtype=np.float64)/255

face_source = Image.new('L',original.size,0)
draw = ImageDraw.Draw(face_source)
draw.polygon([(115,92),(155,62),(292,62),(332,100),(356,188),(347,285),(304,346),(250,372),(197,368),(146,340),(105,284),(86,190)],fill=255)
face_source = face_source.filter(ImageFilter.MaxFilter(21)).filter(ImageFilter.GaussianBlur(6))
protected = np.asarray(face_source.resize((size,size),Image.Resampling.LANCZOS),dtype=np.float64)/255
# Explicit no-AI zones: eyebrows/eyes, nose, mouth and teeth. Coordinates refer to
# the ORIGINAL photo and are scaled without any warp, relighting geometry or pose.
for left,top,right,bottom in [(110,146,327,226),(172,200,275,274),(130,240,315,315)]:
    protected[round(top*scale):round(bottom*scale),round(left*scale):round(right*scale)] = 1
Image.fromarray(np.uint8(np.rint(protected*255))).save(folder/'face-protection-mask.png')

original_array = np.asarray(original,dtype=np.float64)/255
gray_reference = original_array[25:75,20:65].mean(axis=(0,1))
white_balance = np.clip(gray_reference.mean()/gray_reference,.985,1.015)

def finish(rgb):
    rgb = np.clip(rgb*white_balance,0,1)
    luminance = rgb @ np.array([.2126,.7152,.0722])
    lifted = luminance + .018*4*luminance*(1-luminance)
    target = np.clip(.5+(lifted-.5)*1.025,0,1)
    return np.clip(rgb*((target+1e-6)/(luminance+1e-6))[:,:,None],0,1)

def rgba(rgb,a):
    array = np.dstack([np.uint8(np.rint(np.clip(rgb,0,1)*255)),np.uint8(np.rint(np.clip(a,0,1)*255))])
    return Image.fromarray(array)

candidates = {}
for name in ['esrgan2','esrnet4']:
    path = folder/f'{name}-raw.png'
    if path.exists():
        candidates[name] = np.asarray(Image.open(path).convert('RGB').resize((size,size),Image.Resampling.LANCZOS),dtype=np.float64)/255

try:
    font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',17)
except OSError:
    font=ImageFont.load_default()

def sheet(images,labels,path,face_crops=True):
    panel=460
    height=960 if face_crops else 500
    canvas=Image.new('RGB',(panel*len(images),height),'#141413')
    paint=ImageDraw.Draw(canvas)
    for index,(image,label) in enumerate(zip(images,labels)):
        paint.text((index*panel+12,12),label,font=font,fill='#edece5')
        back=Image.new('RGBA',image.size,'#0a0a09');back.alpha_composite(image.convert('RGBA'))
        canvas.paste(back.convert('RGB').resize((panel,panel),Image.Resampling.LANCZOS),(index*panel,40))
        if face_crops:
            w,h=image.size
            crop=image.crop((round(w*.23),round(h*.29),round(w*.77),round(h*.76)))
            crop_back=Image.new('RGBA',crop.size,'#0a0a09');crop_back.alpha_composite(crop.convert('RGBA'))
            canvas.paste(crop_back.convert('RGB').resize((panel,400),Image.Resampling.LANCZOS),(index*panel,540))
    canvas.save(path)

if args.preview_only:
    images=[original.convert('RGBA')]+[rgba(finish(image),alpha) for image in candidates.values()]
    sheet(images,['ORIGINAL / 460px']+[f'{name.upper()} / RAW MODEL' for name in candidates],folder/'model-comparison.png')
    print('Raw model comparison generated. No production images replaced.')
    raise SystemExit(0)

if args.select not in candidates:
    raise SystemExit(f'Missing {args.select} inference. Run portrait-superresolution.py first.')
# Neural SR contributes outside the protected face, with a conservative blend.
neural_strength=.65*(1-protected)
mixed = baseline*(1-neural_strength[:,:,None])+candidates[args.select]*neural_strength[:,:,None]
assert np.array_equal(mixed[protected==1],baseline[protected==1])
photo = finish(mixed)
foreground = estimate_foreground_ml(photo,alpha)
edge=(alpha>0)&(alpha<.995)
photo[edge]=foreground[edge]
photo=np.clip(photo,0,1)
master=rgba(photo,alpha)
master.save('img/alex-enhanced-master.png',optimize=True)

yy,xx=np.mgrid[0:size,0:size].astype(np.float64)
yn=yy/(size-1)
def smooth(a,b,value):
    t=np.clip((value-a)/(b-a),0,1)
    return t*t*(3-2*t)

luma=photo @ np.array([.2126,.7152,.0722])
shirt=1-smooth(.13,.31,luma)
lower=smooth(.75,.97,yn)
strength=lower*(.12+.88*shirt)*(1-protected)
# Screen fixed in exported pixels: 9.2px at 920px = 4.6px at the 460px hero.
spacing=9.2
angle=np.deg2rad(18)
u=(xx*np.cos(angle)+yy*np.sin(angle))/spacing
v=(-xx*np.sin(angle)+yy*np.cos(angle))/spacing
distance=np.hypot((u+.5)%1-.5,(v+.5)%1-.5)
radius=(.40+.065*(1-luma))*(1-.52*smooth(.88,1,yn))
coverage=1-smooth(radius-.065,radius+.065,distance)
editorial_alpha=alpha*((1-strength)+strength*coverage)
# The actual alpha dissolves toward the base; CSS does not simulate transparency.
editorial_alpha*=1-smooth(.925,1,yn)
# Color comes from the photograph. Lift only the dark garment dots slightly so
# the print structure reads on charcoal without recoloring the face or teeth.
ink_lift=.025*lower*shirt*coverage*(1-protected)
editorial_rgb=np.clip(photo+ink_lift[:,:,None],0,1)
# Small, selected shoulder-edge dispersion. Nearest foreground colors only;
# no dots beside ears, face or hair, and no random animation in the browser.
inside=alpha>.85
outside_distance,nearest=distance_transform_edt(~inside,return_indices=True)
scatter=(alpha<.015)&(outside_distance>0)&(outside_distance<5*scale)&(yn>.80)&(yn<.975)
scatter_alpha=coverage*.20*(1-outside_distance/(5*scale))*lower
editorial_alpha[scatter]=np.maximum(editorial_alpha[scatter],scatter_alpha[scatter])
nearest_rgb=photo[nearest[0],nearest[1]]
editorial_rgb[scatter]=nearest_rgb[scatter]
# Explicitly prove halftone does not touch the protected facial pixels.
face_core=(protected==1)&(yn<.74)
assert np.array_equal(editorial_rgb[face_core],photo[face_core])
assert np.array_equal(editorial_alpha[face_core],alpha[face_core])
editorial=rgba(editorial_rgb,editorial_alpha)
editorial.save('img/alex-editorial-halftone.png',optimize=True)
editorial.save('img/alex-editorial-halftone.webp',quality=90,method=6,alpha_quality=100)
sheet([original.convert('RGBA'),master,editorial],['ORIGINAL / 460px','MEJORA CONSERVADORA / 920px','EDITORIAL COLOR / HALFTONE'],'img/alex-comparison.png')
sheet([original.convert('RGBA')]+[rgba(finish(image),alpha) for image in candidates.values()]+[master],['ORIGINAL']+[f'{name.upper()} / RAW MODEL' for name in candidates]+['FINAL / FACE PROTECTED'],folder/'model-comparison.png')
for color,name in [('#000000','black'),('#808080','gray'),('#ffffff','white'),('#0a0a09','hero')]:
    backdrop=Image.new('RGBA',editorial.size,color);backdrop.alpha_composite(editorial)
    backdrop.convert('RGB').save(folder/f'editorial-on-{name}.png')
report={'selected_model':args.select,'input':'img/alex.jpg','output_size':[size,size],
        'scale':scale,'face_neural_contribution':0,'face_restoration':False,
        'outside_face_neural_blend':.65,'white_balance_multipliers':white_balance.tolist(),
        'halftone_spacing_px':spacing,'halftone_angle_degrees':18,
        'alpha_range':editorial.getchannel('A').getextrema(),
        'master_bytes':Path('img/alex-enhanced-master.png').stat().st_size,
        'webp_bytes':Path('img/alex-editorial-halftone.webp').stat().st_size,
        'original_sha256':hashlib.sha256(Path('img/alex.jpg').read_bytes()).hexdigest(),
        'note':'Model details are estimates, not recovered ground truth. Face uses conservative original-derived pixels.'}
(folder/'processing-report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report),flush=True)
