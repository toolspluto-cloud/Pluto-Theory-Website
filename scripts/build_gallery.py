# Builds the website gallery from your photos.
#
# 1. Put photos (JPG, PNG or WEBP) in these folders, by type of work:
#      assets/gallery/originals/branding/
#      assets/gallery/originals/photography/
#      assets/gallery/originals/ai-photoshoot/
#    Name each file the way you'd describe it, e.g. "emirati-gentleman-ring-campaign.jpg".
#    That name becomes the photo's caption and alt text ("Emirati gentleman ring campaign").
#    Optional: start names with a number to set the order, e.g. "01-kfc-menu-shoot.jpg".
# 2. Run, from the site folder:   py scripts/build_gallery.py
#
# It makes a small (600 px) and a large (1600 px) WEBP of each photo in assets/gallery/ and writes
# gallery-data.js. The originals folder is not uploaded to the website (see .vercelignore).
import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

SITE = Path(__file__).resolve().parent.parent
SRC = SITE / "assets" / "gallery" / "originals"
OUT = SITE / "assets" / "gallery"
CATEGORIES = ["branding", "photography", "ai-photoshoot"]
SIZES = {"thumb": 600, "src": 1600}

def caption(stem):
    words = re.sub(r"^\d+[-_ ]*", "", stem).replace("_", " ").replace("-", " ").strip()
    return (words[:1].upper() + words[1:]) or "Pluto Theory work"

def slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")

items, made = [], set()
for cat in CATEGORIES:
    folder = SRC / cat
    folder.mkdir(parents=True, exist_ok=True)
    for f in sorted(folder.iterdir()):
        if f.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
            continue
        try:
            im = ImageOps.exif_transpose(Image.open(f))  # respect phone camera rotation
        except Exception as e:
            print(f"Skipped {f.name}: {e}", file=sys.stderr)
            continue
        im = im.convert("RGB") if im.mode not in ("RGB", "RGBA") else im
        base = f"{cat}-{slug(f.stem)}"
        entry = {"category": cat, "alt": caption(f.stem)}
        for key, size in SIZES.items():
            copy = im.copy()
            copy.thumbnail((size, size * 3))  # fit the width, keep the shape
            name = f"{base}-{size}.webp"
            copy.save(OUT / name, "WEBP", quality=82, method=6)
            made.add(name)
            entry[key] = f"/assets/gallery/{name}"
            if key == "thumb":
                entry["w"], entry["h"] = copy.size
        items.append(entry)

# Remove web copies of photos that were deleted from the originals folders
for old in OUT.glob("*.webp"):
    if old.name not in made:
        old.unlink()

(SITE / "gallery-data.js").write_text(
    "// Made by scripts/build_gallery.py from assets/gallery/originals. Don't edit by hand.\n"
    f"window.PT_GALLERY = {json.dumps(items, indent=1)};\n",
    encoding="utf-8",
)
print(f"Gallery: {len(items)} photos " + ", ".join(f"{c}: {sum(1 for i in items if i['category'] == c)}" for c in CATEGORIES))
