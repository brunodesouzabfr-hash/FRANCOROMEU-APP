'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const {install,blocks}=require('../src/fr-seo-indexing-phase910.cjs');
const ORIGIN='https://www.francoromeufr.com.br';
test('F9.10 editorial inserts unique source-backed sections without replacing existing SPA contracts',()=>{
 const dom=new JSDOM('<html><head></head><body><section id="view-home"><h1>Início</h1></section><section id="view-projetos"><h1>Portfólio</h1><div id="existing-portfolio"></div></section><section id="view-projetos3d"><h1>3D</h1><div id="existing-p3d"></div></section><section id="view-orcamento"><h1>Orçamento</h1></section></body></html>');
 const doc=dom.window.document;
 const out=install(doc);
 assert.equal(out.sections,2);
 assert.equal(doc.querySelectorAll('section.frsi').length,2);
 assert.ok(doc.querySelector('#existing-portfolio'));
 assert.ok(doc.querySelector('#existing-p3d'));
 assert.equal(doc.querySelectorAll('#view-home .frsi').length,0);
 assert.equal(doc.querySelectorAll('#view-orcamento .frsi').length,0);
 assert.equal(doc.querySelectorAll('#view-projetos h1').length,1);
 assert.equal(doc.querySelectorAll('#view-projetos3d h1').length,1);
 assert.equal(doc.querySelectorAll('.frsi h2').length,2);
 assert.equal(doc.querySelectorAll('link[href="/assets/css/fr-seo-indexing-phase910.css"]').length,1);
 assert.equal(doc.querySelectorAll('.frsi-links a').length,6);
 for(const block of blocks){
  const section=doc.getElementById(block.section);
  assert.ok(section.closest('#'+block.id));
  assert.equal(section.querySelector('h2').textContent,block.title);
  assert.equal(section.querySelector('nav').children.length,3);
 }
 assert.throws(()=>install(doc),/repeated install/);
 dom.window.close();
});
test('F9.10 static service hub and four detail pages gain reciprocal contextual links to indexable SPA views',()=>{
 const build=fs.readFileSync('scripts/build-local-services.cjs','utf8');
 assert.match(build,/const related=/);
 assert.match(build,/href=\\"\\/portfolio\\"/);
 assert.match(build,/href=\\"\\/projetos-3d\\"/);
 if(!fs.existsSync('dist/solucoes/index.html'))return;
 const urls=['solucoes',...JSON.parse(fs.readFileSync('content/local-services.json','utf8')).services.map(s=>'solucoes/'+s.id)];
 for(const folder of urls){
  const html=fs.readFileSync(path.join('dist',folder,'index.html'),'utf8');
  assert.match(html,/<a href="\/portfolio">portfólio de referências<\/a>/);
  assert.match(html,/<a href="\/projetos-3d">estudos em 3D<\/a>/);
  assert.ok(html.includes('<link rel="canonical" href="'+ORIGIN+'/'+folder+'/">'));
 }
});
test('F9.10 generated SPA views keep distinct self-referencing canonicals and readable route context',()=>{
 if(!fs.existsSync('dist/index.html'))return;
 const src=fs.readFileSync('scripts/build-site.cjs','utf8');
 assert.match(src,/fr-seo-indexing-phase910/);
 const expected=[
  ['portfolio.html','/portfolio','frsi-portfolio'],
  ['projetos-3d.html','/projetos-3d','frsi-projetos3d']
 ];
 for(const [file,route,sectionId] of expected){
  const html=fs.readFileSync(path.join('dist',file),'utf8');
  assert.match(html,new RegExp('<link\\s+rel="canonical"\\s+href="'+ORIGIN+route+'"'));
  assert.ok(html.includes('id="'+sectionId+'"'));
  assert.ok(html.includes('<meta name="robots" content="index, follow, max-image-preview:large">'));
  assert.ok(html.includes('href="/assets/css/fr-seo-indexing-phase910.css"'));
  assert.ok(html.includes('href="/solucoes/"'));
 }
 assert.equal(fs.readFileSync('dist/sitemap.xml','utf8').match(/<loc>/g).length,11);
});
test('F9.10 canonical host and trailing slash redirect rules stay deterministic and preserve aliases',()=>{
 const cfg=JSON.parse(fs.readFileSync('vercel.json','utf8'));
 for(const route of ['sobre','ambientes','projetos-3d','portfolio','orcamento']){
  const found=cfg.redirects.filter(r=>r.source==='/'+route+'/');
  assert.equal(found.length,1);
  assert.equal(found[0].destination,'/'+route);
  assert.equal(found[0].permanent,true);
 }
 for(const suffix of ['solucoes','solucoes/marcenaria-sob-medida','solucoes/drywall','solucoes/pisos','solucoes/revestimentos-e-acabamentos']){
  const found=cfg.redirects.filter(r=>r.source==='/'+suffix);
  assert.equal(found.length,1);
  assert.equal(found[0].destination,'/'+suffix+'/');
  assert.equal(found[0].permanent,true);
 }
 assert.ok(cfg.redirects.some(r=>r.has?.some(h=>h.value==='francoromeu-app.vercel.app')));
 assert.ok(cfg.redirects.some(r=>r.has?.some(h=>h.value==='francoromeufr.com.br')));
});
