#!/usr/bin/env python3
"""Strict full decoding. Never enables Pillow truncated-image tolerance."""
import json, sys
from PIL import Image, ImageOps

results = []
for row in json.load(sys.stdin):
    result = dict(row)
    try:
        with Image.open(row['file']) as image:
            image.load()
            oriented = ImageOps.exif_transpose(image)
            result.update(decode_ok=True, width=oriented.width, height=oriented.height,
                          format=image.format, artist=image.getexif().get(315),
                          copyright=image.getexif().get(33432))
    except Exception as error:
        result.update(decode_ok=False, error=str(error))
    results.append(result)
json.dump(results, sys.stdout, ensure_ascii=False)
