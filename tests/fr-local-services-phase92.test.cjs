'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const ORIGIN='https://www.francoromeufr.com.br';
const config=JSON.parse(fs.readFileSync('content/local-services.json','utf8'));
const institution=JSON.parse(fs.readFileSync('content/media/organization.json','utf8'));
const serviceMap=JSON.parse(fs.readFileSync('content/services/media-service-map.json','utf8'));
const route=id=>'/solucoes/'+id+'/';
const read=r=>new JSDOM(fs.readFileSync(path.join('dist',r.slice(1),'index.html'),'utf8')).window.document;
test('F9.2 catalog is a curated subset of verified institutional service IDs',()=>{
 assert.equal(config.schema_version,'fr-local-solutions-1.0.0');
 assert.equal(config.services.length,4);
 const names=new Set(serviceMap.services.map(s=>s.service_id));
 for(const row of config.services){
  assert.ok(names.has(row.id),'unverified service '+row.id);
  assert.ok(row.meta.length>=90,'thin meta '+row.id);
  assert.ok(row.intro.length>=140,'thin introduction '+row.id);
  assert.equal(row.applications.length,3);
  assert.equal(row.steps.length,4);
  assert.equal(row.faq.length,2);
 }
 assert.deepEqual(institution.jsonld_base.areaServed.map(s=>s.name),['São Paulo','Guarulhos','Osasco','Barueri','Santo André','São Bernardo do Campo']);
});
test('F9.2 every landing page has unique H1, canonical, metadata and Service graph',()=>{
 const seen=new Set();
 for(const item of config.services){
  const r=route(item.id),doc=read(r);
  assert.equal(doc.querySelector('link[rel="canonical"]')?.href,ORIGIN+r);
  assert.equal(doc.querySelectorAll('h1').length,1);
  assert.equal(doc.querySelector('h1').textContent.trim(),item.heading);
  assert.ok(doc.querySelector('meta[name="description"]')?.content.includes('São Paulo'));
  assert.match(doc.querySelector('meta[name="robots"]')?.content,/index/);
  assert.ok(doc.querySelectorAll('.frls-item').length>=7);
  assert.equal(doc.querySelectorAll('.frls-faq details').length,2);
  assert.ok(doc.querySelector('a[href="/orcamento"]'));
  assert.ok(doc.querySelector('a[href^="https://wa.me/"]'));
  assert.ok(!doc.querySelector('form, input, textarea'),'No collection of personal data on static pages');
  assert.equal(doc.querySelectorAll('script[src="/assets/js/fr-conversion-phase9.js"]').length,1);
  assert.equal(doc.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]').length,1);
  const g=JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
  const service=g.filter(x=>x['@type']==='Service');
  assert.equal(service.length,1);
  assert.equal(service[0].provider['@id'],ORIGIN+'/#organization');
  assert.deepEqual(service[0].areaServed.map(a=>a.name),institution.jsonld_base.areaServed.map(a=>a.name));
  assert.equal(g.some(x=>x['@type']==='BreadcrumbList'),true);
  const text=doc.body.textContent;
  assert.doesNotMatch(text,/garantimos 3 anos|cliente satisfeito|avaliado com cinco estrelas|promoção imperdível/i);
  seen.add(doc.title);
  doc.defaultView.close();
 }
 assert.equal(seen.size,4);
});
test('F9.2 hub links to four details and retains canonical root',()=>{
 const doc=read('/solucoes/');
 assert.equal(doc.querySelector('link[rel="canonical"]').href,ORIGIN+'/solucoes/');
 assert.equal(doc.querySelectorAll('h1').length,1);
 assert.equal(doc.querySelectorAll('script[type="application/ld+json"]').length,1);
 assert.match(doc.querySelector('meta[name="robots"]').content,/index/);
 for(const item of config.services)assert.ok(doc.querySelector('a[href="'+route(item.id)+'"]'),item.id);
 doc.defaultView.close();
});
test('F9.2 sitemap includes exactly five allowed solution paths, not unapproved media',()=>{
 const map=JSON.parse(fs.readFileSync('.artifacts/build/PUBLIC_MEDIA_MAP.json','utf8'));
 const pages=map.routes.filter(r=>r.category==='local-service');
 assert.equal(pages.length,5);
 assert.equal(pages.filter(r=>r.indexable).length,5);
 const urls=pages.map(p=>ORIGIN+p.route).sort();
 assert.deepEqual(urls,[ORIGIN+'/solucoes/',...config.services.map(s=>ORIGIN+route(s.id))].sort());
 const sitemap=fs.readFileSync('dist/sitemap.xml','utf8');
 for(const url of urls)assert.ok(sitemap.includes('<loc>'+url+'</loc>'),url);
 for(const row of pages){
   assert.ok(fs.existsSync(path.join('dist',row.file)),row.file);
   assert.deepEqual(row.media_ids,[]);
 }
});
test('F9.2 discovery is visible within main SPA views with no duplicate ids or route conflicts',()=>{
 for(const name of ['index.html','sobre.html','orcamento.html']){
  const doc=new JSDOM(fs.readFileSync(path.join('dist',name),'utf8')).window.document;
  const blocks=doc.querySelectorAll('.frls-discovery');
  assert.equal(blocks.length,3,name);
  assert.equal(doc.querySelectorAll('[id="frls-discovery"]').length,0,name);
  for(const section of ['view-home','view-sobre','view-orcamento'])
    assert.ok(doc.querySelector('#'+section+' .frls-discovery'),section);
  assert.equal(doc.querySelectorAll('link[href="/assets/css/fr-local-services.css"]').length,1);
  doc.defaultView.close();
 }
});
