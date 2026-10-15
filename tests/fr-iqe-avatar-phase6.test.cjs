'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');
const install=require('../src/fr-iqe-avatar-phase6.cjs');
const js=fs.readFileSync(path.join(__dirname,'../assets/js/fr-iqe-avatar-phase6.js'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'../assets/css/fr-iqe-avatar-phase6.css'),'utf8');
const content='<div id="fr-ai-root"><button class="fr-ai-context-bubble" type="button"><span id="fr-ai-bubble-text">Contexto</span></button><section id="fr-ai-panel"><header><div class="fr-ai-avatar" aria-hidden="true"><i class="fa-solid fa-robot"></i></div><strong id="fr-ai-title">IQE</strong></header><div id="fr-ai-body"><button type="button" data-fr-ai-action="budget">Orçamento</button><button type="button" data-fr-ai-action="tips">Dicas</button></div></section><button id="fr-ai-launcher" class="fr-ai-launcher" aria-label="Abrir assistente inteligente" aria-controls="fr-ai-panel" aria-expanded="false"><span class="fr-ai-robot" aria-hidden="true"><span class="fr-ai-eyes"><span class="fr-ai-eye"></span><span class="fr-ai-eye"></span></span><span class="fr-ai-mouth"></span></span><span class="fr-ai-status-dot"></span></button></div><div id="iqe-overlay"><span id="iqe-modal">Questionário original</span></div><div id="calculator-root">115 serviços</div>';
function fixture(opts={}){
 const dom=new JSDOM('<!doctype html><html><head><style id="fr-stage5-assistant-styles"></style><script id="fr-stage5-assistant-engine"></script></head><body>'+(opts.noRoot?'':content)+'</body></html>',{runScripts:'outside-only',pretendToBeVisual:true,url:'https://www.francoromeufr.com.br'});
 const w=dom.window,d=w.document;
 w.matchMedia=()=>({matches:!!opts.reduced,addEventListener(){},removeEventListener(){}});
 return {dom,w,d,root:d.getElementById('fr-ai-root'),launcher:d.getElementById('fr-ai-launcher')};
}
function boot(f){f.w.eval(js);f.d.dispatchEvent(new f.w.Event('DOMContentLoaded'));return f.w.FRIQEAvatar6;}
test('Phase 6: canonical build injects visual-only resources and leaves original engines untouched',()=>{
 const f=fixture(),wizard=f.d.getElementById('iqe-modal'),engine=f.d.getElementById('fr-stage5-assistant-engine'),root=f.root;
 assert.deepEqual(install(f.d),{preservesWizard:true,preservesAssistant:true,visualOnly:true});
 assert.equal(f.d.querySelector('link[href="/assets/css/fr-iqe-avatar-phase6.css"]').rel,'stylesheet');
 assert.equal(f.d.querySelector('script[src="/assets/js/fr-iqe-avatar-phase6.js"]').defer,true);
 assert.equal(f.d.contains(wizard)&&f.d.contains(engine)&&f.d.contains(root),true);
 assert.throws(()=>install(f.d),/duplicate install/);f.w.close();
});
test('Phase 6: two reversible cubes and 12 pixel expressions, including exact original DOM restore',()=>{
 const f=fixture(),d=f.d,header=d.querySelector('.fr-ai-avatar').outerHTML,launcher=d.getElementById('fr-ai-launcher').outerHTML;
 const api=boot(f),state=api.getState();
 assert.equal(state.mounted,true);assert.equal(state.scenes,2);
 assert.equal(state.expressions.length,12);assert.equal(new Set(state.expressions).size,12);
 assert.equal(d.querySelectorAll('.fr6iqe-face').length,12);
 assert.equal(d.querySelectorAll('.fr6iqe-eye').length,4);
 assert.equal(d.querySelectorAll('.fr6iqe-pixel').length,100);
 assert.equal(d.getElementById('iqe-modal').textContent,'Questionário original');
 for(const name of state.expressions){
  assert.equal(api.setExpression(name),true);
  assert.equal(api.getState().expression,name);
  assert.ok(d.querySelector('.fr6iqe-eye .is-on'),name);
 }
 api.destroy();
 assert.equal(d.querySelector('.fr-ai-avatar').outerHTML,header);
 assert.equal(d.getElementById('fr-ai-launcher').outerHTML,launcher);
 assert.equal(d.querySelectorAll('.fr6iqe-scene').length,0);f.w.close();
});
test('Phase 6: original launcher, tips and budget handlers still receive clicks',()=>{
 const f=fixture(),d=f.d;let counts=[0,0,0];
 f.launcher.addEventListener('click',()=>counts[0]++);
 d.querySelector('[data-fr-ai-action="budget"]').addEventListener('click',()=>counts[1]++);
 d.querySelector('[data-fr-ai-action="tips"]').addEventListener('click',()=>counts[2]++);
 const api=boot(f);
 f.launcher.click();d.querySelector('[data-fr-ai-action="budget"]').click();d.querySelector('[data-fr-ai-action="tips"]').click();
 assert.deepEqual(counts,[1,1,1]);assert.equal(d.getElementById('calculator-root').textContent,'115 serviços');
 assert.equal(f.launcher.getAttribute('aria-label'),'Abrir assistente inteligente');
 api.destroy();f.w.close();
});
test('Phase 6: original panel state maps to focused expression',async()=>{
 const f=fixture(),api=boot(f);
 f.root.classList.add('is-open');await Promise.resolve();
 assert.equal(api.getState().expression,'focus');
 assert.equal(f.root.dataset.fr6iqeState,'engaged');
 f.root.classList.remove('is-open');await Promise.resolve();
 assert.equal(api.getState().expression,'neutral');
 api.destroy();f.w.close();
});
test('Phase 6: reduced-motion and constrained hardware do not animate or schedule expressions',async()=>{
 const f=fixture({reduced:true}),api=boot(f);
 assert.equal(api.getState().lowPower,true);assert.equal(api.setExpression('glitch'),false);
 api.destroy();f.w.close();
 const g=fixture(),other=boot(g);
 g.d.documentElement.classList.add('fr7-low-power');await Promise.resolve();
 assert.equal(other.getState().lowPower,true);assert.equal(other.setExpression('wink'),false);
 assert.equal(other.getState().expression,'neutral');
 other.destroy();assert.equal(g.d.querySelectorAll('#fr-ai-launcher .fr-ai-eye').length,2);
 assert.equal(other.mount(),true);other.destroy();g.w.close();
});
test('Phase 6: missing original assistant fails safely, keeping original controls',()=>{
 const f=fixture({noRoot:true}),api=boot(f);
 assert.equal(api.getState().mounted,false);api.destroy();f.w.close();
 const g=fixture();g.d.querySelector('.fr-ai-avatar').remove();
 const other=boot(g);assert.equal(other.getState().mounted,false);
 assert.equal(g.d.querySelectorAll('.fr6iqe-scene').length,0);
 other.destroy();g.w.close();
});
test('Phase 6: styles are isolated, chamfered, 3D, reduced-motion and no continuous JS render loop',()=>{
 assert.match(css,/#fr-ai-root\.fr6iqe-ready/);
 assert.match(css,/clip-path:polygon\(/);
 assert.match(css,/@keyframes fr6iqe-organic/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/html\.fr7-low-power/);
 assert.match(css,/@media\(max-width:390px\)/);
 assert.doesNotMatch(js,/WebGLRenderingContext|canvas\.getContext/);
 assert.doesNotMatch(js,/requestAnimationFrame\(/);
});
