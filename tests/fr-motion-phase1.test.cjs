'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');
const build=require('../src/fr-motion-phase1.cjs');
const {normalizePair,chooseHome,findSameProject3D}=build._internal;
const heroMarkup='<!doctype html><html><head></head><body><div id="view-home"><section class="fr6-hero"></section><section id="other-home"></section></div><div id="view-projetos"><div class="fr10-portfolio-stage"></div></div></body></html>';
const curated=['FR-BA010','FR-BA055','FR-BA007','FR-BA034','FR-BA059'];
function fixture(total=60){
 const media={},pairs=[];
 for(let i=0;i<total;i++){
  const id=curated[i]||'FR-BA'+String(100+i),projectId='FR-P'+i;
  const before='BEFORE'+i,after='AFTER'+i;
  for(const mid of [before,after])media[mid]={media_id:mid,canonicalFile:'assets/media/'+mid+'.webp',alt:'Registro FR',stage:mid.startsWith('BEFORE')?'BEFORE':'APPLICATION',variants:[{canonical:true,width:800,height:900}]};
  pairs.push({pair_id:id,project_id:projectId,before_media_id:before,after_media_id:after,
   project:{title:'Estudo ilustrativo — Ambiente '+i+' — Reforma '+i,environment_ids:['E'+i]},
   interventions:['Marcenaria','Acabamento'],route:'/projetos/antes-depois/'+i+'/'});
 }
 const env=new Map(pairs.map((_,i)=>['E'+i,{name:'Espaço '+i}]));
 return {data:{pairs,media},l:{maps:{environments:env}}};
}
test('Phase 2: five explicit editorial scenes and all 60 portfolio comparisons are rendered as separate fullscreen stages',()=>{
 const dom=new JSDOM(heroMarkup),d=dom.window.document,prepared=fixture(60);
 const result=build(d,prepared);
 assert.equal(result.home,5);assert.equal(result.portfolio,60);
 assert.deepEqual(result.homePairIds,curated);assert.equal(result.projectToExecution,false);
 const home=d.querySelector('#frms-home'),portfolio=d.querySelector('#frms-portfolio');
 assert.equal(home.dataset.frmsScrollHeight,'500');assert.equal(portfolio.dataset.frmsScrollHeight,'4820');
 assert.equal(home.querySelectorAll('.frms-card').length,5);
 assert.equal(portfolio.querySelectorAll('.frms-card').length,60);
 assert.equal(portfolio.querySelectorAll('figure img').length,120);
 assert.equal(home.previousElementSibling.className,'fr6-hero');
 assert.equal(portfolio.nextElementSibling.id,'frms-portfolio-links');
 assert.equal(portfolio.nextElementSibling.nextElementSibling.className,'fr10-portfolio-stage');
 assert.equal(portfolio.querySelectorAll('[data-frms-jump]').length,60);
 assert.equal(portfolio.querySelectorAll('.frms-card a[href^="/projetos/"]').length,60);
 assert.equal(d.querySelectorAll('#frms-portfolio-links a').length,3);
 assert.match(home.querySelector('.frms-card-title').textContent,/Ambiente 0 — Reforma 0/);
 assert.doesNotMatch(home.querySelector('.frms-card-title').textContent,/ilustrativ/i);
 assert.match(home.querySelector('.frms-card-kicker').textContent,/Espaço 0/);
 assert.equal(d.querySelectorAll('script[src="/assets/js/fr-motion-split.js"]').length,1);
 assert.ok(d.querySelector('link[href="/assets/css/fr-motion-split.css"]'));
 assert.equal(prepared.data.pairs.length,60);
 dom.window.close();
});
test('Phase 2: project 3D and executed scene are joined only for one canonical project',()=>{
 const fixtureData=fixture(),items=fixtureData.data.media;
 items.render={media_id:'render',project_ids:['FR-C001'],nature:'RENDER',stage:'PROJECT_3D',canonicalFile:'assets/media/render.webp',variants:[{width:500,height:500,canonical:true}]};
 items.executed={media_id:'executed',project_ids:['FR-C001'],nature:'ILLUSTRATIVE',stage:'APPLICATION',canonicalFile:'assets/media/executed.webp',variants:[{width:500,height:500,canonical:true}]};
 items.wrong={media_id:'wrong',project_ids:['FR-X'],nature:'ILLUSTRATIVE',stage:'APPLICATION'};
 const same=findSameProject3D(fixtureData);
 assert.equal(same.before_media_id,'render');assert.equal(same.after_media_id,'executed');
 const dom=new JSDOM(heroMarkup),result=build(dom.window.document,fixtureData);
 assert.equal(result.projectToExecution,true);
 assert.equal(result.homePairIds[2],'FR-C001-3D-EXEC');
 assert.match(dom.window.document.querySelectorAll('#frms-home .frms-card-top')[2].textContent,/PROJETO 3D/);
 dom.window.close();
});
test('Phase 2: pair metadata belongs to its own project and catalog does not create cross-project pairs',()=>{
 const f=fixture(),p=normalizePair(f.data.pairs[0],f.l.maps.environments);
 assert.equal(p.title,'Ambiente 0 — Reforma 0');assert.equal(p.environment,'Espaço 0');
 assert.equal(p.before_media_id,'BEFORE0');assert.equal(p.after_media_id,'AFTER0');
 assert.equal(findSameProject3D(f),null);
 assert.deepEqual(chooseHome(f.data.pairs.map(x=>normalizePair(x,f.l.maps.environments)),null).map(x=>x.pair_id),curated);
});
test('Phase 2: incomplete media, missing anchors and curation errors fail loudly',()=>{
 const d=new JSDOM(heroMarkup).window.document,p=fixture(7);
 delete p.data.media.BEFORE3;
 assert.throws(()=>build(d,p),/incomplete canonical comparisons/);
 const p2=fixture(7),empty=new JSDOM('<main></main>').window.document;
 assert.throws(()=>build(empty,p2),/insert points missing/);
 assert.throws(()=>chooseHome(p2.data.pairs.slice(0,4),null),/missing one of the five/);
});
test('Phase 2: motion remains namespaced with mobile, reduced-motion and lifecycle safeguards',()=>{
 const css=fs.readFileSync(path.join(__dirname,'../assets/css/fr-motion-split.css'),'utf8');
 const js=fs.readFileSync(path.join(__dirname,'../assets/js/fr-motion-split.js'),'utf8');
 assert.match(css,/\.frms-portfolio-links/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(js,/FRMotionSplit/);assert.match(js,/requestAnimationFrame/);assert.match(js,/data-frms-jump/);
});
