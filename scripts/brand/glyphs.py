"""Converte texto em contorno SVG (Archivo), na linha de base y=0, origem x=0.

uso: python glyphs.py <fonts_dir> > glyphs.json
Cada entrada: d (path), advance, bbox [xMin, yMin, xMax, yMax] já em px do
tamanho pedido (y para baixo, como no SVG).
"""
import json
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

FONTS = sys.argv[1]
JOBS = {
    # logo: "jpg" peso 300, 80 px, tracking -0.05em (o -4 do quadro de opções)
    "word": {"text": "jpg", "weight": 300, "size": 80, "track": -0.05},
    # logo pesado para tamanhos pequenos (avatar)
    "word400": {"text": "jpg", "weight": 400, "size": 80, "track": -0.05},
    # favicon: "j" peso 600, 23 px
    "j": {"text": "j", "weight": 600, "size": 23, "track": 0},
    # assinatura ao lado do logo
    "name": {"text": "João Pedro Gaspar", "weight": 300, "size": 40, "track": -0.02},
    "role": {"text": "Front-end engineer for Shopify", "weight": 600, "size": 15, "track": 0},
}

out = {}
for key, job in JOBS.items():
    font = TTFont(f"{FONTS}/archivo-{job['weight']}.ttf")
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    upm = font["head"].unitsPerEm
    s = job["size"] / upm
    pen = SVGPathPen(gs)
    bounds = BoundsPen(gs)
    x = 0.0
    for ch in job["text"]:
        name = cmap[ord(ch)]
        # escala, inverte o y (fonte cresce para cima, SVG para baixo) e desloca
        t = (s, 0, 0, -s, x, 0)
        gs[name].draw(TransformPen(pen, t))
        gs[name].draw(TransformPen(bounds, t))
        x += gs[name].width * s + job["track"] * job["size"]
    out[key] = {
        "d": pen.getCommands(),
        "advance": round(x, 3),
        "bbox": [round(v, 3) for v in bounds.bounds],
    }

json.dump(out, sys.stdout)
