'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');
const build=require('../src/fr-motion-phase1.cjs');
test('Phase 1: mounts independent full-viewport Home and Portfolio split scenes without editing canonical state',()=>{
 const dom=new JSDOM('<!doctype html><html><head></head><body><div id="view-home"><section class="fr6-hero"></section></div><div id="view-projetos"><div class="fr10-portfolio-stage"></div></div></body></html>');
 const media={},pairs=Array.from({length:7},(_,i)=>{
  const id='PAIR-'+i;for(const side of ['BEFORE','AFTER'])media[side+i]={canonicalFile:'assets/media/'+side+i+'.webp',alt:side,variants:[{canonical:true,width:800,height:900}]};
  return {pair_id:id,project_id:'P'+i,before_media_id:'BEFORE'+i,after_media_id:'AFTER'+i,title:'Projeto '+i,environment:'Ambiente '+i,environment_ids:['E'+i],route:'/projetos/'+i};
 });
 const original={state:1};const prepared={data:{media,pairs},state:original};
 const result=build(dom.window.document,prepared);
 assert.equal(result.home,5);assert.equal(result.portfolio,7);
 const home=dom.window.document.querySelector('#frms-home'),port=dom.window.document.querySelector('#frms-portfolio');
 assert.equal(home.style.height,'440svh');assert.equal(port.style.height,'610svh');
 assert.equal(home.querySelectorAll('.frms-card').length,5);assert.equal(port.querySelectorAll('.frms-card').length,7);
 assert.equal(home.querySelectorAll('.frms-frame').length,10);assert.equal(port.querySelectorAll('.frms-frame').length,14);
 assert.equal(home.previousElementSibling.className,'fr6-hero');
 assert.equal(port.nextElementSibling.className,'fr10-portfolio-stage');
 assert.equal(dom.window.document.querySelectorAll('#frms-home script,#frms-portfolio script').length,0);
 assert.equal(dom.window.document.querySelectorAll('script[src="/assets/js/fr-motion-split.js"]').length,1);
 assert.equal(prepared.state,original);
 assert.equal(port.querySelectorAll('a[href^="/projetos/"]').length,14);
 dom.window.close();
});
test('Phase 1: missing canonical insertion points fail without silent layout changes',()=>{
 const d=new JSDOM('<div id="view-home"></div><div id="view-projetos"></div>').window.document;
 assert.throws(()=>build(d,{data:{pairs:Array.from({length:5},(_,i)=>({before_media_id:'a'+i,after_media_id:'b'+i})),media:Object.fromEntries(Array.from({length:5},(_,i)=>[['a'+i,{}],['b'+i,{}]]).flat())}}),/insert points missing/);
});
test('Phase 1: motion assets are present and isolate styles',()=>{
 const css=fs.readFileSync(path.join(__dirname,'../assets/css/fr-motion-split.css'),'utf8');
 const js=fs.readFileSync(path.join(__dirname,'../assets/js/fr-motion-split.js'),'utf8');
 assert.match(css,/\.frms-section/);assert.match(css,/prefers-reduced-motion/);
 assert.match(js,/FRMotionSplit/);assert.match(js,/requestAnimationFrame/);
});
