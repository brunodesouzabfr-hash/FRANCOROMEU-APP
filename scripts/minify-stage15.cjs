'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { minify } = require('terser');
const { transform } = require('lightningcss');

const root = path.resolve(__dirname, '..');
const sourceName = 'FRANCO_ROMEU_ETAPA15_SITES_INDIVIDUAIS.html';
const outputName = 'FRANCO_ROMEU_ETAPA15_SITES_INDIVIDUAIS.min.html';
const sourcePath = [path.join(root, sourceName), path.join(root, 'base-original', sourceName)]
  .find(candidate => fs.existsSync(candidate));
if (!sourcePath) throw new Error(`Fonte não localizada: ${sourceName}`);
const outputPath = path.join(path.dirname(sourcePath), outputName);

async function minifyScripts(html) {
  const blocks = [];
  html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (full, attrs, body) => {
    blocks.push({ full, attrs, body });
    return full;
  });

  for (const block of blocks) {
    if (/\bsrc\s*=/i.test(block.attrs) || !block.body.trim()) continue;
    let code = block.body;
    try {
      if (/application\/ld\+json/i.test(block.attrs)) {
        code = JSON.stringify(JSON.parse(block.body));
      } else {
        const result = await minify(block.body, {
          compress: false,
          mangle: false,
          format: { comments: false, semicolons: true }
        });
        code = result.code || block.body;
      }
    } catch (error) {
      process.stderr.write(`Aviso: script preservado sem minificar (${error.message})\n`);
    }
    const replacement = `<script${block.attrs}>${code}</script>`;
    html = html.replace(block.full, () => replacement);
  }
  return html;
}

function minifyStyles(html) {
  return html.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi, (full, attrs, body) => {
    try {
      const result = transform({
        filename: 'inline.css',
        code: Buffer.from(body),
        minify: true,
        sourceMap: false
      });
      return `<style${attrs}>${result.code.toString()}</style>`;
    } catch (error) {
      process.stderr.write(`Aviso: CSS preservado sem minificar (${error.message})\n`);
      return full;
    }
  });
}

function minifyMarkup(html) {
  return html
    .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .replace(/[\t ]{2,}/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

(async () => {
  let html = fs.readFileSync(sourcePath, 'utf8');
  html = await minifyScripts(html);
  html = minifyStyles(html);
  html = minifyMarkup(html);
  fs.writeFileSync(outputPath, html);
  process.stdout.write(`${outputPath}\n${Buffer.byteLength(html)} bytes\n`);
})().catch(error => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
