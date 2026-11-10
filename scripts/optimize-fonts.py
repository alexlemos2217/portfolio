from pathlib import Path
from fontTools.ttLib import TTFont
css = Path('fonts/fonts.css').read_text(encoding='utf-8-sig')
for path in Path('fonts').glob('*.ttf'):
    font = TTFont(path)
    font.flavor = 'woff2'
    font.save(path.with_suffix('.woff2'))
    css = css.replace(path.name, path.with_suffix('.woff2').name)
    path.unlink()
Path('fonts/fonts.css').write_text(css.replace("format('truetype')", "format('woff2')"), encoding='utf-8')
