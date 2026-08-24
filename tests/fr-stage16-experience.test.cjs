'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'FRANCO_ROMEU_ETAPA15_MATERIALIDADE_IMERSIVA.html');
const basePath = path.join(root, 'base-original', 'FRANCO_ROMEU_ETAPA14_AWWWARDS_UNIVERSES.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const base = fs.readFileSync(basePath, 'utf8');

function scriptById(source, id) {
  return source.match(new RegExp('<script id="' + id + '">([\\s\\S]*?)<\\/script>', 'i'))?.[1] || '';
}

function registryTextById(source, id) {
  const marker = `<script type="application/json" id="${id}">`;
  const start = source.indexOf(marker);
  const end = source.indexOf('</script>', start);
  assert.notEqual(start, -1, `Registro ausente: ${id}`);
  assert.notEqual(end, -1, `Fim do registro ausente: ${id}`);
  return source.slice(start + marker.length, end);
}

function registryById(source, id) {
  return JSON.parse(registryTextById(source, id));
}

function copy(value) {
  return JSON.parse(JSON.stringify(value));
}

function sourceSlice(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  assert.notEqual(start, -1, `Início de bloco ausente: ${startMarker}`);
  assert.notEqual(end, -1, `Fim de bloco ausente: ${endMarker}`);
  return source.slice(start, end);
}

const socialPolicy = {
  loadMode: 'click_to_load',
  externalScriptsAtFirstPaint: false,
  consentRequired: true,
  allowRawHtml: false,
  showSyntheticMetrics: false
};

const pricingContexts = [
  'cidade_regiao',
  'tipologia',
  'metragem',
  'imovel_ocupado',
  'condicao_instalacoes',
  'padrao_materiais',
  'prazo_janela',
  'logistica_acesso',
  'inclusoes_exclusoes'
];

function pointer(window, target, type, values) {
  const event = new window.Event(type, { bubbles: true, cancelable: true });
  Object.entries(values).forEach(([key, value]) => Object.defineProperty(event, key, { value }));
  target.dispatchEvent(event);
  return event;
}

function assertClose(actual, expected, tolerance = 0.011) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≉ ${expected}`);
}

async function waitFor(predicate, timeout = 2000) {
  const deadline = Date.now() + timeout;
  while (!predicate() && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 25));
  return predicate();
}

test('adiciona uma única camada tardia e preserva os motores protegidos', () => {
  assert.equal((html.match(/id="fr-stage16-experience-css"/g) || []).length, 1);
  assert.equal((html.match(/id="fr-stage16-experience-engine"/g) || []).length, 1);
  assert.ok(html.indexOf('id="fr-stage16-experience-engine"') > html.indexOf('id="fr-stage15-materialidade-engine"'));
  assert.ok(html.indexOf('id="fr-stage16-experience-engine"') < html.lastIndexOf('</body>'));
  for (const id of ['fr-stage2-portfolio-engine', 'fr-pdf-stack-loader', 'fr-budget-core']) {
    assert.ok(scriptById(base, id).length > 1000, 'Motor ausente na base: ' + id);
    assert.equal(scriptById(html, id), scriptById(base, id), 'Motor protegido alterado: ' + id);
  }
});

test('incorpora registros CP2 inertes, únicos e coerentes com as fontes', () => {
  const social = registryById(html, 'fr16-social-registry');
  const pricing = registryById(html, 'fr16-pricing-registry');
  const ambientes = registryById(html, 'fr16-ambientes-content-registry');
  for (const id of ['fr16-social-registry', 'fr16-pricing-registry', 'fr16-ambientes-content-registry']) {
    assert.doesNotMatch(registryTextById(html, id), /</, `${id} deve escapar qualquer sinal de menor que como \\u003c`);
  }
  const parsed = new JSDOM(html);
  try {
    const ids = Array.from(parsed.window.document.querySelectorAll('[id]'), node => node.id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    assert.deepEqual(duplicates, []);
    assert.equal(parsed.window.document.querySelectorAll('#fr16-social-registry').length, 1);
    assert.equal(parsed.window.document.querySelectorAll('#fr16-pricing-registry').length, 1);
    assert.equal(parsed.window.document.querySelectorAll('#fr16-ambientes-content-registry').length, 1);
    assert.equal(parsed.window.document.querySelectorAll('.fr16-social-card,[data-fr16-load-embed]').length, 0);
  } finally {
    parsed.window.close();
  }

  assert.equal(social.schemaVersion, '1.0');
  assert.deepEqual(social.policy, socialPolicy);
  assert.deepEqual(social.items.map(item => item.provider), ['instagram', 'tiktok', 'youtube', 'facebook', 'pinterest', 'x']);
  assert.deepEqual(social.items.map(item => item.order), [10, 20, 30, 40, 50, 60]);
  assert.equal(new Set(social.items.map(item => item.id)).size, 6);
  assert.ok(social.items.every(item => item.status === 'placeholder' && item.permalink === null && item.externalId === null && item.poster === null));

  assert.equal(pricing.schemaVersion, '1.0');
  assert.equal(pricing.status, 'pending_validation');
  assert.equal(new Set(pricing.ranges.map(range => range.id)).size, 4);
  assert.ok(pricing.ranges.every(range => range.scope === null && range.min === null && range.max === null));

  const expectedAmbientes = ['mansory', 'industrial', 'contemporaneo', 'minimalista', 'rustico', 'brutalismo', 'classico-contemporaneo', 'japandi', 'art-deco', 'tropical-modern', 'wabi-sabi', 'ecletico-autoral'].sort();
  assert.deepEqual(Object.keys(ambientes.items).sort(), expectedAmbientes);
  assert.ok(Object.values(ambientes.items).every(item => item.status === 'draft' && !Object.hasOwn(item, 'services')));
  assert.equal(ambientes.items.mansory.nameStatus, 'pending_validation');
  assert.equal(ambientes.items.mansory.alternativeName, 'Maximalismo de Precisão');

  const stage15End = html.indexOf('</script>', html.indexOf('id="fr-stage15-materialidade-engine"'));
  const socialStart = html.indexOf('id="fr16-social-registry"');
  const engineStart = html.indexOf('id="fr-stage16-experience-engine"');
  assert.ok(stage15End < socialStart && socialStart < engineStart);
  assert.ok(!html.slice(socialStart, engineStart).includes('</script><script>'));
});

test('preserva a abertura CP3 e acrescenta o arquivo editorial CP4 sem substituir contratos', () => {
  const stage16 = scriptById(html, 'fr-stage16-experience-engine');
  const stage15 = scriptById(html, 'fr-stage15-materialidade-engine');
  assert.match(stage16, /version:'16\.6-checkpoint6'/);
  assert.match(stage16, /section\.id='fr16-portfolio'/);
  assert.match(stage16, /Array\.isArray\(w\.GM_PROJECTS\)\?w\.GM_PROJECTS/);
  assert.match(stage16, /typeof w\.openProjectModal==='function'/);
  assert.match(stage16, /data-fr16-project/);
  assert.match(stage16, /function drawCanvas\(\)/);
  const canvasRenderer = stage16.slice(stage16.indexOf('function drawCanvas()'), stage16.indexOf('function shouldAnimateCanvas()'));
  assert.doesNotMatch(canvasRenderer, /drawImage|fillText|strokeText|new Image/);
  assert.match(html, /\.fr16-portfolio-canvas\{[^}]*pointer-events:none!important/);
  assert.match(html, /\.fr16-portfolio-rail\{[^}]*scroll-snap-type:x mandatory/);
  for (const token of [
    '--fr16-carbon:var(--frx-carbon,#121318)',
    '--fr16-petroleum:var(--frx-petrol,#043451)',
    '--fr16-gold:var(--frx-gold,#F6A700)',
    '--fr16-copper:var(--frx-leather,#C8986A)',
    '--fr16-wine:var(--frx-bordeaux,#8F1133)',
    '--fr16-bone:var(--frx-bone,#E6D6B5)'
  ]) assert.ok(html.includes(token), `Token FR ausente: ${token}`);
  assert.match(stage16, /colors:\['#F6A700','#C8986A','#8F1133','#043451'\]/);
  assert.match(stage16, /getPropertyValue\(token\)/);
  assert.doesNotMatch(stage16, /aria-posinset|aria-setsize/);
  assert.doesNotMatch(stage16, /image\.loading=.*eager/);
  assert.match(html, /env\(safe-area-inset-left\)/);
  assert.match(html, /env\(safe-area-inset-right\)/);
  assert.match(html, /env\(safe-area-inset-bottom\)/);
  assert.match(stage15, /if\(active\)\{if\(!portfolioState\.spiralImages\.length\)loadSpiralImages\(\)/);
  const legacyInstall = stage15.slice(stage15.indexOf('function installPortfolioUniverse()'), stage15.indexOf('var AMB_TECH='));
  assert.doesNotMatch(legacyInstall, /loadSpiralImages\(\)/);
  assert.match(html, /@media\(max-width:900px\)\{[\s\S]*?@supports not \(scroll-snap-type:x mandatory\)\{\.fr16-portfolio-rail\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)\}\}/);
  assert.match(html, /@media\(max-width:767px\)\{[\s\S]*?@supports not \(scroll-snap-type:x mandatory\)\{\.fr16-portfolio-rail\{grid-template-columns:1fr;margin-inline:0;padding-inline:0\}\}/);
  assert.match(html, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(stage15, /window\.__FR_STAGE16__&&window\.__FR_STAGE16__\.portfolioActive===true/);
  assert.match(stage15, /frStage16PortfolioModeChanged/);
  assert.match(html, /portfolioReplaced=view\?\.id==='view-projetos'&&window\.__FR_STAGE16__\?\.portfolioActive===true/);
  assert.match(html, /id==='view-projetos'&&portfolioReplaced/);
  assert.match(html, /addEventListener\('frStage16PortfolioModeChanged'/);
  for (const copy of [
    'PORTFÓLIO / MATÉRIA EM MOVIMENTO',
    'O invisível sustenta <span>cada transformação.</span>',
    'Antes da imagem final, existe uma sequência de decisões:',
    'Role para percorrer · arraste para investigar · use as setas para navegar.',
    'Deslize os projetos ou continue rolando.',
    'A fotografia mostra a chegada. O projeto explica o caminho.',
    'Uma reforma não é a soma de acabamentos.',
    'Medir não é apenas registrar largura e altura.',
    'Elétrica, hidráulica, iluminação, revestimento e mobiliário',
    'Planejar a sequência é desenhar a obra no tempo.',
    'Amostra, lote, junta, borda, veio, reflexo e manutenção',
    'Cena, temperatura, ofuscamento, facho, comando e integração',
    'Uma boa finalização inclui teste, ajuste, limpeza técnica'
  ]) assert.ok(stage16.includes(copy), `Copy CP3 ausente: ${copy}`);
  assert.match(stage16, /function FRSocialArchive\(/);
  assert.match(stage16, /function FREmbedLoader\(/);
  assert.match(stage16, /externalScriptsAtFirstPaint:false/);
  assert.doesNotMatch(html, /<(?:iframe|script)[^>]+(?:youtube-nocookie|tiktok\.com\/player|platform\.x\.com\/widgets|assets\.pinterest\.com\/js\/pinit|instagram\.com\/embed|facebook\.com\/plugins)/i);
  assert.equal((html.match(/id="fr-stage2-portfolio-engine"/g) || []).length, 1);
});

test('restaura Ambientes canônico sem alterar seu HTML ou AMB_STYLES', () => {
  const stage16 = scriptById(html, 'fr-stage16-experience-engine');
  const currentView = sourceSlice(html, '    <main id="view-ambientes"', '\n</main>');
  const baselineView = sourceSlice(base, '    <main id="view-ambientes"', '\n</main>');
  const currentStyles = sourceSlice(html, '    const AMB_STYLES = [', '    const AMB_STAGE3 =');
  const baselineStyles = sourceSlice(base, '    const AMB_STYLES = [', '    const AMB_STAGE3 =');

  assert.equal(currentView, baselineView, 'O main canônico de Ambientes deve permanecer byte a byte');
  assert.equal(currentStyles, baselineStyles, 'AMB_STYLES deve permanecer byte a byte');
  assert.equal((currentView.match(/class="amb-hero"/g) || []).length, 1);
  assert.equal((currentView.match(/class="amb-museum"/g) || []).length, 1);
  assert.equal((currentView.match(/id="amb-grid-container"/g) || []).length, 1);

  assert.match(stage16, /function FRAmbientesExperience\(\)/);
  assert.match(stage16, /refreshAmbientes:function\(\)/);
  assert.match(stage16, /function wrappedOpen\(index,options\)/);
  assert.match(stage16, /function wrappedInit\(\)/);
  assert.match(stage16, /if\(w\.openAmbDetail===wrappedOpen\)w\.openAmbDetail=legacyOpen/);
  assert.match(stage16, /if\(w\.initAmbView===wrappedInit\)w\.initAmbView=legacyInit/);
  assert.match(stage16, /id:'fr16-amb-dossier'/);
  assert.match(stage16, /'#fr16-amb-dossier'/);
  assert.match(html, /#view-ambientes\.fr16-amb-canonical>\.amb-hero\{display:flex!important\}/);
  assert.match(html, /#view-ambientes\.fr16-amb-canonical>\.fr15-amb-atlas,#view-ambientes\.fr16-amb-canonical>\.fr14-curator-desk\{display:none!important\}/);
  assert.match(html, /#view-ambientes\.fr16-amb-canonical \.amb-museum\{[^}]*display:grid!important/);
  assert.match(html, /@media\(max-width:767px\)\{[^}]*#view-ambientes\.fr16-amb-canonical \.amb-museum\{display:block!important\}/);
  assert.match(html, /@media\(prefers-reduced-motion:reduce\)\{[^}]*\.fr16-amb-row/);
  assert.match(stage16, /Referência visual — não é obra FR/);
  assert.match(stage16, /data-fr16-amb-section="thesis"/);
  assert.match(stage16, /data-fr16-amb-section="package"/);
});

test('mantém rollback por flags e limita a exceção do cubo aos símbolos autorizados', () => {
  const stage16 = scriptById(html, 'fr-stage16-experience-engine');
  const stage15 = scriptById(html, 'fr-stage15-materialidade-engine');
  for (const flag of ['cursorUnified', 'cubeDrag', 'cubeNarrativeScroll', 'portfolioUniverse', 'socialArchive', 'ambientesCanonical', 'ambientesDossier']) {
    assert.match(stage16, new RegExp(flag + ':'));
  }
  assert.match(stage16, /if\(w\.__FR_STAGE16__\)return/);
  assert.match(stage15, /window\.FR_STAGE16_FLAGS&&window\.FR_STAGE16_FLAGS\.cubeDrag===true/);
  assert.match(stage15, /addEventListener\('pointerdown',p3dPointer\)/);
  assert.match(stage15, /addEventListener\('pointerup',p3dPointer\)/);
  assert.match(stage15, /addEventListener\('pointercancel',p3dPointer\)/);
  assert.match(stage15, /addEventListener\('lostpointercapture',p3dPointer\)/);
  assert.match(stage15, /setPointerCapture/);
  assert.match(stage15, /event\.isPrimary===false\|\|event\.button!==0/);
  assert.match(stage15, /pitch=clamp\(p3dState\.pitch-dy\*\.24,-55,55\)/);
  assert.match(stage15, /!p3dState\.inViewport\|\|d\.hidden\|\|reduced\.matches/);
  assert.match(stage15, /p3dState\.visibilityObserver=new IntersectionObserver/);
  assert.match(stage15, /frStage16CubeSwipe/);
  assert.match(stage15, /swipeThreshold=swipeType==='touch'\?48:72/);
  assert.match(stage15, /addEventListener\('fr16P3DSnap'/);
  assert.match(stage15, /detail\.release===true/);
  assert.match(stage15, /p3dState\.narrativeHold=detail\.hold!==false/);
  assert.match(stage15, /cancelAnimationFrame\(p3dState\.raf\);p3dState\.raf=0/);
  assert.match(stage15, /reduced\.matches\|\|p3dState\.narrativeHold/);
  assert.match(html, /\.fr15-p3d-orbit\{touch-action:pan-y pinch-zoom\}/);
  assert.match(html, /\.fr15-p3d-orbit\.is-dragging \.fr15-p3d-cube\{transition:none!important\}/);
  assert.match(html, /\*::before,\s*\nhtml:not\(\.fr16-cursor-on\):not\(\.fr16-cursor-legacy\) \*::after\{cursor:inherit!important\}/);
  assert.match(stage16, /if\(!flags\.cubeDrag&&!flags\.cubeNarrativeScroll\)/);
  assert.match(stage16, /cubeNarrativeScroll:true/);
  assert.match(stage16, /function FRCubeNarrative\(\)/);
  assert.match(stage16, /localListen\(orbit,'wheel',wheel,\{passive:false\}\)/);
  assert.doesNotMatch(stage16, /localListen\((?:w|d|view|lab),'wheel'/);
  assert.match(stage16, /event\.ctrlKey\|\|event\.metaKey\|\|event\.shiftKey/);
  assert.match(stage16, /function canAdvance\(direction\)/);
  assert.match(stage16, /function finishBoundary\(direction\)/);
  assert.match(stage16, /function onSwipe\(event\)[\s\S]*?canAdvance\(direction\)[\s\S]*?applyPosition\(state\.position\+direction/);
  assert.doesNotMatch(stage16, /if\(event\.target\.closest\('\[data-fr16-cube-inspect\]'\)\)\{releaseSnap\(\)/);
  assert.match(stage16, /function applyPosition\(position,prefix,trigger\)[\s\S]*?dispatchSnap\(state\.index,state\.mode==='immersive'&&activeView\(\)\);render\(\)/);
  assert.match(stage16, /focusWasInDrawer[\s\S]*?if\(!target\.drawer&&focusWasInDrawer\)restoreDrawerFocus/);
  assert.match(stage16, /narrativeControl&&\['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'\]/);
  assert.match(stage16, /role="group" aria-label="Progressão por face e painel"/);
  assert.match(stage16, /localListen\(d,'keydown',documentKeydown\)/);
  assert.match(stage16, /role="region" aria-labelledby="fr16-cube-drawer-title"/);
  assert.doesNotMatch(stage16, /fr16-cube-drawer[^\n]{0,300}aria-modal/);
  assert.match(html, /@media\(min-width:1180px\) and \(min-height:900px\) and \(hover:hover\) and \(pointer:fine\)/);
  assert.match(stage16, /w\.innerWidth>=1180&&w\.innerHeight>=900/);
  assert.match(stage16, /state\.mode==='fallback'&&drawer&&drawer\.isConnected\)drawer\.scrollIntoView/);
  assert.match(stage16, /if\(options&&options\.focus\)focusNode\(drawer\.querySelector/);
  assert.match(stage16, /if\(options&&options\.focus\)restoreDrawerFocus\(returnTarget\|\|orbit\)/);
  assert.match(stage16, /requestAnimationFrame\(function\(\)\{if\(state\.drawerOpen&&state\.mode==='fallback'/);
  assert.match(stage16, /function restoreCubeDescription\(\)/);
  assert.match(stage16, /cleanupTasks\.push\(restoreCubeDescription\)/);
  assert.match(stage16, /next==='immersive'&&focusWasInFlow\)focusNode\(state\.drawerOpen\?drawer\.querySelector/);
  assert.match(html, /\.fr16-cube-control\{[^}]*min-width:44px;min-height:44px/);
});

test('mantém fallback congelado quando registros estão ausentes ou malformados', () => {
  const engine = scriptById(html, 'fr-stage16-experience-engine');
  const fixtures = [
    '',
    '<script type="application/json" id="fr16-social-registry">{json-invalido</script>'
  ];
  fixtures.forEach(markup => {
    const isolated = new JSDOM(`<!doctype html><html><body>${markup}</body></html>`, {
      runScripts: 'outside-only',
      pretendToBeVisual: true,
      url: 'https://franco-romeu.local/'
    });
    try {
      const { window } = isolated;
      window.matchMedia = query => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} });
      window.requestAnimationFrame = callback => window.setTimeout(() => callback(window.performance.now()), 0);
      window.cancelAnimationFrame = id => window.clearTimeout(id);
      window.scrollTo = () => {};
      window.AMB_STYLES = [];
      window.__frCore = { SERVICES: {} };
      assert.doesNotThrow(() => window.eval(engine));
      window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
      assert.equal(window.FR_STAGE16.version, '16.6-checkpoint6');
      assert.equal(window.FR_STAGE16.getSocialRegistry().items.length, 0);
      assert.equal(window.FR_STAGE16.getPricingRegistry().ranges.length, 0);
      assert.equal(Object.keys(window.__FR_STAGE16__.content.ambientes.items).length, 0);
      assert.ok(window.FR_STAGE16.audit().social.errors > 0);
      assert.ok(Object.isFrozen(window.FR_STAGE16.getSocialRegistry()));
      window.__FR_STAGE16__.cleanup();
    } finally {
      isolated.window.close();
    }
  });
});

test('arquivo social exige ação, limita um embed e mantém adapters externos fail-closed', async () => {
  const engine = scriptById(html, 'fr-stage16-experience-engine');
  const readySocial = {
    schemaVersion: '1.0',
    updatedAt: null,
    policy: copy(socialPolicy),
    items: [
      { id: 'fr-social-youtube-ready', provider: 'youtube', status: 'ready', series: 'Caderno oficial', title: 'Vídeo oficial validado.', format: 'video', aspectRatio: '16/9', permalink: 'https://www.youtube.com/watch?v=M7lc1UVf-VE', externalId: 'M7lc1UVf-VE', poster: null, rightsStatus: 'verified', consentRequired: true, order: 10 },
      { id: 'fr-social-tiktok-ready', provider: 'tiktok', status: 'ready', series: 'Caderno oficial', title: 'Vídeo vertical oficial validado.', format: 'video', aspectRatio: '9/16', permalink: 'https://www.tiktok.com/@franco/video/3234567890123456789', externalId: '3234567890123456789', poster: null, rightsStatus: 'verified', consentRequired: true, order: 20 },
      { id: 'fr-social-x-ready-1', provider: 'x', status: 'ready', series: 'Nota oficial', title: 'Primeira nota oficial validada.', format: 'post', aspectRatio: '1/1', permalink: 'https://x.com/franco/status/1234567890123456789', externalId: '1234567890123456789', poster: null, rightsStatus: 'verified', consentRequired: true, order: 30 },
      { id: 'fr-social-x-ready-2', provider: 'x', status: 'ready', series: 'Nota oficial', title: 'Segunda nota oficial validada.', format: 'post', aspectRatio: '1/1', permalink: 'https://x.com/franco/status/2234567890123456789', externalId: '2234567890123456789', poster: null, rightsStatus: 'verified', consentRequired: true, order: 40 },
      { id: 'fr-social-facebook-ready', provider: 'facebook', status: 'ready', series: 'Registro oficial', title: 'Registro Meta validado nos dados.', format: 'post', aspectRatio: '4/5', permalink: 'https://www.facebook.com/franco/posts/123456789', externalId: null, poster: null, rightsStatus: 'verified', consentRequired: true, order: 50 },
      { id: 'fr-social-pinterest-ready', provider: 'pinterest', status: 'ready', series: 'Referência oficial', title: 'Pin oficial validado nos dados.', format: 'pin', aspectRatio: '2/3', permalink: 'https://www.pinterest.com/pin/123456789012345678/', externalId: null, poster: null, rightsStatus: 'verified', consentRequired: true, order: 60 }
    ]
  };
  const pendingPricing = {
    schemaVersion: '1.0', status: 'pending_validation', currency: 'BRL', region: null, referenceMonth: null, approvedBy: null, disclaimer: 'Faixas dependem de escopo.', requiredContext: copy(pricingContexts),
    ranges: [{ id: 'faixa-arquivada', label: 'Faixa histórica', status: 'archived', unit: null, scope: null, min: null, max: null, includes: [], excludes: [], source: null, verifiedAt: null }]
  };
  const markup = [
    `<script type="application/json" id="fr16-social-registry">${JSON.stringify(readySocial)}</script>`,
    `<script type="application/json" id="fr16-pricing-registry">${JSON.stringify(pendingPricing)}</script>`,
    '<script type="application/json" id="fr16-ambientes-content-registry">{"schemaVersion":"1.0","items":{}}</script>',
    '<main id="view-projetos" class="view-section active"><section class="fr15-portfolio-universe"><button type="button">Legado</button></section></main>',
    '<main id="view-orcamento" class="view-section"></main>'
  ].join('');
  const isolated = new JSDOM(`<!doctype html><html><body>${markup}</body></html>`, {
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    url: 'https://franco-romeu.local/'
  });
  try {
    const { window } = isolated;
    const { document } = window;
    window.GM_PROJECTS = [];
    window.AMB_STYLES = [];
    window.__frCore = { SERVICES: {} };
    window.matchMedia = query => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} });
    window.requestAnimationFrame = callback => window.setTimeout(() => callback(window.performance.now()), 0);
    window.cancelAnimationFrame = id => window.clearTimeout(id);
    const nativeSetTimeout = window.setTimeout.bind(window);
    window.setTimeout = (callback, delay, ...args) => nativeSetTimeout(callback, delay === 10000 ? 10 : delay, ...args);
    window.HTMLElement.prototype.scrollIntoView = function() {};
    window.HTMLCanvasElement.prototype.getContext = () => null;
    const connection = { saveData: false, addEventListener() {}, removeEventListener() {} };
    Object.defineProperty(window.navigator, 'connection', { value: connection, configurable: true });
    window.switchView = id => Array.from(document.querySelectorAll('.view-section')).forEach(view => view.classList.toggle('active', view.id === id));

    assert.doesNotThrow(() => window.eval(engine));
    document.dispatchEvent(new window.Event('DOMContentLoaded'));
    assert.equal(document.querySelectorAll('.fr16-social-card').length, 6);
    assert.equal(document.querySelectorAll('#fr16-pricing-grid .fr16-pricing-card').length, 0, 'Faixa archived não deve renderizar');
    assert.equal(document.querySelectorAll('.fr16-social-embed-host iframe,script[data-fr16-provider-script]').length, 0);
    assert.equal(window.FR_STAGE16.audit().social.externalRequests, 0);

    const youtubeButton = document.querySelector('[data-fr16-load-embed="fr-social-youtube-ready"]');
    youtubeButton.focus();
    youtubeButton.click();
    const youtubeFrame = document.querySelector('iframe[data-fr16-provider-frame="youtube"]');
    assert.ok(youtubeFrame);
    assert.equal(youtubeFrame.loading, 'lazy');
    assert.match(youtubeFrame.title, /YouTube: Vídeo oficial validado/);
    assert.equal(new URL(youtubeFrame.src).hostname, 'www.youtube-nocookie.com');
    assert.match(youtubeFrame.src, /autoplay=0/);
    assert.doesNotMatch(youtubeFrame.src, /autoplay=1/);
    assert.doesNotMatch(youtubeFrame.allow, /camera|microphone|geolocation|autoplay/i);
    assert.match(youtubeFrame.getAttribute('sandbox'), /allow-scripts/);
    assert.equal(document.activeElement, youtubeButton);
    youtubeFrame.dispatchEvent(new window.Event('load'));
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.match(youtubeButton.textContent, /Remover publicação/);
    assert.equal(window.FR_STAGE16.audit().social.active, 1);

    const tiktokButton = document.querySelector('[data-fr16-load-embed="fr-social-tiktok-ready"]');
    tiktokButton.click();
    const tiktokFrame = document.querySelector('iframe[data-fr16-provider-frame="tiktok"]');
    assert.ok(tiktokFrame);
    assert.equal(new URL(tiktokFrame.src).hostname, 'www.tiktok.com');
    assert.match(tiktokFrame.src, /\/player\/v1\/3234567890123456789/);
    assert.doesNotMatch(tiktokFrame.allow, /camera|microphone|geolocation|autoplay/i);
    tiktokFrame.dispatchEvent(new window.Event('load'));
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.match(tiktokButton.textContent, /Remover publicação/);
    tiktokButton.click();
    assert.equal(document.querySelector('iframe[data-fr16-provider-frame="tiktok"]'), null);

    const firstXButton = document.querySelector('[data-fr16-load-embed="fr-social-x-ready-1"]');
    firstXButton.focus();
    firstXButton.click();
    const xScript = document.querySelector('script[data-fr16-provider-script="x"]');
    assert.ok(xScript);
    assert.equal(document.querySelectorAll('script[data-fr16-provider-script="x"]').length, 1);
    assert.equal(document.querySelector('iframe[data-fr16-provider-frame="youtube"]'), null);
    await new Promise(resolve => nativeSetTimeout(resolve, 20));
    assert.equal(document.querySelector('script[data-fr16-provider-script="x"]'), null, 'Script expirado deve ser removido');
    assert.match(firstXButton.textContent, /Tentar novamente/);
    assert.equal(firstXButton.disabled, false);

    firstXButton.click();
    const xRetryScript = document.querySelector('script[data-fr16-provider-script="x"]');
    assert.ok(xRetryScript);
    assert.notEqual(xRetryScript, xScript, 'Retry deve criar uma nova tentativa de script');
    window.twttr = { widgets: { createTweet(id, target) { const rendered = document.createElement('span'); rendered.dataset.renderedX = id; target.appendChild(rendered); return Promise.resolve(rendered); } } };
    xRetryScript.dispatchEvent(new window.Event('load'));
    await new Promise(resolve => setTimeout(resolve, 0));
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(document.activeElement, firstXButton);
    assert.match(firstXButton.textContent, /Remover publicação/);

    const secondXButton = document.querySelector('[data-fr16-load-embed="fr-social-x-ready-2"]');
    window.twttr.widgets.createTweet = () => Promise.resolve(undefined);
    secondXButton.click();
    await new Promise(resolve => setTimeout(resolve, 0));
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.match(secondXButton.textContent, /Tentar novamente/);
    assert.equal(window.FR_STAGE16.audit().social.active, 0, 'Widget vazio não pode ser marcado como pronto');
    window.twttr.widgets.createTweet = (id, target) => { const rendered = document.createElement('span'); rendered.dataset.renderedX = id; target.appendChild(rendered); return Promise.resolve(rendered); };
    secondXButton.click();
    await new Promise(resolve => setTimeout(resolve, 0));
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(document.querySelectorAll('script[data-fr16-provider-script="x"]').length, 1);
    assert.equal(document.querySelectorAll('[data-rendered-x]').length, 1);
    assert.equal(document.querySelector('[data-rendered-x]').dataset.renderedX, '2234567890123456789');
    assert.match(firstXButton.textContent, /Carregar publicação/);
    assert.equal(window.FR_STAGE16.audit().social.active, 1);
    secondXButton.click();
    assert.equal(window.FR_STAGE16.audit().social.active, 0);

    youtubeButton.click();
    const failedFrame = document.querySelector('iframe[data-fr16-provider-frame="youtube"]');
    assert.ok(failedFrame);
    failedFrame.dispatchEvent(new window.Event('error'));
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(document.querySelector('iframe[data-fr16-provider-frame="youtube"]'), null);
    assert.match(youtubeButton.closest('.fr16-social-card').querySelector('.fr16-social-state').textContent, /Não foi possível carregar/);
    assert.equal(window.FR_STAGE16.audit().social.active, 0);
    assert.equal(secondXButton.disabled, false);

    const facebookButton = document.querySelector('[data-fr16-load-embed="fr-social-facebook-ready"]');
    assert.equal(facebookButton.disabled, true);
    facebookButton.click();
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(document.querySelector('iframe[data-fr16-provider-frame="facebook"]'), null);
    assert.equal(document.querySelector('script[data-fr16-provider-script="instagram"]'), null);
    assert.match(facebookButton.closest('.fr16-social-card').querySelector('.fr16-social-state').textContent, /Adaptador aguardando verificação oficial/);
    assert.equal(facebookButton.closest('.fr16-social-card').querySelector('.fr16-social-fallback').rel, 'noopener noreferrer');
    const pinterestButton = document.querySelector('[data-fr16-load-embed="fr-social-pinterest-ready"]');
    assert.equal(pinterestButton.disabled, true);
    assert.match(pinterestButton.closest('.fr16-social-card').querySelector('.fr16-social-state').textContent, /Adaptador aguardando verificação oficial/);
    assert.equal(pinterestButton.closest('.fr16-social-card').querySelector('.fr16-social-fallback').rel, 'noopener noreferrer');
    assert.equal(window.FR_STAGE16.audit().social.externalRequests, 5);

    window.FR_STAGE16_FLAGS.socialArchive = false;
    window.FR_STAGE16.refreshSocial();
    assert.equal(document.getElementById('fr16-social-archive').hidden, true);
    assert.equal(document.querySelectorAll('.fr16-social-card,iframe[data-fr16-provider-frame]').length, 0);
    assert.equal(document.querySelector('script[data-fr16-provider-script]'), null);
    window.__FR_STAGE16__.cleanup();
    assert.equal(document.getElementById('fr16-portfolio'), null);
    assert.equal(document.querySelector('script[data-fr16-provider-script]'), null);
  } finally {
    isolated.window.close();
  }
});

test('preserva pricing arquivado no modelo sem renderizar ranges internos', () => {
  const engine = scriptById(html, 'fr-stage16-experience-engine');
  const social = { schemaVersion: '1.0', updatedAt: null, policy: copy(socialPolicy), items: [] };
  const pricing = {
    schemaVersion: '1.0', status: 'archived', currency: 'BRL', region: null, referenceMonth: null, approvedBy: null, disclaimer: 'Registro histórico.', requiredContext: copy(pricingContexts),
    ranges: [{ id: 'faixa-interna-pendente', label: 'Faixa interna pendente', status: 'pending_validation', unit: null, scope: null, min: null, max: null, includes: [], excludes: [], source: null, verifiedAt: null }]
  };
  const markup = [
    `<script type="application/json" id="fr16-social-registry">${JSON.stringify(social)}</script>`,
    `<script type="application/json" id="fr16-pricing-registry">${JSON.stringify(pricing)}</script>`,
    '<script type="application/json" id="fr16-ambientes-content-registry">{"schemaVersion":"1.0","items":{}}</script>',
    '<main id="view-projetos" class="view-section active"><section class="fr15-portfolio-universe"></section></main>',
    '<main id="view-orcamento" class="view-section"></main>'
  ].join('');
  const isolated = new JSDOM(`<!doctype html><html><body>${markup}</body></html>`, { runScripts: 'outside-only', pretendToBeVisual: true, url: 'https://franco-romeu.local/' });
  try {
    const { window } = isolated;
    window.GM_PROJECTS = [];
    window.AMB_STYLES = [];
    window.__frCore = { SERVICES: {} };
    window.matchMedia = query => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} });
    window.requestAnimationFrame = callback => window.setTimeout(() => callback(window.performance.now()), 0);
    window.cancelAnimationFrame = id => window.clearTimeout(id);
    window.HTMLCanvasElement.prototype.getContext = () => null;
    window.switchView = () => {};
    assert.doesNotThrow(() => window.eval(engine));
    window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
    assert.equal(window.FR_STAGE16.getPricingRegistry().status, 'archived');
    assert.equal(window.FR_STAGE16.getPricingRegistry().ranges.length, 1, 'Range arquivado deve permanecer no modelo validado');
    assert.equal(window.document.querySelectorAll('#fr16-pricing-grid .fr16-pricing-card').length, 0, 'Pricing raiz archived não deve renderizar');
    window.__FR_STAGE16__.cleanup();
  } finally {
    isolated.window.close();
  }
});

test('mantém galeria funcional sem canvas e restaura Etapa 15 pela flag', () => {
  const engine = scriptById(html, 'fr-stage16-experience-engine');
  const isolated = new JSDOM('<!doctype html><html><body><main id="view-projetos" class="view-section active"><section class="fr15-portfolio-universe"><button type="button">Legado</button></section></main></body></html>', {
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    url: 'https://franco-romeu.local/'
  });
  try {
    const { window } = isolated;
    const opened = [];
    window.GM_PROJECTS = [
      { id: 'b', title: 'Referência B', cat: 'beta', catLabel: 'Beta', url: 'https://images.unsplash.com/photo-b' },
      { id: 'a', title: 'Referência A', cat: 'alpha', catLabel: 'Alpha', url: 'https://images.unsplash.com/photo-a' }
    ];
    window.FR_DEFAULT_PROJECTS = [{ id: 'fallback', title: 'Não usar', cat: 'fallback' }];
    window.AMB_STYLES = [];
    window.__frCore = { SERVICES: {} };
    window.openProjectModal = project => opened.push(project);
    window.matchMedia = query => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} });
    window.requestAnimationFrame = callback => window.setTimeout(() => callback(window.performance.now()), 0);
    window.cancelAnimationFrame = id => window.clearTimeout(id);
    window.IntersectionObserver = class { constructor(callback) { this.callback = callback; } observe(target) { this.callback([{ target, isIntersecting: true, intersectionRatio: 1 }]); } disconnect() {} };
    window.ResizeObserver = class { observe() {} disconnect() {} };
    window.HTMLElement.prototype.scrollIntoView = function() {};
    window.HTMLCanvasElement.prototype.getContext = () => null;
    assert.doesNotThrow(() => window.eval(engine));
    window.document.dispatchEvent(new window.Event('DOMContentLoaded'));

    const root = window.document.getElementById('fr16-portfolio');
    const legacy = window.document.querySelector('.fr15-portfolio-universe');
    assert.ok(root);
    assert.equal(root.classList.contains('is-grid'), true);
    assert.equal(window.document.querySelectorAll('[data-fr16-project]').length, 2);
    assert.deepEqual(Array.from(window.document.querySelectorAll('[data-fr16-project]'), card => card.dataset.fr16Project), ['b', 'a']);
    assert.equal(legacy.getAttribute('aria-hidden'), 'true');
    assert.equal(legacy.hasAttribute('inert'), true);
    window.document.querySelector('[data-fr16-project="b"]').click();
    assert.equal(opened[0], window.GM_PROJECTS[0]);

    window.FR_STAGE16_FLAGS.portfolioUniverse = false;
    window.FR_STAGE16.refreshPortfolio();
    assert.equal(window.document.getElementById('view-projetos').classList.contains('fr16-portfolio-ready'), false);
    assert.equal(root.hidden, true);
    assert.equal(legacy.hasAttribute('aria-hidden'), false);
    assert.equal(legacy.hasAttribute('inert'), false);
    assert.equal(window.__FR_STAGE16__.portfolioActive, false);

    window.FR_STAGE16_FLAGS.portfolioUniverse = true;
    window.FR_STAGE16.refreshPortfolio();
    assert.equal(root.hidden, false);
    assert.equal(legacy.getAttribute('aria-hidden'), 'true');
    assert.equal(window.FR_STAGE16.audit().portfolio.canvasSupported, false);
    assert.equal(window.FR_STAGE16.audit().portfolio.canvasRunning, false);
    window.__FR_STAGE16__.cleanup();
    assert.equal(window.document.getElementById('fr16-portfolio'), null);
    assert.equal(legacy.hasAttribute('aria-hidden'), false);
    assert.equal(legacy.hasAttribute('inert'), false);
  } finally {
    isolated.window.close();
  }
});

test('restaura aria-hidden e inert do legado quando a instalação falha após ativar', () => {
  const engine = scriptById(html, 'fr-stage16-experience-engine');
  const isolated = new JSDOM('<!doctype html><html><body><main id="view-projetos" class="view-section active"><section class="fr15-portfolio-universe" aria-hidden="false"><button type="button">Legado</button></section></main></body></html>', {
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    url: 'https://franco-romeu.local/'
  });
  try {
    const { window } = isolated;
    const { document } = window;
    window.GM_PROJECTS = [{ id: 'a', title: 'Referência A', cat: 'alpha', catLabel: 'Alpha' }];
    window.AMB_STYLES = [];
    window.__frCore = { SERVICES: {} };
    window.matchMedia = query => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} });
    window.requestAnimationFrame = callback => window.setTimeout(() => callback(window.performance.now()), 0);
    window.cancelAnimationFrame = id => window.clearTimeout(id);
    window.IntersectionObserver = class { constructor(callback) { this.callback = callback; } observe(target) { this.callback([{ target, isIntersecting: true, intersectionRatio: 1 }]); } disconnect() {} };
    window.ResizeObserver = class { observe() {} disconnect() {} };
    window.HTMLElement.prototype.scrollIntoView = function() {};
    window.HTMLCanvasElement.prototype.getContext = () => null;
    const dispatch = document.dispatchEvent.bind(document);
    let injected = false;
    document.dispatchEvent = event => {
      if (!injected && event.type === 'frStage16PortfolioModeChanged' && event.detail?.active === true) {
        injected = true;
        throw new Error('falha tardia injetada');
      }
      return dispatch(event);
    };

    assert.doesNotThrow(() => window.eval(engine));
    document.dispatchEvent(new window.Event('DOMContentLoaded'));

    const legacy = document.querySelector('.fr15-portfolio-universe');
    assert.equal(injected, true);
    assert.equal(window.FR_STAGE16.audit().portfolio.installError, true);
    assert.equal(window.__FR_STAGE16__.portfolioActive, false);
    assert.equal(document.getElementById('fr16-portfolio'), null);
    assert.equal(document.getElementById('view-projetos').classList.contains('fr16-portfolio-ready'), false);
    assert.equal(legacy.getAttribute('aria-hidden'), 'false');
    assert.equal(legacy.hasAttribute('inert'), false);
    window.__FR_STAGE16__.cleanup();
  } finally {
    isolated.window.close();
  }
});

test('Ambientes usa pacote transacional, rollback por flags e restaura adaptadores legados', { timeout: 15000 }, async () => {
  const engine = scriptById(html, 'fr-stage16-experience-engine');
  const editorial = {
    schemaVersion: '1.0',
    items: {
      'estilo-teste': {
        status: 'draft', nameStatus: null, alternativeName: null,
        thesis: 'Tese editorial do estilo teste.',
        whereItWorks: 'Ambientes de teste com escopo conhecido.',
        technicalDecision: 'Compatibilizar as interfaces antes da execução.',
        executionAttention: 'Validar base, acesso e sequência.',
        budgetVariables: 'Quantidade, acesso e especificação.'
      },
      'estilo-dois': {
        status: 'draft', nameStatus: 'pending_validation', alternativeName: 'Nome alternativo',
        thesis: 'Segunda tese editorial.',
        whereItWorks: 'Outro ambiente de teste.',
        technicalDecision: 'Decisão técnica dois.',
        executionAttention: 'Atenção de execução dois.',
        budgetVariables: 'Variáveis dois.'
      }
    }
  };
  const markup = [
    '<script type="application/json" id="fr16-social-registry">{"schemaVersion":"1.0","updatedAt":null,"policy":{"loadMode":"click_to_load","externalScriptsAtFirstPaint":false,"consentRequired":true,"allowRawHtml":false,"showSyntheticMetrics":false},"items":[]}</script>',
    '<script type="application/json" id="fr16-pricing-registry">{"schemaVersion":"1.0","status":"pending_validation","currency":"BRL","region":null,"referenceMonth":null,"approvedBy":null,"disclaimer":"Teste.","requiredContext":[],"ranges":[]}</script>',
    `<script type="application/json" id="fr16-ambientes-content-registry">${JSON.stringify(editorial)}</script>`,
    '<main id="view-ambientes" class="view-section active fr15-amb-ready"><section class="amb-hero">Hero canônico</section><section class="fr15-amb-atlas"><button type="button">Atlas legado</button></section><section class="fr14-curator-desk">Curadoria legada</section><div class="amb-museum"><div><span>Duas linguagens</span></div><div id="amb-grid-container"></div></div></main>',
    '<main id="view-orcamento" class="view-section"></main>',
    '<div id="fr15-amb-project" aria-hidden="true"><button id="fr15-amb-close" type="button">Fechar legado</button></div>',
    '<div id="amb-detail-overlay" aria-hidden="true"></div>'
  ].join('');
  const isolated = new JSDOM(`<!doctype html><html><body>${markup}</body></html>`, {
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    url: 'https://franco-romeu.local/'
  });
  try {
    const { window } = isolated;
    const { document } = window;
    const styles = [
      {
        id: 'estilo-teste', label: '01', name: 'Estilo Teste', essence: 'Essência teste', desc: 'Descrição teste.', quote: 'Citação teste.',
        img: 'https://images.unsplash.com/photo-test', accent: '#F6A700', palette: ['#121318', '#043451'],
        services: [
          { id: 'svc-existing', qty: 9, role: 'Preservar existente' },
          { id: 'svc-select', qty: 3, role: 'Configuração de seleção' },
          { id: 'svc-number', qty: 2, role: 'Configuração numérica' },
          { id: 'svc-missing', qty: 1, role: 'Ausente no catálogo' }
        ]
      },
      {
        id: 'estilo-dois', label: '02', name: 'Estilo Dois', essence: 'Essência dois', desc: 'Descrição dois.', quote: 'Citação dois.',
        img: 'https://images.unsplash.com/photo-two', accent: '#C8986A', palette: ['#0B3D3E'], services: []
      }
    ];
    const stylesSnapshot = JSON.stringify(styles);
    const selectedServices = [{ id: 'kept', serviceId: 'svc-existing', quantidade: 7, configs: { original: true } }];
    let saveCalls = 0;
    let legacyInitCalls = 0;
    const legacyOpened = [];
    const stage15Selected = [];
    const switched = [];
    const scrollCalls = [];
    const core = {
      SERVICES: {
        'svc-existing': { id: 'svc-existing', nome: 'Existente', unidade: 'un', configuracoes: {} },
        'svc-select': { id: 'svc-select', nome: 'Seleção', unidade: 'm²', configuracoes: { acabamento: { tipo: 'select', opcoes: [{ id: 'fosco' }, { id: 'brilho' }] } } },
        'svc-number': { id: 'svc-number', nome: 'Numérico', unidade: 'm', configuracoes: { camadas: { tipo: 'number', opcoes: [] } } }
      },
      appState: { selectedServices },
      saveAndRender() { saveCalls += 1; }
    };
    const legacyOpen = index => legacyOpened.push(Number(index));
    const legacyClose = () => {};
    const legacyInit = () => { legacyInitCalls += 1; document.getElementById('amb-grid-container').textContent = 'grid legado'; };
    const legacyStage15Select = index => stage15Selected.push(Number(index));
    window.AMB_STYLES = styles;
    window.GM_PROJECTS = [];
    window.__frCore = core;
    window.openAmbDetail = legacyOpen;
    window.closeAmbDetail = legacyClose;
    window.initAmbView = legacyInit;
    window.FR_STAGE15 = { selectEnvironment: legacyStage15Select };
    window.ambImageFallback = image => { image.src = 'data:image/svg+xml,fr16-fallback'; image.dataset.fallbackApplied = 'true'; };
    Object.defineProperty(window, 'scrollX', { value: 0, configurable: true, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true });
    window.scrollTo = (first, second) => {
      const options = typeof first === 'object'
        ? { left: Number(first.left || 0), top: Number(first.top || 0) }
        : { left: Number(first || 0), top: Number(second || 0) };
      scrollCalls.push(options);
      Object.defineProperty(window, 'scrollX', { value: options.left, configurable: true, writable: true });
      Object.defineProperty(window, 'scrollY', { value: options.top, configurable: true, writable: true });
    };
    window.switchView = id => {
      switched.push(id);
      Array.from(document.querySelectorAll('.view-section')).forEach(view => view.classList.toggle('active', view.id === id));
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };
    window.matchMedia = query => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
    window.requestAnimationFrame = callback => window.setTimeout(() => callback(window.performance.now()), 0);
    window.cancelAnimationFrame = id => window.clearTimeout(id);
    window.HTMLElement.prototype.scrollIntoView = function() {};
    window.HTMLCanvasElement.prototype.getContext = () => null;

    assert.doesNotThrow(() => window.eval(engine));
    document.dispatchEvent(new window.Event('DOMContentLoaded'));
    await new Promise(resolve => setTimeout(resolve, 20));

    const view = document.getElementById('view-ambientes');
    const grid = document.getElementById('amb-grid-container');
    const atlas = document.querySelector('.fr15-amb-atlas');
    const curator = document.querySelector('.fr14-curator-desk');
    const dossier = document.getElementById('fr16-amb-dossier');
    let rows = Array.from(grid.querySelectorAll('[data-fr16-amb-index]'));
    assert.equal(JSON.stringify(window.AMB_STYLES), stylesSnapshot);
    assert.equal(view.classList.contains('fr16-amb-canonical'), true);
    assert.equal(rows.length, 2);
    assert.equal(atlas.hidden, true);
    assert.equal(atlas.getAttribute('aria-hidden'), 'true');
    assert.equal(atlas.hasAttribute('inert'), true);
    assert.equal(curator.hidden, true);

    assert.notEqual(window.FR_STAGE15.selectEnvironment, legacyStage15Select);
    window.FR_STAGE15.selectEnvironment(1);
    assert.equal(dossier.classList.contains('is-open'), true);
    assert.equal(document.getElementById('fr16-amb-dossier-title').textContent, 'Estilo Dois');
    assert.deepEqual(stage15Selected, [], 'API Stage15 não pode abrir seu modal oculto no modo canônico');
    assert.equal(document.getElementById('fr15-amb-project').hidden, true);
    assert.equal(document.getElementById('fr15-amb-project').classList.contains('is-open'), false);
    window.__FR_STAGE16__.ambientes.close({ skipFocus: true });

    pointer(window, rows[1], 'pointerover', { pointerType: 'mouse' });
    assert.equal(document.getElementById('fr16-amb-preview-title').textContent, 'Estilo Dois');
    assert.equal(dossier.hidden, true, 'Hover apenas antecipa a prévia');
    rows[0].focus();
    assert.equal(document.getElementById('fr16-amb-preview-title').textContent, 'Estilo Teste');
    assert.equal(dossier.hidden, true, 'Foco apenas antecipa a prévia');

    const bodyBefore = ['overflow', 'position', 'top', 'left', 'right', 'width'].map(key => document.body.style[key]);
    rows[0].click();
    await new Promise(resolve => setTimeout(resolve, 100));
    assert.equal(dossier.classList.contains('is-open'), true);
    assert.equal(rows[0].getAttribute('aria-expanded'), 'true');
    assert.equal(rows[1].getAttribute('aria-expanded'), 'false');
    assert.equal(document.activeElement, dossier.querySelector('[data-fr16-amb-close]'));
    assert.equal(document.body.style.position, 'fixed');
    assert.equal(view.getAttribute('aria-hidden'), 'true');
    assert.equal(view.hasAttribute('inert'), true);
    assert.deepEqual(Array.from(dossier.querySelectorAll('[data-fr16-amb-section]'), node => node.dataset.fr16AmbSection), ['thesis', 'application', 'translation', 'decision', 'execution', 'material-light', 'budget', 'services', 'rights', 'package']);
    assert.equal(dossier.querySelectorAll('[data-fr16-service-id]').length, 4);
    assert.match(dossier.textContent, /Direção conceitual não substitui levantamento/);
    assert.doesNotMatch(dossier.textContent, /R\$\s*\d/);

    const lastFocusable = dossier.querySelector('[data-fr16-amb-budget-open]');
    const firstFocusable = dossier.querySelector('[data-fr16-amb-prev]');
    lastFocusable.focus();
    lastFocusable.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    assert.equal(document.activeElement, firstFocusable);
    firstFocusable.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }));
    assert.equal(document.activeElement, lastFocusable);

    const beforePrepare = copy(selectedServices);
    dossier.querySelector('[data-fr16-amb-prepare]').click();
    assert.deepEqual(selectedServices, beforePrepare, 'Preparar não pode alterar o orçamento');
    assert.equal(dossier.querySelector('[data-fr16-amb-confirm]').hidden, false);
    assert.match(document.getElementById('fr16-amb-confirm-copy').textContent, /primeira opção padrão do catálogo/);
    dossier.querySelector('[data-fr16-amb-confirm-add]').click();
    assert.equal(saveCalls, 1);
    assert.equal(selectedServices.length, 3);
    assert.equal(selectedServices[0].id, 'kept');
    const selectEntry = selectedServices.find(item => item.serviceId === 'svc-select');
    const numberEntry = selectedServices.find(item => item.serviceId === 'svc-number');
    assert.deepEqual(copy({ quantidade: selectEntry.quantidade, configs: selectEntry.configs, estimated: selectEntry.estimated, source: selectEntry.source, styleId: selectEntry.styleId }), { quantidade: 3, configs: { acabamento: 'fosco' }, estimated: true, source: 'ambientes-stage16', styleId: 'estilo-teste' });
    assert.deepEqual(copy({ quantidade: numberEntry.quantidade, configs: numberEntry.configs, estimated: numberEntry.estimated }), { quantidade: 2, configs: { camadas: 1 }, estimated: true });
    assert.equal(selectedServices.filter(item => item.serviceId === 'svc-existing').length, 1);
    assert.match(document.getElementById('fr16-amb-feedback').textContent, /2 soluções adicionadas/);
    assert.match(document.getElementById('fr16-amb-feedback').textContent, /1 indisponível/);

    dossier.querySelector('[data-fr16-amb-prepare]').click();
    assert.equal(dossier.querySelector('[data-fr16-amb-confirm-add]').disabled, true);
    assert.equal(selectedServices.length, 3, 'Repetir a preparação não cria duplicatas');
    const rowAfterConfirm = grid.querySelector('[data-fr16-amb-index="0"]');
    assert.notEqual(rowAfterConfirm, rows[0], 'Confirmação deve exercitar a substituição do índice');
    assert.equal(rowAfterConfirm.isConnected, true);
    assert.equal(rowAfterConfirm.getAttribute('aria-expanded'), 'true');
    dossier.querySelector('[data-fr16-amb-close]').click();
    await new Promise(resolve => setTimeout(resolve, 30));
    assert.equal(document.activeElement, rowAfterConfirm, 'Foco deve voltar ao row equivalente após confirmar');
    assert.equal(rowAfterConfirm.getAttribute('aria-expanded'), 'false');

    rowAfterConfirm.click();
    await new Promise(resolve => setTimeout(resolve, 20));
    assert.equal(rowAfterConfirm.getAttribute('aria-expanded'), 'true');
    dossier.querySelector('[data-fr16-amb-undo]').click();
    assert.equal(saveCalls, 2);
    assert.deepEqual(selectedServices, beforePrepare, 'Undo remove somente inclusões desta transação');
    const rowAfterUndo = grid.querySelector('[data-fr16-amb-index="0"]');
    assert.notEqual(rowAfterUndo, rowAfterConfirm, 'Undo deve exercitar nova substituição do índice');
    assert.equal(rowAfterUndo.getAttribute('aria-expanded'), 'true');
    dossier.querySelector('[data-fr16-amb-close]').click();
    await new Promise(resolve => setTimeout(resolve, 30));
    assert.equal(document.activeElement, rowAfterUndo, 'Foco deve voltar ao row equivalente após undo');
    assert.equal(rowAfterUndo.getAttribute('aria-expanded'), 'false');

    rowAfterUndo.click();
    await new Promise(resolve => setTimeout(resolve, 20));
    let durableSnapshot = null;
    let compensationCalls = 0;
    core.saveAndRender = () => {
      durableSnapshot = copy(selectedServices);
      compensationCalls += 1;
      if (compensationCalls === 1) throw new Error('persistiu e falhou durante o render');
    };
    dossier.querySelector('[data-fr16-amb-prepare]').click();
    dossier.querySelector('[data-fr16-amb-confirm-add]').click();
    assert.deepEqual(selectedServices, beforePrepare, 'Falha de persistência deve reverter o lote inteiro');
    assert.equal(compensationCalls, 2, 'Rollback local deve ser persistido em uma segunda tentativa compensatória');
    assert.deepEqual(durableSnapshot, beforePrepare, 'Snapshot durável deve terminar no estado anterior ao lote');
    assert.match(document.getElementById('fr16-amb-feedback').textContent, /foram revertidas/);
    core.saveAndRender = () => { saveCalls += 1; };

    const rowBeforeRefresh = grid.querySelector('[data-fr16-amb-index="0"]');
    assert.equal(rowBeforeRefresh.getAttribute('aria-expanded'), 'true');
    window.FR_STAGE16.refreshAmbientes();
    const rowAfterRefresh = grid.querySelector('[data-fr16-amb-index="0"]');
    assert.notEqual(rowAfterRefresh, rowBeforeRefresh, 'Refresh deve substituir o índice durante o dossiê');
    assert.equal(rowAfterRefresh.getAttribute('aria-expanded'), 'true');
    dossier.querySelector('[data-fr16-amb-close]').click();
    await new Promise(resolve => setTimeout(resolve, 30));
    assert.equal(document.activeElement, rowAfterRefresh, 'Foco deve voltar ao row equivalente após refresh');
    assert.equal(rowAfterRefresh.getAttribute('aria-expanded'), 'false');

    window.scrollTo(0, 880);
    window.__frCore = null;
    window.__FR_STAGE16__.ambientes.open(0, rowAfterRefresh);
    await new Promise(resolve => setTimeout(resolve, 80));
    assert.equal(document.body.style.position, 'fixed');
    assert.equal(document.body.style.top, '-880px', 'Abertura programática deve capturar a origem real da página');
    assert.match(document.getElementById('fr16-amb-package-summary').textContent, /ponte da calculadora ainda não está disponível/);
    assert.ok(Array.from(dossier.querySelectorAll('[data-fr16-service-id] em')).every(status => /Calculadora indisponível/.test(status.textContent)));
    dossier.querySelector('[data-fr16-amb-prepare]').click();
    assert.match(document.getElementById('fr16-amb-feedback').textContent, /calculadora ainda não terminou/);
    assert.equal(dossier.querySelector('[data-fr16-amb-confirm]').hidden, true);
    window.__frCore = core;
    document.dispatchEvent(new window.CustomEvent('frCoreReady'));
    await new Promise(resolve => setTimeout(resolve, 40));
    const serviceStatuses = Object.fromEntries(Array.from(dossier.querySelectorAll('[data-fr16-service-id]'), item => [item.dataset.fr16ServiceId, item.querySelector('em').textContent]));
    assert.deepEqual(serviceStatuses, {
      'svc-existing': 'Já no orçamento',
      'svc-select': 'Pronto para incluir',
      'svc-number': 'Pronto para incluir',
      'svc-missing': 'Indisponível no catálogo'
    });
    assert.match(document.getElementById('fr16-amb-package-summary').textContent, /2 soluções disponíveis para incluir · 1 já presente · 1 indisponível/);
    assert.equal(document.getElementById('fr16-amb-feedback').textContent, '');
    dossier.querySelector('[data-fr16-amb-prepare]').click();
    assert.equal(dossier.querySelector('[data-fr16-amb-confirm]').hidden, false, 'CTA deve voltar a preparar o pacote após frCoreReady');
    assert.equal(dossier.querySelector('[data-fr16-amb-confirm-add]').disabled, false);
    dossier.querySelector('[data-fr16-amb-cancel]').click();

    window.__FR_STAGE16__.ambientes.close({ skipFocus: true });
    await new Promise(resolve => setTimeout(resolve, 80));
    assert.equal(window.scrollY, 880, 'Fechamento programático deve restaurar a origem não zero');
    window.scrollTo(0, 725);
    window.__FR_STAGE16__.ambientes.open(0, grid.querySelector('[data-fr16-amb-index="0"]'));
    await new Promise(resolve => setTimeout(resolve, 80));
    assert.equal(document.body.style.position, 'fixed');
    assert.equal(document.body.style.top, '-725px');
    dossier.querySelector('[data-fr16-amb-budget-open]').click();
    await new Promise(resolve => setTimeout(resolve, 120));
    assert.equal(switched.at(-1), 'view-orcamento');
    assert.deepEqual(selectedServices, beforePrepare, 'Abrir orçamento preserva a seleção');
    assert.equal(document.body.classList.contains('fr16-popup-lock'), false);
    assert.equal(document.body.style.position, bodyBefore[1]);
    assert.equal(window.scrollY, 0, 'Orçamento deve permanecer no topo depois da liberação do popup lock');
    assert.deepEqual(scrollCalls.at(-1), { left: 0, top: 0 });

    window.FR_STAGE16_FLAGS.ambientesDossier = false;
    window.FR_STAGE16.refreshAmbientes();
    legacyOpened.length = 0;
    window.FR_STAGE15.selectEnvironment(1);
    assert.deepEqual(legacyOpened, [1], 'Com dossiê desligado, API Stage15 deve usar o overlay canônico');
    assert.deepEqual(stage15Selected, []);
    assert.equal(document.getElementById('fr15-amb-project').hidden, true);
    window.openAmbDetail(1);
    assert.deepEqual(legacyOpened, [1, 1]);
    assert.equal(window.FR_STAGE16.audit().ambientes.legacyFallback, true);

    window.FR_STAGE16_FLAGS.ambientesCanonical = false;
    window.FR_STAGE16.refreshAmbientes();
    assert.equal(view.classList.contains('fr16-amb-canonical'), false);
    assert.equal(view.classList.contains('fr15-amb-ready'), true);
    assert.equal(atlas.hidden, false);
    assert.equal(atlas.hasAttribute('inert'), false);
    assert.ok(legacyInitCalls > 0);
    window.FR_STAGE15.selectEnvironment(0);
    assert.deepEqual(stage15Selected, [0], 'Com modo canônico desligado, API Stage15 deve delegar ao original');

    window.FR_STAGE16_FLAGS.ambientesCanonical = true;
    window.FR_STAGE16_FLAGS.ambientesDossier = true;
    window.FR_STAGE16.refreshAmbientes();
    rows = Array.from(grid.querySelectorAll('[data-fr16-amb-index]'));
    assert.equal(rows.length, 2);
    assert.equal(document.querySelectorAll('#fr16-amb-dossier').length, 1);
    window.scrollTo(0, 640);
    rows[1].focus();
    rows[1].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await new Promise(resolve => setTimeout(resolve, 80));
    assert.equal(document.getElementById('fr16-amb-dossier-title').textContent, 'Estilo Dois');
    assert.equal(rows[1].getAttribute('aria-expanded'), 'true');
    assert.equal(document.body.style.top, '-640px', 'Abertura por teclado deve preservar a origem não zero no lock');
    dossier.click();
    await new Promise(resolve => setTimeout(resolve, 80));
    assert.equal(dossier.hidden, true);
    assert.equal(document.activeElement, rows[1]);
    assert.equal(rows[1].getAttribute('aria-expanded'), 'false');
    assert.equal(window.scrollY, 640, 'Backdrop deve devolver a rolagem da abertura por teclado');
    assert.deepEqual(['overflow', 'position', 'top', 'left', 'right', 'width'].map(key => document.body.style[key]), bodyBefore);

    rows[0].focus();
    rows[0].click();
    await new Promise(resolve => setTimeout(resolve, 20));
    assert.equal(rows[0].getAttribute('aria-expanded'), 'true');
    dossier.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await new Promise(resolve => setTimeout(resolve, 20));
    assert.equal(dossier.hidden, true);
    assert.equal(document.activeElement, rows[0]);
    assert.equal(rows[0].getAttribute('aria-expanded'), 'false');

    rows[0].click();
    assert.equal(rows[0].getAttribute('aria-expanded'), 'true');
    dossier.querySelector('[data-fr16-amb-close]').click();
    await new Promise(resolve => setTimeout(resolve, 20));
    assert.equal(dossier.hidden, true);
    assert.equal(document.activeElement, rows[0]);
    assert.equal(rows[0].getAttribute('aria-expanded'), 'false');

    window.__FR_STAGE16__.cleanup();
    assert.equal(document.getElementById('fr16-amb-dossier'), null);
    assert.equal(view.classList.contains('fr16-amb-canonical'), false);
    assert.equal(atlas.hidden, false);
    assert.equal(atlas.hasAttribute('inert'), false);
    assert.equal(window.openAmbDetail, legacyOpen);
    assert.equal(window.closeAmbDetail, legacyClose);
    assert.equal(window.initAmbView, legacyInit);
    assert.equal(window.FR_STAGE15.selectEnvironment, legacyStage15Select);
    assert.equal(JSON.stringify(window.AMB_STYLES), stylesSnapshot);
  } finally {
    isolated.window.close();
  }
});

test('runtime preserva contratos e cobre cursor, cubo, popups e cleanup', { timeout: 90000 }, async () => {
  const runtimeErrors = [];
  const mediaQueries = new Map();
  const virtualConsole = new VirtualConsole();
  const intersectionObservers = [];
  virtualConsole.on('jsdomError', error => {
    if (!/Could not load (script|link)|Not implemented: navigation|Not implemented: HTMLCanvasElement/.test(error.message)) runtimeErrors.push(error.message);
  });
  virtualConsole.on('error', message => runtimeErrors.push(String(message)));
  const captured = new WeakMap();
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    url: 'https://franco-romeu.local/',
    virtualConsole,
    beforeParse(window) {
      Object.defineProperty(window, 'innerWidth', { value: 1440, configurable: true, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 900, configurable: true, writable: true });
      window.scrollX = 0;
      window.scrollY = 0;
      window.scrollTo = value => Object.defineProperty(window, 'scrollY', {
        value: typeof value === 'object' ? Number(value.top || 0) : 0,
        configurable: true,
        writable: true
      });
      window.matchMedia = query => {
        if (mediaQueries.has(query)) return mediaQueries.get(query);
        const listeners = new Set();
        const isFine = /hover:\s*hover/.test(query) && /pointer:\s*fine/.test(query);
        const media = {
          matches: isFine,
          media: query,
          addEventListener(type, listener) { if (type === 'change') listeners.add(listener); },
          removeEventListener(type, listener) { if (type === 'change') listeners.delete(listener); },
          addListener(listener) { listeners.add(listener); },
          removeListener(listener) { listeners.delete(listener); },
          set(matches) {
            this.matches = matches;
            listeners.forEach(listener => listener({ matches, media: query }));
          }
        };
        mediaQueries.set(query, media);
        return media;
      };
      window.__setMedia = (pattern, matches) => mediaQueries.forEach((media, query) => {
        if (pattern.test(query)) media.set(matches);
      });
      const connectionListeners = new Set();
      const connection = {
        saveData: false,
        addEventListener(type, listener) { if (type === 'change') connectionListeners.add(listener); },
        removeEventListener(type, listener) { if (type === 'change') connectionListeners.delete(listener); }
      };
      window.__setSaveData = value => {
        connection.saveData = value;
        connectionListeners.forEach(listener => listener({ type: 'change' }));
      };
      Object.defineProperty(window.navigator, 'connection', { value: connection, configurable: true });
      Object.defineProperty(window, 'devicePixelRatio', { value: 3, configurable: true });
      window.requestIdleCallback = callback => window.setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 10 }), 0);
      window.cancelIdleCallback = id => window.clearTimeout(id);
      class Observer {
        constructor(callback) { this.callback = callback; this.targets = new Set(); intersectionObservers.push(this); }
        observe(target) { this.targets.add(target); this.callback([{ target, isIntersecting: true, intersectionRatio: 1 }], this); }
        unobserve(target) { this.targets.delete(target); }
        disconnect() { this.targets.clear(); }
      }
      window.IntersectionObserver = Observer;
      window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
      window.HTMLElement.prototype.scrollIntoView = function() {};
      window.HTMLElement.prototype.animate = function() { return { cancel() {}, finished: Promise.resolve() }; };
      window.HTMLElement.prototype.getAnimations = function() { return []; };
      window.HTMLElement.prototype.setPointerCapture = function(pointerId) { captured.set(this, pointerId); };
      window.HTMLElement.prototype.releasePointerCapture = function(pointerId) {
        if (captured.get(this) === pointerId) captured.delete(this);
      };
      window.HTMLElement.prototype.hasPointerCapture = function(pointerId) { return captured.get(this) === pointerId; };
      const canvasContexts = new WeakMap();
      window.__canvasClearCount = canvas => canvasContexts.get(canvas)?.stats.clearRect || 0;
      window.HTMLCanvasElement.prototype.getContext = function() {
        if (canvasContexts.has(this)) return canvasContexts.get(this).context;
        const stats = { clearRect: 0 };
        const context = new Proxy({}, {
          get(target, key) {
            if (key === 'clearRect') return () => { stats.clearRect += 1; };
            return target[key] || (() => {});
          },
          set(target, key, value) { target[key] = value; return true; }
        });
        canvasContexts.set(this, { context, stats });
        return context;
      };
      window.fetch = async () => ({ ok: false, status: 404, json: async () => ({}) });
      window.open = () => null;
      window.alert = () => {};
      window.confirm = () => false;
      window.URL.createObjectURL = () => 'blob:fr-test';
      window.URL.revokeObjectURL = () => {};
      window.CSS = window.CSS || {};
      window.CSS.escape = window.CSS.escape || (value => String(value).replace(/[^a-z0-9_-]/gi, '\\$&'));
      Object.defineProperty(window.navigator, 'vibrate', { value: () => true, configurable: true });
      Object.defineProperty(window.navigator, 'clipboard', { value: { writeText: async () => {} }, configurable: true });
    }
  });

  try {
    const { window } = dom;
    const { document } = window;
    await new Promise(resolve => document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', resolve, { once: true })
      : resolve());
    await new Promise(resolve => setTimeout(resolve, 500));

    assert.equal(window.__FR_STAGE16__?.version, '16.6-checkpoint6');
    assert.equal(window.FR_STAGE16?.version, '16.6-checkpoint6');
    assert.equal(window.FR_STAGE16_FLAGS.cursorUnified, true);
    assert.equal(window.FR_STAGE16_FLAGS.cubeDrag, true);
    assert.equal(Object.keys(window.__frCore.SERVICES).length, 115);
    assert.equal(Object.keys(window.__frCore.COUPONS).length, 7);
    assert.equal(document.querySelectorAll('.view-section').length, 6);
    window.__frCore.appState.step = 2;
    window.__frCore.renderApp();
    await new Promise(resolve => setTimeout(resolve, 80));
    assert.equal(document.querySelectorAll('[data-action="toggleCatalogCategory"]').length, 15);

    const socialRegistry = window.FR_STAGE16.getSocialRegistry();
    const pricingRegistry = window.FR_STAGE16.getPricingRegistry();
    assert.equal(Object.isFrozen(socialRegistry), true);
    assert.equal(Object.isFrozen(pricingRegistry), true);
    assert.equal(socialRegistry.items.length, 6);
    assert.equal(socialRegistry.errors.length, 0);
    assert.deepEqual(Array.from(socialRegistry.items, item => item.order), [10, 20, 30, 40, 50, 60]);
    assert.ok(socialRegistry.items.every(item => item.status === 'placeholder' && !item.canLoadEmbed && item.permalink === null));
    assert.equal(pricingRegistry.ranges.length, 4);
    assert.equal(pricingRegistry.publishableCount, 0);
    assert.equal(pricingRegistry.errors.length, 0);
    assert.ok(pricingRegistry.ranges.every(range => range.min === null && range.max === null && !range.canRenderNumbers && range.displayValue === 'Faixa em validação'));

    const readyItems = [
      { provider: 'instagram', permalink: 'https://www.instagram.com/p/FRvalid1/', externalId: null, format: 'post', aspectRatio: '1/1' },
      { provider: 'tiktok', permalink: 'https://www.tiktok.com/@franco/video/1234567890123456789', externalId: '1234567890123456789', format: 'video', aspectRatio: '9/16' },
      { provider: 'youtube', permalink: 'https://www.youtube.com/watch?v=M7lc1UVf-VE', externalId: 'M7lc1UVf-VE', format: 'video', aspectRatio: '16/9' },
      { provider: 'facebook', permalink: 'https://www.facebook.com/franco/posts/123456789', externalId: null, format: 'post', aspectRatio: '1/1' },
      { provider: 'pinterest', permalink: 'https://www.pinterest.com/pin/123456789012345678/', externalId: null, format: 'pin', aspectRatio: '2/3' },
      { provider: 'x', permalink: 'https://www.x.com/franco/status/2234567890123456789', externalId: '2234567890123456789', format: 'post', aspectRatio: '1/1' }
    ].map((item, index) => ({
      id: `fr-social-${item.provider}-ready`, status: 'ready', series: 'Série FR validada', title: 'Conteúdo oficial validado.', poster: null,
      rightsStatus: 'verified', consentRequired: true, order: (index + 1) * 10, ...item
    }));
    const socialFixture = { schemaVersion: '1.0', updatedAt: null, policy: copy(socialPolicy), items: readyItems };
    const validSocial = window.FR_STAGE16.validate.social(socialFixture);
    assert.equal(validSocial.items.length, 6);
    assert.equal(validSocial.items.filter(item => item.canLoadEmbed).length, 3);
    assert.ok(validSocial.items.filter(item => ['instagram', 'facebook', 'pinterest'].includes(item.provider)).every(item => item.status === 'ready' && item.permalink && !item.canLoadEmbed));
    assert.deepEqual(socialFixture.items.map(item => item.order), [10, 20, 30, 40, 50, 60]);

    const reversedSocial = copy(socialFixture);
    reversedSocial.items.reverse();
    const reversedBefore = reversedSocial.items.map(item => item.order);
    const sortedSocial = window.FR_STAGE16.validate.social(reversedSocial);
    assert.deepEqual(Array.from(sortedSocial.items, item => item.order), [10, 20, 30, 40, 50, 60]);
    assert.deepEqual(reversedSocial.items.map(item => item.order), reversedBefore);

    const duplicateIds = copy(socialFixture);
    duplicateIds.items = [copy(readyItems[0]), { ...copy(readyItems[0]), order: 90 }];
    const duplicateIdResult = window.FR_STAGE16.validate.social(duplicateIds);
    assert.equal(duplicateIdResult.items.length, 0);
    assert.ok(duplicateIdResult.errors.includes('social_duplicate_id'));
    const duplicateOrders = copy(socialFixture);
    duplicateOrders.items = [copy(readyItems[0]), { ...copy(readyItems[1]), order: readyItems[0].order }];
    const duplicateOrderResult = window.FR_STAGE16.validate.social(duplicateOrders);
    assert.equal(duplicateOrderResult.items.length, 0);
    assert.ok(duplicateOrderResult.errors.includes('social_duplicate_order'));

    const maliciousSocial = copy(socialFixture);
    maliciousSocial.items = [
      copy(readyItems[2]),
      { ...copy(readyItems[2]), id: 'fr-social-youtube-hostile', provider: 'youtube', permalink: 'https://www.youtube.com.evil.test/watch/1', order: 80 },
      { ...copy(readyItems[4]), id: 'fr-social-pinterest-http', permalink: 'http://www.pinterest.com/pin/1', order: 90 },
      { ...copy(readyItems[5]), id: 'fr-social-x-raw', rawHtml: '</script><script>alert(1)</script>', order: 100 }
    ];
    const maliciousResult = window.FR_STAGE16.validate.social(maliciousSocial);
    assert.equal(maliciousResult.items.length, 3);
    assert.equal(maliciousResult.items.filter(item => item.canLoadEmbed).length, 1);
    assert.ok(maliciousResult.items.filter(item => item.id !== readyItems[2].id).every(item => item.status === 'disabled' && item.permalink === null));
    assert.ok(maliciousResult.errors.includes('social_permalink_rejected'));
    assert.ok(maliciousResult.errors.includes('social_item_rejected'));

    const mismatchedIdentity = copy(socialFixture);
    mismatchedIdentity.items = [{ ...copy(readyItems[2]), externalId: 'dQw4w9WgXcQ' }];
    const mismatchedIdentityResult = window.FR_STAGE16.validate.social(mismatchedIdentity);
    assert.equal(mismatchedIdentityResult.items[0].status, 'ready');
    assert.equal(mismatchedIdentityResult.items[0].canLoadEmbed, false);
    assert.equal(mismatchedIdentityResult.items[0].permalink, readyItems[2].permalink);
    assert.ok(mismatchedIdentityResult.errors.includes('social_embed_identity_mismatch'));

    const pendingRights = copy(socialFixture);
    pendingRights.items = [{ ...copy(readyItems[0]), rightsStatus: 'pending_rights' }];
    const pendingRightsResult = window.FR_STAGE16.validate.social(pendingRights);
    assert.equal(pendingRightsResult.items[0].status, 'disabled');
    assert.equal(pendingRightsResult.items[0].permalink, null);

    const protocolRelativePoster = copy(socialFixture);
    protocolRelativePoster.items = [{
      ...copy(readyItems[0]),
      status: 'placeholder',
      permalink: null,
      externalId: null,
      poster: '//evil.example/poster.webp',
      rightsStatus: 'not_applicable'
    }];
    const protocolRelativePosterResult = window.FR_STAGE16.validate.social(protocolRelativePoster);
    assert.equal(protocolRelativePosterResult.items.length, 1);
    assert.equal(protocolRelativePosterResult.items[0].poster, null);
    assert.ok(protocolRelativePosterResult.errors.includes('social_poster_rejected'));

    const missingConsent = copy(socialFixture);
    missingConsent.items = [{ ...copy(readyItems[0]), consentRequired: false }];
    const missingConsentResult = window.FR_STAGE16.validate.social(missingConsent);
    assert.equal(missingConsentResult.items.length, 0);
    assert.ok(missingConsentResult.errors.includes('social_item_rejected'));
    assert.equal(window.FR_STAGE16.validate.social(null).items.length, 0);

    const verifiedRange = {
      id: 'faixa-validada', label: 'Faixa validada', status: 'verified', unit: 'm²', scope: 'Projeto executivo com escopo delimitado', min: 100, max: 200,
      includes: ['Entregáveis descritos'], excludes: ['Execução não incluída'], source: 'Fonte interna aprovada', verifiedAt: '2026-08-22T12:00:00-03:00'
    };
    const verifiedPricing = {
      schemaVersion: '1.0', status: 'verified', currency: 'BRL', region: 'São Paulo — SP', referenceMonth: '2026-08', approvedBy: 'Revisão comercial FR',
      disclaimer: 'Faixa condicionada ao escopo.', requiredContext: copy(pricingContexts), ranges: [verifiedRange]
    };
    const validPricing = window.FR_STAGE16.validate.pricing(verifiedPricing);
    assert.equal(validPricing.publishableCount, 1);
    assert.equal(validPricing.ranges[0].min, 100);
    assert.equal(validPricing.ranges[0].max, 200);

    for (const key of ['region', 'referenceMonth', 'approvedBy', 'disclaimer']) {
      const incomplete = copy(verifiedPricing);
      incomplete[key] = null;
      assert.equal(window.FR_STAGE16.validate.pricing(incomplete).publishableCount, 0, `Pricing liberou sem ${key}`);
    }
    for (const requiredContext of [null, [], pricingContexts.slice(0, -1), [...pricingContexts, pricingContexts[0]]]) {
      const incomplete = copy(verifiedPricing);
      incomplete.requiredContext = requiredContext;
      assert.equal(window.FR_STAGE16.validate.pricing(incomplete).publishableCount, 0, 'Pricing liberou com contexto incompleto ou duplicado');
    }
    const unexpectedPricingKey = copy(verifiedPricing);
    unexpectedPricingKey.unexpected = 'não permitido';
    assert.equal(window.FR_STAGE16.validate.pricing(unexpectedPricingKey).publishableCount, 0);
    const rawPricingRoot = copy(verifiedPricing);
    rawPricingRoot.disclaimer = '<img src=x onerror=alert(1)>';
    const rawPricingRootResult = window.FR_STAGE16.validate.pricing(rawPricingRoot);
    assert.equal(rawPricingRootResult.publishableCount, 0);
    assert.equal(rawPricingRootResult.disclaimer, null);
    assert.ok(rawPricingRootResult.errors.includes('pricing_registry_keys'));
    for (const key of ['unit', 'scope', 'includes', 'excludes', 'source', 'verifiedAt']) {
      const incomplete = copy(verifiedPricing);
      incomplete.ranges[0][key] = ['includes', 'excludes'].includes(key) ? [] : null;
      assert.equal(window.FR_STAGE16.validate.pricing(incomplete).publishableCount, 0, `Pricing liberou sem ${key}`);
    }
    const pendingWithNumbers = copy(verifiedPricing);
    pendingWithNumbers.status = 'pending_validation';
    pendingWithNumbers.ranges[0].status = 'pending_validation';
    const redactedPricing = window.FR_STAGE16.validate.pricing(pendingWithNumbers);
    assert.equal(redactedPricing.publishableCount, 0);
    assert.equal(redactedPricing.ranges[0].min, null);
    assert.equal(redactedPricing.ranges[0].max, null);
    const stringPrice = copy(verifiedPricing);
    stringPrice.ranges[0].min = '100';
    assert.equal(window.FR_STAGE16.validate.pricing(stringPrice).publishableCount, 0);
    const looseTimestamp = copy(verifiedPricing);
    looseTimestamp.ranges[0].verifiedAt = '2026';
    assert.equal(window.FR_STAGE16.validate.pricing(looseTimestamp).publishableCount, 0);
    const duplicatePricing = copy(verifiedPricing);
    duplicatePricing.ranges.push(copy(verifiedRange));
    assert.equal(window.FR_STAGE16.validate.pricing(duplicatePricing).ranges.length, 0);
    assert.equal(window.FR_STAGE16.validate.pricing(null).ranges.length, 0);

    const ambientesSnapshot = JSON.stringify(window.AMB_STYLES);
    const mansoryContent = window.FR_STAGE16.getEnvironmentContent('mansory');
    assert.equal(Object.isFrozen(mansoryContent), true);
    assert.equal(Object.isFrozen(mansoryContent.base), true);
    assert.equal(mansoryContent.base.name, 'Mansory');
    assert.equal(mansoryContent.editorial.alternativeName, 'Maximalismo de Precisão');
    assert.equal(mansoryContent.resolvedServices.length, 6);
    assert.ok(mansoryContent.resolvedServices.every(service => service.available));
    assert.equal(window.FR_STAGE16.getEnvironmentContent('inexistente'), null);
    try { mansoryContent.base.name = 'Mutação indevida'; } catch (_) {}
    assert.equal(window.AMB_STYLES[0].name, 'Mansory');
    assert.equal(JSON.stringify(window.AMB_STYLES), ambientesSnapshot);
    const savedCore = window.__frCore;
    window.__frCore = null;
    assert.ok(window.FR_STAGE16.getEnvironmentContent('mansory').resolvedServices.every(service => !service.available));
    window.__frCore = savedCore;

    const contentAudit = window.FR_STAGE16.audit();
    assert.equal(contentAudit.social.total, 6);
    assert.equal(contentAudit.social.placeholders, 6);
    assert.equal(contentAudit.social.loadable, 0);
    assert.equal(contentAudit.pricing.total, 4);
    assert.equal(contentAudit.pricing.publishable, 0);
    assert.equal(contentAudit.pricing.hidden, 4);
    assert.equal(contentAudit.ambientes.source, 12);
    assert.equal(contentAudit.ambientes.content, 12);
    assert.equal(contentAudit.ambientes.merged, 12);
    assert.equal(contentAudit.ambientes.serviceRefs, 72);
    assert.equal(contentAudit.ambientes.uniqueServices, 28);
    assert.equal(contentAudit.ambientes.missingServiceRefs, 0);
    assert.equal(contentAudit.contracts.services, 115);
    assert.equal(contentAudit.contracts.views, 6);
    assert.equal(/"(?:permalink|approvedBy|title|min|max|appState|selectedServices)"/.test(JSON.stringify(contentAudit)), false);

    const ambientesView = document.getElementById('view-ambientes');
    const ambientesHero = ambientesView.querySelector('.amb-hero');
    const ambientesMuseum = ambientesView.querySelector('.amb-museum');
    const ambientesGrid = document.getElementById('amb-grid-container');
    const legacyAmbientesAtlas = ambientesView.querySelector('.fr15-amb-atlas');
    const legacyCurator = ambientesView.querySelector('.fr14-curator-desk');
    const ambientesDossier = document.getElementById('fr16-amb-dossier');
    const ambientesRows = Array.from(ambientesGrid.querySelectorAll('[data-fr16-amb-index]'));
    assert.ok(ambientesView && ambientesHero && ambientesMuseum && legacyAmbientesAtlas && legacyCurator && ambientesDossier);
    assert.equal(document.querySelectorAll('#amb-grid-container').length, 1);
    assert.equal(document.querySelectorAll('#fr16-amb-dossier').length, 1);
    assert.equal(ambientesView.classList.contains('fr16-amb-canonical'), true);
    assert.equal(ambientesView.classList.contains('fr15-amb-ready'), false);
    assert.equal(ambientesHero.hidden, false);
    assert.equal(ambientesMuseum.hidden, false);
    assert.equal(ambientesGrid.classList.contains('fr16-amb-index'), true);
    assert.equal(ambientesRows.length, 12);
    assert.deepEqual(ambientesRows.map(row => Number(row.dataset.fr16AmbIndex)), Array.from(window.AMB_STYLES, (_, index) => index));
    assert.deepEqual(ambientesRows.map(row => row.querySelector('strong').textContent), Array.from(window.AMB_STYLES, style => style.name));
    assert.equal(legacyAmbientesAtlas.hidden, true);
    assert.equal(legacyAmbientesAtlas.getAttribute('aria-hidden'), 'true');
    assert.equal(legacyAmbientesAtlas.hasAttribute('inert'), true);
    assert.equal(legacyCurator.hidden, true);
    assert.equal(legacyCurator.hasAttribute('inert'), true);
    assert.equal(contentAudit.ambientes.enabled, true);
    assert.equal(contentAudit.ambientes.dossierEnabled, true);
    assert.equal(contentAudit.ambientes.rendered, 12);
    assert.equal(contentAudit.ambientes.heroPreserved, true);
    assert.equal(contentAudit.ambientes.museumRestored, true);
    assert.equal(contentAudit.ambientes.stage15Hidden, true);
    assert.equal(contentAudit.ambientes.installError, false);

    pointer(window, ambientesRows[1], 'pointerover', { pointerType: 'mouse' });
    assert.equal(document.getElementById('fr16-amb-preview-title').textContent, window.AMB_STYLES[1].name);
    assert.equal(ambientesDossier.hidden, true, 'Hover não deve confirmar a abertura');
    ambientesRows[2].focus();
    assert.equal(document.getElementById('fr16-amb-preview-title').textContent, window.AMB_STYLES[2].name);
    assert.equal(ambientesDossier.hidden, true, 'Foco não deve confirmar a abertura');
    ambientesRows[2].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
    assert.equal(document.activeElement, ambientesRows[3]);
    ambientesRows[3].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }));
    assert.equal(document.activeElement, ambientesRows.at(-1));
    ambientesRows.at(-1).dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Home', bubbles: true, cancelable: true }));
    assert.equal(document.activeElement, ambientesRows[0]);

    const dossierSectionOrder = ['thesis', 'application', 'translation', 'decision', 'execution', 'material-light', 'budget', 'services', 'rights', 'package'];
    for (let index = 0; index < window.AMB_STYLES.length; index += 1) {
      const style = window.AMB_STYLES[index];
      const content = window.FR_STAGE16.getEnvironmentContent(style.id);
      window.openAmbDetail(index);
      assert.equal(ambientesDossier.hidden, false);
      assert.equal(ambientesDossier.classList.contains('is-open'), true);
      assert.equal(ambientesDossier.getAttribute('role'), 'dialog');
      assert.equal(ambientesDossier.getAttribute('aria-modal'), 'true');
      assert.equal(ambientesDossier.getAttribute('aria-hidden'), 'false');
      assert.equal(ambientesDossier.getAttribute('aria-labelledby'), 'fr16-amb-dossier-title');
      assert.equal(document.getElementById('fr16-amb-dossier-title').textContent, style.name);
      assert.equal(document.getElementById('fr16-amb-thesis').textContent, content.editorial.thesis);
      assert.equal(document.getElementById('fr16-amb-where').textContent, content.editorial.whereItWorks);
      assert.equal(document.getElementById('fr16-amb-translation').textContent, `${style.essence}. ${style.desc}`);
      assert.equal(document.getElementById('fr16-amb-quote').textContent, `“${style.quote}”`);
      assert.equal(document.getElementById('fr16-amb-decision').textContent, content.editorial.technicalDecision);
      assert.equal(document.getElementById('fr16-amb-execution').textContent, content.editorial.executionAttention);
      assert.equal(document.getElementById('fr16-amb-budget-vars').textContent, content.editorial.budgetVariables);
      assert.match(document.getElementById('fr16-amb-material').textContent, /Paleta conceitual:/);
      assert.deepEqual(Array.from(ambientesDossier.querySelectorAll('[data-fr16-amb-section]'), node => node.dataset.fr16AmbSection), dossierSectionOrder);
      const renderedServiceIds = Array.from(ambientesDossier.querySelectorAll('[data-fr16-service-id]'), item => item.dataset.fr16ServiceId);
      assert.deepEqual(renderedServiceIds, Array.from(style.services, service => service.id));
      assert.ok(renderedServiceIds.every(serviceId => Object.hasOwn(window.__frCore.SERVICES, serviceId)));
      assert.equal(ambientesDossier.querySelector('.fr16-amb-dossier-gallery figcaption').textContent, 'Referência visual — não é obra FR');
      assert.match(document.getElementById('fr16-amb-dossier-img').alt, /^Referência visual — não é obra FR:/);
      assert.equal(ambientesDossier.querySelectorAll('.fr16-amb-swatch').length, style.palette.length);
      assert.doesNotMatch(ambientesDossier.textContent, /R\$\s*\d/);
      assert.match(ambientesDossier.textContent, /Direção conceitual não substitui levantamento/);
      window.__FR_STAGE16__.ambientes.close({ skipFocus: true });
      assert.equal(ambientesDossier.hidden, true);
    }
    window.openAmbDetail(0);
    assert.match(document.getElementById('fr16-amb-name-note').textContent, /Nomenclatura em validação/);
    assert.match(document.getElementById('fr16-amb-name-note').textContent, /Maximalismo de Precisão/);
    const dossierImage = document.getElementById('fr16-amb-dossier-img');
    dossierImage.dispatchEvent(new window.Event('error'));
    assert.equal(dossierImage.dataset.fallbackApplied, 'true');
    assert.match(dossierImage.src, /^data:image\/svg\+xml/);
    window.__FR_STAGE16__.ambientes.close({ skipFocus: true });
    window.openAmbDetail(5);
    assert.equal(document.getElementById('fr16-amb-dossier-title').textContent, window.AMB_STYLES[5].name, 'Deep link deve usar o wrapper canônico');
    window.__FR_STAGE16__.ambientes.close({ skipFocus: true });

    const portfolioView = document.getElementById('view-projetos');
    const portfolioRoot = document.getElementById('fr16-portfolio');
    const legacyPortfolio = portfolioView.querySelector('.fr15-portfolio-universe');
    const portfolioOrbit = document.getElementById('fr16-portfolio-orbit');
    const portfolioCanvas = document.getElementById('fr16-portfolio-canvas');
    const portfolioRail = document.getElementById('fr16-portfolio-rail');
    assert.ok(portfolioRoot && legacyPortfolio && portfolioOrbit && portfolioCanvas && portfolioRail);
    assert.equal(document.querySelectorAll('#fr16-portfolio').length, 1);
    assert.equal(portfolioView.classList.contains('fr16-portfolio-ready'), true);
    assert.equal(legacyPortfolio.getAttribute('aria-hidden'), 'true');
    assert.equal(legacyPortfolio.hasAttribute('inert'), true);
    assert.equal(portfolioRoot.hidden, false);
    assert.equal(portfolioCanvas.getAttribute('aria-hidden'), 'true');
    assert.ok(legacyPortfolio.compareDocumentPosition(portfolioRoot) & window.Node.DOCUMENT_POSITION_FOLLOWING);
    assert.deepEqual(
      Array.from(portfolioRail.querySelectorAll('[data-fr16-project]'), card => card.dataset.fr16Project),
      Array.from(window.GM_PROJECTS, project => String(project.id))
    );
    assert.equal(portfolioRail.querySelectorAll('[data-fr16-project]').length, 16);
    assert.equal(document.querySelectorAll('[data-fr16-portfolio-filter]').length, 11);
    assert.ok(Array.from(portfolioRail.querySelectorAll('img')).every(image => image.alt.startsWith('Referência visual — não é obra FR:')));
    assert.ok(Array.from(portfolioRail.querySelectorAll('img')).every(image => image.dataset.frReference === 'true'));
    assert.equal(portfolioRoot.querySelectorAll('.fr-reference-badge').length, 0);
    assert.equal(contentAudit.portfolio.source, 16);
    assert.equal(contentAudit.portfolio.rendered, 16);
    assert.equal(contentAudit.portfolio.filters, 11);
    assert.equal(contentAudit.portfolio.legacyPreserved, 1);
    assert.equal(contentAudit.portfolio.legacyHidden, true);
    assert.equal(contentAudit.portfolio.installError, false);
    assert.equal(contentAudit.portfolio.dprCap, 1.5);

    const socialSection = document.getElementById('fr16-social-archive');
    const socialRail = document.getElementById('fr16-social-rail');
    const socialCards = Array.from(socialRail.querySelectorAll('.fr16-social-card'));
    assert.ok(socialSection && socialRail);
    assert.equal(socialSection.hidden, false);
    assert.equal(socialSection.getAttribute('aria-hidden'), 'false');
    assert.deepEqual(socialCards.map(card => card.dataset.provider), ['instagram', 'tiktok', 'youtube', 'facebook', 'pinterest', 'x']);
    assert.deepEqual(socialCards.map(card => card.querySelector('h3').textContent), Array.from(socialRegistry.items, item => item.title));
    assert.deepEqual(socialCards.map(card => card.dataset.aspectRatio), ['9/16', '9/16', '16/9', '4/5', '2/3', '1/1']);
    assert.ok(socialCards.every(card => card.querySelector('.fr16-social-frame').style.getPropertyValue('--fr16-social-ratio').includes(' / ')));
    assert.ok(socialCards.every(card => card.querySelector('.fr16-social-placeholder-status').textContent === 'DEMONSTRAÇÃO — AGUARDANDO PUBLICAÇÃO OFICIAL'));
    assert.ok(socialCards.every(card => card.querySelector('[data-fr16-load-embed]').disabled));
    assert.equal(socialRail.querySelectorAll('.fr16-social-fallback').length, 0);
    assert.equal(socialRail.querySelectorAll('iframe,script[src]').length, 0);
    assert.doesNotMatch(socialRail.textContent, /curtidas|comentários|visualizações|seguidores|@franco/i);
    assert.equal(contentAudit.social.enabled, true);
    assert.equal(contentAudit.social.mounted, true);
    assert.equal(contentAudit.social.rendered, 6);
    assert.equal(contentAudit.social.active, 0);
    assert.equal(contentAudit.social.externalRequests, 0);
    assert.equal(document.querySelectorAll('#fr16-case-model img').length, 0);
    assert.equal(document.querySelectorAll('#fr16-case-model .fr16-case-step').length, 3);
    assert.match(document.getElementById('fr16-case-model').textContent, /MODELO EDITORIAL \/ NÃO PUBLICADO/);
    assert.equal(document.querySelectorAll('#fr16-method-list .fr16-method-step').length, 7);
    assert.equal(document.querySelectorAll('#fr16-services-body tr').length, 6);
    assert.equal(document.querySelectorAll('#fr16-pricing-grid .fr16-pricing-card').length, 4);
    assert.ok(Array.from(document.querySelectorAll('#fr16-pricing-grid .fr16-pricing-card p'), node => node.textContent).every(text => text === 'Faixa em validação'));
    assert.doesNotMatch(document.getElementById('fr16-pricing').textContent, /R\$\s*\d/);
    assert.ok(document.getElementById('fr16-portfolio-insight').compareDocumentPosition(socialSection) & window.Node.DOCUMENT_POSITION_FOLLOWING);
    assert.ok(socialSection.compareDocumentPosition(document.getElementById('fr16-case-model')) & window.Node.DOCUMENT_POSITION_FOLLOWING);

    Object.defineProperty(socialRail, 'clientWidth', { value: 300, configurable: true });
    Object.defineProperty(socialRail, 'scrollWidth', { value: 2100, configurable: true });
    Object.defineProperty(socialRail, 'offsetLeft', { value: 0, configurable: true });
    socialCards.forEach((card, index) => Object.defineProperty(card, 'offsetLeft', { value: index * 350, configurable: true }));
    socialRail.scrollTo = options => {
      socialRail.scrollLeft = Number(options?.left || 0);
      socialRail.dispatchEvent(new window.Event('scroll'));
    };
    socialRail.focus();
    const socialArrow = new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true });
    socialRail.dispatchEvent(socialArrow);
    assert.equal(socialArrow.defaultPrevented, true);
    assert.equal(document.activeElement, socialRail);
    assert.equal(socialRail.scrollLeft, 350);
    socialCards[0].querySelector('[data-fr16-load-embed]').click();
    assert.equal(socialRail.querySelectorAll('iframe,script[src]').length, 0);
    assert.equal(window.FR_STAGE16.audit().social.externalRequests, 0);

    portfolioOrbit.getBoundingClientRect = () => ({ left: 0, top: 0, right: 400, bottom: 200, width: 400, height: 200 });
    window.switchView('view-projetos');
    window.dispatchEvent(new window.Event('resize'));
    await new Promise(resolve => setTimeout(resolve, 760));
    assert.equal(window.FR_STAGE16.audit().portfolio.canvasRunning, true, JSON.stringify(window.FR_STAGE16.audit().portfolio));
    assert.equal(portfolioCanvas.width, 600);
    assert.equal(portfolioCanvas.height, 300);
    const legacyAmbient = portfolioView.querySelector('.fr14-ambient');
    assert.ok(legacyAmbient);
    const hiddenAmbientFrames = window.__canvasClearCount(legacyAmbient);
    await new Promise(resolve => setTimeout(resolve, 90));
    assert.equal(window.__canvasClearCount(legacyAmbient), hiddenAmbientFrames, 'Canvas ambiental legado manteve RAF oculto');

    const portfolioObserver = intersectionObservers.find(observer => observer.targets.has(portfolioOrbit));
    assert.ok(portfolioObserver);
    portfolioObserver.callback([{ target: portfolioOrbit, isIntersecting: false, intersectionRatio: 0 }], portfolioObserver);
    await new Promise(resolve => setTimeout(resolve, 40));
    assert.equal(window.FR_STAGE16.audit().portfolio.canvasRunning, false);
    portfolioObserver.callback([{ target: portfolioOrbit, isIntersecting: true, intersectionRatio: 1 }], portfolioObserver);
    await new Promise(resolve => setTimeout(resolve, 40));
    assert.equal(window.FR_STAGE16.audit().portfolio.canvasRunning, true);

    window.__setMedia(/prefers-reduced-motion/, true);
    assert.equal(window.FR_STAGE16.audit().portfolio.staticMode, true);
    assert.equal(window.FR_STAGE16.audit().portfolio.canvasRunning, false);
    assert.equal(portfolioCanvas.hidden, true);
    window.__setMedia(/prefers-reduced-motion/, false);
    await new Promise(resolve => setTimeout(resolve, 30));
    assert.equal(window.FR_STAGE16.audit().portfolio.canvasRunning, true);
    window.__setSaveData(true);
    assert.equal(window.FR_STAGE16.audit().portfolio.staticMode, true);
    assert.equal(window.FR_STAGE16.audit().portfolio.canvasRunning, false);
    window.__setSaveData(false);
    await new Promise(resolve => setTimeout(resolve, 30));
    assert.equal(window.FR_STAGE16.audit().portfolio.canvasRunning, true);

    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    document.dispatchEvent(new window.Event('visibilitychange'));
    assert.equal(window.FR_STAGE16.audit().portfolio.canvasRunning, false);
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    document.dispatchEvent(new window.Event('visibilitychange'));
    await new Promise(resolve => setTimeout(resolve, 30));
    assert.equal(window.FR_STAGE16.audit().portfolio.canvasRunning, true);

    const marmoreFilter = document.querySelector('[data-fr16-portfolio-filter="marmore"]');
    marmoreFilter.click();
    assert.equal(marmoreFilter.getAttribute('aria-pressed'), 'true');
    assert.equal(portfolioRail.querySelectorAll('[data-fr16-project]').length, 3);
    document.querySelector('[data-fr16-portfolio-filter="todos"]').click();
    assert.equal(portfolioRail.querySelectorAll('[data-fr16-project]').length, 16);

    Object.defineProperty(portfolioRail, 'clientWidth', { value: 300, configurable: true });
    Object.defineProperty(portfolioRail, 'scrollWidth', { value: 1200, configurable: true });
    Object.defineProperty(portfolioRail, 'offsetLeft', { value: 0, configurable: true });
    const portfolioCards = Array.from(portfolioRail.querySelectorAll('[data-fr16-project]'));
    portfolioCards.forEach((card, index) => Object.defineProperty(card, 'offsetLeft', { value: index * 320, configurable: true }));
    portfolioRail.scrollTo = options => {
      portfolioRail.scrollLeft = Number(options?.left || 0);
      portfolioRail.dispatchEvent(new window.Event('scroll'));
    };
    portfolioCards[0].focus();
    portfolioCards[0].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    assert.equal(document.activeElement, portfolioCards[1]);
    assert.match(document.getElementById('fr16-portfolio-status').textContent, /Referência 2 de 16:/);
    portfolioCards[1].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }));
    assert.equal(document.activeElement, portfolioCards.at(-1));
    portfolioCards.at(-1).dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Home', bubbles: true, cancelable: true }));
    assert.equal(document.activeElement, portfolioCards[0]);

    portfolioRail.scrollLeft = 400;
    const middleWheel = new window.WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true });
    portfolioRail.dispatchEvent(middleWheel);
    assert.equal(middleWheel.defaultPrevented, true);
    assert.equal(portfolioRail.scrollLeft, 500);
    portfolioRail.scrollLeft = 900;
    const edgeWheel = new window.WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true });
    portfolioRail.dispatchEvent(edgeWheel);
    assert.equal(edgeWheel.defaultPrevented, false);
    portfolioRail.scrollLeft = 400;
    const zoomWheel = new window.WheelEvent('wheel', { deltaY: 100, ctrlKey: true, bubbles: true, cancelable: true });
    portfolioRail.dispatchEvent(zoomWheel);
    assert.equal(zoomWheel.defaultPrevented, false);
    window.__setMedia(/max-width: 767px/, true);
    const mobileWheel = new window.WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true });
    portfolioRail.dispatchEvent(mobileWheel);
    assert.equal(mobileWheel.defaultPrevented, false);
    window.__setMedia(/max-width: 767px/, false);

    portfolioRail.scrollLeft = 400;
    pointer(window, portfolioRail, 'pointerdown', { pointerId: 41, pointerType: 'mouse', button: 0, isPrimary: true, clientX: 100, clientY: 100 });
    const portfolioDrag = pointer(window, portfolioRail, 'pointermove', { pointerId: 41, pointerType: 'mouse', button: 0, isPrimary: true, clientX: 35, clientY: 100 });
    assert.equal(portfolioDrag.defaultPrevented, true);
    pointer(window, portfolioRail, 'pointerup', { pointerId: 41, pointerType: 'mouse', button: 0, isPrimary: true, clientX: 35, clientY: 100 });
    portfolioCards[0].focus();
    portfolioCards[0].click();
    assert.equal(document.getElementById('project-modal').classList.contains('open'), false);
    await new Promise(resolve => setTimeout(resolve, 340));
    portfolioCards[0].click();
    assert.equal(document.getElementById('project-modal').classList.contains('open'), true);
    assert.equal(document.getElementById('pm-title').textContent, window.GM_PROJECTS[0].title);
    document.activeElement.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await new Promise(resolve => setTimeout(resolve, 60));
    assert.equal(document.getElementById('project-modal').classList.contains('open'), false);
    assert.equal(document.activeElement, portfolioCards[0]);
    portfolioCards[1].focus();
    portfolioCards[1].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    assert.equal(document.getElementById('pm-title').textContent, window.GM_PROJECTS[1].title);
    window.closeProjectModal();

    const canonicalProjects = window.GM_PROJECTS;
    window.GM_PROJECTS = [
      { id: 'custom-2', title: '<b>Texto seguro</b>', cat: 'custom', catLabel: 'Custom', url: null },
      { id: 'custom-1', title: 'Segundo item', cat: 'custom', catLabel: 'Custom', url: null }
    ];
    window.FR_STAGE16.refreshPortfolio();
    assert.deepEqual(Array.from(portfolioRail.querySelectorAll('[data-fr16-project]'), card => card.dataset.fr16Project), ['custom-2', 'custom-1']);
    assert.equal(portfolioRail.querySelector('b'), null);
    assert.doesNotMatch(portfolioRail.textContent, /Texto seguro/);
    assert.match(portfolioRail.querySelector('.fr16-portfolio-card-title').textContent, /Referência visual/);
    window.GM_PROJECTS = [];
    window.FR_STAGE16.refreshPortfolio();
    assert.equal(portfolioRail.querySelectorAll('[data-fr16-project]').length, 0);
    assert.match(portfolioRail.textContent, /Nenhuma referência disponível/);
    window.GM_PROJECTS = canonicalProjects;
    window.FR_STAGE16.refreshPortfolio();

    window.FR_STAGE16_FLAGS.portfolioUniverse = false;
    window.FR_STAGE16.refreshPortfolio();
    assert.equal(portfolioView.classList.contains('fr16-portfolio-ready'), false);
    assert.equal(portfolioRoot.hidden, true);
    assert.equal(legacyPortfolio.hasAttribute('aria-hidden'), false);
    assert.equal(legacyPortfolio.hasAttribute('inert'), false);
    assert.equal(window.__FR_STAGE16__.portfolioActive, false);
    const legacyFramesBeforeResume = window.__canvasClearCount(legacyAmbient);
    await new Promise(resolve => setTimeout(resolve, 90));
    assert.ok(window.__canvasClearCount(legacyAmbient) > legacyFramesBeforeResume, 'Canvas ambiental legado não retomou no rollback');
    window.FR_STAGE16_FLAGS.portfolioUniverse = true;
    window.FR_STAGE16.refreshPortfolio();
    assert.equal(portfolioRoot.hidden, false);
    assert.equal(legacyPortfolio.getAttribute('aria-hidden'), 'true');
    assert.equal(legacyPortfolio.hasAttribute('inert'), true);
    const legacyFramesBeforePause = window.__canvasClearCount(legacyAmbient);
    await new Promise(resolve => setTimeout(resolve, 90));
    assert.equal(window.__canvasClearCount(legacyAmbient), legacyFramesBeforePause, 'Canvas ambiental legado não pausou após reativar CP3');
    window.switchView('view-home');
    await new Promise(resolve => setTimeout(resolve, 760));
    assert.equal(window.FR_STAGE16.audit().portfolio.canvasRunning, false);

    const socialFlag = window.FR_STAGE16_FLAGS.socialArchive;
    window.FR_STAGE16_FLAGS.socialArchive = false;
    window.FR_STAGE16.refreshSocial();
    assert.equal(window.FR_STAGE16.audit().flags.socialArchive, false);
    assert.equal(window.FR_STAGE16.getSocialRegistry().items.length, 6);
    assert.equal(document.querySelectorAll('.fr16-social-card,[data-fr16-load-embed]').length, 0);
    assert.equal(document.getElementById('fr16-social-archive').hidden, true);
    window.FR_STAGE16_FLAGS.socialArchive = socialFlag;
    window.FR_STAGE16.refreshSocial();
    assert.equal(document.querySelectorAll('.fr16-social-card').length, 6);
    assert.equal(document.querySelectorAll('[data-fr16-load-embed]').length, 6);
    assert.ok(Array.from(document.querySelectorAll('[data-fr16-load-embed]'), button => button.disabled).every(Boolean));
    assert.equal(Array.from(document.scripts).filter(script => /(?:instagram|tiktok|facebook|youtube|pinterest|twitter|\/x\.com)/i.test(script.src)).length, 0);

    assert.equal(document.documentElement.classList.contains('fr16-cursor-managed'), true);
    window.__FR_STAGE16__.cursor.hide();
    assert.equal(document.body.classList.contains('fr16-cursor-ready'), false);
    const cursorTarget = document.getElementById('fr-global-search-nav');
    pointer(window, cursorTarget, 'pointermove', { pointerId: 1, pointerType: 'mouse', clientX: 320, clientY: 180 });
    await new Promise(resolve => setTimeout(resolve, 80));
    assert.equal(document.body.classList.contains('fr16-cursor-ready'), true);
    assert.equal(document.body.classList.contains('fr8-cursor-active'), true);
    assert.match(document.getElementById('fr8-cursor-dot').style.transform, /320\.00px,180\.00px/);
    assert.match(document.getElementById('fr8-cursor-dot').style.transform, /translate\(-50%,-50%\)/);
    const input = document.querySelector('input');
    pointer(window, input, 'pointermove', { pointerId: 1, pointerType: 'mouse', clientX: 330, clientY: 190 });
    assert.equal(document.body.classList.contains('fr16-cursor-native'), true);
    window.__setMedia(/prefers-reduced-motion/, true);
    pointer(window, cursorTarget, 'pointermove', { pointerId: 2, pointerType: 'mouse', clientX: 340, clientY: 200 });
    assert.equal(document.documentElement.classList.contains('fr16-cursor-on'), false);
    window.__setMedia(/prefers-reduced-motion/, false);
    window.__setMedia(/hover:\s*hover.*pointer:\s*fine/, false);
    pointer(window, cursorTarget, 'pointermove', { pointerId: 3, pointerType: 'mouse', clientX: 350, clientY: 210 });
    assert.equal(document.documentElement.classList.contains('fr16-cursor-on'), false);
    window.__setMedia(/hover:\s*hover.*pointer:\s*fine/, true);

    const orbit = document.getElementById('fr15-p3d-orbit');
    const cube = orbit.querySelector('.fr15-p3d-cube');
    const cubeLab = orbit.closest('.fr15-p3d-lab');
    const projectIds = Array.from(window.FR_STAGE15.projects3d, project => project.id);
    assert.deepEqual(projectIds, [
      'reforma-residencial-integral', 'retrofit-comercial', 'calacatta-orbita', 'marcenaria-integrada', 'brinquedomovel',
      'futebol-x1', 'basquete-aco', 'patinacao-dmx', 'luz-no-movel', 'suite-material'
    ]);
    assert.equal(cube.querySelectorAll(':scope > .fr15-p3d-face').length, 6);
    assert.equal(document.querySelectorAll('#fr16-cube-narrative').length, 1);
    assert.equal(document.querySelectorAll('[data-fr16-cube-project]').length, 10);
    assert.ok(Array.from(document.querySelectorAll('[data-fr16-cube-project]'), button => button.tagName === 'BUTTON' && button.getAttribute('role') === null && button.parentElement.tagName === 'LI').every(Boolean));
    assert.deepEqual(copy(window.FR_STAGE16.audit().cubeNarrative), {
      enabled: true,
      mounted: true,
      mode: 'immersive',
      source: 10,
      physicalFaces: 6,
      cycles: 2,
      projectIndex: 0,
      face: 1,
      cycle: 1,
      position: 0,
      states: 19,
      phase: 'face',
      panelStep: 1,
      panelTotal: 10,
      drawerOpen: false,
      released: false,
      complete: false,
      roots: 1,
      announcements: 0,
      errors: 0,
      installError: false
    });
    assert.equal(orbit.getAttribute('aria-describedby'), 'fr16-p3d-instructions');
    pointer(window, orbit, 'pointerdown', { pointerId: 9, pointerType: 'mouse', button: 2, isPrimary: true, clientX: 100, clientY: 100 });
    assert.equal(orbit.classList.contains('is-dragging'), false);
    pointer(window, orbit, 'pointerdown', { pointerId: 10, pointerType: 'mouse', button: 0, isPrimary: false, clientX: 100, clientY: 100 });
    assert.equal(orbit.classList.contains('is-dragging'), false);
    const mouseDown = pointer(window, orbit, 'pointerdown', { pointerId: 11, pointerType: 'mouse', button: 0, isPrimary: true, clientX: 100, clientY: 100 });
    assert.equal(mouseDown.defaultPrevented, false);
    assert.equal(orbit.classList.contains('is-dragging'), true);
    assert.equal(orbit.hasPointerCapture(11), true);
    const yawBeforeMouse = cube.style.getPropertyValue('--ry');
    const pitchBeforeMouse = cube.style.getPropertyValue('--rx');
    pointer(window, orbit, 'pointermove', { pointerId: 11, pointerType: 'mouse', button: 0, clientX: 120, clientY: 80 });
    const yawAfterMouse = Number.parseFloat(cube.style.getPropertyValue('--ry'));
    const pitchAfterMouse = Number.parseFloat(cube.style.getPropertyValue('--rx'));
    assert.ok(Number.isFinite(yawAfterMouse));
    assert.ok(Number.isFinite(pitchAfterMouse));
    assert.notEqual(cube.style.getPropertyValue('--ry'), yawBeforeMouse);
    assert.notEqual(cube.style.getPropertyValue('--rx'), pitchBeforeMouse);
    const projectBeforeMouseRelease = window.FR_STAGE16.audit().cubeNarrative.projectIndex;
    pointer(window, orbit, 'pointerup', { pointerId: 11, pointerType: 'mouse', button: 0, clientX: 500, clientY: 500 });
    assert.equal(orbit.classList.contains('is-dragging'), false);
    assert.equal(orbit.hasPointerCapture(11), false);
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.projectIndex, projectBeforeMouseRelease, 'Drag diagonal não deve disparar avanço narrativo');

    pointer(window, orbit, 'pointerdown', { pointerId: 14, pointerType: 'mouse', button: 0, isPrimary: true, clientX: 100, clientY: 100 });
    pointer(window, orbit, 'pointermove', { pointerId: 14, pointerType: 'mouse', button: 0, clientX: 110, clientY: 100 });
    pointer(window, orbit, 'pointercancel', { pointerId: 14, pointerType: 'mouse', button: 0, clientX: 110, clientY: 100 });
    assert.equal(orbit.classList.contains('is-dragging'), false);
    assert.equal(orbit.hasPointerCapture(14), false);

    pointer(window, orbit, 'pointerdown', { pointerId: 15, pointerType: 'mouse', button: 0, isPrimary: true, clientX: 100, clientY: 100 });
    const yawBeforeRollbackMove = cube.style.getPropertyValue('--ry');
    window.FR_STAGE16_FLAGS.cubeDrag = false;
    pointer(window, orbit, 'pointermove', { pointerId: 15, pointerType: 'mouse', button: 0, clientX: 160, clientY: 100 });
    assert.equal(cube.style.getPropertyValue('--ry'), yawBeforeRollbackMove);
    pointer(window, orbit, 'pointerup', { pointerId: 15, pointerType: 'mouse', button: 0, clientX: 160, clientY: 100 });
    assert.equal(orbit.classList.contains('is-dragging'), false);
    assert.equal(orbit.hasPointerCapture(15), false);
    window.FR_STAGE16_FLAGS.cubeDrag = true;

    const yawBeforeVertical = cube.style.getPropertyValue('--ry');
    const verticalDown = pointer(window, orbit, 'pointerdown', { pointerId: 12, pointerType: 'touch', button: 0, isPrimary: true, clientX: 100, clientY: 100 });
    const verticalMove = pointer(window, orbit, 'pointermove', { pointerId: 12, pointerType: 'touch', button: 0, clientX: 103, clientY: 120 });
    assert.equal(verticalDown.defaultPrevented, false);
    assert.equal(verticalMove.defaultPrevented, false);
    assert.equal(orbit.hasPointerCapture(12), false);
    assert.equal(cube.style.getPropertyValue('--ry'), yawBeforeVertical);
    pointer(window, orbit, 'pointercancel', { pointerId: 12, pointerType: 'touch', button: 0, clientX: 103, clientY: 120 });

    const yawBeforeTouch = Number.parseFloat(cube.style.getPropertyValue('--ry'));
    pointer(window, orbit, 'pointerdown', { pointerId: 13, pointerType: 'touch', button: 0, isPrimary: true, clientX: 100, clientY: 100 });
    const intentMove = pointer(window, orbit, 'pointermove', { pointerId: 13, pointerType: 'touch', button: 0, clientX: 118, clientY: 104 });
    assert.equal(intentMove.defaultPrevented, true);
    assert.equal(orbit.hasPointerCapture(13), true);
    const dragMove = pointer(window, orbit, 'pointermove', { pointerId: 13, pointerType: 'touch', button: 0, clientX: 128, clientY: 104 });
    assert.equal(dragMove.defaultPrevented, true);
    assert.ok(Number.parseFloat(cube.style.getPropertyValue('--ry')) > yawBeforeTouch + 8);
    pointer(window, orbit, 'lostpointercapture', { pointerId: 13, pointerType: 'touch', button: 0, clientX: 128, clientY: 104 });
    assert.equal(orbit.classList.contains('is-dragging'), false);

    const yawBeforeKeys = Number.parseFloat(cube.style.getPropertyValue('--ry'));
    orbit.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
    assertClose(Number.parseFloat(cube.style.getPropertyValue('--ry')), yawBeforeKeys - 15);
    orbit.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    assertClose(Number.parseFloat(cube.style.getPropertyValue('--ry')), yawBeforeKeys);
    const pitchBeforeKeys = Number.parseFloat(cube.style.getPropertyValue('--rx'));
    orbit.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
    assertClose(Number.parseFloat(cube.style.getPropertyValue('--rx')), Math.min(55, pitchBeforeKeys + 10));
    orbit.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
    assertClose(Number.parseFloat(cube.style.getPropertyValue('--rx')), Math.min(55, pitchBeforeKeys + 10) - 10);
    for (let index = 0; index < 20; index += 1) orbit.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
    assert.equal(cube.style.getPropertyValue('--rx'), '55.00deg');

    window.__setMedia(/prefers-reduced-motion/, true);
    const reducedYaw = Number.parseFloat(cube.style.getPropertyValue('--ry'));
    orbit.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    assertClose(Number.parseFloat(cube.style.getPropertyValue('--ry')), reducedYaw + 15);
    await new Promise(resolve => setTimeout(resolve, 100));
    assertClose(Number.parseFloat(cube.style.getPropertyValue('--ry')), reducedYaw + 15);
    window.__setMedia(/prefers-reduced-motion/, false);

    window.FR_STAGE16_FLAGS.cubeDrag = false;
    orbit.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 200, right: 200, bottom: 200 });
    pointer(window, orbit, 'pointermove', { pointerId: 20, pointerType: 'mouse', button: 0, clientX: 200, clientY: 100 });
    assert.equal(cube.style.getPropertyValue('--ry'), '37.00deg');
    document.dispatchEvent(new window.CustomEvent('frStage15Ready'));
    assert.equal(orbit.getAttribute('aria-describedby'), 'fr16-p3d-instructions', 'A narrativa ativa mantém instrução mesmo sem o drag CP1');
    assert.match(document.getElementById('fr16-p3d-instructions').textContent, /role somente sobre o volume/);
    window.FR_STAGE16_FLAGS.cubeNarrativeScroll = false;
    window.FR_STAGE16.refreshCubeNarrative();
    assert.equal(document.querySelectorAll('#fr16-cube-narrative').length, 0);
    assert.equal(cubeLab.classList.contains('fr16-cube-narrative'), false);
    assert.equal(orbit.hasAttribute('aria-describedby'), false);
    const rollbackWheel = new window.WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true });
    orbit.dispatchEvent(rollbackWheel);
    assert.equal(rollbackWheel.defaultPrevented, false);
    window.FR_STAGE16_FLAGS.cubeNarrativeScroll = true;
    window.FR_STAGE16.refreshCubeNarrative();
    window.FR_STAGE16.refreshCubeNarrative();
    assert.equal(document.querySelectorAll('#fr16-cube-narrative').length, 1, 'Refresh repetido deve manter UI singleton');
    window.FR_STAGE16_FLAGS.cubeDrag = true;
    window.FR_STAGE16.refreshCubeNarrative();

    window.switchView('view-projetos3d');
    await new Promise(resolve => setTimeout(resolve, 760));
    pointer(window, orbit, 'pointerdown', { pointerId: 21, pointerType: 'mouse', button: 0, isPrimary: true, clientX: 100, clientY: 100 });
    pointer(window, orbit, 'pointermove', { pointerId: 21, pointerType: 'mouse', button: 0, clientX: 115, clientY: 100 });
    pointer(window, orbit, 'pointerup', { pointerId: 21, pointerType: 'mouse', button: 0, clientX: 115, clientY: 100 });
    await new Promise(resolve => setTimeout(resolve, 30));
    const pausedYaw = Number.parseFloat(cube.style.getPropertyValue('--ry'));
    await new Promise(resolve => setTimeout(resolve, 220));
    const yawDuringPause = Number.parseFloat(cube.style.getPropertyValue('--ry'));
    assert.ok(Math.abs(yawDuringPause - pausedYaw) < 0.05, `Pausa CP1 alterou yaw de ${pausedYaw} para ${yawDuringPause}`);
    await new Promise(resolve => setTimeout(resolve, 1100));
    assertClose(Number.parseFloat(cube.style.getPropertyValue('--ry')), pausedYaw, 0.05);
    orbit.dispatchEvent(new window.CustomEvent('fr16P3DSnap', { detail: { release: true } }));
    await new Promise(resolve => setTimeout(resolve, 1250));
    assert.ok(Number.parseFloat(cube.style.getPropertyValue('--ry')) > pausedYaw, 'Autorrotação Etapa 15 deve retomar após a soltura narrativa');
    window.FR_STAGE16.refreshCubeNarrative();

    const orbitObserver = intersectionObservers.find(observer => observer.targets.has(orbit));
    assert.ok(orbitObserver);
    orbitObserver.callback([{ target: orbit, isIntersecting: false, intersectionRatio: 0 }], orbitObserver);
    const offscreenYaw = Number.parseFloat(cube.style.getPropertyValue('--ry'));
    await new Promise(resolve => setTimeout(resolve, 100));
    assertClose(Number.parseFloat(cube.style.getPropertyValue('--ry')), offscreenYaw);
    orbitObserver.callback([{ target: orbit, isIntersecting: true, intersectionRatio: 1 }], orbitObserver);
    await new Promise(resolve => setTimeout(resolve, 100));
    assertClose(Number.parseFloat(cube.style.getPropertyValue('--ry')), offscreenYaw, 0.05, 'O snap narrativo deve continuar sem RAF ao voltar ao viewport');

    const bodyBeforeCubeNarrative = ['overflow', 'position', 'top', 'left', 'right', 'width'].map(key => document.body.style[key]);
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.projectIndex, 0);
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.position, 0);
    pointer(window, orbit, 'pointerdown', { pointerId: 60, pointerType: 'mouse', button: 0, isPrimary: true, clientX: 180, clientY: 100 });
    pointer(window, orbit, 'pointermove', { pointerId: 60, pointerType: 'mouse', button: 0, isPrimary: true, clientX: 90, clientY: 102 });
    pointer(window, orbit, 'pointerup', { pointerId: 60, pointerType: 'mouse', button: 0, isPrimary: true, clientX: 85, clientY: 102 });
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.projectIndex, 1, 'Arraste horizontal deliberado de mouse avança uma face');
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.drawerOpen, false);
    pointer(window, orbit, 'pointerdown', { pointerId: 601, pointerType: 'mouse', button: 0, isPrimary: true, clientX: 180, clientY: 100 });
    pointer(window, orbit, 'pointermove', { pointerId: 601, pointerType: 'mouse', button: 0, isPrimary: true, clientX: 90, clientY: 102 });
    pointer(window, orbit, 'pointerup', { pointerId: 601, pointerType: 'mouse', button: 0, isPrimary: true, clientX: 85, clientY: 102 });
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.position, 2, 'Segundo arraste abre o drawer do mesmo projeto');
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.projectIndex, 1);
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.drawerOpen, true);
    assertClose(Number.parseFloat(cube.style.getPropertyValue('--ry')), 180, 0.05, 'Segundo arraste restaura o snap da face lógica');
    window.__FR_STAGE16__.cubeNarrative.select(0, { announce: false });
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.position, 0);
    const outsideState = window.FR_STAGE16.audit().cubeNarrative.position;
    const outsideWheel = new window.WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true });
    cubeLab.dispatchEvent(outsideWheel);
    assert.equal(outsideWheel.defaultPrevented, false);
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.position, outsideState, 'Roda fora da órbita não altera a narrativa');
    const reverseAtStart = new window.WheelEvent('wheel', { deltaY: -120, bubbles: true, cancelable: true });
    orbit.dispatchEvent(reverseAtStart);
    assert.equal(reverseAtStart.defaultPrevented, false, 'Limite inicial deve liberar a página');
    const zoomOnCube = new window.WheelEvent('wheel', { deltaY: 120, ctrlKey: true, bubbles: true, cancelable: true });
    orbit.dispatchEvent(zoomOnCube);
    assert.equal(zoomOnCube.defaultPrevented, false, 'Ctrl+wheel deve preservar zoom');

    const narrativeKeyControl = document.querySelector('[data-fr16-cube-next]');
    narrativeKeyControl.focus();
    const firstNarrativeKey = new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true });
    narrativeKeyControl.dispatchEvent(firstNarrativeKey);
    assert.equal(firstNarrativeKey.defaultPrevented, true);
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.position, 1);
    const secondNarrativeKey = new window.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true });
    narrativeKeyControl.dispatchEvent(secondNarrativeKey);
    assert.equal(secondNarrativeKey.defaultPrevented, true);
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.position, 2);
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.drawerOpen, true);
    const reverseNarrativeKey = new window.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true });
    narrativeKeyControl.dispatchEvent(reverseNarrativeKey);
    assert.equal(reverseNarrativeKey.defaultPrevented, true);
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.position, 1);
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.drawerOpen, false);
    window.__FR_STAGE16__.cubeNarrative.select(0, { announce: false });

    orbit.focus();
    const firstNarrativeWheel = new window.WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true });
    orbit.dispatchEvent(firstNarrativeWheel);
    assert.equal(firstNarrativeWheel.defaultPrevented, true);
    let cubeNarrativeAudit = window.FR_STAGE16.audit().cubeNarrative;
    assert.equal(cubeNarrativeAudit.projectIndex, 1);
    assert.equal(cubeNarrativeAudit.face, 2);
    assert.equal(cubeNarrativeAudit.cycle, 1);
    assert.equal(cubeNarrativeAudit.position, 1);
    assert.equal(cubeNarrativeAudit.drawerOpen, false);
    assertClose(Number.parseFloat(cube.style.getPropertyValue('--ry')), 180);
    await new Promise(resolve => setTimeout(resolve, 410));
    const focusBeforeWheelPanel = document.activeElement;
    const secondNarrativeWheel = new window.WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true });
    orbit.dispatchEvent(secondNarrativeWheel);
    assert.equal(secondNarrativeWheel.defaultPrevented, true);
    cubeNarrativeAudit = window.FR_STAGE16.audit().cubeNarrative;
    assert.equal(cubeNarrativeAudit.position, 2);
    assert.equal(cubeNarrativeAudit.drawerOpen, true);
    assert.equal(document.activeElement, focusBeforeWheelPanel, 'Wheel não deve mover foco');
    const cubeDrawer = document.getElementById('fr16-cube-drawer');
    assert.equal(cubeDrawer.hidden, false);
    assert.equal(cubeDrawer.getAttribute('role'), 'region');
    assert.equal(cubeDrawer.hasAttribute('aria-modal'), false);
    assert.equal(cubeDrawer.getAttribute('aria-hidden'), 'false');
    assert.match(document.querySelector('[data-fr16-cube-progress-label]').textContent, /face 2 de 6.*painel etapa 2 de 10/i);
    assert.deepEqual(['overflow', 'position', 'top', 'left', 'right', 'width'].map(key => document.body.style[key]), bodyBeforeCubeNarrative, 'Drawer narrativo não pode travar o body');
    const drawerWheelState = cubeNarrativeAudit.position;
    const drawerWheel = new window.WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true });
    cubeDrawer.dispatchEvent(drawerWheel);
    assert.equal(drawerWheel.defaultPrevented, false);
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.position, drawerWheelState);

    cursorTarget.focus();
    cursorTarget.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await new Promise(resolve => setTimeout(resolve, 30));
    assert.equal(cubeDrawer.hidden, true);
    assert.equal(document.activeElement, orbit, 'Escape global escopado devolve foco mesmo após wheel sem mover foco');
    orbit.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await new Promise(resolve => setTimeout(resolve, 30));
    assert.equal(cubeDrawer.hidden, false);
    assert.equal(document.activeElement, cubeDrawer.querySelector('[data-fr16-cube-close]'));
    document.dispatchEvent(new window.CustomEvent('frStage16CubeSwipe', { detail: { direction: 1 } }));
    assert.equal(cubeDrawer.hidden, true, 'Gesto pode fechar drawer aberto pelo teclado');
    assert.equal(document.activeElement, orbit, 'Fechamento por gesto não deixa foco em conteúdo hidden/inert');
    document.dispatchEvent(new window.CustomEvent('frStage16CubeSwipe', { detail: { direction: -1 } }));
    assert.equal(cubeDrawer.hidden, false);
    cubeDrawer.querySelector('[data-fr16-cube-inspect]').focus();
    const yawBeforeInspector = Number.parseFloat(cube.style.getPropertyValue('--ry'));
    cubeDrawer.querySelector('[data-fr16-cube-inspect]').click();
    await new Promise(resolve => setTimeout(resolve, 100));
    const cubeInspector = document.getElementById('fr15-p3d-inspector');
    assert.equal(cubeInspector.classList.contains('is-open'), true);
    assert.equal(cubeDrawer.hidden, false, 'Inspector abre sobre o drawer não modal');
    document.activeElement.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await new Promise(resolve => setTimeout(resolve, 100));
    assert.equal(cubeInspector.classList.contains('is-open'), false);
    assert.equal(cubeDrawer.hidden, false, 'Primeiro Escape fecha somente o inspector');
    await new Promise(resolve => setTimeout(resolve, 1250));
    assertClose(Number.parseFloat(cube.style.getPropertyValue('--ry')), yawBeforeInspector, 0.05, 'Fechar o inspector preserva o snap enquanto o drawer continua aberto');
    document.activeElement.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await new Promise(resolve => setTimeout(resolve, 30));
    assert.equal(cubeDrawer.hidden, true, 'Segundo Escape fecha o drawer');

    const projectBeforeTouchSwipe = window.FR_STAGE16.audit().cubeNarrative.projectIndex;
    pointer(window, orbit, 'pointerdown', { pointerId: 61, pointerType: 'touch', button: 0, isPrimary: true, clientX: 100, clientY: 100 });
    const horizontalNarrativeMove = pointer(window, orbit, 'pointermove', { pointerId: 61, pointerType: 'touch', button: 0, isPrimary: true, clientX: 25, clientY: 104 });
    pointer(window, orbit, 'pointerup', { pointerId: 61, pointerType: 'touch', button: 0, isPrimary: true, clientX: 20, clientY: 104 });
    assert.equal(horizontalNarrativeMove.defaultPrevented, true);
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.projectIndex, projectBeforeTouchSwipe, 'Primeiro swipe touch abre o drawer do projeto já selecionado');
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.drawerOpen, true);
    assertClose(Number.parseFloat(cube.style.getPropertyValue('--ry')), 180, 0.05, 'Swipe que abre drawer mantém a face lógica em snap');
    pointer(window, orbit, 'pointerdown', { pointerId: 611, pointerType: 'touch', button: 0, isPrimary: true, clientX: 100, clientY: 100 });
    pointer(window, orbit, 'pointermove', { pointerId: 611, pointerType: 'touch', button: 0, isPrimary: true, clientX: 25, clientY: 104 });
    pointer(window, orbit, 'pointerup', { pointerId: 611, pointerType: 'touch', button: 0, isPrimary: true, clientX: 20, clientY: 104 });
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.projectIndex, projectBeforeTouchSwipe + 1, 'Segundo swipe touch avança para a próxima face lógica');
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.drawerOpen, false);
    const projectBeforeCancelledSwipe = window.FR_STAGE16.audit().cubeNarrative.projectIndex;
    pointer(window, orbit, 'pointerdown', { pointerId: 62, pointerType: 'touch', button: 0, isPrimary: true, clientX: 100, clientY: 100 });
    pointer(window, orbit, 'pointermove', { pointerId: 62, pointerType: 'touch', button: 0, isPrimary: true, clientX: 20, clientY: 102 });
    pointer(window, orbit, 'pointercancel', { pointerId: 62, pointerType: 'touch', button: 0, isPrimary: true, clientX: 20, clientY: 102 });
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.projectIndex, projectBeforeCancelledSwipe, 'pointercancel não avança');

    for (const mode of ['wireframe', 'light', 'final']) {
      document.querySelector(`[data-fr15-p3d-mode="${mode}"]`).click();
      assert.equal(document.getElementById('fr15-p3d-viewport').dataset.mode, mode);
    }

    window.__setMedia(/prefers-reduced-motion/, true);
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.mode, 'fallback');
    assert.equal(cubeLab.classList.contains('is-immersive'), false);
    assert.equal(document.querySelectorAll('[data-fr16-cube-project]').length, 10);
    window.__FR_STAGE16__.cubeNarrative.select(0, { announce: false });
    narrativeKeyControl.focus();
    narrativeKeyControl.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    narrativeKeyControl.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.position, 2);
    assert.equal(document.activeElement, cubeDrawer.querySelector('[data-fr16-cube-close]'), 'Setas no fallback movem foco ao drawer revelado');
    document.activeElement.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    assert.equal(document.activeElement, narrativeKeyControl, 'Fechar drawer devolve foco ao controle narrativo');
    const reducedNarrativeWheel = new window.WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true });
    orbit.dispatchEvent(reducedNarrativeWheel);
    assert.equal(reducedNarrativeWheel.defaultPrevented, false);
    document.querySelector('[data-fr16-cube-project="6"]').click();
    cubeNarrativeAudit = window.FR_STAGE16.audit().cubeNarrative;
    assert.equal(cubeNarrativeAudit.projectIndex, 6);
    assert.equal(cubeNarrativeAudit.face, 1);
    assert.equal(cubeNarrativeAudit.cycle, 2);
    assert.equal(cubeNarrativeAudit.drawerOpen, true);
    assert.equal(document.getElementById('fr16-cube-narrative').previousElementSibling, document.querySelector('.fr15-p3d-workbench'));
    assert.equal(document.activeElement, cubeDrawer.querySelector('[data-fr16-cube-close]'), 'Ativação de lista por teclado move foco ao drawer revelado');
    const responsiveListTrigger = document.querySelector('[data-fr16-cube-project="6"]');
    responsiveListTrigger.focus();
    window.__setMedia(/prefers-reduced-motion/, false);
    assert.equal(document.activeElement, cubeDrawer.querySelector('[data-fr16-cube-close]'), 'Transição para imersivo não deixa foco na lista ocultada');
    window.__FR_STAGE16__.cubeNarrative.close();
    await new Promise(resolve => setTimeout(resolve, 30));
    assert.equal(document.activeElement, orbit, 'Ao voltar para imersivo, foco não retorna a item oculto da lista');

    const narrativeExit = document.querySelector('[data-fr16-cube-exit]');
    narrativeExit.click();
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.released, true);
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.mode, 'fallback');
    const releasedListTrigger = document.querySelector('[data-fr16-cube-project="2"]');
    releasedListTrigger.click();
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.released, true, 'Explorar a lista após Pular não retoma sticky implicitamente');
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.mode, 'fallback');
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.drawerOpen, true);
    assert.equal(document.activeElement, cubeDrawer.querySelector('[data-fr16-cube-close]'));
    window.__FR_STAGE16__.cubeNarrative.close();
    assert.equal(document.activeElement, releasedListTrigger, 'Fechar o drawer devolve foco à seleção da lista');
    window.FR_STAGE16.refreshCubeNarrative();
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.released, true, 'Refresh idempotente preserva a saída voluntária');
    narrativeExit.click();
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.released, false);
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.mode, 'immersive');

    window.__FR_STAGE16__.cubeNarrative.select(9, { announce: false });
    window.__FR_STAGE16__.cubeNarrative.open(9, orbit);
    await new Promise(resolve => setTimeout(resolve, 30));
    cubeNarrativeAudit = window.FR_STAGE16.audit().cubeNarrative;
    assert.equal(cubeNarrativeAudit.projectIndex, 9);
    assert.equal(cubeNarrativeAudit.face, 4);
    assert.equal(cubeNarrativeAudit.cycle, 2);
    assert.equal(cubeNarrativeAudit.position, 18);
    assert.equal(cubeNarrativeAudit.drawerOpen, true);
    await new Promise(resolve => setTimeout(resolve, 410));
    const terminalWheel = new window.WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true });
    orbit.dispatchEvent(terminalWheel);
    assert.equal(terminalWheel.defaultPrevented, false, 'Depois do último painel a roda deve ser liberada');
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.complete, true);
    assert.deepEqual(['overflow', 'position', 'top', 'left', 'right', 'width'].map(key => document.body.style[key]), bodyBeforeCubeNarrative);
    await new Promise(resolve => setTimeout(resolve, 410));
    const returnFromTerminal = new window.WheelEvent('wheel', { deltaY: -120, bubbles: true, cancelable: true });
    orbit.dispatchEvent(returnFromTerminal);
    assert.equal(returnFromTerminal.defaultPrevented, true);
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.position, 17);
    assert.equal(window.FR_STAGE16.audit().cubeNarrative.drawerOpen, false);

    const bodyBeforePopups = ['overflow', 'position', 'top', 'left', 'right', 'width'].map(key => document.body.style[key]);
    window.switchView('view-ambientes');
    await new Promise(resolve => setTimeout(resolve, 760));
    const freshAmbientesRows = Array.from(document.querySelectorAll('#amb-grid-container [data-fr16-amb-index]'));
    const ambTrigger = freshAmbientesRows[4];
    const ambDossier = document.getElementById('fr16-amb-dossier');
    const ambPanel = ambDossier.querySelector('.fr16-amb-dossier-panel');
    const ambViewInertBeforePopup = document.getElementById('view-ambientes').hasAttribute('inert');
    ambTrigger.focus();
    ambTrigger.click();
    await new Promise(resolve => setTimeout(resolve, 100));
    assert.equal(ambDossier.classList.contains('is-open'), true);
    assert.equal(ambDossier.getAttribute('aria-hidden'), 'false');
    assert.equal(ambTrigger.getAttribute('aria-expanded'), 'true');
    assert.equal(document.activeElement, ambDossier.querySelector('[data-fr16-amb-close]'));
    assert.equal(document.body.style.position, 'fixed');
    assert.equal(document.body.classList.contains('fr16-popup-lock'), true);
    assert.equal(document.documentElement.classList.contains('fr16-cursor-managed'), true);
    assert.equal(document.getElementById('view-ambientes').getAttribute('aria-hidden'), 'true');
    assert.equal(document.getElementById('view-ambientes').hasAttribute('inert'), true);
    assert.equal(ambPanel.getAttribute('tabindex'), '-1');
    assert.equal(window.getComputedStyle(ambPanel).overflowY, 'auto');

    const ambFirstFocusable = ambDossier.querySelector('[data-fr16-amb-prev]');
    const ambLastFocusable = ambDossier.querySelector('[data-fr16-amb-budget-open]');
    ambLastFocusable.focus();
    ambLastFocusable.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    assert.equal(document.activeElement, ambFirstFocusable);
    ambFirstFocusable.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }));
    assert.equal(document.activeElement, ambLastFocusable);

    ambDossier.querySelector('[data-fr16-amb-next]').click();
    assert.equal(document.getElementById('fr16-amb-dossier-title').textContent, window.AMB_STYLES[5].name);
    assert.equal(ambTrigger.getAttribute('aria-expanded'), 'false');
    assert.equal(freshAmbientesRows[5].getAttribute('aria-expanded'), 'true');
    ambDossier.querySelector('[data-fr16-amb-prev]').click();
    assert.equal(document.getElementById('fr16-amb-dossier-title').textContent, window.AMB_STYLES[4].name);
    assert.equal(ambTrigger.getAttribute('aria-expanded'), 'true');
    ambPanel.scrollTop = 420;
    document.activeElement.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await new Promise(resolve => setTimeout(resolve, 100));
    assert.equal(ambDossier.hidden, true);
    assert.equal(document.activeElement, ambTrigger);
    assert.equal(ambTrigger.getAttribute('aria-expanded'), 'false');
    assert.equal(document.getElementById('view-ambientes').hasAttribute('inert'), ambViewInertBeforePopup);
    assert.deepEqual(['overflow', 'position', 'top', 'left', 'right', 'width'].map(key => document.body.style[key]), bodyBeforePopups);

    ambTrigger.click();
    await new Promise(resolve => setTimeout(resolve, 80));
    assert.equal(ambTrigger.getAttribute('aria-expanded'), 'true');
    assert.equal(ambPanel.scrollTop, 0);
    ambDossier.click();
    await new Promise(resolve => setTimeout(resolve, 100));
    assert.equal(ambDossier.hidden, true, 'Backdrop fecha o dossiê');
    assert.equal(document.activeElement, ambTrigger);
    assert.equal(ambTrigger.getAttribute('aria-expanded'), 'false');

    ambTrigger.click();
    await new Promise(resolve => setTimeout(resolve, 80));
    assert.equal(ambTrigger.getAttribute('aria-expanded'), 'true');
    ambDossier.querySelector('[data-fr16-amb-close]').click();
    await new Promise(resolve => setTimeout(resolve, 100));
    assert.equal(ambDossier.hidden, true, 'Botão close fecha o dossiê');
    assert.equal(document.activeElement, ambTrigger);
    assert.equal(ambTrigger.getAttribute('aria-expanded'), 'false');
    assert.deepEqual(['overflow', 'position', 'top', 'left', 'right', 'width'].map(key => document.body.style[key]), bodyBeforePopups);

    cursorTarget.focus();
    const returnTarget = document.activeElement;
    window.openProjectModal(window.GM_PROJECTS[0]);
    await new Promise(resolve => setTimeout(resolve, 80));
    const projectModal = document.getElementById('project-modal');
    assert.equal(projectModal.classList.contains('open'), true);
    assert.equal(document.body.style.position, 'fixed');
    window.IQE.abrir();
    await new Promise(resolve => setTimeout(resolve, 80));
    const iqe = document.getElementById('iqe-overlay');
    assert.equal(iqe.getAttribute('role'), 'dialog');
    assert.equal(iqe.getAttribute('aria-modal'), 'true');
    assert.equal(iqe.getAttribute('aria-labelledby'), 'iqe-marca');
    await waitFor(() => document.activeElement?.id === 'iqe-fechar');
    assert.equal(document.activeElement?.id, 'iqe-fechar');
    assert.equal(projectModal.getAttribute('aria-hidden'), 'true');
    assert.equal(projectModal.hasAttribute('inert'), true);
    document.activeElement.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await new Promise(resolve => setTimeout(resolve, 100));
    assert.equal(document.getElementById('iqe-overlay'), null);
    assert.equal(projectModal.classList.contains('open'), true);
    assert.equal(projectModal.getAttribute('aria-hidden'), 'false');
    assert.equal(projectModal.hasAttribute('inert'), false);
    assert.equal(projectModal.contains(document.activeElement), true);
    assert.equal(document.body.style.position, 'fixed');
    document.activeElement.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await new Promise(resolve => setTimeout(resolve, 100));
    assert.equal(projectModal.classList.contains('open'), false);
    assert.equal(document.activeElement, returnTarget);
    assert.deepEqual(['overflow', 'position', 'top', 'left', 'right', 'width'].map(key => document.body.style[key]), bodyBeforePopups);

    returnTarget.focus();
    window.__frCore.handle.showWhatIf({ dataset: { title: 'Teste de foco', desc: 'Modal de caracterização.' } });
    await new Promise(resolve => setTimeout(resolve, 80));
    assert.ok(document.getElementById('modal-backdrop'));
    await waitFor(() => document.getElementById('modal-backdrop')?.contains(document.activeElement));
    assert.equal(document.getElementById('modal-backdrop').contains(document.activeElement), true);
    document.activeElement.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await new Promise(resolve => setTimeout(resolve, 80));
    assert.equal(document.getElementById('modal-backdrop'), null);
    assert.equal(document.activeElement, returnTarget);

    returnTarget.focus();
    window.toggleGodMode(true);
    await new Promise(resolve => setTimeout(resolve, 80));
    const godMode = document.getElementById('god-mode-panel');
    assert.equal(godMode.getAttribute('role'), 'dialog');
    await waitFor(() => godMode.contains(document.activeElement));
    assert.equal(godMode.contains(document.activeElement), true);
    document.activeElement.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await new Promise(resolve => setTimeout(resolve, 80));
    assert.equal(godMode.classList.contains('fr10-gm-open'), false);
    assert.equal(document.activeElement, returnTarget);

    pointer(window, cursorTarget, 'pointermove', { pointerId: 30, pointerType: 'mouse', clientX: 360, clientY: 220 });
    await new Promise(resolve => setTimeout(resolve, 30));
    const persistedHide = new window.Event('pagehide');
    Object.defineProperty(persistedHide, 'persisted', { value: true });
    window.dispatchEvent(persistedHide);
    assert.equal(document.body.classList.contains('fr16-cursor-ready'), false);
    const persistedShow = new window.Event('pageshow');
    Object.defineProperty(persistedShow, 'persisted', { value: true });
    window.dispatchEvent(persistedShow);
    pointer(window, cursorTarget, 'pointermove', { pointerId: 31, pointerType: 'mouse', clientX: 370, clientY: 230 });
    await new Promise(resolve => setTimeout(resolve, 30));
    assert.equal(document.body.classList.contains('fr16-cursor-ready'), true);
    const finalHide = new window.Event('pagehide');
    Object.defineProperty(finalHide, 'persisted', { value: false });
    window.dispatchEvent(finalHide);
    assert.equal(document.body.classList.contains('fr16-cursor-ready'), false);
    assert.equal(document.documentElement.classList.contains('fr16-cursor-managed'), false);
    assert.equal(document.getElementById('fr16-portfolio'), null);
    assert.equal(legacyPortfolio.hasAttribute('aria-hidden'), false);
    assert.equal(legacyPortfolio.hasAttribute('inert'), false);
    assert.equal(document.getElementById('fr16-amb-dossier'), null);
    assert.equal(document.getElementById('fr16-cube-narrative'), null);
    assert.equal(cubeLab.classList.contains('fr16-cube-narrative'), false);
    assert.equal(cubeLab.classList.contains('is-immersive'), false);
    assert.equal(orbit.hasAttribute('aria-details'), false);
    assert.equal(orbit.hasAttribute('aria-describedby'), false);
    assert.equal(document.getElementById('fr16-p3d-instructions'), null);
    assert.equal(ambientesView.classList.contains('fr16-amb-canonical'), false);
    assert.equal(ambientesGrid.classList.contains('fr16-amb-index'), false);
    assert.equal(legacyAmbientesAtlas.hidden, false);
    assert.equal(legacyAmbientesAtlas.hasAttribute('aria-hidden'), false);
    assert.equal(legacyAmbientesAtlas.hasAttribute('inert'), false);
    assert.equal(legacyCurator.hidden, false);
    assert.equal(legacyCurator.hasAttribute('inert'), false);
    assert.deepEqual(runtimeErrors, []);
  } finally {
    dom.window.close();
  }
});
