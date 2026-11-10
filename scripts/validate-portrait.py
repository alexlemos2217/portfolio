"""Validate exported pixels/alpha and record factual, local image checks."""
from pathlib import Path
import hashlib,json
import numpy as np
from PIL import Image

folder=Path('artifacts/portrait-editorial')
master=np.asarray(Image.open('img/alex-enhanced-master.png').convert('RGBA'))
editorial=np.asarray(Image.open('img/alex-editorial-halftone.png').convert('RGBA'))
webp=np.asarray(Image.open('img/alex-editorial-halftone.webp').convert('RGBA'))
protected=np.asarray(Image.open(folder/'face-protection-mask.png'))==255
rows=np.arange(master.shape[0])[:,None]/(master.shape[0]-1)
face=protected&(rows<.74)&(master[:,:,3]>250)
assert master.shape==editorial.shape==webp.shape==(920,920,4)
assert np.array_equal(master[face],editorial[face]),'Halftone touched the protected face'
assert np.array_equal(editorial[:,:,3],webp[:,:,3]),'Production alpha changed'
assert int(editorial[:,:,3].min())==0 and int(editorial[:,:,3].max())==255
assert int(master[:,:,3].min())==0 and int(master[:,:,3].max())==255
face_mae=float(np.abs(editorial[:,:,:3].astype(float)[face]-webp[:,:,:3].astype(float)[face]).mean())
assert face_mae<3,'Excessive WebP color error in face'
assert np.any(editorial[:,:,:3][face][:,0]!=editorial[:,:,:3][face][:,2]),'Image became grayscale'
report=json.loads((folder/'processing-report.json').read_text())
assert report['original_sha256']==hashlib.sha256(Path('img/alex.jpg').read_bytes()).hexdigest()
assert report['face_neural_contribution']==0
validation={'dimensions':[920,920],'face_rgba_identical_between_master_and_halftone':True,
            'webp_alpha_identical_to_png':True,'alpha_range':[0,255],
            'webp_face_mean_absolute_channel_error_0_to_255':face_mae,
            'color_preserved':True,'original_unchanged':True,
            'files':{p.name:p.stat().st_size for p in Path('img').glob('alex-*') if p.name in ['alex-enhanced-master.png','alex-editorial-halftone.png','alex-editorial-halftone.webp','alex-comparison.png']}}
(folder/'image-validation.json').write_text(json.dumps(validation,indent=2))
print(json.dumps(validation,indent=2))
