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
 assert.equal(home.dataset.frmsScrollHeight,'500');assert.equal(portfolio.dataset.frmsScrollHeight,'6000');
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

function controller(reduced=false){
 const dom=new JSDOM(heroMarkup,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://www.francoromeufr.com.br/'}),w=dom.window,d=w.document;
 build(d,fixture(5));
 d.getElementById('view-home').className='view-section active';d.getElementById('view-projetos').className='view-section';
 const root=d.getElementById('frms-home');let clock=0,id=0,callbacks=new Map();
 Object.defineProperty(w,'innerHeight',{value:800,writable:true});Object.defineProperty(w,'scrollY',{value:1000,writable:true});
 Object.defineProperty(w.performance,'now',{value:()=>clock});
 w.requestAnimationFrame=fn=>{callbacks.set(++id,fn);return id};w.cancelAnimationFrame=n=>callbacks.delete(n);
 w.matchMedia=()=>({matches:reduced,addEventListener(){},removeEventListener(){}});w.HTMLCanvasElement.prototype.getContext=()=>null;
 root.getBoundingClientRect=()=>({top:1000-w.scrollY,bottom:5000-w.scrollY,height:4000});root.querySelector('.frms-pin').getBoundingClientRect=()=>({height:800});
 w.scrollTo=({top})=>{w.scrollY=top;w.dispatchEvent(new w.Event('scroll'))};
 w.eval(fs.readFileSync(path.join(__dirname,'../assets/js/fr-motion-split.js'),'utf8'));d.dispatchEvent(new w.Event('DOMContentLoaded'));
 function step(ms=0){clock+=ms;const tasks=[...callbacks.values()];callbacks.clear();tasks.forEach(fn=>fn(clock));}
 function wheel(delta,gap=200,options={}){clock+=gap;const e=new w.WheelEvent('wheel',{deltaY:delta,cancelable:true,bubbles:true,...options});root.dispatchEvent(e);return e;}
 function touch(type,points){const e=new w.Event(type,{cancelable:true,bubbles:true});Object.defineProperty(e,'touches',{value:points.map(([clientX,clientY])=>({clientX,clientY}))});root.dispatchEvent(e);return e;}
 function state(){return w.FRMotionSplit.getState().find(x=>x.kind==='home')}
 function whole(index){
  assert.equal(state().index,index);assert.equal(state().animating,false);
  assert.equal(root.querySelectorAll('.frms-card[aria-hidden="false"]').length,1);
  assert.equal(root.querySelector('.frms-card[aria-hidden="false"]').style.opacity,'1');
  for(const side of ['left','right']){
   const frames=[...root.querySelectorAll('[data-frms-side="'+side+'"] .frms-frame')].filter(el=>el.style.visibility==='visible');
   assert.equal(frames.length,1);assert.equal(frames[0].dataset.frmsOrder,String(index));assert.match(frames[0].style.clipPath,/^inset\((?:0(?:\.000)?%?\s*)+\)$/);
  }
 }
 step();return {dom,w,d,root,step,wheel,touch,state,whole};
}
test('scene controller: tiny and large wheel gestures each finish exactly one complete image',()=>{
 const f=controller();
 assert.equal(f.wheel(1).defaultPrevented,true);assert.equal(f.state().target,1);
 f.step(200);assert.equal(f.state().animating,true);f.step(500);f.whole(1);
 assert.equal(f.wheel(1800).defaultPrevented,true);assert.equal(f.state().target,2);f.step(700);f.whole(2);
 f.dom.window.close();
});
test('scene controller: trackpad momentum coalesces and repeated mouse notches queue in order',()=>{
 const f=controller();f.wheel(12);for(const delta of [10,8,4,1])f.wheel(delta,16);assert.equal(f.state().target,1);f.step(700);f.whole(1);
 f.wheel(120);f.wheel(120,40);f.wheel(120,40);assert.equal(f.state().target,4);
 f.step(700);f.step(700);f.step(700);f.whole(4);f.dom.window.close();
});
test('scene controller: reverse and boundary scrolls release the page; zoom and open dialogs are untouched',()=>{
 const f=controller();assert.equal(f.wheel(-1).defaultPrevented,false);
 f.wheel(500,200,{ctrlKey:true});f.whole(0);
 const dialog=f.d.createElement('dialog');dialog.setAttribute('open','');f.d.body.appendChild(dialog);assert.equal(f.wheel(100).defaultPrevented,false);dialog.remove();
 f.root.querySelector('[data-frms-jump="4"]').click();f.step(700);f.whole(4);assert.equal(f.wheel(1).defaultPrevented,false);
 f.wheel(-1);f.step(700);f.whole(3);f.dom.window.close();
});
test('scene controller: one vertical swipe advances one image; pinch zoom remains native',()=>{
 const f=controller();f.touch('touchstart',[[50,600]]);assert.equal(f.touch('touchmove',[[50,80]]).defaultPrevented,true);f.touch('touchend',[]);assert.equal(f.state().target,1);f.step(700);f.whole(1);
 f.touch('touchstart',[[50,600],[120,500]]);assert.equal(f.touch('touchmove',[[50,580],[120,520]]).defaultPrevented,false);f.touch('touchend',[]);f.whole(1);f.dom.window.close();
});
test('scene controller: keyboard and native scrollbar settle; route changes and destroy cancel transitions',()=>{
 const f=controller();f.root.dispatchEvent(new f.w.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true,cancelable:true}));f.step(700);f.whole(1);
 f.w.scrollY=1000+3200*.61;f.w.dispatchEvent(new f.w.Event('scroll'));f.step();f.step(700);f.whole(2);
 f.wheel(1);f.step(200);f.d.getElementById('view-home').classList.remove('active');f.d.dispatchEvent(new f.w.Event('frViewChanged'));assert.equal(f.state().animating,false);
 f.w.FRMotionSplit.destroy();assert.equal(f.w.FRMotionSplit.getCount().length,0);assert.equal(f.wheel(100).defaultPrevented,false);f.dom.window.close();
});
test('scene controller: reduced motion keeps all scenes reachable without tweening or wheel capture',()=>{
 const f=controller(true);f.root.querySelector('[data-frms-jump="4"]').click();f.whole(4);assert.equal(f.state().duration,0);assert.equal(f.wheel(-120).defaultPrevented,false);
 f.root.querySelector('[data-frms-step="-1"]').click();f.whole(3);f.dom.window.close();
});
test('Portfolio mount moves original pairs into the active stage, keeps old anchors and has one project folder',()=>{
 const dom=new JSDOM(heroMarkup,{runScripts:'outside-only',url:'https://www.francoromeufr.com.br/portfolio'}),w=dom.window,d=w.document,prepared=fixture(60);
 prepared.data.groups=[];prepared.data.dossiers=[{id:'cozinha-lavanderia',title:'Cozinha, lavanderia, quartzo e móveis',description:'Projeto integrado',cover:'AFTER0',type:'Interiores',media:[{media_id:'AFTER0',category:'details'}],classifications:[],materials:[],journalRoute:'/projetos/cozinha-lavanderia'}];
 build(d,prepared);const split=d.getElementById('frms-portfolio'),first=split.querySelector('img');
 const flat=d.createElement('section');flat.id='frpm-before-after';flat.className='frpm';flat.innerHTML='<article class="frpm-pair"><img src="duplicate.webp"></article>';d.getElementById('view-projetos').appendChild(flat);
 const stage=d.createElement('section');stage.id='fr16-portfolio';stage.innerHTML='<section id="fr16-portfolio-orbit"><div class="fr16-portfolio-actions"><a href="#fr16-portfolio-gallery" data-fr16-jump="fr16-portfolio-gallery">Explorar transformações</a></div></section><section id="fr16-final-cta"></section>';d.getElementById('view-projetos').appendChild(stage);
 split.setAttribute('inert','');split.setAttribute('aria-hidden','true');
 w.FR_MEDIA_PRERENDER=true;w.FR_MEDIA_LIBRARY=prepared.data;w.eval(fs.readFileSync('assets/js/fr-project-media.js','utf8'));w.FRProjectMedia.mount();w.FRProjectMedia.mount();
 assert.equal(d.getElementById('frms-portfolio'),split);assert.equal(split.querySelector('img'),first);assert.equal(split.parentElement,stage);assert.equal(split.hasAttribute('inert'),false);
 assert.equal(d.querySelectorAll('#frpm-before-after').length,1);assert.equal(d.querySelectorAll('#view-projetos .frpm-pair').length,0);
 assert.equal(stage.querySelectorAll('#frms-portfolio figure img').length,120);assert.equal(stage.querySelectorAll('#frpm-portfolio-projects .frpm-dossier-card').length,1);
 assert.equal(stage.lastElementChild.id,'fr16-final-cta');assert.equal(split.nextElementSibling.id,'frms-portfolio-links');assert.equal(stage.querySelector('[data-fr16-jump]').dataset.fr16Jump,'frpm-before-after');dom.window.close();
});
