'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');
const mountBuild=require('../src/fr-projects3d-phase5.cjs');
const js=fs.readFileSync(path.join(__dirname,'../assets/js/fr-projects3d-phase5.js'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'../assets/css/fr-projects3d-phase5.css'),'utf8');
function fixture(count=10){
 const cards=Array.from({length:count},(_,i)=>'<button type="button" data-fr15-p3d-index="'+i+'" aria-current="'+(i===0?'true':'false')+'"><span class="fr15-p3d-thumb"><img src="/assets/media/'+i+'.webp" alt=""></span><span class="fr15-p3d-index-copy"><strong>Projeto '+i+'</strong></span></button>').join('');
 const dom=new JSDOM('<!doctype html><html><head></head><body><main id="view-projetos3d" class="view-section active"><section class="p3d-hero"></section><section class="p3d-showcase"><div id="p3d-track"></div></section><section class="fr15-p3d-lab"><header class="fr15-p3d-head">Original</header><div class="fr15-p3d-workbench"><nav class="fr15-p3d-index" aria-label="Índice">'+cards+'</nav><div class="fr15-p3d-viewport"><div class="fr15-p3d-orbit" id="fr15-p3d-orbit" role="img"><div class="fr15-p3d-cube">'+Array.from({length:6},()=>'<div class="fr15-p3d-face"></div>').join('')+'</div></div></div><aside class="fr15-p3d-dossier"><h3 id="fr15-p3d-name">Projeto 0</h3><button type="button" id="fr15-p3d-open">Ver em 3D</button><button type="button" id="fr15-p3d-budget">Orçamento</button></aside></div></section><section class="p3d-process"><p>Etapas</p></section></main><div class="fr15-p3d-inspector" id="fr15-p3d-inspector" role="dialog"></div></body></html>',{runScripts:'outside-only',url:'https://www.francoromeufr.com.br/projetos-3d'});
 const w=dom.window,d=w.document,view=d.getElementById('view-projetos3d');
 w.matchMedia=q=>({matches:q.includes('prefers-reduced-motion')?false:false});
 const projects=Array.from({length:count},(_,i)=>({id:'P'+i,title:'Projeto '+i,views:['/assets/media/a'+i+'.webp','/assets/media/b'+i+'.webp','/assets/media/c'+i+'.webp']}));
 let selected=[],opened=[],budget=0;
 const cube=d.querySelector('.fr15-p3d-cube'),tileArray=Array.from(d.querySelectorAll('[data-fr15-p3d-index]'));
 w.FR_STAGE15={projects3d:projects,selectProject3D(i){
   selected.push(i);
   tileArray.forEach((t,j)=>t.setAttribute('aria-current',String(i===j)));
   d.getElementById('fr15-p3d-name').textContent=projects[i].title;
   for(let k=0;k<6;k++)cube.children[k].style.setProperty('--face-image','url("'+projects[i].views[k%3]+'")');
 },openProject3D(i){opened.push(i);}};
 d.getElementById('fr15-p3d-budget').addEventListener('click',()=>budget++);
 view.querySelector('.fr15-p3d-lab').addEventListener('click',e=>{
  const tile=e.target.closest('[data-fr15-p3d-index]');
  if(tile)w.FR_STAGE15.selectProject3D(Number(tile.dataset.fr15P3dIndex),true);
 });
 return {dom,w,d,view,projects,cube,selected,opened,getBudget:()=>budget};
}
function bootstrap(f){
 f.w.eval(js);
 f.d.dispatchEvent(new f.w.Event('DOMContentLoaded'));
 return f.w.FRProjects3DPhase5;
}
test('Phase 5 / build hook adds only a CSS+runtime and keeps the original showcase, cube, inspector, and process',()=>{
 const f=fixture();
 const original={showcase:f.d.querySelector('.p3d-showcase'),cube:f.cube,inspector:f.d.getElementById('fr15-p3d-inspector'),process:f.d.querySelector('.p3d-process')};
 const result=mountBuild(f.d);
 assert.deepEqual(result,{originalShowcase:true,originalCube:true,originalInspector:true,originalP3dProcess:true});
 assert.ok(f.d.getElementById('fr5d-module-marker'));
 assert.equal(f.d.querySelector('link[href="/assets/css/fr-projects3d-phase5.css"]').rel,'stylesheet');
 assert.equal(f.d.querySelector('script[src="/assets/js/fr-projects3d-phase5.js"]').defer,true);
 for(const [key,el] of Object.entries(original))assert.equal(f.d.contains(el),true,key);
 assert.throws(()=>mountBuild(f.d),/duplicate mount/);
 f.w.close();
});
test('Phase 5 / runtime mounts exactly ten original 1:1 gallery cards plus one original cube and unchanged inspector',()=>{
 const f=fixture(),api=bootstrap(f);
 const state=api.getState();
 assert.deepEqual(state,{installed:true,count:10,selected:0,originalCube:true,originalInspector:true});
 assert.equal(f.d.querySelectorAll('.fr15-p3d-index button').length,10);
 assert.equal(f.d.querySelectorAll('#fr15-p3d-orbit .fr15-p3d-cube').length,1);
 assert.equal(f.d.querySelectorAll('#fr15-p3d-orbit .fr15-p3d-face').length,6);
 assert.equal(f.d.querySelectorAll('#fr5d-toolbar').length,1);
 assert.equal(f.d.querySelectorAll('.fr5d-face-controls button').length,3);
 assert.equal(f.d.querySelectorAll('#fr15-p3d-orbit button').length,0);
 assert.equal(f.d.querySelectorAll('#fr15-p3d-inspector').length,1);
 assert.equal(f.d.querySelectorAll('#fr15-p3d-budget').length,1);
 api.destroy();f.w.close();
});
test('Phase 5 / selecting a tile uses canonical Stage15 API, rebinds six faces, and retains project inspector and budget',async()=>{
 const f=fixture(),api=bootstrap(f);
 f.d.querySelectorAll('[data-fr15-p3d-index]')[4].click();
 await Promise.resolve();
 assert.deepEqual(f.selected,[4]);
 assert.equal(api.getState().selected,4);
 assert.match(f.cube.children[0].style.getPropertyValue('--face-image'),/a4\.webp/);
 assert.match(f.cube.children[1].style.getPropertyValue('--face-image'),/b4\.webp/);
 assert.equal(f.d.getElementById('fr15-p3d-name').textContent,'Projeto 4');
 assert.equal(f.d.querySelector('[data-fr5d-counter]').textContent,'05 / 10');
 f.d.querySelector('[data-fr5d-inspect]').click();
 assert.deepEqual(f.opened,[4]);
 f.d.getElementById('fr15-p3d-budget').click();
 assert.equal(f.getBudget(),1);
 api.destroy();f.w.close();
});
test('Phase 5 / previous-next and face controls act without remounting or replacing project metadata',async()=>{
 const f=fixture(),api=bootstrap(f);
 f.d.querySelector('[data-fr5d-next]').click();await Promise.resolve();
 assert.equal(api.getState().selected,1);
 f.d.querySelector('[data-fr5d-prev]').click();await Promise.resolve();
 assert.equal(api.getState().selected,0);
 assert.equal(f.d.querySelector('[data-fr5d-prev]').disabled,true);
 f.d.querySelector('[data-fr5d-face="1"]').click();
 assert.match(f.cube.style.getPropertyValue('--ry'),/118deg/);
 assert.equal(f.d.querySelector('[data-fr5d-face="1"]').getAttribute('aria-pressed'),'true');
 api.destroy();f.w.close();
});
test('Phase 5 / destroy restores original layout without removing popup, original selection buttons or legacy data',()=>{
 const f=fixture(),api=bootstrap(f),original=f.d.querySelector('.fr15-p3d-index');
 api.destroy();
 assert.equal(api.getState().installed,false);
 assert.equal(original.isConnected,true);
 assert.equal(f.d.querySelector('#fr5d-toolbar'),null);
 assert.equal(f.d.querySelector('.fr5d-face-controls'),null);
 assert.equal(f.d.querySelector('.fr15-p3d-lab').classList.contains('fr5d-ready'),false);
 assert.equal(f.d.getElementById('fr15-p3d-inspector').isConnected,true);
 assert.equal(f.d.querySelectorAll('[data-fr15-p3d-index]').length,10);
 assert.equal(api.mount(),true);
 assert.equal(f.d.querySelectorAll('#fr5d-toolbar').length,1);
 api.destroy();f.w.close();
});
test('Phase 5 / unsupported or incomplete lab fails safely without changes to original cube or gallery',()=>{
 const f=fixture(2),api=bootstrap(f);
 assert.equal(api.getState().installed,false);
 assert.equal(f.d.querySelectorAll('#fr5d-toolbar').length,0);
 assert.equal(f.d.querySelectorAll('#fr15-p3d-orbit .fr15-p3d-cube').length,1);
 api.destroy();f.w.close();
});
test('Phase 5 / CSS: three desktop 1:1 photo cards, square cube, reduced motion and native horizontal scroll',()=>{
 assert.match(css,/grid-template-areas:"cube gallery"/);
 assert.match(css,/\.fr15-p3d-index button\{[^}]*flex:0 0 calc\(\(100% - 2\*var\(--fr5d-gap\)\)\/3\)/);
 assert.match(css,/\.fr15-p3d-viewport\{[^}]*aspect-ratio:1/);
 assert.match(css,/@media\(max-width:750px\)/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(js,/FR_STAGE15/);
 assert.doesNotMatch(js,/addEventListener\(['"](?:wheel|touchmove)/);
});
