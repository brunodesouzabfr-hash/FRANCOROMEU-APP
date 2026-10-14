'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const delivery = '/home/romeu/Downloads/ENTREGA_FRANCO_ROMEU/08_SITE';
const contexts = path.resolve('IMAGENS/leiamecodex');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const field = (text, label) => text.match(new RegExp('\\*\\*' + label + ':\\*\\* ([^\\r\\n]+)'))?.[1];
const w = {}; vm.runInNewContext(fs.readFileSync(path.join(delivery, 'media-catalog.js'), 'utf8'), { window: w }, { timeout: 1000 });
const catalog = w.FR_MEDIA_CATALOG;
if (catalog.assets.length !== 57 || catalog.real_execution_proven !== false || catalog.model_3d !== null) throw new Error('Classificação da entrega incompatível');
const assets = [];
const contextCopies = [];
function preserveContext(file) {
  const destination = path.join('docs/site-refactor/media-context', path.basename(file));
  contextCopies.push({ source:file,destination });return destination;
}
for (const asset of catalog.assets) {
  const fichaFile = path.join(contexts, path.basename(asset.ficha));
  const ficha = fs.readFileSync(fichaFile, 'utf8');
  const releasedContext = preserveContext(fichaFile);
  if (!['aprovado', 'candidato'].includes(field(ficha, 'Estado')) || field(ficha, 'Rótulo público obrigatório') !== asset.publication_label || field(ficha, 'SHA-256 da fonte') !== asset.source_hash || asset.status !== 'READY_WITH_LABEL') throw new Error('Ficha não autoriza: ' + asset.media_id);
  const native = field(ficha, 'Dimensões do arquivo entregue').match(/(\d+) × (\d+)/).slice(1).map(Number);
  const variants = [];
  for (const variant of asset.variants) {
    if (!/^assets\/media\/fr-coz-lav\/[\w-]+\.webp$/.test(variant.file)) throw new Error('Caminho inválido');
    const original = path.join(delivery, variant.file), variantContext = path.join(contexts, path.basename(variant.file, '.webp') + '.md'), variantFicha = fs.readFileSync(variantContext, 'utf8');
    preserveContext(variantContext);
    const dimensions = execFileSync('identify', ['-format', '%w %h', original], { encoding: 'utf8' }).split(' ').map(Number);
    if (hash(original) !== field(variantFicha, 'SHA-256 do arquivo entregue') || dimensions[0] !== variant.width || dimensions[1] !== variant.height || variant.width > native[0] || variant.height > native[1] || variant.crop_box !== null) throw new Error('Derivado inválido: ' + variant.file);
    if (asset.media_id === 'M047_PANEL_DIREITO' && variant.width > 472) throw new Error('R119P ampliado');
    variants.push({ ...variant, sha256: hash(original), bytes: fs.statSync(original).size });
  }
  assets.push({ id: asset.media_id, context: releasedContext, contextSha256:hash(fichaFile), sourceContext:path.relative(process.cwd(), fichaFile), sourceHash: asset.source_hash, label: asset.publication_label, state: field(ficha, 'Estado'), native, variants });
}
// Copy only validated, explicitly released derivatives; no masters or HOLD paths.
for (const asset of assets) for (const v of asset.variants) { fs.mkdirSync(path.dirname(v.file), { recursive: true }); fs.copyFileSync(path.join(delivery, v.file), v.file); }
for (const context of contextCopies) { fs.mkdirSync(path.dirname(context.destination),{recursive:true});fs.copyFileSync(context.source,context.destination); }
fs.mkdirSync('assets/js', { recursive: true });
fs.copyFileSync(path.join(delivery, 'media-catalog.js'), 'assets/js/media-catalog.js');
// Do not overwrite the reviewed integration with the delivery template on reruns.
if (!fs.existsSync('assets/js/fr-media-case.js')) fs.copyFileSync(path.join(delivery, 'fr-media-case.js'), 'assets/js/fr-media-case.js');
fs.mkdirSync('docs/site-refactor', { recursive: true });
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]); }
const originals = walk('IMAGENS').filter(name => name.endsWith('.png')).map(file => ({ file, sha256: hash(file), publication: 'not_published_original' }));
fs.writeFileSync('docs/site-refactor/case-media-verification.json', JSON.stringify({ verifiedAt: new Date().toISOString(), delivery, originalCount: originals.length, originals, assets, holdPublished: 0, documentaryExecutionProven: false, model3D: null }, null, 2));
console.log(JSON.stringify({ releasedAssets: assets.length, variants: assets.reduce((n,a) => n+a.variants.length, 0), originals: originals.length, holdPublished: 0 }));
