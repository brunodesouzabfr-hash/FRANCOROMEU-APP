'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');
const inject=require('../src/fr-block-iqe-stage.cjs');
function fixture(){
 const doc=new JSDOM('<!doctype html><html><head><meta name="robots" content="index,follow">'+
 '<style id="fr-stage5-assistant-styles"></style><script id="fr-stage5-assistant-engine"></script></head>'+
 '<body><div id="fr-ai-root"><button id="fr-ai-launcher" aria-label="Abrir IQE" aria-expanded="false"><span class="fr-ai-robot">Original</span></button>'+
 '<div class="fr-ai-avatar">Original cabeçalho</div><div id="fr-ai-body"><button data-fr-ai-action="budget">Orçamento</button></div></div>'+
 '<div id="iqe-overlay">Wizard original</div></body></html>',{
 runScripts:'outside-only',pretendToBeVisual:true,url:'https://www.francoromeufr.com.br'
 });
 return doc;
}
test('staging disabled by default: no override, no script, original SEO retained',()=>{
 const dom=fixture(),doc=dom.window.document,html=doc.documentElement.outerHTML;
 const result=inject(doc,{enabled:false});
 assert.equal(result.enabled,false);
 assert.equal(doc.documentElement.outerHTML,html);
 dom.window.close();
});
test('staging explicitly enabled adds only visual assets and noindex with no change to original assistant',()=>{
 const dom=fixture(),doc=dom.window.document;
 const button=doc.getElementById('fr-ai-launcher'),wizard=doc.getElementById('iqe-overlay');
 const clicks=[];button.addEventListener('click',()=>clicks.push('old'));
 const result=inject(doc,{enabled:true});
 assert.equal(result.visualOnly,true);
 assert.equal(doc.querySelector('meta[name=robots]').content,'noindex,nofollow');
 assert.deepEqual(Array.from(doc.querySelectorAll('script[src*="fr-block"]')).map(el=>el.getAttribute('src')),[
  '/assets/js/fr-block-avatar.iife.js','/assets/js/fr-block-iqe-balloons.js','/assets/js/fr-block-iqe-init.js'
 ]);
 assert.equal(doc.querySelector('link[href*="fr-block-iqe-stage.css"]').rel,'stylesheet');
 assert.equal(doc.getElementById('fr-ai-launcher'),button);
 assert.equal(doc.getElementById('iqe-overlay'),wizard);
 button.click();assert.deepEqual(clicks,['old']);
 assert.throws(()=>inject(doc,{enabled:true}),/duplicate/);
 dom.window.close();
});
test('only the named Vercel preview branch enables Block without explicit flag',()=>{
 const originalEnv=process.env.VERCEL_ENV,originalRef=process.env.VERCEL_GIT_COMMIT_REF,originalFlag=process.env.FR_BLOCK_IQE_STAGING;
 try{
  delete process.env.FR_BLOCK_IQE_STAGING;
  process.env.VERCEL_ENV='preview';
  process.env.VERCEL_GIT_COMMIT_REF='feature/block-iqe-staging-2026-10-17';
  const d1=fixture();assert.equal(inject(d1.window.document).enabled,true);d1.window.close();
  process.env.VERCEL_GIT_COMMIT_REF='main';
  const d2=fixture();assert.equal(inject(d2.window.document).enabled,false);d2.window.close();
  process.env.VERCEL_ENV='production';
  process.env.VERCEL_GIT_COMMIT_REF='feature/block-iqe-staging-2026-10-17';
  const d3=fixture();assert.equal(inject(d3.window.document).enabled,false);d3.window.close();
 } finally{
  for(const [key,value] of [['VERCEL_ENV',originalEnv],['VERCEL_GIT_COMMIT_REF',originalRef],['FR_BLOCK_IQE_STAGING',originalFlag]]){
   if(value===undefined)delete process.env[key];else process.env[key]=value;
  }
 }
});
test('Vercel main production enables Block while preserving public indexing and allows emergency opt-out',()=>{
 const keys=['VERCEL_ENV','VERCEL_GIT_COMMIT_REF','FR_BLOCK_IQE_STAGING','FR_BLOCK_IQE_ENABLED'];
 const values=Object.fromEntries(keys.map(key=>[key,process.env[key]]));
 try{
  delete process.env.FR_BLOCK_IQE_STAGING;delete process.env.FR_BLOCK_IQE_ENABLED;
  process.env.VERCEL_ENV='production';
  process.env.VERCEL_GIT_COMMIT_REF='main';
  const production=fixture(),doc=production.window.document;
  const launcher=doc.getElementById('fr-ai-launcher');
  const originalContent=doc.getElementById('iqe-overlay');
  const result=inject(doc);
  assert.equal(result.enabled,true);
  assert.equal(result.visualOnly,true);
  assert.equal(doc.querySelector('meta[name=robots]').content,'index,follow','production SEO must remain indexable');
  assert.equal(doc.querySelector('#fr-block-iqe-stage-marker').content,'production');
  assert.equal(doc.getElementById('fr-ai-launcher'),launcher);
  assert.equal(doc.getElementById('iqe-overlay'),originalContent);
  production.window.close();
  process.env.FR_BLOCK_IQE_ENABLED='0';
  const fallback=fixture();
  assert.equal(inject(fallback.window.document).enabled,false,'opt-out must restore old production build');
  assert.equal(fallback.window.document.querySelector('#fr-block-iqe-stage-marker'),null);
  fallback.window.close();
  delete process.env.FR_BLOCK_IQE_ENABLED;
  process.env.VERCEL_GIT_COMMIT_REF='other-branch';
  const wrongBranch=fixture();
  assert.equal(inject(wrongBranch.window.document).enabled,false);
  wrongBranch.window.close();
 }finally{
  for(const key of keys){if(values[key]===undefined)delete process.env[key];else process.env[key]=values[key];}
 }
});
test('browser boot installs only when ready and its rollback leaves button events intact',()=>{
 const dom=fixture(),win=dom.window,doc=win.document;
 const button=doc.getElementById('fr-ai-launcher');
 let clicks=0;button.addEventListener('click',()=>clicks++);
 let destroys=0,legacyMounts=0,mounts=0;
 win.FRIQEAvatar6={mount(){legacyMounts++;},destroy(){destroys++;}};
 win.FRBlockAvatar={mountIQEBlock({root,palette,disableLegacy}){
   assert.equal(root,doc.getElementById('fr-ai-root'));
   assert.equal(palette,'lovable');assert.equal(disableLegacy,true);
   mounts++;
   return {destroy(){destroys++;},react(){},update(){},state(){return {mounted:true,faces:2}}};
 }};
 // jsdom needs a canvas stub; visual integration is separately tested in Block's repository.
 win.HTMLCanvasElement.prototype.getContext=function(type){return type==='2d'?{}:null;};
 const src=fs.readFileSync(path.join(__dirname,'../assets/js/fr-block-iqe-init.js'),'utf8');
 win.eval(src);doc.dispatchEvent(new win.Event('DOMContentLoaded'));
 assert.equal(mounts,1);
 assert.equal(win.FRBlockStage.getState().mounted,true);
 assert.equal(doc.getElementById('iqe-overlay').textContent,'Wizard original');
 assert.equal(doc.getElementById('fr-ai-root').classList.contains('fr-block-iqe-staging'),true);
 button.click();assert.equal(clicks,1);
 win.FRBlockStage.destroy();assert.equal(destroys,1);assert.equal(legacyMounts,1);
 button.click();assert.equal(clicks,2);
 dom.window.close();
});
test('late Stage 5 launcher discovery mounts Block after the DOMContentLoaded event',async()=>{
 const dom=fixture(),win=dom.window,doc=win.document;
 const root=doc.getElementById('fr-ai-root'),parent=root.parentNode;
 root.remove();
 let count=0;
 win.FRBlockAvatar={mountIQEBlock(){
   count++;
   return {destroy(){},react(){},update(){},state(){return {mounted:true,faces:2}}};
 }};
 win.HTMLCanvasElement.prototype.getContext=function(){return {};};
 const code=fs.readFileSync(path.join(__dirname,'../assets/js/fr-block-iqe-init.js'),'utf8');
 win.eval(code);doc.dispatchEvent(new win.Event('DOMContentLoaded'));
 assert.equal(count,0,'the adapter must wait rather than mount onto missing elements');
 parent.appendChild(root);
 await new Promise(done=>win.setTimeout(done,12));
 assert.equal(count,1);
 assert.equal(win.FRBlockStage.getState().mounted,true);
 win.FRBlockStage.destroy();dom.window.close();
});
test('compiled browser bundle is actually vendored and contains the reversible Block API',()=>{
 const code=fs.readFileSync(path.join(__dirname,'../assets/js/fr-block-avatar.iife.js'),'utf8');
 assert.ok(code.length>15000);
 assert.match(code,/FRBlockAvatar/);assert.match(code,/mountIQEBlock/);
 assert.match(code,/createElement/);
});

test('Block contextual hints restore welcome, navigation and auto-budget explanations without interfering with IQE events',()=>{
 const dom=fixture(),win=dom.window,doc=win.document,root=doc.getElementById('fr-ai-root');
 const code=fs.readFileSync(path.join(__dirname,'../assets/js/fr-block-iqe-balloons.js'),'utf8');
 let reactions=0,launcherClicks=0;
 root.querySelector('#fr-ai-launcher').addEventListener('click',()=>launcherClicks++);
 win.eval(code);
 const tips=win.FRBlockBalloons.mount(root,()=>reactions++);
 assert.ok(tips);
 assert.equal(tips.explain('welcome'),true);
 const current=doc.querySelector('.fr-block-tip');
 assert.ok(current && !current.hidden);
 assert.match(current.textContent,/Boas-vindas ao IQE/);
 assert.equal(tips.explain('orcamento'),true);
 assert.match(current.textContent,/orçamento/i);
 assert.equal(tips.explain('auto'),true);
 assert.match(current.textContent,/Orçamento automático/);
 doc.body.dispatchEvent(new win.Event('pointerdown',{bubbles:true}));
 assert.equal(current.hidden,true,'the balloon must yield to user interaction');
 root.querySelector('#fr-ai-launcher').click();
 assert.equal(launcherClicks,1);
 // Native Stage 5 bubble wins if it becomes visible.
 const native=doc.createElement('button');native.className='fr-ai-context-bubble is-visible';native.textContent='Aviso nativo';
 root.appendChild(native);
 assert.equal(tips.explain('search'),false);
 tips.destroy();
 assert.equal(doc.querySelector('.fr-block-tip'),null);
 assert.ok(reactions>=2);
 dom.window.close();
});

test('site vendors the exact validated Lovable v2 bundle with broad calendar and explicit loyalty ranks',()=>{
 const crypto=require('node:crypto');
 const code=fs.readFileSync(path.join(__dirname,'../assets/js/fr-block-avatar.iife.js'),'utf8');
 assert.equal(crypto.createHash('sha256').update(code).digest('hex'),
  '7aaf38696c833b93097a2973a8b71d8fcf13f9bbd79a457f303e63f36e60a194');
 for(const feature of ['#B66622','HALLOWEEN','DIA DAS MÃES','SÃO JOÃO','CARNAVAL','BLACK FRIDAY','CONSCIÊNCIA NEGRA','BRONZE','PRATA','OURO','PREMIUM']){
  assert.ok(code.includes(feature),'Missing Lovable v2 feature: '+feature);
 }
});
