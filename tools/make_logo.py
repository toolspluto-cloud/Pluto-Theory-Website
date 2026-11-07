import sys
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
g = Image.open(src).convert("L")
bbox = g.point(lambda v: 255 if v > 60 else 0).getbbox()
pad = 4
g = g.crop((bbox[0]-pad, bbox[1]-pad, bbox[2]+pad, bbox[3]+pad))
# white text on black -> ink-coloured text on transparent, brightness becomes opacity
alpha = g.point(lambda v: 0 if v < 25 else min(255, int((v - 25) * 255 / 200)))
img = Image.new("RGBA", g.size, (11, 11, 15, 255))
img.putalpha(alpha)
img.save(out, optimize=True)
print(img.size)
