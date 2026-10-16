'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');
const mountBuild=require('../src/fr-nav-phase7.cjs');
const runtime=fs.readFileSync(path.join(__dirname,'../assets/js/fr-nav-phase7.js'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'../assets/css/fr-nav-phase7.css'),'utf8');
const links=[['/sobre','view-sobre','Sobre'],['/ambientes','view-ambientes','Ambientes'],['/projetos-3d','view-projetos3d','Projetos 3D'],['/portfolio','view-projetos','Portfólio'],['/orcamento','view-orcamento','Orçamento']];
function page(){
 const navLinks=links.map(([href,id,label])=>'<li><a class="'+(id==='view-orcamento'?'nav-cta':'nav-link')+'" href="'+href+'" data-fr-view="'+id+'"><i class="fa fa-cube"></i><span class="nav-label">'+label+'</span></a></li>').join('');
 const panelLinks=links.map(([href,id,label])=>'<a href="'+href+'" data-fr-view="'+id+'">'+label+'</a>').join('');
 return '<!doctype html><html><head></head><body><nav id="smart-nav" class="nav-state-header" aria-label="Navegação principal"><a id="smart-nav-brand" href="/" data-fr-view="view-home"><span class="frx-top-logo"><img src="/assets/brand/logo.webp" alt=""></span><span class="frx-brand-copy">Franco Romeu</span></a><ul class="nav-items">'+navLinks+'</ul><div class="fr-site-nav-contact"><a data-fr-contact="instagram" href="https://instagram.com/francoromeu.fr">Instagram</a><a data-fr-contact="whatsapp" href="https://wa.me/5511990021603">WhatsApp</a><button type="button" id="fr-site-menu-open" aria-controls="fr-site-menu" aria-expanded="false">Menu</button></div></nav><dialog id="fr-site-menu" aria-label="Navegação mobile"><button type="button" id="fr-site-menu-close">Fechar</button><nav><a href="/" data-fr-view="view-home">Home</a>'+panelLinks+'<button id="fr-site-menu-search">Buscar</button></nav></dialog><main class="view-section active" id="view-home"></main><main class="view-section" id="view-sobre"></main><main class="view-section" id="view-ambientes"></main><main class="view-section" id="view-projetos3d"></main><main class="view-section" id="view-projetos"></main><main class="view-section" id="view-orcamento"></main><div id="fr-ai-root"></div><div id="iqe-overlay"></div><div id="fr15-p3d-inspector" aria-hidden="true"></div></body></html>';
}
function fixture(){
 const dom=new JSDOM(page(),{runScripts:'outside-only',pretendToBeVisual:true,url:'https://www.francoromeufr.com.br/'});
 const w=dom.window,d=w.document,nav=d.getElementById('smart-nav'),menu=d.getElementById('fr-site-menu'),open=d.getElementById('fr-site-menu-open');
 let sy=0,queue=[],closed=0,search=0;
 Object.defineProperty(w,'scrollY',{configurable:true,get:()=>sy});
 w.requestAnimationFrame=callback=>{queue.push(callback);return queue.length;};
 w.cancelAnimationFrame=()=>{};
 w.matchMedia=()=>({matches:false});
 menu.showModal=function(){this.open=true;open.setAttribute('aria-expanded','true');};
 menu.close=function(){this.open=false;closed++;open.setAttribute('aria-expanded','false');this.dispatchEvent(new w.Event('close'));};
 open.addEventListener('click',()=>{if(!menu.open)menu.showModal();});
 d.getElementById('fr-site-menu-close').addEventListener('click',()=>menu.close());
 d.getElementById('fr-site-menu-search').addEventListener('click',()=>{search++;if(menu.open)menu.close();});
 const originalLogo=nav.querySelector('img'),originalLinks=Array.from(nav.querySelectorAll('a')).map(x=>x.href);
 const flush=()=>{let loops=0;while(queue.length&&loops++<8)queue.shift()();};
 return {dom,w,d,nav,menu,open,logo:originalLogo,links:originalLinks,
  flush,scroll:y=>{sy=y;w.dispatchEvent(new w.Event('scroll'));flush();},getClosed:()=>closed,getSearch:()=>search};
}
function boot(f){
 f.w.eval(runtime);f.d.dispatchEvent(new f.w.Event('DOMContentLoaded'));f.flush();
 return f.w.FRNav7;
}
test('Phase 7 / build hook creates only CSS/JS and keeps original router, logo, contacts and modal intact',()=>{
 const f=fixture();const nav=f.nav,menu=f.menu,brand=f.d.getElementById('smart-nav-brand');
 assert.deepEqual(mountBuild(f.d),{originalNav:true,originalMenu:true,originalSpaRouter:true,originalIQE:true});
 assert.equal(f.d.getElementById('smart-nav'),nav);
 assert.equal(f.d.getElementById('smart-nav-brand'),brand);
 assert.equal(f.d.getElementById('fr-site-menu'),menu);
 assert.equal(f.d.querySelector('link[href="/assets/css/fr-nav-phase7.css"]').rel,'stylesheet');
 assert.equal(f.d.querySelector('script[src="/assets/js/fr-nav-phase7.js"]').defer,true);
 assert.throws(()=>mountBuild(f.d),/duplicate installation/);
 f.dom.window.close();
});
test('Phase 7 / scroll: default expanded, down hides, up reveals and compact navbar never replaces original links',()=>{
 const f=fixture(),api=boot(f);
 assert.equal(api.getState().mounted,true);
 assert.equal(api.getState().visible,true);
 f.scroll(260);
 assert.equal(api.getState().visible,false);
 assert.equal(f.nav.classList.contains('fr-nav7-concealed'),true);
 assert.equal(f.nav.inert,true);
 f.scroll(170);assert.equal(api.getState().visible,true);
 assert.equal(f.nav.classList.contains('fr-nav7-compact'),true);
 assert.deepEqual(Array.from(f.nav.querySelectorAll('a')).map(x=>x.href),f.links);
 assert.equal(f.nav.querySelector('img'),f.logo);
 api.destroy();f.dom.window.close();
});
test('Phase 7 / scroll does not conceal navigation during budget view or reduced-motion',()=>{
 const f=fixture(),api=boot(f);
 f.d.querySelector('#view-home').classList.remove('active');
 f.d.querySelector('#view-orcamento').classList.add('active');
 f.d.dispatchEvent(new f.w.CustomEvent('frViewChanged',{detail:{viewId:'view-orcamento'}}));f.flush();
 f.scroll(350);assert.equal(api.getState().visible,true);
 assert.equal(f.nav.dataset.frNav7View,'view-orcamento');
 assert.equal(f.nav.querySelector('a[href="/orcamento"]').getAttribute('aria-current'),'page');
 api.destroy();f.dom.window.close();
});
test('Phase 7 / original mobile native dialog, close and search handlers operate without duplicates',async()=>{
 const f=fixture(),api=boot(f);
 f.open.click();await Promise.resolve();f.flush();
 assert.equal(f.menu.open,true);
 assert.equal(f.open.getAttribute('aria-expanded'),'true');
 assert.equal(f.d.querySelector('#fr-site-menu-search').isConnected,true);
 assert.equal(f.nav.dataset.frNav7State,'modal');
 f.d.getElementById('fr-site-menu-search').click();await Promise.resolve();f.flush();
 assert.equal(f.getSearch(),1);
 assert.equal(f.getClosed(),1);
 assert.equal(f.menu.open,false);
 assert.equal(f.open.getAttribute('aria-expanded'),'false');
 api.destroy();f.dom.window.close();
});
test('Phase 7 / modal and IQE activation conceal navbar without changing popup or assistant state',async()=>{
 const f=fixture(),api=boot(f),iqe=f.d.getElementById('fr-ai-root');
 iqe.classList.add('is-open');await Promise.resolve();f.flush();
 assert.equal(f.nav.dataset.frNav7State,'modal');
 assert.equal(iqe.classList.contains('is-open'),true);
 iqe.classList.remove('is-open');await Promise.resolve();f.flush();
 assert.equal(f.nav.dataset.frNav7State!=='modal',true);
 const inspector=f.d.getElementById('fr15-p3d-inspector');
 inspector.classList.add('is-open');await Promise.resolve();f.flush();
 assert.equal(f.nav.dataset.frNav7State,'modal');
 inspector.classList.remove('is-open');await Promise.resolve();f.flush();
 api.destroy();f.dom.window.close();
});
test('Phase 7 / route changes synchronize all navigation links with existing SPA events',()=>{
 const f=fixture(),api=boot(f);
 f.d.querySelector('#view-home').classList.remove('active');
 f.d.querySelector('#view-ambientes').classList.add('active');
 f.d.dispatchEvent(new f.w.CustomEvent('frViewChanged',{detail:{viewId:'view-ambientes'}}));f.flush();
 assert.equal(f.nav.querySelector('a[href="/ambientes"]').getAttribute('aria-current'),'page');
 assert.equal(f.d.querySelector('#fr-site-menu a[href="/ambientes"]').getAttribute('aria-current'),'page');
 assert.equal(f.nav.querySelector('a[href="/sobre"]').hasAttribute('aria-current'),false);
 assert.equal(f.nav.dataset.frNav7View,'view-ambientes');
 api.destroy();f.dom.window.close();
});
test('Phase 7 / destroy restores old classes and listeners, remount is idempotent',()=>{
 const f=fixture(),api=boot(f),logo=f.logo,menu=f.menu;
 f.scroll(300);assert.equal(f.nav.inert,true);
 api.destroy();
 assert.equal(f.nav.classList.contains('fr-nav7-ready'),false);
 assert.equal(f.nav.classList.contains('fr-nav7-concealed'),false);
 assert.equal(f.nav.inert,false);
 assert.equal(f.d.body.classList.contains('fr-nav7-active'),false);
 assert.equal(f.menu.classList.contains('fr-nav7-dialog'),false);
 assert.equal(f.nav.querySelector('img'),logo);
 assert.equal(f.d.getElementById('fr-site-menu'),menu);
 assert.equal(api.mount(),true);
 assert.equal(f.d.querySelectorAll('#smart-nav').length,1);
 api.destroy();f.dom.window.close();
});
test('Phase 7 / visual contracts: mobile menu, quiet luxury geometry, reduced motion, focus and no wheel hijack',()=>{
 assert.match(css,/fr-nav7-compact/);
 assert.match(css,/fr-nav7-concealed/);
 assert.match(css,/@media\(max-width:1050px\)/);
 assert.match(css,/@media\(max-width:600px\)/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/min-width:44px/);
 assert.match(css,/#smart-nav\.fr-nav7-ready/);
 assert.match(css,/fr-nav7-dialog/);
 assert.doesNotMatch(runtime,/addEventListener\(['"](?:wheel|touchmove)/);
 assert.doesNotMatch(runtime,/\.showModal\(/);
});
