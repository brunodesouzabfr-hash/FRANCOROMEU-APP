const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html);
const doc = dom.window.document;

function walk(dir, excluded = new Set()) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (excluded.has(entry.name)) return [];
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(target, excluded) : [target];
  });
}

function pngDimensions(file) {
  const data = fs.readFileSync(file);
  assert.equal(data.subarray(1, 4).toString('ascii'), 'PNG', `${file} não é PNG`);
  return [data.readUInt32BE(16), data.readUInt32BE(20)];
}

function jpegDimensions(file) {
  const data = fs.readFileSync(file);
  assert.equal(data.readUInt16BE(0), 0xffd8, `${file} não é JPEG`);
  let offset = 2;
  while (offset < data.length) {
    if (data[offset] !== 0xff) { offset += 1; continue; }
    const marker = data[offset + 1];
    if (marker >= 0xc0 && marker <= 0xc3) {
      return [data.readUInt16BE(offset + 7), data.readUInt16BE(offset + 5)];
    }
    offset += 2 + data.readUInt16BE(offset + 2);
  }
  throw new Error(`dimensões JPEG não encontradas em ${file}`);
}

function webpDimensions(file) {
  const data = fs.readFileSync(file);
  assert.equal(data.subarray(0, 4).toString('ascii'), 'RIFF', `${file} não é RIFF`);
  assert.equal(data.subarray(8, 12).toString('ascii'), 'WEBP', `${file} não é WebP`);
  assert.equal(data.subarray(12, 16).toString('ascii'), 'VP8 ', `${file} usa WebP inesperado`);
  return [data.readUInt16LE(26) & 0x3fff, data.readUInt16LE(28) & 0x3fff];
}

function localAsset(url) {
  const value = new URL(url, 'https://francoromeu-app.vercel.app/');
  assert.equal(value.origin, 'https://francoromeu-app.vercel.app');
  return value.pathname.replace(/^\//, '');
}

test('unifica domínio, metadados sociais, JSON-LD e roteador SPA', () => {
  const origin = 'https://francoromeu-app.vercel.app';
  assert.equal(doc.querySelector('link[rel="canonical"]').href, `${origin}/`);
  assert.equal(doc.querySelector('meta[property="og:url"]').content, `${origin}/`);
  assert.equal(doc.querySelector('meta[property="og:image"]').content, `${origin}/assets/social/franco-romeu-og-site-1200x630.jpg`);
  assert.equal(doc.querySelector('meta[name="twitter:image"]').content, `${origin}/assets/social/franco-romeu-og-site-1200x630.jpg`);

  const graph = JSON.parse(doc.querySelector('#fr-seo-structured-data').textContent)['@graph'];
  const localBusiness = graph.find(node => Array.isArray(node['@type']) && node['@type'].includes('LocalBusiness'));
  assert.equal(localBusiness.logo.url, `${origin}/assets/brand/franco-romeu-logo-remaster-800.webp`);
  assert.equal(localBusiness.image, `${origin}/assets/social/franco-romeu-og-site-1200x630.jpg`);
  assert.deepEqual(localBusiness.sameAs, [
    'https://instagram.com/francoromeu.fr',
    'https://www.pinterest.com/FrancoRomeu',
    'https://wa.me/5511990021603'
  ]);
  assert.match(doc.querySelector('#fr-seo-spa-router').textContent, /origin='https:\/\/francoromeu-app\.vercel\.app'/);
});

test('favicons, PWA e derivados remasterizados existem nas dimensões corretas', () => {
  const expectedPng = new Map([
    ['assets/icons/favicon-16x16.png', [16, 16]],
    ['assets/icons/favicon-32x32.png', [32, 32]],
    ['assets/icons/apple-touch-icon.png', [180, 180]],
    ['assets/icons/icon-192x192.png', [192, 192]],
    ['assets/icons/icon-512x512.png', [512, 512]]
  ]);
  for (const [file, dimensions] of expectedPng) {
    assert.ok(fs.existsSync(file), `asset ausente: ${file}`);
    assert.deepEqual(pngDimensions(file), dimensions, `dimensão incorreta: ${file}`);
  }

  const expectedWebp = new Map([
    ['assets/brand/franco-romeu-logo-remaster-384.webp', [384, 384]],
    ['assets/brand/franco-romeu-logo-remaster-800.webp', [800, 800]],
    ['assets/brand/franco-romeu-profile-remaster-256.webp', [256, 256]]
  ]);
  for (const [file, dimensions] of expectedWebp) {
    assert.ok(fs.existsSync(file), `asset ausente: ${file}`);
    assert.deepEqual(webpDimensions(file), dimensions, `dimensão incorreta: ${file}`);
    assert.ok(fs.statSync(file).size < 200 * 1024, `derivado WebP excessivo: ${file}`);
  }

  assert.deepEqual(jpegDimensions('assets/social/franco-romeu-og-site-1200x630.jpg'), [1200, 630]);
  assert.ok(fs.statSync('assets/social/franco-romeu-og-site-1200x630.jpg').size < 200 * 1024);

  const ico = fs.readFileSync('favicon.ico');
  assert.equal(ico.readUInt16LE(0), 0);
  assert.equal(ico.readUInt16LE(2), 1);
  assert.equal(ico.readUInt16LE(4), 6);

  const referencedIcons = [...doc.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]')]
    .map(link => localAsset(link.href));
  assert.ok(!referencedIcons.some(file => file.endsWith('.svg')), 'favicon vetorial legado ainda referenciado');
  referencedIcons.forEach(file => assert.ok(fs.existsSync(file), `favicon referenciado ausente: ${file}`));

  const manifest = JSON.parse(fs.readFileSync('site.webmanifest', 'utf8'));
  assert.deepEqual(manifest.icons.map(icon => icon.src), [
    'assets/icons/icon-192x192.png',
    'assets/icons/icon-512x512.png'
  ]);
  manifest.icons.forEach(icon => assert.ok(fs.existsSync(icon.src), `ícone PWA ausente: ${icon.src}`));
});

test('superfícies de marca usam os masters aprovados e recipiente circular sem distorção', () => {
  assert.equal(doc.querySelector('#loader img').getAttribute('src'), 'assets/brand/franco-romeu-logo-remaster-384.webp');
  assert.equal(doc.querySelector('#smart-nav-brand img').getAttribute('src'), 'assets/brand/franco-romeu-profile-remaster-256.webp');
  assert.match(html, /criarConteudoPDF[\s\S]*?franco-romeu-profile-remaster-256\.webp/);
  assert.match(html, /renderHeader[\s\S]*?franco-romeu-profile-remaster-256\.webp/);
  assert.match(html, /renderFooter[\s\S]*?franco-romeu-logo-remaster-384\.webp/);
  assert.doesNotMatch(html, /assets\/brand\/[^"']*(?:logomark|lockup|selo)[^"']*\.svg/i);

  const css = doc.querySelector('#fr-brand-remaster-css').textContent;
  assert.match(css, /\.fr-brand-circle\{[^}]*aspect-ratio:1\/1[^}]*border-radius:50%[^}]*overflow:hidden/);
  assert.match(css, /\.fr-brand-circle>img\{[^}]*object-fit:cover[^}]*object-position:center/);
  assert.match(css, /\.fr-brand-circle--contain>img\{[^}]*object-fit:contain!important[^}]*object-position:center!important/);
  assert.match(css, /#smart-nav\.nav-state-header #smart-nav-brand,[\s\S]*?min-width:44px!important[^}]*min-height:44px!important/);
  assert.match(css, /#smart-nav\.nav-state-header #fr-global-search-nav,[\s\S]*?min-width:44px!important[^}]*min-height:44px!important[^}]*aspect-ratio:1\/1!important/);

  const staticCircles = [
    doc.querySelector('#loader img'),
    doc.querySelector('#smart-nav-brand img'),
    doc.querySelector('#header-container img'),
    doc.querySelector('#footer-container img')
  ];
  staticCircles.forEach(image => assert.ok(image.closest('.fr-brand-circle'), `imagem sem recipiente circular: ${image?.outerHTML}`));
});

test('mantém um único h1 e alt em todas as imagens declaradas', () => {
  assert.equal((html.match(/<h1\b/gi) || []).length, 1);
  assert.equal((html.match(/<\/h1>/gi) || []).length, 1);
  assert.match(html, /<h1[^>]+id="hero-title"/i);
  for (const id of ['p3d-main-title', 'proj-title', 'orc-main-title', 'fr15-portfolio-title', 'fr16-portfolio-title']) {
    assert.match(html, new RegExp(`<h2[^>]+id=["']${id}["']`, 'i'), `heading semântico ausente: ${id}`);
  }
  assert.match(html, /<h2[^>]*>[\s\S]*?id="sw1"/i);

  const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)].map(match => match[0]);
  assert.ok(imageTags.length > 30);
  imageTags.forEach(tag => assert.match(tag, /\balt\s*=/i, `imagem sem alt: ${tag}`));
});

test('HTML-fonte declara o GodMode fechado antes do JavaScript', () => {
  const panel = doc.querySelector('#god-mode-panel');
  const backdrop = doc.querySelector('#gm-backdrop');
  assert.equal(doc.body.classList.contains('god-mode-active'), false);
  assert.equal(doc.body.classList.contains('fr16-popup-lock'), false);
  assert.equal(panel.classList.contains('fr10-gm-open'), false);
  assert.equal(panel.classList.contains('translate-x-full'), true);
  assert.equal(panel.getAttribute('aria-hidden'), 'true');
  assert.equal(panel.style.transform, 'translateX(100%)');
  assert.equal(panel.style.visibility, 'hidden');
  assert.equal(panel.style.pointerEvents, 'none');
  assert.equal(backdrop.classList.contains('fr10-gm-open'), false);
  assert.equal(backdrop.classList.contains('hidden'), true);
  assert.equal(backdrop.classList.contains('opacity-0'), true);
  assert.equal(backdrop.getAttribute('aria-hidden'), 'true');
  assert.equal(backdrop.style.display, 'none');
});

test('exportador remove locks, foco e estados transitórios do clone', () => {
  const script = [...doc.querySelectorAll('script')].find(node => node.textContent.includes('window.gmDownloadFinalHTML = function()'));
  assert.ok(script, 'script do exportador não encontrado');
  const start = script.textContent.indexOf('window.gmDownloadFinalHTML = function()');
  const endMarker = '\n};\n\n// ── UTIL';
  const end = script.textContent.indexOf(endMarker, start);
  assert.notEqual(end, -1, 'fim do exportador não encontrado');
  const functionSource = script.textContent.slice(start, end + 3);

  const exportDom = new JSDOM(`<!doctype html><html><head></head><body class="god-mode-active fr16-popup-lock fr-motion-modal-open" style="overflow:hidden;position:fixed;top:-120px;left:0;right:0;width:100%" data-fr-motion-lock-y="120">
    <main inert><input autofocus></main>
    <aside id="god-mode-panel" class="fr10-gm-open" aria-hidden="false" style="transform:none;visibility:visible;pointer-events:auto"></aside>
    <div id="gm-backdrop" class="fr10-gm-open" aria-hidden="false" style="display:block;opacity:1;visibility:visible;pointer-events:auto"></div>
    <div id="project-modal" class="open" aria-hidden="false"></div>
    <div id="amb-detail-overlay" class="open visible" aria-hidden="false"></div>
    <div id="fr-ai-root" class="is-open" aria-hidden="false"></div>
    <div id="fr15-p3d-inspector" class="is-open" aria-hidden="false"></div>
    <div id="fr15-amb-project" class="is-open" aria-hidden="false"></div>
    <div id="fr16-amb-dossier" class="is-open" aria-hidden="false"></div>
    <div id="iqe-overlay"></div><div id="modal-backdrop"></div><div class="admin-overlay"></div>
  </body></html>`, { runScripts: 'outside-only', url: 'https://francoromeu-app.vercel.app/' });
  const win = exportDom.window;
  let exportedHtml = '';
  win.gmCore = () => ({ saveAdminData() {} });
  win.gmApplyStoredStyle = () => {};
  win.gmToast = () => {};
  win.Blob = function Blob(parts) { exportedHtml = parts.join(''); };
  win.URL.createObjectURL = () => 'blob:fr-test';
  win.URL.revokeObjectURL = () => {};
  win.HTMLAnchorElement.prototype.click = () => {};
  win.eval(functionSource);
  win.gmDownloadFinalHTML();

  const exportedDoc = new JSDOM(exportedHtml).window.document;
  const body = exportedDoc.body;
  const panel = exportedDoc.querySelector('#god-mode-panel');
  const backdrop = exportedDoc.querySelector('#gm-backdrop');
  assert.equal(body.classList.contains('god-mode-active'), false);
  assert.equal(body.classList.contains('fr16-popup-lock'), false);
  assert.equal(body.classList.contains('fr-motion-modal-open'), false);
  ['overflow', 'position', 'top', 'left', 'right', 'width'].forEach(prop => assert.equal(body.style.getPropertyValue(prop), ''));
  assert.equal(body.hasAttribute('data-fr-motion-lock-y'), false);
  assert.equal(panel.classList.contains('fr10-gm-open'), false);
  assert.equal(panel.classList.contains('translate-x-full'), true);
  assert.equal(panel.getAttribute('aria-hidden'), 'true');
  assert.equal(backdrop.classList.contains('fr10-gm-open'), false);
  assert.equal(backdrop.classList.contains('hidden'), true);
  assert.equal(backdrop.classList.contains('opacity-0'), true);
  assert.equal(backdrop.getAttribute('aria-hidden'), 'true');
  assert.equal(exportedDoc.querySelector('#project-modal').classList.contains('open'), false);
  assert.equal(exportedDoc.querySelector('#amb-detail-overlay').classList.contains('visible'), false);
  assert.equal(exportedDoc.querySelector('#fr-ai-root').classList.contains('is-open'), false);
  assert.equal(exportedDoc.querySelector('#fr16-amb-dossier').hasAttribute('hidden'), true);
  assert.equal(exportedDoc.querySelector('#iqe-overlay'), null);
  assert.equal(exportedDoc.querySelector('#modal-backdrop'), null);
  assert.equal(exportedDoc.querySelector('.admin-overlay'), null);
  assert.equal(exportedDoc.querySelector('[autofocus]'), null);
  assert.equal(exportedDoc.querySelector('[inert]'), null);
});

test('não conserva domínio antigo, i.ibb.co nem altera assets/media', () => {
  const textFiles = walk('.', new Set(['.git', '.codex-input', 'node_modules']))
    .filter(file => path.resolve(file) !== __filename)
    .filter(file => !/\.(?:avif|gif|ico|jpe?g|png|webp|woff2?)$/i.test(file));
  for (const file of textFiles) {
    const contents = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(contents, /francoromeu\.com\.br/i, `domínio antigo em ${file}`);
    assert.doesNotMatch(contents, /i\.ibb\.co/i, `host externo em ${file}`);
  }

  const media = walk('assets/media').sort();
  const digest = crypto.createHash('sha256');
  for (const file of media) {
    digest.update(file);
    digest.update('\0');
    digest.update(fs.readFileSync(file));
  }
  assert.equal(media.length, 138);
  assert.equal(digest.digest('hex'), '278c3cea5684fc4445d4f34dcb5c738acc4f85fba25398a1134a05c719f2e0ae');
});
