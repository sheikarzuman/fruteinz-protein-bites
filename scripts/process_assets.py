"""
One-off asset pipeline: extracts real Fruteinz artwork from the supplied
poster (WhatsApp Image 2026-09-09 at 18.59.42.jpeg) into static/images/.

This does NOT redesign or alter the product packaging. It only crops
rectangular regions from the original poster and resizes them (preserving
aspect ratio, no distortion) for use across the website.

Run once from the project root:
    source venv/bin/activate && python scripts/process_assets.py [path/to/poster.jpeg]

If no path is given, it falls back to the original poster location used
during development (only meaningful on that machine).
"""

import sys
from pathlib import Path
from PIL import Image, ImageDraw

DEFAULT_SOURCE = Path.home() / "Downloads" / "WhatsApp Image 2026-09-09 at 18.59.42.jpeg"
SOURCE = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SOURCE
OUT = Path(__file__).resolve().parent.parent / "static" / "images"
OUT.mkdir(parents=True, exist_ok=True)


def save_jpg(img: Image.Image, name: str, max_w: int, quality: int = 88) -> None:
    if img.width > max_w:
        h = int(img.height * (max_w / img.width))
        img = img.resize((max_w, h), Image.LANCZOS)
    img.convert("RGB").save(OUT / name, "JPEG", quality=quality, optimize=True)
    print(f"wrote {name} {img.size}")


def save_png(img: Image.Image, name: str, max_w: int) -> None:
    if img.width > max_w:
        h = int(img.height * (max_w / img.width))
        img = img.resize((max_w, h), Image.LANCZOS)
    img.save(OUT / name, "PNG", optimize=True)
    print(f"wrote {name} {img.size}")


def main() -> None:
    im = Image.open(SOURCE)
    w, h = im.size
    assert (w, h) == (1024, 1536), f"unexpected source size {im.size}"

    # ---- Individual product packs (pouch + scattered bites), no distortion ----
    packs = {
        "pack-guava": (12, 578, 228, 1000),
        "pack-jackfruit": (218, 578, 424, 1000),
        "pack-avocado": (414, 578, 622, 1000),
        "pack-blackberry": (608, 578, 818, 1000),
        "pack-raspberry": (802, 578, 1018, 1000),
    }
    for name, box in packs.items():
        save_jpg(im.crop(box), f"{name}.jpg", max_w=640, quality=90)

    # ---- Full five-pack lineup (hero / product showcase) ----
    save_jpg(im.crop((0, 578, w, 1005)), "packs-lineup.jpg", max_w=1800, quality=88)

    # ---- Poster icon strip (What's Inside benefits) ----
    icons = {
        "icon-protein": (0, 1040, 205, 1210),
        "icon-fruit-flavours": (205, 1040, 410, 1210),
        "icon-honey": (410, 1040, 615, 1210),
        "icon-soy": (615, 1040, 820, 1210),
        "icon-no-artificial": (820, 1040, 1024, 1210),
    }
    for name, box in icons.items():
        save_png(im.crop(box), f"{name}.png", max_w=500)

    # ---- Authentic logo lockup crop (hero / footer use on cream bg) ----
    save_png(im.crop((235, 55, 800, 250)), "logo-lockup.png", max_w=900)

    # ---- Full poster (about / footer credit, optional reference) ----
    save_jpg(im, "poster-full.jpg", max_w=1000, quality=85)

    make_favicon()

    print("Done. Source poster untouched at:", SOURCE)


def make_favicon() -> None:
    """Small programmatic favicon (forest-green circle + cream leaf mark).

    This is site chrome (a browser-tab icon), not product packaging, so it is
    generated rather than cropped from the poster.
    """
    size = 512
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    forest = (20, 67, 42, 255)
    cream = (250, 243, 228, 255)
    draw.ellipse((0, 0, size, size), fill=forest)
    # Simple two-leaf mark.
    draw.pieslice((150, 110, 300, 260), start=200, end=380, fill=cream)
    draw.pieslice((210, 110, 360, 260), start=160, end=340, fill=cream)
    draw.ellipse((246, 150, 266, 170), fill=forest)
    img.save(OUT / "favicon.png")
    print("wrote favicon.png", img.size)


if __name__ == "__main__":
    main()
