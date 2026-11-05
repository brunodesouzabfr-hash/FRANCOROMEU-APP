'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const {JSDOM}=require('jsdom');
const evidence=require('../src/fr-evidence-scenes.cjs');
const runtime=fs.readFileSync('assets/js/fr-evidence-scenes.js','utf8');
const loadScript=file=>{const w={};vm.runInNewContext(fs.readFileSync(file,'utf8'),{window:w});return JSON.parse(JSON.stringify(w));};
const data=loadScript('dist/assets/js/fr-project-library.js').FR_MEDIA_LIBRARY;
const library=loadScript('dist/assets/js/fr-evidence-library.js').FR_EVIDENCE_LIBRARY;
const projectConfig=JSON.parse(fs.readFileSync('content/experience/project-stages.json','utf8'));
function dom(html='<main></main>',options={}){
 const instance=new JSDOM('<!doctype html><html><body>'+html+'</body></html>',{runScripts:'outside-only',pretendToBeVisual:true,url:'https://www.francoromeufr.com.br/portfolio'});
 const w=instance.window,triggers=[];
 w.matchMedia=()=>({matches:!!options.reduced,addEventListener(){},removeEventListener(){}});
 w.FR_MEDIA_LIBRARY=data;w.FR_EVIDENCE_LIBRARY=library;
 w.AMB_STYLES=options.styles||[];
 w.ScrollTrigger={create(config){const t={progress:0,config,killed:false,kill(){this.killed=true;}};triggers.push(t);return t;}};
 w.eval(runtime);w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
 return {instance,w,d:w.document,triggers,close(){w.FREvidenceScenes.destroy();instance.window.close();}};
}
function input(f,root,value){const range=root.querySelector('input[type=range]');range.value=String(value);range.dispatchEvent(new f.w.Event('input',{bubbles:true}));return range;}

test('Portfolio covers every canonical pair once across organic and split scenes, with stable curation',()=>{
 const doc=new JSDOM(fs.readFileSync('dist/portfolio.html','utf8')).window.document;
 const organic=[...doc.querySelectorAll('[data-fres-pair]')].map(n=>n.dataset.fresPair),split=[...doc.querySelectorAll('#frms-portfolio [data-frms-pair-id]')].map(n=>n.dataset.frmsPairId);
 assert.equal(organic.length,30);assert.equal(split.length,30);assert.equal(new Set([...organic,...split]).size,data.pairs.length);
 assert.deepEqual([...organic,...split].sort(),data.pairs.map(p=>p.pair_id).sort());
 assert.equal(doc.getElementById('fres-before-after').nextElementSibling.id,'frms-portfolio');
 assert.equal(doc.querySelectorAll('#frpm-before-after').length,1);
 assert.equal(doc.querySelector('#frms-portfolio').dataset.frmsCount,'30');
 assert.deepEqual([...doc.querySelectorAll('#frms-portfolio .frms-card')].map(n=>n.dataset.frmsOrder),Array.from({length:30},(_,i)=>String(i)));
 assert.deepEqual(evidence.partition(data.pairs),evidence.partition(data.pairs));
 assert.equal(doc.querySelectorAll('#frms-home .frms-card').length,5);
 const ids=[...doc.querySelectorAll('[id]')].map(n=>n.id);assert.equal(new Set(ids).size,ids.length,'all generated controls have distinct IDs');
});
test('the public 3D archive covers the 18 approved views and preserves archived alternatives',()=>{
 const public3d=Object.values(data.media).filter(m=>m.stage==='PROJECT_3D').map(m=>m.media_id);
 const views=projectConfig.scenes.flatMap(s=>s.views);
 assert.equal(public3d.length,18);assert.equal(views.length,18);assert.equal(new Set(views).size,18);assert.deepEqual(views.slice().sort(),public3d.slice().sort());
 assert.equal(projectConfig.archived_views.length,3);
 for(const scene of projectConfig.scenes){for(const stage of scene.stages){const m=data.media[stage.media_id];assert.ok(m);assert.ok(m.project_ids.includes('FR-C001'));assert.ok(!projectConfig.archived_views.includes(m.media_id));}}
 const integration=projectConfig.scenes.find(s=>s.id==='integracao');assert.deepEqual(integration.stages.map(s=>s.stage),['before','gray','render','result']);
 assert.equal(projectConfig.scenes.find(s=>s.id==='frontao-direito').stages.length,2,'missing demolition/render are not fabricated');
 assert.equal(projectConfig.scenes.find(s=>s.id==='cooktop-detalhe').stages.at(-1).media_id,'FR-M-F95547B93191E812');
 assert.ok(library.annotations['FR-M-45222B69BBC5B8EE'].pins.some(p=>p.title==='MDP cinza no tampo'));
});
test('all material trails have three related states: place, material panel and application',()=>{
 const trails=data.groups.flatMap(g=>g.trails);
 assert.equal(library.environments.length,trails.length);assert.ok(trails.length>=48);
 for(const scene of library.environments){
  const group=data.groups.find(g=>g.physical===scene.group),trail=group.trails.find(t=>t.trail_id===scene.id);
  assert.equal(scene.mediaIds.length,3);assert.equal(scene.mediaIds[0],group.cover);
  const steps=group.sequence.filter(s=>s.trail_id===trail.trail_id);
  assert.equal(scene.mediaIds[1],steps.find(s=>s.type==='MATERIAL').media_id);
  assert.equal(scene.mediaIds[2],steps.find(s=>s.type==='EXAMPLE').media_id);
  assert.ok(data.media[scene.mediaIds[1]].project_ids.includes(trail.project_id));
  assert.ok(data.media[scene.mediaIds[2]].project_ids.includes(trail.project_id));
 }
});
test('four-state scrub has adjacent layers only and no stale state after rapid jumps',()=>{
 const scene=library.scenes.find(s=>s.id==='integracao');
 const f=dom(scene.template.replaceAll('__INSTANCE__','test-scene'));
 const root=f.d.querySelector('[data-fres-scene]'),layers=[...root.querySelectorAll('[data-fres-layer]')];
 for(const value of [0,250,500,750,1000,100,999,0,1000]){
  const range=input(f,root,value),visible=layers.map((n,i)=>Number(n.style.opacity)>0?i:-1).filter(i=>i>=0);
  assert.ok(visible.length<=2);if(visible.length===2)assert.equal(visible[1]-visible[0],1);
  assert.equal(range.value,String(value));assert.equal(f.w.FREvidenceScenes.getState()[0].manual,true);
 }
 assert.deepEqual(layers.map(n=>Number(n.style.opacity)),[0,0,0,1]);
 input(f,root,0);assert.deepEqual(layers.map(n=>Number(n.style.opacity)),[1,0,0,0]);
 f.close();
});
test('manual input owns a scene across scroll updates until the user resumes',()=>{
 const scene=library.scenes.find(s=>s.id==='integracao');
 const f=dom(scene.template.replaceAll('__INSTANCE__','ownership'));
 const root=f.d.querySelector('[data-fres-scene]');
 Object.defineProperty(root,'getBoundingClientRect',{value:()=>({height:500,top:0,bottom:500})});
 f.w.FREvidenceScenes.refresh();const trigger=f.triggers.at(-1);assert.ok(trigger);
 input(f,root,330);trigger.progress=1;trigger.config.onUpdate(trigger);assert.equal(root.dataset.fresValue,'330');
 root.querySelector('[data-fres-resume]').click();assert.equal(root.dataset.fresValue,'1000');assert.equal(f.w.FREvidenceScenes.getState()[0].manual,false);
 f.w.FREvidenceScenes.destroy();assert.equal(trigger.killed,true);assert.equal(f.w.FREvidenceScenes.getState().length,0);f.instance.window.close();
});
test('before/after remains keyboard-range driven with both exact endpoints',()=>{
 const p=data.pairs[0],html=evidence.comparison({id:'wipe',mode:'wipe',layers:[{label:'Antes',media:data.media[p.before_media_id]},{label:'Depois',media:data.media[p.after_media_id]}]});
 const f=dom(html),root=f.d.querySelector('[data-fres-scene]'),top=root.querySelectorAll('[data-fres-layer]')[1];
 input(f,root,0);assert.equal(top.style.clipPath,'inset(0 0 0 0%)');
 input(f,root,1000);assert.equal(top.style.clipPath,'inset(0 0 0 100%)');
 assert.equal(root.querySelector('input').getAttribute('aria-valuetext'),'100% antes; 0% depois');f.close();
});
test('reduced motion has no scroll-triggered state changes but all state buttons work',()=>{
 const scene=library.scenes.find(s=>s.id==='integracao'),f=dom(scene.template.replaceAll('__INSTANCE__','reduce'),{reduced:true}),root=f.d.querySelector('[data-fres-scene]');
 assert.equal(f.triggers.length,0);const buttons=[...root.querySelectorAll('[data-fres-set]')];
 buttons[3].click();assert.equal(root.dataset.fresValue,'1000');buttons[1].click();assert.equal(root.dataset.fresState,'1');
 root.querySelector('[data-fres-resume]').click();assert.equal(root.dataset.fresState,'1');f.close();
});
test('numbered image disclosures do not nest buttons inside image links and restore keyboard focus',()=>{
 const id='FR-M-986CF342224E81F1',f=dom('<figure><a href="/projetos/cozinha-lavanderia"><img data-fr-media-id="'+id+'" alt="Cozinha"></a></figure>');
 assert.equal(f.d.querySelectorAll('a button').length,0);const button=f.d.querySelector('.fres-pin'),panel=f.d.querySelector('.fres-annotation-panel');assert.ok(button);assert.equal(panel.hidden,true);
 button.click();assert.equal(panel.hidden,false);assert.equal(button.getAttribute('aria-expanded'),'true');assert.match(panel.textContent,/Quartzo Calacatta/);
 let parentEscape=0;f.d.querySelector('figure').addEventListener('keydown',()=>parentEscape++);
 const escape=new f.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true});panel.dispatchEvent(escape);assert.equal(panel.hidden,true);assert.equal(f.d.activeElement,button);assert.equal(escape.defaultPrevented,true);assert.equal(parentEscape,0,'Escape closes the disclosure before an enclosing viewer');
 f.w.FREvidenceScenes.enhance(f.d);assert.equal(f.d.querySelectorAll('.fres-annotation').length,1,'repeat enhancement is idempotent');f.close();
});
test('a before image describes its initial state without future materials or services',()=>{
 for(const m of Object.values(data.media).filter(m=>m.stage==='BEFORE')){
  const record=library.annotations[m.media_id];assert.equal(record.pins.length,1);assert.equal(record.pins[0].title,'Condição inicial');assert.equal(record.pins[0].copy,m.caption);
 }
});
test('the twelve-style atlas can explain existing material and service notes without editing its source catalog',()=>{
 const styles=[{id:'industrial',name:'Industrial',img:'assets/media/ambiente-industrial-01.jpg',desc:'Concreto, aço, instalações aparentes, madeira e luz pontual.',services:[{id:'ele_conduite',qty:6,role:'Infraestrutura elétrica aparente'}]}],snapshot=JSON.stringify(styles);
 const f=dom('<main id="view-ambientes" class="view-section active"><article><div class="fa-image" style="position:absolute;inset:0"><img src="/assets/media/ambiente-industrial-01.jpg" alt="Industrial"></div></article></main>',{styles});
 assert.equal(f.d.querySelectorAll('.fres-pin').length,2);assert.equal(f.d.querySelector('.fa-image').style.position,'absolute');
 f.d.querySelector('.fres-pin').click();assert.match(f.d.querySelector('.fres-annotation-panel').textContent,/Concreto, aço/);assert.equal(JSON.stringify(styles),snapshot);f.close();
});
test('lighting has five real image files with distinct bytes and one unchanged reference camera',()=>{
 const cfg=JSON.parse(fs.readFileSync('content/experience/light-sequence.json','utf8'));
 assert.equal(cfg.source_media_id,'FR-M-986CF342224E81F1');assert.equal(cfg.states.length,5);assert.deepEqual(cfg.states.map(s=>s.hour),['06h','09h','12h','17h','22h']);
 const hashes=cfg.states.map(s=>{assert.ok(fs.existsSync(s.file));assert.ok(fs.existsSync('dist/'+s.file));return crypto.createHash('sha256').update(fs.readFileSync(s.file)).digest('hex');});
 assert.equal(new Set(hashes).size,5);assert.equal(cfg.night_ceiling,'off');
 const html=fs.readFileSync('dist/ambientes.html','utf8'),doc=new JSDOM(html).window.document,scene=doc.querySelector('[data-fres-mode=light]');assert.ok(scene);assert.equal(scene.querySelectorAll('[data-fres-layer]').length,5);
 assert.doesNotMatch(runtime,/brightness\(/,'lighting uses separate frames, not a global brightness filter');
});
test('project and material dialogs reuse the same scrub scenes without changing catalogs',()=>{
 const f=dom('<div id="project"></div><div id="environment"></div>'),before=JSON.stringify(data);
 assert.equal(f.w.FREvidenceScenes.mountProjectScene(f.d.getElementById('project'),'FR-M-33EC3B99BA4271D8'),true);
 const trail=library.environments[0];assert.equal(f.w.FREvidenceScenes.mountEnvironmentScene(f.d.getElementById('environment'),trail.group,trail.id,trail.mediaIds[1]),true);
 const root=f.d.getElementById('environment').querySelector('[data-fres-scene]');assert.equal(root.dataset.fresValue,'500');
 assert.equal(JSON.stringify(data),before);f.close();
});
test('the Portfolio adapter releases the new organic scene from legacy inert snapshots',()=>{
 const f=dom('<main id="view-projetos"><section id="fr16-portfolio"><div id="fr16-portfolio-orbit"></div></section><section id="fres-before-after" inert aria-hidden="true"></section><section id="frms-portfolio"></section><section id="protected-legacy" inert aria-hidden="true"></section></main>');
 f.w.FR_MEDIA_PRERENDER=true;
 const saved=f.w.FR_MEDIA_LIBRARY;f.w.FR_MEDIA_LIBRARY={pairs:[],groups:[],dossiers:[],media:{}};
 f.w.eval(fs.readFileSync('assets/js/fr-project-media.js','utf8'));f.w.FRProjectMedia.mount();
 const organic=f.d.getElementById('fres-before-after');assert.equal(organic.parentElement.id,'fr16-portfolio');assert.equal(organic.hasAttribute('inert'),false);assert.equal(organic.getAttribute('aria-hidden'),'false');assert.equal(organic.nextElementSibling.id,'frms-portfolio');assert.equal(f.d.getElementById('protected-legacy').hasAttribute('inert'),true);
 f.w.FR_MEDIA_LIBRARY=saved;f.close();
});
