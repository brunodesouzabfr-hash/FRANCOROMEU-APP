'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const directory = 'assets/optimized';
const original = 'assets/media/home-hero-2200.jpg';
fs.mkdirSync(directory, { recursive: true });
const hash = crypto.createHash('sha256').update(fs.readFileSync(original)).digest('hex');
const media = { id: 'fr-home-hero', original, originalSha256: hash, nature: 'reference-visual-not-execution', context: 'Home', variants: [] };
for (const width of [640, 960, 1600]) {
  for (const format of ['webp', 'avif']) {
    const temporary = path.join(directory, `hero-${width}.pending.${format}`);
    if (format === 'webp') execFileSync('convert', [original, '-auto-orient', '-resize', `${width}x>`, '-strip', '-quality', '82', temporary]);
    else execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', original, '-vf', `scale=${width}:-2`, '-frames:v', '1', '-c:v', 'libaom-av1', '-still-picture', '1', '-crf', '32', '-cpu-used', '6', '-threads', '2', '-map_metadata', '-1', temporary]);
    const data = fs.readFileSync(temporary);
    const variantHash = crypto.createHash('sha256').update(data).digest('hex');
    const target = path.join(directory, `franco-romeu-interiores-referencia-${width}.${variantHash.slice(0, 12)}.${format}`);
    const dimensions = execFileSync('identify', ['-format', '%w %h', temporary], { encoding: 'utf8' }).trim().split(' ').map(Number);
    fs.renameSync(temporary, target);
    media.variants.push({ path: target, format, width: dimensions[0], height: dimensions[1], bytes: data.length, sha256: variantHash });
  }
}
fs.writeFileSync(path.join(directory, 'media-manifest.json'), JSON.stringify(media, null, 2));
console.log(JSON.stringify(media, null, 2));
