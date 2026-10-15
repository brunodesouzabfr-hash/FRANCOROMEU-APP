/* Franco Romeu / IQE Phase 6 — visual-only CSS 3D avatar.
 * The persistent assistant and the IQE wizard own every business/state action.
 * This layer NEVER calls the original open/close, search or budget functions.
 */
(function(w,d){
'use strict';
if(w.FRIQEAvatar6)return;
var root=null,launcher=null,header=null,originals=[],observers=[],handlers=[],timer=0,hold=0,mounted=false,turn=0;
var media=w.matchMedia?w.matchMedia('(prefers-reduced-motion: reduce)'):null;
var EXPRESSIONS=Object.freeze([
 'neutral','blink','smile','happy','focus','curious','surprise','wink',
 'thinking','sleepy','determined','glitch'
]);
/* 5×5 LED designs: separate left/right images allow wink and asymmetric interest.
   All pixel matrices are deliberately tiny, deterministic and local. */
var CLOSED='00000'+'00000'+'11111'+'00000'+'00000';
var NORMAL='00000'+'00100'+'00100'+'00100'+'00000';
var WIDE='00000'+'01110'+'01010'+'01110'+'00000';
var SQUINT='00000'+'00000'+'01110'+'00100'+'00000';
var SPARK='00100'+'01110'+'11111'+'01110'+'00100';
var RAISED='00100'+'01000'+'00100'+'00100'+'00000';
var LOW='00000'+'00000'+'01110'+'01010'+'00000';
var THIN='00000'+'00000'+'00100'+'00000'+'00000';
var SOLID='00000'+'01110'+'01110'+'01110'+'00000';
var XPIX='10001'+'01010'+'00100'+'01010'+'10001';
var eyes=Object.freeze({
 neutral:[NORMAL,NORMAL],blink:[CLOSED,CLOSED],smile:[SQUINT,SQUINT],
 happy:[SPARK,SPARK],focus:[SOLID,SOLID],curious:[RAISED,NORMAL],
 surprise:[WIDE,WIDE],wink:[CLOSED,WIDE],thinking:[NORMAL,RAISED],
 sleepy:[LOW,LOW],determined:[SQUINT,SOLID],glitch:[XPIX,SPARK]
});
var sceneEls=[];
function el(tag,cls){var n=d.createElement(tag);if(cls)n.className=cls;return n;}
function listen(node,event,fn,opts){node.addEventListener(event,fn,opts);handlers.push([node,event,fn,opts]);}
function observe(target,config,callback){
 if(!w.MutationObserver||!target)return;
 var o=new w.MutationObserver(callback);o.observe(target,config);observers.push(o);
}
function scene(kind){
 var group=el('span','fr6iqe-scene');group.dataset.fr6iqeKind=kind;
 group.dataset.fr6iqeExpression='neutral';group.setAttribute('aria-hidden','true');
 var cube=el('span','fr6iqe-cube');
 for(var i=0;i<6;i++){
  var names=['front','back','right','left','top','bottom'],f=el('span','fr6iqe-face');
  f.dataset.face=names[i];f.appendChild(el('span','fr6iqe-edge'));
  if(i===0){
   var visor=el('span','fr6iqe-visor');
   for(var j=0;j<2;j++){
    var eye=el('span','fr6iqe-eye');eye.dataset.fr6iqeEye=String(j);
    for(var k=0;k<25;k++){var pixel=el('span','fr6iqe-pixel');eye.appendChild(pixel);}
    visor.appendChild(eye);
   }
   f.append(visor,el('span','fr6iqe-mouth'));
  }else if(i===1){
   var mark=el('span','fr6iqe-mark');mark.textContent='ꟻR';f.appendChild(mark);
  }else f.appendChild(el('span','fr6iqe-side-stroke'));
  cube.appendChild(f);
 }
 group.appendChild(cube);sceneEls.push(group);return group;
}
function assign(name){
 if(EXPRESSIONS.indexOf(name)<0)return false;
 var pair=eyes[name];
 sceneEls.forEach(function(group){
  group.dataset.fr6iqeExpression=name;
  var fields=group.querySelectorAll('.fr6iqe-eye');
  for(var j=0;j<Math.min(2,fields.length);j++){
   var pixels=fields[j].children;
   for(var i=0;i<Math.min(25,pixels.length);i++){
    pixels[i].classList.toggle('is-on',pair[j].charAt(i)==='1');
   }
  }
 });
 return true;
}
function lowPower(){return Boolean(d.documentElement.classList.contains('fr7-low-power'));}
function paused(){return !!((media&&media.matches)||lowPower()||d.hidden);}
function haltClock(){if(timer){w.clearInterval(timer);timer=0;}}
function tick(){
 if(!mounted||paused())return;
 if(root&&root.classList.contains('is-open'))return;
 // No random clock work, deterministic expression sequence with a 12s gap.
 var progression=['neutral','smile','curious','blink','neutral','happy','thinking','neutral','wink','neutral','sleepy','neutral'];
 assign(progression[(turn++)%progression.length]);
}
function syncClock(){
 if(!root||!mounted)return;
 var isPaused=paused();
 root.dataset.fr6iqeState=isPaused?'paused':root.classList.contains('is-open')?'engaged':'idle';
 if(isPaused){haltClock();assign('neutral');return;}
 if(!timer)timer=w.setInterval(tick,12000);
}
function delayedReset(){
 if(hold)w.clearTimeout(hold);
 hold=w.setTimeout(function(){
  hold=0;
  if(!mounted)return;
  assign(root.classList.contains('is-open')?'focus':'neutral');
 },1900);
}
function action(event){
 if(!mounted||paused())return;
 var target=event.target.closest?event.target.closest('[data-fr-ai-action],#fr-ai-launcher,#fr-ai-close,#fr-ai-search-head,.fr-ai-context-bubble'):null;
 if(!target||!root.contains(target))return;
 var act=target.getAttribute('data-fr-ai-action')||target.id||'';
 var expression=act==='search'||act==='fr-ai-search-head'?'focus':
   act==='auto'||act==='budget'?'happy':act==='tips'?'curious':
   act==='fr-ai-launcher'?'surprise':act==='fr-ai-close'?'blink':
   act==='fr-ai-context-bubble'?'listening':'determined';
 if(expression==='listening')expression='thinking';
 assign(expression);delayedReset();
}
function storeAndReplace(node){
 var saved=Array.prototype.slice.call(node.childNodes);
 originals.push([node,saved]);node.replaceChildren(scene(node.classList.contains('fr-ai-avatar')?'header':'launcher'));
}
function mount(){
 if(mounted)return true;
 root=d.getElementById('fr-ai-root');
 if(!root)return false;
 launcher=root.querySelector('#fr-ai-launcher .fr-ai-robot');
 header=root.querySelector('.fr-ai-avatar');
 if(!launcher||!header||!root.querySelector('#fr-ai-body')||!root.querySelector('.fr-ai-context-bubble'))return false;
 storeAndReplace(launcher);storeAndReplace(header);
 root.classList.add('fr6iqe-ready');mounted=true;
 assign('neutral');
 observe(root,{attributes:true,attributeFilter:['class']},function(){
  if(!mounted)return;
  syncClock();
  if(!paused())assign(root.classList.contains('is-open')?'focus':'neutral');
 });
 var bubble=root.querySelector('.fr-ai-context-bubble');
 observe(bubble,{attributes:true,attributeFilter:['class']},function(){
  if(!mounted||paused()||root.classList.contains('is-open'))return;
  assign(bubble.classList.contains('is-visible')?'curious':'neutral');
 });
 observe(d.documentElement,{attributes:true,attributeFilter:['class']},syncClock);
 listen(root,'click',action);
 listen(d,'visibilitychange',syncClock);
 if(media&&typeof media.addEventListener==='function')listen(media,'change',syncClock);
 syncClock();return true;
}
var discoverer=null;
function discover(){
 if(mount())return;
 if(!d.body||!w.MutationObserver)return;
 discoverer=new w.MutationObserver(function(){
  if(mount()){discoverer.disconnect();discoverer=null;}
 });
 discoverer.observe(d.body,{childList:true,subtree:true});
}
function destroy(){
 haltClock();if(hold){w.clearTimeout(hold);hold=0;}
 if(discoverer){discoverer.disconnect();discoverer=null;}
 observers.forEach(function(o){o.disconnect();});observers=[];
 handlers.forEach(function(row){row[0].removeEventListener(row[1],row[2],row[3]);});handlers=[];
 originals.forEach(function(item){item[0].replaceChildren.apply(item[0],item[1]);});originals=[];
 if(root){root.classList.remove('fr6iqe-ready');delete root.dataset.fr6iqeState;}
 sceneEls=[];mounted=false;launcher=null;header=null;root=null;turn=0;
}
w.FRIQEAvatar6={version:'6.0',mount:mount,destroy:destroy,
 setExpression:function(name){return mounted&&!paused()?assign(name):false;},
 getState:function(){return {mounted:mounted,expressions:EXPRESSIONS.slice(),expression:sceneEls[0]?.dataset.fr6iqeExpression||null,
  scenes:sceneEls.length,lowPower:paused(),wizardUntouched:!!d.getElementById('fr-stage5-assistant-engine')};}};
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',discover,{once:true});
else discover();
})(window,document);
