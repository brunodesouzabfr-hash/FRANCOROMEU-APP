'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');
const mountShell=require('../src/fr-ambientes-363.cjs');
const runtime=fs.readFileSync(path.join(__dirname,'../assets/js/fr-ambientes-363.js'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'../assets/css/fr-ambientes-363.css'),'utf8');
const styles=()=>Array.from({length:12},(_,i)=>({
 id:'amb-'+i,name:'Ambiente '+(i+1),img:'/assets/media/ambiente-'+i+'.jpg',
 essence:'Essência '+i,desc:'Descrição preservada '+i,palette:['#0a2f26','#e6d6b5'],
 services:[{id:'pintura-'+i,role:'Pintura'}]
}));
function fixture(){
 const dom=new JSDOM('<!doctype html><html><head></head><body><main id="view-ambientes" class="view-section active fr16-amb-canonical"><section class="amb-hero"></section><div class="amb-museum"><div id="amb-grid-container"><button type="button" id="legacy-amb-btn">Legado</button></div></div><div class="amb-ticker"></div></main></body></html>',{runScripts:'outside-only',pretendToBeVisual:true,url:'https://www.francoromeufr.com.br/ambientes'});
 const w=dom.window,d=w.document;
 w.matchMedia=query=>({matches:query.includes('max-width')?false:false,addEventListener(){},removeEventListener(){}});
 w.IntersectionObserver=class{constructor(callback){this.callback=callback}observe(node){this.callback([{target:node,isIntersecting:true}])}unobserve(){}disconnect(){}};
 let opened=[];
 w.openAmbDetail=index=>opened.push(index);
 w.AMB_STYLES=styles();
 return {dom,w,d,opened};
}
test('Phase 3: build creates only an additive shell preserving the canonical museum, hero and IDs',()=>{
 const f=fixture(),original=f.d.querySelector('.amb-museum');
 assert.deepEqual(mountShell(f.d),{originalAtlasPreserved:true,placeholder:true});
 assert.equal(f.d.querySelectorAll('#framb363-atlas').length,1);
 assert.equal(f.d.querySelector('.amb-museum'),original);
 assert.equal(f.d.querySelector('#amb-grid-container #legacy-amb-btn').textContent,'Legado');
 assert.equal(f.d.querySelector('.amb-hero').nextElementSibling.id,'framb363-atlas');
 assert.equal(f.d.querySelector('script[src="/assets/js/fr-ambientes-363.js"]').defer,true);
 assert.equal(f.d.querySelector('link[href="/assets/css/fr-ambientes-363.css"]').rel,'stylesheet');
 assert.throws(()=>mountShell(f.d),/duplicate shell/);
 f.w.close();
});
test('Phase 3: exact 3+6+3 order, original catalog, 12 names and service IDs retained',()=>{
 const f=fixture(),before=JSON.stringify(f.w.AMB_STYLES),original=f.d.querySelector('.amb-museum');
 mountShell(f.d);f.w.eval(runtime);f.d.dispatchEvent(new f.w.Event('DOMContentLoaded'));
 const state=f.w.FRAmbientes363.getState();
 assert.equal(state.mounted,true);assert.equal(state.rendered,12);
 assert.equal(state.originalAtlasIntact,true);
 assert.equal(f.d.querySelectorAll('.fa-intro-card').length,3);
 assert.equal(f.d.querySelectorAll('.fa-spatial').length,6);
 assert.equal(f.d.querySelectorAll('.fa-diamond').length,3);
 assert.deepEqual([...f.d.querySelectorAll('[data-fa-index]')].map(x=>Number(x.dataset.faIndex)),Array.from({length:12},(_,i)=>i));
 assert.deepEqual([...f.d.querySelectorAll('[data-fa-open]')].map(x=>Number(x.dataset.faOpen)),Array.from({length:12},(_,i)=>i));
 assert.equal(f.d.querySelector('.fa-intro-card .fa-name').textContent,'Ambiente 1');
 assert.equal(f.d.querySelector('.fa-spatial .fa-name').textContent,'Ambiente 4');
 assert.equal(f.d.querySelector('.fa-diamond .fa-name').textContent,'Ambiente 10');
 assert.equal(f.d.querySelector('.fa-spatial').dataset.faServices,'pintura-3');
 assert.equal(f.d.querySelector('.amb-museum'),original);
 assert.equal(f.d.getElementById('legacy-amb-btn').isConnected,true);
 assert.equal(JSON.stringify(f.w.AMB_STYLES),before);
 assert.equal(f.d.getElementById('view-ambientes').classList.contains('framb363-ready'),true);
 f.w.close();
});
test('Phase 3: detail buttons call the original openAmbDetail with the original index; teardown restores the old atlas',()=>{
 const f=fixture();mountShell(f.d);f.w.eval(runtime);f.d.dispatchEvent(new f.w.Event('DOMContentLoaded'));
 const btns=f.d.querySelectorAll('[data-fa-open]');
 btns[0].click();btns[5].click();btns[11].click();
 assert.deepEqual(f.opened,[0,5,11]);
 f.w.FRAmbientes363.destroy();
 assert.equal(f.d.getElementById('view-ambientes').classList.contains('framb363-ready'),false);
 assert.equal(f.d.querySelectorAll('[data-fa-index]').length,0);
 assert.equal(f.d.getElementById('legacy-amb-btn').isConnected,true);
 assert.equal(f.w.FRAmbientes363.mount(),true);
 assert.equal(f.d.querySelectorAll('[data-fa-index]').length,12);
 f.w.FRAmbientes363.destroy();f.w.close();
});
test('Phase 3: missing original catalog fields preserve legacy presentation, never partial 3+6+3',()=>{
 const f=fixture();f.w.AMB_STYLES.pop();mountShell(f.d);f.w.eval(runtime);f.d.dispatchEvent(new f.w.Event('DOMContentLoaded'));
 assert.equal(f.w.FRAmbientes363.getState().mounted,false);
 assert.equal(f.d.getElementById('view-ambientes').classList.contains('framb363-ready'),false);
 assert.equal(f.d.getElementById('legacy-amb-btn').isConnected,true);
 f.w.AMB_STYLES=styles();
 f.w.AMB_STYLES[2].img='https://untrusted.example.com/image.png';
 assert.equal(f.w.FRAmbientes363.mount(),false);
 f.w.AMB_STYLES=styles();assert.equal(f.w.FRAmbientes363.mount(),true);
 assert.equal(f.d.querySelectorAll('[data-fa-index]').length,12);
 f.w.FRAmbientes363.destroy();f.w.close();
});
test('Phase 3: movement only clips introductory photos, no card entrance transform; includes mobile and accessible fallbacks',()=>{
 assert.match(css,/\.fa-intro-card \.fa-image img\{clip-path:/);
 assert.doesNotMatch(css,/\.fa-intro-card\{[^}]*transform:/);
 assert.match(css,/\.fa-rail\{[^}]*width:200%/);
 assert.match(css,/@media\(max-width:800px\)/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/\.fa-diamond \.fa-image\{clip-path:polygon/);
 assert.match(runtime,/openAmbDetail\(id\)/);
 assert.doesNotMatch(runtime,/addEventListener\(['"](?:wheel|touchmove)/);
});
