"""Run official RRDB weights on the ORIGINAL photo; never load a face restorer.

Development-only: torch CPU + Pillow + NumPy, cached official architecture/weights
in .tools/sr. See docs/PORTRAIT-EDITORIAL.md for provenance and setup.
"""
import argparse, hashlib, json, time
from pathlib import Path
import numpy as np
from PIL import Image
import torch
from torch import nn
from torch.nn import functional as F

parser = argparse.ArgumentParser()
parser.add_argument('--model', choices=['esrgan2', 'esrnet4'], required=True)
parser.add_argument('--tile', type=int, default=160)
args = parser.parse_args()
torch.set_num_threads(4)
torch.set_num_interop_threads(1)
cache = Path('.tools/sr')
scale = 2 if args.model == 'esrgan2' else 4
weight_path = cache / ('RealESRGAN_x2plus.pth' if scale == 2 else 'RealESRNet_x4plus.pth')
architecture = cache / 'rrdbnet_arch.py'
if not weight_path.exists() or not architecture.exists():
    raise SystemExit('Missing official architecture/weights; see docs/PORTRAIT-EDITORIAL.md')

# Adapt only BasicSR registry/initialization helpers. The official network and
# strict state dictionary are unchanged. No BasicSR/OpenCV runtime is installed.
class Registry:
    def register(self):
        return lambda value: value

namespace = {'__name__': 'portrait_rrdb', 'ARCH_REGISTRY': Registry(),
             'default_init_weights': lambda *a, **k: None,
             'make_layer': lambda block, count, **kw: nn.Sequential(*(block(**kw) for _ in range(count))),
             'pixel_unshuffle': lambda image, scale: F.pixel_unshuffle(image, scale)}
code = architecture.read_text(encoding='utf-8')
code = code.replace('from basicsr.utils.registry import ARCH_REGISTRY', '')
code = code.replace('from .arch_util import default_init_weights, make_layer, pixel_unshuffle', '')
exec(compile(code, str(architecture), 'exec'), namespace)
model = namespace['RRDBNet'](3, 3, scale=scale, num_feat=64, num_block=23, num_grow_ch=32)
weights = torch.load(weight_path, map_location='cpu', weights_only=True)
model.load_state_dict(weights.get('params_ema', weights.get('params', weights)), strict=True)
model.eval()
model = model.to(memory_format=torch.channels_last)
source = Image.open('img/alex.jpg').convert('RGB')
rgb = np.asarray(source, dtype=np.float32) / 255
tensor = torch.from_numpy(rgb.transpose(2, 0, 1).copy()).unsqueeze(0).contiguous(memory_format=torch.channels_last)
height, width = rgb.shape[:2]
output = np.zeros((height * scale, width * scale, 3), dtype=np.float32)
padding = 24
started = time.perf_counter()
total = ((height + args.tile - 1) // args.tile) * ((width + args.tile - 1) // args.tile)
done = 0
with torch.inference_mode():
    for top in range(0, height, args.tile):
        for left in range(0, width, args.tile):
            bottom, right = min(top + args.tile, height), min(left + args.tile, width)
            pt, pl = max(0, top - padding), max(0, left - padding)
            pb, pr = min(height, bottom + padding), min(width, right + padding)
            prediction = model(tensor[:, :, pt:pb, pl:pr]).clamp_(0, 1)
            pixels = prediction[0].permute(1, 2, 0).numpy()
            output[top*scale:bottom*scale, left*scale:right*scale] = pixels[(top-pt)*scale:(bottom-pt)*scale, (left-pl)*scale:(right-pl)*scale]
            done += 1
            print(f'{args.model}: tile {done}/{total}, {time.perf_counter()-started:.1f}s', flush=True)
folder = Path('artifacts/portrait-editorial')
folder.mkdir(parents=True, exist_ok=True)
path = folder / f'{args.model}-raw.png'
Image.fromarray(np.uint8(np.rint(output*255))).save(path)
report = {'model': weight_path.name, 'scale': scale, 'output': str(path),
          'dimensions': [width*scale, height*scale], 'seconds': time.perf_counter()-started,
          'source': 'img/alex.jpg', 'source_sha256': hashlib.sha256(Path('img/alex.jpg').read_bytes()).hexdigest(),
          'weight_sha256': hashlib.sha256(weight_path.read_bytes()).hexdigest(),
          'architecture_sha256': hashlib.sha256(architecture.read_bytes()).hexdigest(),
          'face_reconstruction_model': False, 'torch': torch.__version__}
(folder / f'{args.model}-inference.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report), flush=True)
