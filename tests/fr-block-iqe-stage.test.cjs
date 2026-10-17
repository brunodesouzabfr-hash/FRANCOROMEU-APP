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
  '/assets/js/fr-block-avatar.iife.js','/assets/js/fr-block-iqe-init.js'
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
test('browser boot installs only when ready and its rollback leaves button events intact',()=>{
 const dom=fixture(),win=dom.window,doc=win.document;
 const button=doc.getElementById('fr-ai-launcher');
 let clicks=0;button.addEventListener('click',()=>clicks++);
 let destroys=0,legacyMounts=0,mounts=0;
 win.FRIQEAvatar6={mount(){legacyMounts++;},destroy(){destroys++;}};
 win.FRBlockAvatar={mountIQEBlock({root,palette,disableLegacy}){
   assert.equal(root,doc.getElementById('fr-ai-root'));
   assert.equal(palette,'verdeLaranja');assert.equal(disableLegacy,true);
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
test('compiled browser bundle is actually vendored and contains the reversible Block API',()=>{
 const code=fs.readFileSync(path.join(__dirname,'../assets/js/fr-block-avatar.iife.js'),'utf8');
 assert.ok(code.length>15000);
 assert.match(code,/FRBlockAvatar/);assert.match(code,/mountIQEBlock/);
 assert.match(code,/createElement/);
});
