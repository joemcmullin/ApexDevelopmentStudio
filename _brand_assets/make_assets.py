#!/usr/bin/env python3
"""Generate Apex Development Studio branded iPhone 16 wallpaper + profile image."""
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

MARK = "/Users/joemcmullin/Projects/ApexDevelopmentStudio/Apex-mark.png"
OUT = "/Users/joemcmullin/Projects/ApexDevelopmentStudio/_brand_assets"

CRIMSON = (192, 24, 46)     # #C0182E
PURPLE  = (155, 29, 181)    # #9B1DB5
TOP     = (7, 7, 15)        # #07070F
MID     = (12, 12, 26)      # #0C0C1A
BOT     = (17, 17, 38)      # #111126


def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


def vertical_bg(w, h):
    """Three-stop vertical gradient: TOP -> MID -> BOT."""
    base = Image.new("RGB", (1, h))
    px = base.load()
    for y in range(h):
        t = y / (h - 1)
        if t < 0.5:
            c = lerp(TOP, MID, t / 0.5)
        else:
            c = lerp(MID, BOT, (t - 0.5) / 0.5)
        px[0, y] = c
    return base.resize((w, h))


def orb(size, color, radius, intensity=1.0):
    """A soft radial glow (RGBA) of given color, transparent at the edge."""
    s = size
    layer = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    px = layer.load()
    cx = cy = s / 2
    for y in range(s):
        for x in range(s):
            d = math.hypot(x - cx, y - cy) / radius
            if d < 1:
                a = int((1 - d) ** 2 * 255 * intensity)
                px[x, y] = (color[0], color[1], color[2], a)
    return layer


def add_orb(canvas, color, cx, cy, radius, intensity=1.0):
    size = radius * 2
    o = orb(size, color, radius, intensity)
    canvas.alpha_composite(o, (int(cx - radius), int(cy - radius)))


def white_mark(scale_px):
    """Load the dark line-art mark and recolor strokes to white, preserving alpha."""
    im = Image.open(MARK).convert("RGBA")
    # crop to the visual bounding box for tight control
    bbox = im.getchannel("A").getbbox()
    im = im.crop(bbox)
    alpha = im.getchannel("A")
    white = Image.new("RGBA", im.size, (255, 255, 255, 255))
    white.putalpha(alpha)
    # resize to target width
    w, h = white.size
    nh = int(h * scale_px / w)
    return white.resize((scale_px, nh), Image.LANCZOS)


def wordmark(text, font, fill, tracking):
    """Render letter-spaced text on its own transparent layer."""
    dummy = Image.new("RGBA", (10, 10))
    d = ImageDraw.Draw(dummy)
    widths = []
    for ch in text:
        bb = d.textbbox((0, 0), ch, font=font)
        widths.append(bb[2] - bb[0])
    total = sum(widths) + tracking * (len(text) - 1)
    asc, desc = font.getmetrics()
    h = asc + desc
    layer = Image.new("RGBA", (int(total) + 4, h + 4), (0, 0, 0, 0))
    dd = ImageDraw.Draw(layer)
    x = 0
    for ch, wd in zip(text, widths):
        dd.text((x, 0), ch, font=font, fill=fill)
        x += wd + tracking
    return layer.crop(layer.getchannel("A").getbbox())


def load_font(size):
    for p in [
        "/System/Library/Fonts/Supplemental/Futura.ttc",
        "/System/Library/Fonts/HelveticaNeue.ttc",
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf",
    ]:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            continue
    return ImageFont.load_default()


# ---------------------------------------------------------------- WALLPAPER
def make_wallpaper():
    W, H = 1179, 2556
    canvas = vertical_bg(W, H).convert("RGBA")

    # gradient orbs (blurred radial glows), matching the website aesthetic
    add_orb(canvas, CRIMSON, W * 0.18, H * 0.20, 760, 0.55)
    add_orb(canvas, PURPLE,  W * 0.88, H * 0.40, 820, 0.50)
    add_orb(canvas, CRIMSON, W * 0.92, H * 0.82, 640, 0.32)
    add_orb(canvas, PURPLE,  W * 0.10, H * 0.92, 700, 0.30)
    canvas = canvas.filter(ImageFilter.GaussianBlur(40))

    # subtle ring accent behind the mark
    mark_w = 560
    mark = white_mark(mark_w)
    mx = (W - mark.size[0]) // 2
    my = int(H * 0.40) - mark.size[1] // 2

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    add_orb(glow, (255, 255, 255), W / 2, my + mark.size[1] / 2, 520, 0.10)
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    canvas.alpha_composite(glow)

    canvas.alpha_composite(mark, (mx, my))

    # wordmark
    f1 = load_font(76)
    f2 = load_font(38)
    line1 = wordmark("APEX", f1, (245, 246, 250, 255), 24)
    line2 = wordmark("DEVELOPMENT · STUDIO", f2, (150, 150, 180, 255), 14)

    y1 = my + mark.size[1] + 90
    canvas.alpha_composite(line1, ((W - line1.size[0]) // 2, y1))
    y2 = y1 + line1.size[1] + 34
    canvas.alpha_composite(line2, ((W - line2.size[0]) // 2, y2))

    out = f"{OUT}/apex-wallpaper-iphone16.png"
    canvas.convert("RGB").save(out, "PNG")
    print("wrote", out, canvas.size)


# ---------------------------------------------------------------- PROFILE
def make_profile():
    S = 1024
    canvas = vertical_bg(S, S).convert("RGBA")
    add_orb(canvas, CRIMSON, S * 0.20, S * 0.18, 560, 0.60)
    add_orb(canvas, PURPLE,  S * 0.85, S * 0.85, 600, 0.55)
    add_orb(canvas, PURPLE,  S * 0.85, S * 0.18, 380, 0.30)
    canvas = canvas.filter(ImageFilter.GaussianBlur(34))

    mark = white_mark(560)
    mx = (S - mark.size[0]) // 2
    my = (S - mark.size[1]) // 2

    glow = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    add_orb(glow, (255, 255, 255), S / 2, S / 2, 470, 0.12)
    glow = glow.filter(ImageFilter.GaussianBlur(55))
    canvas.alpha_composite(glow)
    canvas.alpha_composite(mark, (mx, my))

    out = f"{OUT}/apex-profile-1024.png"
    canvas.convert("RGB").save(out, "PNG")
    print("wrote", out, canvas.size)

    # also a circular-masked version for platforms that don't auto-crop
    mask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, S, S), fill=255)
    circ = canvas.convert("RGBA")
    circ.putalpha(mask)
    outc = f"{OUT}/apex-profile-1024-circle.png"
    circ.save(outc, "PNG")
    print("wrote", outc)


if __name__ == "__main__":
    make_wallpaper()
    make_profile()
