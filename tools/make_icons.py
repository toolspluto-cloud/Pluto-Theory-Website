# Builds the browser-tab icons from the Pluto Theory wordmark: white logo on a black rounded square.
import sys
from PIL import Image, ImageDraw
logo_path, out_dir = sys.argv[1], sys.argv[2]
logo = Image.open(logo_path).convert("RGBA")          # ink-coloured logo on transparent
alpha = logo.getchannel("A")
white = Image.new("RGBA", logo.size, (255, 255, 255, 255)); white.putalpha(alpha)

def icon(size, radius_ratio=0.22, fill=0.84):
    S = size * 8                                        # draw big, shrink for smooth edges
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    ImageDraw.Draw(img).rounded_rectangle((0, 0, S - 1, S - 1), radius=int(S * radius_ratio), fill=(11, 11, 15, 255))
    w = int(S * fill); h = int(w * white.height / white.width)
    mark = white.resize((w, h), Image.LANCZOS)
    img.alpha_composite(mark, ((S - w) // 2, (S - h) // 2))
    return img.resize((size, size), Image.LANCZOS)

icon(32).save(f"{out_dir}/favicon-32.png")
icon(192).save(f"{out_dir}/icon-192.png")
icon(180, radius_ratio=0).save(f"{out_dir}/apple-touch-icon.png")   # iPhone rounds the corners itself
icon(64).save(f"{out_dir}/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
icon(512).save(f"{out_dir}/icon-preview.png")
print("ok")
