"""
Recorta las fuentes de src/assets/fonts/originales/ a lo que la web usa.

Las originales son las de Google Fonts (subset `latin`, variables). Aquí se
limita el eje de peso a los pesos que usa el CSS y se quitan los glifos y
features OpenType que no aparecen (fracciones, numeradores, cirílico...).
Resultado: 128 KB -> 84 KB en las 4 fuentes, que PageSpeed móvil mete en la
cadena del LCP (el H1 es texto).

Si se añade texto con un carácter nuevo (p. ej. ç, ö, ß) y sale con la fuente
de respaldo, añadirlo a EXTRA y volver a ejecutar:

    python3 -m venv /tmp/ft && /tmp/ft/bin/pip install fonttools brotli
    /tmp/ft/bin/python scripts/subset-fonts.py
"""
import io
import os
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "fonts")

# ASCII imprimible + lo que el sitio muestra en español e inglés, con margen.
TEXT = "".join(chr(c) for c in range(0x20, 0x7F))
EXTRA = "ÁÉÍÓÚÜÑáéíóúüñàèç¿¡«»“”‘’‚„•·…–—°ºª²€$£₡©®™×÷≈→←↑↓✓✔★"
TEXT += EXTRA

FONTS = [
    # (original, salida, rango de wght o None, features que se conservan)
    ("manrope.woff2", "manrope-latin-es.woff2", (400, 700), ["kern", "liga", "calt", "locl"]),
    ("cormorant.woff2", "cormorant-latin-es.woff2", (400, 600), ["kern", "liga", "calt", "locl", "ccmp", "lnum"]),
    ("cormorant-italic.woff2", "cormorant-italic-latin-es.woff2", (400, 600), ["kern", "liga", "calt", "locl", "ccmp", "lnum"]),
    ("great-vibes.woff2", "great-vibes-latin-es.woff2", None, ["kern", "liga", "calt", "locl", "ccmp", "init", "fina"]),
]

for src, out, wght, feats in FONTS:
    font = TTFont(os.path.join(ROOT, "originales", src), lazy=False)
    if wght:
        font = instancer.instantiateVariableFont(font, {"wght": wght})
        # Recargar: el subsetter falla sobre la fuente recién instanciada.
        buf = io.BytesIO()
        font.flavor = None
        font.save(buf)
        buf.seek(0)
        font = TTFont(buf, lazy=False)

    opts = subset.Options()
    opts.layout_features = feats
    opts.flavor = "woff2"
    opts.name_IDs = ["*"]
    opts.name_languages = ["*"]
    opts.notdef_outline = True
    opts.hinting = False
    opts.desubroutinize = True
    subsetter = subset.Subsetter(opts)
    subsetter.populate(text=TEXT)
    subsetter.subset(font)

    dest = os.path.join(ROOT, out)
    font.flavor = "woff2"
    font.save(dest)
    before = os.path.getsize(os.path.join(ROOT, "originales", src)) / 1024
    after = os.path.getsize(dest) / 1024
    print(f"{out:34s} {before:5.1f} KB -> {after:5.1f} KB")
