'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { JSDOM } = require('jsdom');
const { parseReport, catalog, verify } = require('../scripts/prepare-price-reference.cjs');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const source = fs.readFileSync('index.html', 'utf8');
const reportText = fs.readFileSync('FR_COMPARATIVO_LEROY_MERLIN_2026-10-08.md', 'utf8');
const data = parseReport(reportText);
const published = JSON.parse(fs.readFileSync('assets/data/price-reference-2026-10-08.json', 'utf8'));
const media = JSON.parse(fs.readFileSync('docs/site-refactor/case-media-verification.json', 'utf8'));
test('anexo integral: 115 serviços, 167 grupos, 403 opções e 94 fontes; sem alteração financeira', () => {
  assert.deepEqual(published, data);
  assert.deepEqual(verify(data, catalog(source)), { services:115,groups:167,options:403,references:94,financialChanges:false });
  const baseline = catalog(execFileSync('git', ['show', '49295469979958569d2f6f5a32c397853f2fb7a9:index.html'], { encoding:'utf8', maxBuffer:3e6 }));
  // Sole editorial correction requested by priority 8 of the supplied report.
  baseline.SERVICES.pis_vinilico.descricao='Instalação de piso vinílico conforme sistema, produto e preparação da base. Uso em áreas molhadas depende das instruções do fabricante; não presumir impermeabilidade ou aplicação em box.';
  assert.equal(JSON.stringify(catalog(source)), JSON.stringify(baseline), 'banco inteiro idêntico à base, exceto correção explícita da descrição do vinílico; nenhum campo financeiro alterado');
  assert.equal(data.gaps.length, 17); assert.equal(data.priorities.length, 10);
  assert.ok(data.references.every(r => r.url.startsWith('https://www.leroymerlin.com.br/')));
  assert.ok(data.references.filter(r => r.status !== 'historical').every(r => r.price === null));
  for (const code of ['50028682','50034233','50039373','50022006']) assert.equal(data.references.find(r => r.code === code).price, null, code + ': divergência, zero ou indexação não são cotação');
  assert.ok(data.gaps.every(g => g.approval === 'pending_scope_and_fr_price'));
  const changed = JSON.parse(JSON.stringify(baseline)); changed.SERVICES.chuveiro.preco_base++;
  assert.throws(() => verify(data, changed), /Catálogo divergente/);
  assert.throws(() => parseReport(reportText.replaceAll('https://www.leroymerlin.com.br/s/reforma-de-banheiro-de-6', 'https://evil.example/s/reforma-de-banheiro-de-6')), /Fonte inválida/);
});
test('57 mídias e 162 variantes liberadas por ficha; rastreabilidade e teto nativo preservados', () => {
  const w = {}; vm.runInNewContext(fs.readFileSync('assets/js/media-catalog.js','utf8'), {window:w});
  const c = w.FR_MEDIA_CATALOG;
  assert.equal(c.assets.length,57);assert.equal(c.model_3d,null);assert.equal(c.real_execution_proven,false);
  assert.equal(media.assets.length,57);assert.equal(media.holdPublished,0);
  assert.equal(media.originals.length,120);
  assert.equal(new Set(media.originals.map(o=>o.file)).size,120);
  assert.ok(media.originals.every(o=>/^[a-f0-9]{64}$/.test(o.sha256)&&o.publication==='not_published_original'));
  const expected = [];
  for (const asset of media.assets) {
    const item = c.assets.find(a => a.media_id === asset.id);
    const ficha = fs.readFileSync(asset.context,'utf8');
    assert.equal(hash(asset.context),asset.contextSha256);
    assert.ok(item && item.status === 'READY_WITH_LABEL');
    assert.ok(['aprovado','candidato'].includes(asset.state));
    // The historic forensic dossier retains the original source label and SHA.
    // The site presents updated work labels without rewriting immutable evidence.
    assert.match(ficha, /^\s*-\s*\*\*Rótulo público obrigatório:\*\* .+$/m);
    assert.ok(ficha.includes('**SHA-256 da fonte:** ' + asset.sourceHash));
    for (const variant of asset.variants) {
      expected.push(variant.file.split('/').pop());
      assert.equal(hash(variant.file),variant.sha256,variant.file);
      assert.ok(fs.readFileSync('docs/site-refactor/media-context/'+variant.file.split('/').pop().replace('.webp','.md'),'utf8').includes('**SHA-256 do arquivo entregue:** '+variant.sha256));
      assert.ok(variant.width <= asset.native[0] && variant.height <= asset.native[1]);
      assert.equal(variant.crop_box,null);
      if (asset.id === 'M047_PANEL_DIREITO') assert.ok(variant.width <= 472);
    }
  }
  assert.equal(expected.length,162);
  assert.deepEqual(fs.readdirSync('assets/media/fr-coz-lav').sort(),expected.sort(), 'nenhum derivado adicional/HOLD publicado');
  const doc = new JSDOM(source).window.document;
  const scripts = [...doc.scripts].map(s => s.getAttribute('src')).filter(Boolean);
  assert.ok(scripts.indexOf('assets/js/media-catalog.js') < scripts.indexOf('assets/js/fr-media-case.js'));
  assert.ok(!/GM_PROJECTS\s*=|FR_DEFAULT_PROJECTS\s*=|AMB_STYLES\s*=|addToBudget\(/.test(fs.readFileSync('assets/js/fr-media-case.js','utf8')));
});
test('galeria reconstrói host, filtra setor e mantém rótulo sem exigir JavaScript ao crawler', async () => {
  const dom = new JSDOM('<main><section id="view-projetos" class="view-section active"><div id="fr16-portfolio"></div></section></main>', {runScripts:'outside-only'});
  dom.window.eval(fs.readFileSync('assets/js/media-catalog.js','utf8'));
  dom.window.eval(fs.readFileSync('assets/js/fr-media-case.js','utf8'));
  dom.window.FRMediaCase.integrate();
  const doc=dom.window.document;
  assert.equal(doc.querySelectorAll('#frmedia-cozinha-lavanderia .frmedia-card').length,57);
  assert.ok([...doc.querySelectorAll('.frmedia-label')].every(n => ['OBRA REALIZADA · REPRESENTAÇÃO DIGITAL','PROJETO 3D · FRANCO ROMEU','RECONSTITUIÇÃO TÉCNICA'].includes(n.textContent)));
  doc.querySelector('[data-group="LAV"]').click();
  assert.equal(doc.querySelectorAll('#frmedia-cozinha-lavanderia .frmedia-card').length,6);
  doc.getElementById('fr16-portfolio').remove();
  const replacement=doc.createElement('div');replacement.id='fr16-portfolio';doc.getElementById('view-projetos').appendChild(replacement);
  dom.window.FRMediaCase.integrate();dom.window.FRMediaCase.integrate();
  assert.equal(replacement.querySelectorAll('#frmedia-cozinha-lavanderia').length,1);
  assert.equal(replacement.querySelectorAll('#frmedia-cozinha-lavanderia img').length,58); // 57 posters + empty dialog image
  replacement.replaceChildren();
  await new Promise(resolve=>dom.window.setTimeout(resolve,20));
  assert.equal(replacement.querySelectorAll('#frmedia-cozinha-lavanderia .frmedia-card').length,57,'reconstrução interna do mesmo host observada automaticamente');
  const cloned=replacement.querySelector('#frmedia-cozinha-lavanderia').cloneNode(true);
  replacement.replaceChildren(cloned);dom.window.FRMediaCase.integrate();
  assert.notEqual(replacement.querySelector('#frmedia-cozinha-lavanderia'),cloned,'a serialized live attribute cannot prove that a clone has listeners');
  replacement.querySelector('#frmedia-cozinha-lavanderia [data-group="LAV"]').click();
  assert.equal(replacement.querySelectorAll('#frmedia-cozinha-lavanderia .frmedia-card').length,6,'a cloned host regains working filter listeners');
  dom.window.close();
});
test('quantidade usa o input existente e seu evento: limites, decimais, vazio e montagem idempotente', () => {
  const dom=new JSDOM('<div id="step-content-container"><input type="number" data-action="updateServiceQty" min="0.01" step="any" max="4"></div>',{runScripts:'outside-only'});
  const w=dom.window,doc=w.document;w.matchMedia=()=>({matches:true});
  const input=doc.querySelector('input'),values=[];input.addEventListener('input',()=>values.push(input.value));
  w.eval(fs.readFileSync('assets/js/fr-quantity-control.js','utf8'));w.FRQuantityControl.mount();
  assert.equal(doc.querySelectorAll('.fr-quantity').length,1);assert.equal(doc.querySelector('input'),input);
  assert.equal(doc.getElementById('step-content-container').classList.contains('fr-quantity-editor'),true);
  const minus=doc.querySelector('[aria-label="Diminuir quantidade"]'),plus=doc.querySelector('[aria-label="Aumentar quantidade"]');
  assert.equal(minus.disabled,true);plus.click();assert.equal(input.value,'1');assert.deepEqual(values,['1']);
  input.value='2.5';input.dispatchEvent(new w.Event('input'));minus.click();assert.equal(input.value,'1.5');
  input.value='1.123456789';input.dispatchEvent(new w.Event('input'));plus.click();assert.equal(input.value,'2.123456789','incremento não pode truncar a medida a seis casas');
  input.value='0.02';input.dispatchEvent(new w.Event('input'));minus.click();assert.equal(input.value,'0.01');assert.equal(minus.disabled,true);
  input.value='4';input.dispatchEvent(new w.Event('input'));assert.equal(plus.disabled,true);assert.equal(input.getAttribute('aria-valuenow'),'4');
  assert.doesNotMatch(fs.readFileSync('assets/js/fr-quantity-control.js','utf8'),/appState|selectedServices|calculateBudget|preco_base/);
  dom.window.close();
});
test('PDF mostra visita efetivamente cobrada pelo núcleo, não o valor nominal isentado', () => {
  const start=source.indexOf('function criarConteudoPDF()'),end=source.indexOf('function setFieldError',start);
  function template(waived){const context={calculateTotal:()=>({subtotal:waived?600:450,discount:0,paymentDiscount:0,total:waived?600:549,visit:99,visitCharged:waived?0:99,visitWaived:waived}),getMaterialsListHTML:()=>'',appState:{selectedServices:[],clientData:{},address:{}},escapeHTML:()=>''};vm.runInNewContext(source.slice(start,end)+';result=criarConteudoPDF();',context);return new JSDOM(context.result).window.document.body.textContent;}
  assert.match(template(true),/Visita Técnica:\s*Isenta/);
  assert.match(template(false),/Visita Técnica:\s*R\$ 99,00/);
  assert.match(template(false),/REFERÊNCIA CENTRAL: R\$ 549,00/);
  assert.match(source.slice(start,end),/toLocaleDateString\('pt-BR', \{ timeZone: 'America\/Sao_Paulo' \}\)/);
  assert.match(source.slice(start,end),/Number\(value\)\.toFixed\(2\)/,'formatar a moeda não pode alterar o arredondamento vigente');
});
