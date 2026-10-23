/* Franco Romeu / Phase 7.1 — ONE centered navbar, TWO real geometric positions.
 * Keep the historical SPA router, native mobile dialog, search, IQE and budget
 * events. Never let old nav-state classes determine the visual position. */
(function(w,d){
'use strict';
if(w.FRNav7)return;
var nav=d.getElementById('smart-nav'),menu=d.getElementById('fr-site-menu'),
 opener=d.getElementById('fr-site-menu-open'),closeButton=d.getElementById('fr-site-menu-close'),
 brand=d.getElementById('smart-nav-brand');
var mounted=false,raf=0,position='header',active='view-home',
 listeners=[],observers=[],previous={},immersiveApplied=false,immersiveInline=null;
var OVERLAYS=[
 ['#iqe-overlay',['open','active','is-open','visible']],
 ['#amb-detail-overlay',['open','visible','is-open']],
 ['#fr15-p3d-inspector',['is-open','open']],
 ['#fr15-amb-project',['is-open','open']],
 ['#fr16-amb-dossier',['is-open','open']],
 ['#modal-container',['open','active','is-open','visible']],
 ['#fr-ai-root',['is-open']],
 ['#god-mode-panel',['open','is-open','active']]
];
function listen(el,event,fn,opts){if(!el)return;el.addEventListener(event,fn,opts);listeners.push([el,event,fn,opts]);}
function observe(el,options,fn){
 if(!w.MutationObserver||!el)return;
 var obs=new w.MutationObserver(fn);obs.observe(el,options);observers.push(obs);
}
function offset(){return Math.max(0,Number(w.scrollY||w.pageYOffset||0));}
function activeView(){return d.querySelector('.view-section.active')?.id||active;}
function overlaysOpen(){
 if(menu&&menu.open)return true;
 if(d.body&&d.body.classList.contains('fr16-popup-lock'))return true;
 return OVERLAYS.some(function(entry){
  var node=d.querySelector(entry[0]);if(!node)return false;
  if(node.tagName==='DIALOG'&&node.open)return true;
  if(entry[1].some(function(key){return node.classList&&node.classList.contains(key);}))return true;
  if(node.getAttribute('aria-hidden')==='false'){
   // If an existing overlay has visibility controlled solely by aria-hidden,
   // it must also be visible in layout before it suppresses navigation.
   if(typeof w.getComputedStyle!=='function')return true;
   var s=w.getComputedStyle(node);
   return s.display!=='none'&&s.visibility!=='hidden'&&s.opacity!=='0';
  }
  return false;
 });
}
function routes(viewId){
 active=viewId||activeView()||'view-home';
 var anchors=d.querySelectorAll('#smart-nav [data-fr-view],#fr-site-menu a[data-fr-view]');
 Array.prototype.forEach.call(anchors,function(anchor){
  if(anchor.dataset.frView===active)anchor.setAttribute('aria-current','page');
  else anchor.removeAttribute('aria-current');
 });
 nav.dataset.frNav7View=active;
}
function budgetViewActive(){
 // The public SPA marks exactly one section as active. Budget is the sole
 // route that must NEVER become a bottom floating dock.
 return activeView()==='view-orcamento';
}
/* Hide the shared nav only while a split-scroll section is actually pinned to
   the mobile viewport. It returns as soon as that section is left. */
function immersiveSplitActive(){
 if(!w.matchMedia||!w.matchMedia('(max-width: 750px)').matches||budgetViewActive())return false;
 var view=activeView(),id=view==='view-home'?'frms-home':view==='view-projetos'?'frms-portfolio':null;
 if(!id)return false;
 var section=d.getElementById(id);
 if(!section||!section.isConnected||!section.closest('.view-section.active'))return false;
 var rect=section.getBoundingClientRect(),vh=w.innerHeight||d.documentElement.clientHeight||1;
 return rect.height>vh&&rect.top<=8&&rect.bottom>=vh-8;
}
/* Some legacy nav engines write inline !important visibility while scrolling.
   Snapshot and restore those exact inline declarations around immersion. */
function applyImmersiveVisibility(hidden){
 var props=['display','opacity','visibility','pointer-events'];
 if(hidden){
  if(!immersiveApplied){
   immersiveInline={};
   props.forEach(function(prop){
    immersiveInline[prop]=[nav.style.getPropertyValue(prop),nav.style.getPropertyPriority(prop)];
   });
   immersiveApplied=true;
  }
  var target={'display':'none','opacity':'0','visibility':'hidden','pointer-events':'none'};
  props.forEach(function(prop){
   if(nav.style.getPropertyValue(prop)!==target[prop]||nav.style.getPropertyPriority(prop)!=='important'){
    nav.style.setProperty(prop,target[prop],'important');
   }
  });
 }else if(immersiveApplied){
  props.forEach(function(prop){
   var saved=immersiveInline[prop];
   if(saved[0])nav.style.setProperty(prop,saved[0],saved[1]);
   else nav.style.removeProperty(prop);
  });
  immersiveInline=null;immersiveApplied=false;
 }
}
function sync(){
 raf=0;if(!mounted)return;
 // Historical engines replace nav.className during scroll. The data-* marker
 // is the CSS contract; recover the class only for legacy diagnostics.
 if(!nav.classList.contains('fr-nav7-ready'))nav.classList.add('fr-nav7-ready');
 var y=offset(),blocked=overlaysOpen(),immersive=immersiveSplitActive();
 // Only Orçamento stays fixed at the TOP throughout scrolling.
 // All other SPA routes retain the original top↔bottom organic transition.
 // The budget guard overrides any old dock state immediately on route entry.
 var budget=budgetViewActive();
 var docked=!budget&&(position==='footer'?y>90:y>=160);
 position=docked?'footer':'header';
 var hideForModal=blocked;
 if(nav.classList.contains('fr-nav7-docked')!==docked)nav.classList.toggle('fr-nav7-docked',docked);
 if(nav.classList.contains('fr-nav7-modal')!==hideForModal)nav.classList.toggle('fr-nav7-modal',hideForModal);
 if(nav.inert!==(hideForModal||immersive))nav.inert=hideForModal||immersive;
 nav.dataset.frNav7Position=position;
 nav.dataset.frNav7State=blocked?'modal':immersive?'immersive':position;
 applyImmersiveVisibility(immersive);
}
function schedule(){if(mounted&&!raf)raf=w.requestAnimationFrame(sync);}
function restoreOnDialogClose(){
 if(!nav||!mounted)return;
 // Capture close before legacy bubble listeners restore focus to the trigger.
 nav.inert=immersiveSplitActive();
 nav.classList.remove('fr-nav7-modal');
 schedule();
}
function routeChange(event){
 routes(event&&event.detail&&event.detail.viewId||activeView());
 // Reconcile position synchronously to avoid a frame of dock in Orçamento.
 sync();
}
function mount(){
 if(mounted)return true;
 if(!nav||!menu||!opener||!closeButton||!brand)return false;
 previous={inert:nav.inert,openerLabel:opener.getAttribute('aria-label')};
 mounted=true;
 nav.classList.add('fr-nav7-ready');
 menu.classList.add('fr-nav7-dialog');
 d.body&&d.body.classList.add('fr-nav7-active');
 nav.dataset.frNav7Version='7.1';
 if(!opener.getAttribute('aria-label'))opener.setAttribute('aria-label','Abrir menu');
 routes();
 position=!budgetViewActive()&&offset()>=160?'footer':'header';
 listen(w,'scroll',schedule,{passive:true});
 listen(w,'resize',schedule,{passive:true});
 listen(w,'orientationchange',schedule,{passive:true});
 listen(w,'pageshow',schedule);
 listen(d,'visibilitychange',schedule);
 listen(d,'frViewChanged',routeChange);
 listen(menu,'close',restoreOnDialogClose,true);
 listen(menu,'cancel',restoreOnDialogClose,true);
 listen(d,'click',function(event){
  if(event.target&&event.target.closest&&event.target.closest('#smart-nav,#fr-site-menu,#fr-ai-root,#iqe-overlay')){
   schedule();
  }
 },true);
 observe(d.body,{attributes:true,attributeFilter:['class']},schedule);
 observe(menu,{attributes:true,attributeFilter:['open','class']},schedule);
 OVERLAYS.forEach(function(entry){
  var node=d.querySelector(entry[0]);
  if(node)observe(node,{attributes:true,attributeFilter:['class','aria-hidden','open']},schedule);
 });
 // Legacy engines may continue changing nav-state-header/floating classes.
 // Their changes are orthogonal to fr-nav7-docked and cannot change the position.
 observe(nav,{attributes:true,attributeFilter:['class','style']},schedule);
 sync();return true;
}
function destroy(){
 applyImmersiveVisibility(false);
 if(raf){w.cancelAnimationFrame(raf);raf=0;}
 observers.forEach(function(o){o.disconnect();});observers=[];
 listeners.forEach(function(row){row[0].removeEventListener(row[1],row[2],row[3]);});listeners=[];
 if(nav){
  nav.classList.remove('fr-nav7-ready','fr-nav7-docked','fr-nav7-modal');
  nav.inert=Boolean(previous.inert);
  delete nav.dataset.frNav7Version;delete nav.dataset.frNav7Position;
  delete nav.dataset.frNav7State;delete nav.dataset.frNav7View;
 }
 if(menu)menu.classList.remove('fr-nav7-dialog');
 if(d.body)d.body.classList.remove('fr-nav7-active');
 if(opener&&previous.openerLabel===null)opener.removeAttribute('aria-label');
 position='header';mounted=false;
}
w.FRNav7={version:'7.1',mount:mount,destroy:destroy,refresh:function(){routes();schedule();},
 getState:function(){return {mounted:mounted,position:position,immersive:nav?.dataset.frNav7State==='immersive',modal:overlaysOpen(),
  centered:true,budgetPinned:budgetViewActive(),view:active,menuIntact:!!d.getElementById('fr-site-menu'),
  iqeIntact:!!d.getElementById('fr-ai-root')};}};
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',mount,{once:true});
else mount();
})(window,document);
