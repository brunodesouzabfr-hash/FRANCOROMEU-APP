'use strict';
/* Public-copy gate: user confirmed that showcased Franco Romeu works were
 * physically executed. Do not reintroduce dismissive labels on media.
 * Keep honest distinctions for CGI/3D views and technical reconstructions.
 * Original evidence/provenance fields and asset filenames are not rewritten. */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');
const ROOT=path.resolve(__dirname,'..'),DIST=path.join(ROOT,'dist');
const forbidden=[
 /imagem(?:ns)?\s+(?:meramente\s+)?ilustrativ[ao]s?/i,
 /estudo(?:s)?\s+ilustrativ[ao]s?/i,
 /(?:comparativo|reconstitui[çc][aã]o)\s+ilustrativ[ao]s?/i,
 /n[aã]o\s+comprova\s+(?:a\s+)?(?:execu[çc][aã]o|obra)/i,
 /n[aã]o\s+(?:é|e|representa)\s+(?:uma?\s+)?obra\s+executada/i,
 /n[aã]o\s+(?:s[aã]o|[eé])\s+(?:fotos?|registros?)\s+de\s+execu[çc][aã]o/i,
 /obra\s+n[aã]o\s+executada/i,
 /execu[çc][aã]o\s+documental\s+pendente/i,
 /o\s+acervo\s+executado\s+ser[aá]\s+identificado\s+individualmente\s+quando\s+validado/i,
 /n[aã]o\s+(?:[ée]\s+)?registro\s+de\s+obra\s+executada/i,
 /n[aã]o\s+representa\s+obra\s+executada/i
];
const list=dir=>fs.existsSync(dir)?fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
 const file=path.join(dir,e.name);return e.isDirectory()?list(file):[file];
}):[];
function hits(text){return forbidden.filter(p=>p.test(text)).map(p=>String(p))}
function accessibleText(doc){
 doc.querySelectorAll('script,style,noscript,template').forEach(n=>n.remove());
 let visible=doc.body?.textContent||'';
 const attributes=[...doc.querySelectorAll('*')].flatMap(n=>
  ['alt','title','aria-label','placeholder','data-fr-caption','data-fr-label'].map(a=>n.getAttribute(a)).filter(Boolean));
 const metadata=[...doc.querySelectorAll('meta[name="description"],meta[property^="og:"],meta[name^="twitter:"]')].map(n=>n.content||'');
 return [visible,...attributes,...metadata].join('\n');
}
test('public HTML has no captions, meta, labels or alt text denying executed Franco Romeu work',()=>{
 const pages=list(DIST).filter(p=>p.endsWith('.html'));
 assert.ok(pages.length>=7,'Build must produce public routes and journal');
 let checked=0,problems=[];
 for(const file of pages){
  const html=fs.readFileSync(file,'utf8');
  // Quick reject before parsing: catches HTML and generated inline content;
  // URLs are excluded by the full DOM/attribute extraction.
  if(!forbidden.some(p=>p.test(html)))continue;
  const dom=new JSDOM(html),text=accessibleText(dom.window.document);
  const found=hits(text);
  if(found.length)problems.push({file:path.relative(DIST,file),patterns:found});
  dom.window.close();checked++;
 }
 assert.deepEqual(problems,[],'Public-facing claims need rewriting in their generating sources');
 assert.ok(pages.length>=7,'Public build did not contain enough pages');
});
test('source index and deployed media/catalog presentation fields use affirmed brand language',()=>{
 const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
 const doc=new JSDOM(html).window.document;
 assert.deepEqual(hits(accessibleText(doc)),[]);
 doc.defaultView.close();
 const mediaSource=fs.readFileSync(path.join(ROOT,'assets/js/media-catalog.js'),'utf8');
 const media=JSON.parse(mediaSource.replace(/^window\.FR_MEDIA_CATALOG\s*=\s*/,'').replace(/;\s*$/,''));
 const inspect=[...(media.assets||[])];
 assert.ok(inspect.length>20);
 for(const asset of inspect){
  assert.deepEqual(hits([asset.publication_label,asset.title,asset.alt,asset.description].join(' ')),[],asset.media_id);
 }
 const projects=JSON.parse(fs.readFileSync(path.join(ROOT,'content/projects/projects.json'),'utf8'));
 for(const p of projects.projects||[]){
  assert.deepEqual(hits([p.title,p.required_public_label,p.description,p.excerpt].join(' ')),[],p.project_id);
 }
 const runtime=fs.readFileSync(path.join(ROOT,'assets/patches/fr-additions-2026-10-14/fr-additions.js'),'utf8');
 assert.doesNotMatch(runtime,/N[AÃ]O COMPROVA EXECU[ÇC][AÃ]O|IMAGEM ILUSTRATIVA/i);
});

test('generated media carries explicit digital-representation labels',()=>{
  const script=fs.readFileSync(path.join(ROOT,'assets/js/media-catalog.js'),'utf8');
  const media=JSON.parse(script.replace(/^window\\.FR_MEDIA_CATALOG\\s*=\\s*/,'').replace(/;\\s*$/,''));
  assert.equal(media.nature,'visualizacao_ilustrativa','Media catalog source kind must be preserved');
  const representations=(media.assets||[]).filter(m=>m.publication_label==='OBRA REALIZADA · REPRESENTAÇÃO DIGITAL');
  assert.ok(representations.length>=20,'Generated project visuals should be identified');
  for(const m of media.assets||[]){
    assert.notEqual(m.publication_label,'PROJETO REALIZADO · FRANCO ROMEU',m.media_id+' may be mistaken for documentary photography');
    if(m.alt?.startsWith('Representação digital de projeto realizado'))assert.match(m.publication_label||'',/REPRESENTAÇÃO DIGITAL/);
  }
  const prep=fs.readFileSync(path.join(ROOT,'scripts/prepare-project-library.cjs'),'utf8');
  assert.ok(prep.includes("if(raw.narrative_stage==='ILLUSTRATIVE_AFTER')return 'Depois — representação visual do projeto';"));
  assert.equal(prep.includes("if(raw.narrative_stage==='ILLUSTRATIVE_AFTER')return 'Depois — realização Franco Romeu';"),false);
});
