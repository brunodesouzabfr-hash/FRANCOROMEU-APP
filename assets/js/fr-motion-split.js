/* FR Motion phase 1: user-approved split reveal reimplemented as an isolated SPA component. */
(function (w,d) {
 'use strict';
 if(w.FRMotionSplit) return;
 var roots=[],raf=0,observer=null,destroyed=false,controls=[],listeners=[],touch=null;
 var duration=680,wheel={at:-Infinity,delta:0,dir:0};
 var motionQuery=w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)');
 var motion=!!(motionQuery&&motionQuery.matches);
 function clamp(n){return Math.min(1,Math.max(0,n));}
 function all(root,sel){return Array.prototype.slice.call(root.querySelectorAll(sel));}
 function alphaColor(a){return a>0.30?'#031812':'#fff7e8';}
 function colorFor(imgs,fallback){
  try{
   var canvas=d.createElement('canvas');canvas.width=96;canvas.height=60;
   var ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)return fallback;
   imgs.forEach(function(img,i){if(img.complete&&img.naturalWidth)ctx.drawImage(img,i*48,0,48,60);});
   var raw=ctx.getImageData(0,0,96,60).data, buckets={};
   for(var y=8;y<52;y+=3)for(var x=6;x<92;x+=3){
    var k=(y*96+x)*4,r=raw[k],g=raw[k+1],b=raw[k+2],v=(r+g+b)/3;
    if(raw[k+3]<240||v<28||v>228)continue;
    var key=[r>>5,g>>5,b>>5].join('-'),c=buckets[key]||(buckets[key]={n:0,r:0,g:0,b:0});
    c.n++;c.r+=r;c.g+=g;c.b+=b;
   }
   var best=Object.values(buckets).sort(function(a,b){return b.n-a.n;})[0];
   if(!best||best.n<4)return fallback;
   var rgb=['r','g','b'].map(function(c){return Math.round(best[c]/best.n);});
   return 'rgb('+rgb.join(' ')+')';
  }catch(_err){return fallback;}
 }
 function luminance(str){
  var nums=str.match(/\d+/g),hex=/^#([0-9a-f]{6})$/i.exec(str),rgb;
  if(hex){rgb=[0,2,4].map(function(i){return parseInt(hex[1].slice(i,i+2),16);});}
  else rgb=nums?nums.slice(0,3).map(Number):[10,47,38];
  var a=rgb.map(function(v){v=v/255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4);});
  return .2126*a[0]+.7152*a[1]+.0722*a[2];
 }
 function lazy(img){if(img&&!img.getAttribute('src')&&img.dataset.frmsSrc){img.src=img.dataset.frmsSrc;delete img.dataset.frmsSrc;}}
 function hydrate(scene,center){
  if(scene.dataset.frmsHydrated)return;
  scene.dataset.frmsHydrated='true';
  var imgs=all(scene,'img');
  imgs.forEach(lazy);
  var card=center,done=function(){
   if(!imgs.every(function(i){return i.complete;}))return;
   var color=colorFor(imgs,'#e6d6b5');
   card.style.background=color;card.style.color=alphaColor(luminance(color));
  };
  imgs.forEach(function(i){i.addEventListener('load',done,{once:true});i.addEventListener('error',done,{once:true});});
  done();
 }
 function now(){return w.performance.now();}
 function listen(target,type,fn,options){target.addEventListener(type,fn,options);listeners.push([target,type,fn,options]);}
 function active(rec){var view=rec.root.closest('.view-section');return rec.root.isConnected&&(!view||view.classList.contains('active'))&&!rec.root.closest('[hidden],[inert]');}
 function geometry(rec){
  var rect=rec.root.getBoundingClientRect(),height=rec.pin.getBoundingClientRect().height||w.innerHeight||1;
  return {rect:rect,height:height,travel:Math.max(1,rect.height-height),top:rect.top+w.scrollY};
 }
 function align(rec,index){if(motion||!active(rec))return;var g=geometry(rec);w.scrollTo({top:Math.round(g.top+g.travel*index/Math.max(1,rec.count-1)),behavior:'instant'});}
 function sceneImages(rec,index){return {dataset:rec.cards[index].dataset,querySelectorAll:function(){return [rec.frames[0][index].querySelector('img'),rec.frames[1][index].querySelector('img')];}};}
 function announce(rec){
  var index=Math.round(rec.position),title=rec.cards[index].querySelector('.frms-card-title');
  if(rec.announced===index)return;rec.announced=index;
  if(rec.status)rec.status.textContent='Comparação '+(index+1)+' de '+rec.count+': '+(title?title.textContent:'Franco Romeu');
 }
 function paint(rec,position){
  rec.position=Math.max(0,Math.min(rec.count-1,position));
  var index=Math.floor(rec.position),fraction=rec.position-index,selected=Math.round(rec.position);
  var visible=fraction>0?[index,index+1]:[index];
  rec.layers.forEach(function(i){
   if(visible.indexOf(i)>=0)return;
   rec.frames.forEach(function(frames){frames[i].style.visibility='hidden';});
   var card=rec.cards[i];card.style.opacity='0';card.style.visibility='hidden';card.style.pointerEvents='none';card.inert=true;card.setAttribute('aria-hidden','true');
  });
  visible.forEach(function(i){
   rec.frames.forEach(function(frames,side){
    var frame=frames[i],open=i===index?1:fraction;
    frame.style.visibility='visible';
    frame.style.clipPath=side===0?'inset('+((1-open)*100).toFixed(3)+'% 0 0 0)':'inset(0 0 '+((1-open)*100).toFixed(3)+'% 0)';
    frame.querySelector('img').style.transform=motion?'none':'translate3d(0,'+((side===0?-1:1)*(1-open)*12).toFixed(3)+'%,0) scale(1.055)';
   });
   var card=rec.cards[i],opacity=i===index?1-fraction:fraction,accessible=i===selected;
   card.style.opacity=String(opacity);card.style.visibility='visible';card.style.transform='translateY('+((1-opacity)*20).toFixed(2)+'px)';
   card.style.pointerEvents=accessible?'auto':'none';card.inert=!accessible;card.setAttribute('aria-hidden',String(!accessible));
  });
  rec.layers=visible;
  if(rec.active!==index){
   rec.active=index;
   for(var look=Math.max(0,index-1);look<=Math.min(rec.count-1,index+2);look++)hydrate(sceneImages(rec,look),rec.cards[look]);
  }
  if(rec.bar)rec.bar.style.width=(100*rec.position/Math.max(1,rec.count-1)).toFixed(2)+'%';
  if(rec.counter)rec.counter.textContent=String(selected+1).padStart(2,'0')+' / '+String(rec.count).padStart(2,'0');
  rec.root.dataset.frmsIndex=String(selected);
  rec.buttons.forEach(function(btn){btn.disabled=Number(btn.dataset.frmsStep)<0?rec.target<=0:rec.target>=rec.count-1;});
 }
 function startTween(rec,direct,shouldAlign){
  if(motion||Math.abs(rec.target-rec.position)<.00001){paint(rec,rec.target);if(shouldAlign)align(rec,rec.target);announce(rec);return;}
  var end=direct?rec.target:Math.round(rec.position)+Math.sign(rec.target-rec.position);
  rec.tween={from:rec.position,to:end,start:now(),align:shouldAlign};schedule();
 }
 function select(rec,index,direct,shouldAlign){
  rec.target=Math.max(0,Math.min(rec.count-1,Math.round(index)));rec.escaping=false;
  if(rec.tween&&!direct)return;
  rec.tween=null;
  if(shouldAlign&&!motion)align(rec,rec.position);
  startTween(rec,direct,shouldAlign);
 }
 function advance(rec,dir){select(rec,rec.target+dir,false,true);}
 function cancel(rec){rec.tween=null;rec.target=Math.round(rec.position);paint(rec,rec.target);}
 function mount(root){
  var frames=[all(root,'[data-frms-side="left"] .frms-frame'),all(root,'[data-frms-side="right"] .frms-frame')],cards=all(root,'.frms-card'),total=cards.length;
  if(!total||frames[0].length!==total||frames[1].length!==total)return null;
  var rec={root:root,pin:root.querySelector('.frms-pin'),frames:frames,cards:cards,bar:root.querySelector('.frms-progress span'),counter:root.querySelector('[data-frms-counter]'),status:root.querySelector('.frms-status'),buttons:all(root,'[data-frms-step]'),count:total,active:-1,announced:-1,position:0,target:0,tween:null,layers:[],escaping:false};
  roots.push(rec);
  frames.forEach(function(arr){arr.forEach(function(frame){frame.style.visibility='hidden';});});
  cards.forEach(function(card){card.style.visibility='hidden';card.inert=true;card.setAttribute('aria-hidden','true');});
  paint(rec,0);
  all(root,'[data-frms-jump]').forEach(function(btn){
   var handler=function(){var index=Number(btn.dataset.frmsJump);if(!Number.isInteger(index)||index<0||index>=total)return;select(rec,index,true,true);var list=btn.closest('details');if(list)list.open=false;};
   btn.addEventListener('click',handler);controls.push([btn,handler]);
  });
  rec.buttons.forEach(function(btn){var handler=function(){advance(rec,Number(btn.dataset.frmsStep));};btn.addEventListener('click',handler);controls.push([btn,handler]);});
  var skip=root.querySelector('[data-frms-skip]');
  if(skip){var handler=function(){
   cancel(rec);rec.escaping=true;var next=root.nextElementSibling;
   if(next){next.scrollIntoView({block:'start',behavior:motion?'instant':'smooth'});var focus=next.querySelector('a,button');if(focus)focus.focus({preventScroll:true});}
  };skip.addEventListener('click',handler);controls.push([skip,handler]);}
  return rec;
 }
 function syncScroll(rec){
  var g=geometry(rec),last=rec.count-1;
  if(motion)return;
  if(g.rect.top>2){rec.escaping=false;if(rec.position!==0){rec.target=0;paint(rec,0);}return;}
  if(g.rect.bottom<g.height-2){rec.escaping=false;if(rec.position!==last){rec.target=last;paint(rec,last);}return;}
  if(rec.escaping)return;
  var nearest=Math.round(clamp(-g.rect.top/g.travel)*last);
  // A scrollbar drag or native page key also resolves to a whole scene.
  if(nearest!==rec.target)select(rec,nearest,true,false);
 }
 function tick(time){
  raf=0;var again=false;
  roots.forEach(function(rec){
   if(!active(rec)){if(rec.tween)cancel(rec);return;}
   if(!rec.tween){syncScroll(rec);if(rec.tween)again=true;return;}
   if(d.hidden){rec.tween=null;paint(rec,rec.target);announce(rec);return;}
   var tween=rec.tween,t=clamp((time-tween.start)/duration),eased=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
   paint(rec,tween.from+(tween.to-tween.from)*eased);
   if(t===1){
    rec.tween=null;paint(rec,tween.to);if(tween.align)align(rec,tween.to);
    if(rec.target!==tween.to)startTween(rec,false,tween.align);else announce(rec);
   }
   if(rec.tween)again=true;
  });
  if(again)schedule();
 }
 function schedule(){if(!destroyed&&!raf)raf=w.requestAnimationFrame(tick);}
 function blocked(target){
  return d.hidden||d.body.style.overflow==='hidden'||!!d.querySelector('dialog[open]')||!!(target&&target.closest&&target.closest('input,textarea,select,[contenteditable="true"],details[open]'));
 }
 function pinned(){return roots.find(function(rec){if(!active(rec))return false;var g=geometry(rec);return g.rect.top<=2&&g.rect.bottom>=g.height-2;});}
 function boundary(rec,dir){return !rec.tween&&(dir<0&&rec.target===0||dir>0&&rec.target===rec.count-1);}
 function onWheel(event){
  if(motion||event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||blocked(event.target))return;
  if(!event.deltaY||Math.abs(event.deltaX)>Math.abs(event.deltaY))return;
  var dir=Math.sign(event.deltaY),at=now(),gap=at-wheel.at;
  // Coalesce trackpad momentum. Separate mouse notches can queue during a tween.
  var notch=event.deltaMode!==0||Math.abs(event.deltaY)>=40&&Number.isInteger(event.deltaY)&&event.deltaY===wheel.delta&&gap>=32;
  var fresh=gap>160||dir!==wheel.dir||notch;
  wheel={at:at,delta:event.deltaY,dir:dir};
  var rec=pinned();
  if(!rec){
   var pixels=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?w.innerHeight:1);
   rec=roots.find(function(item){if(!active(item))return false;var g=geometry(item);return dir>0&&g.rect.top>2&&g.rect.top<=pixels||dir<0&&g.rect.bottom<g.height-2&&g.height-g.rect.bottom<=-pixels;});
   if(rec){event.preventDefault();rec.tween=null;rec.target=dir>0?0:rec.count-1;paint(rec,rec.target);align(rec,rec.target);}
   return;
  }
  if(rec.escaping||boundary(rec,dir))return;
  event.preventDefault();if(fresh)advance(rec,dir);
 }
 function onKey(event){
  if(event.defaultPrevented||event.ctrlKey||event.metaKey||event.altKey||blocked(event.target))return;
  var root=event.target.closest&&event.target.closest('.frms-section'),rec=roots.find(function(item){return item.root===root;})||pinned();
  if(!rec||!active(rec))return;
  var dir={ArrowDown:1,ArrowRight:1,PageDown:1,ArrowUp:-1,ArrowLeft:-1,PageUp:-1}[event.key];
  if(event.key===' '&&!event.target.closest('button,a'))dir=event.shiftKey?-1:1;
  if(dir){if(boundary(rec,dir))return;event.preventDefault();advance(rec,dir);}
  else if(event.key==='Home'||event.key==='End'){event.preventDefault();select(rec,event.key==='Home'?0:rec.count-1,true,true);}
 }
 function onTouchStart(event){
  touch=null;if(motion||event.touches.length!==1||blocked(event.target))return;
  var rec=pinned();if(!rec||rec.escaping)return;var point=event.touches[0];touch={rec:rec,x:point.clientX,y:point.clientY,captured:false,dir:0};
 }
 function onTouchMove(event){
  if(!touch)return;if(event.touches.length!==1){touch=null;return;}
  var point=event.touches[0],dy=touch.y-point.clientY,dx=touch.x-point.clientX;
  if(Math.abs(dy)<8||Math.abs(dy)<=Math.abs(dx))return;
  var dir=Math.sign(dy);if(boundary(touch.rec,dir))return;
  event.preventDefault();touch.captured=true;touch.dir=dir;
 }
 function onTouchEnd(){if(touch&&touch.captured)advance(touch.rec,touch.dir);touch=null;}
 function onResize(){roots.forEach(function(rec){if(rec.tween)cancel(rec);});schedule();}
 function onMotionChange(){motion=!!motionQuery.matches;roots.forEach(function(rec){var target=rec.target;rec.tween=null;paint(rec,target);announce(rec);});schedule();}
 function start(){
  all(d,'.frms-section').forEach(mount);if(!roots.length)return;
  listen(w,'scroll',schedule,{passive:true});listen(w,'resize',onResize,{passive:true});listen(w,'pageshow',schedule,{passive:true});
  listen(w,'wheel',onWheel,{passive:false});listen(w,'keydown',onKey);
  listen(w,'touchstart',onTouchStart,{passive:true});listen(w,'touchmove',onTouchMove,{passive:false});listen(w,'touchend',onTouchEnd,{passive:true});listen(w,'touchcancel',function(){touch=null;},{passive:true});
  listen(d,'visibilitychange',schedule);listen(d,'frViewChanged',function(){touch=null;wheel.at=-Infinity;roots.forEach(function(rec){if(!active(rec)&&rec.tween)cancel(rec);});schedule();});
  if(motionQuery&&motionQuery.addEventListener)listen(motionQuery,'change',onMotionChange);
  observer=new MutationObserver(schedule);all(d,'.view-section').forEach(function(view){observer.observe(view,{attributes:true,attributeFilter:['class','hidden','style']});});
  schedule();
 }
 function destroy(){
  if(destroyed)return;destroyed=true;
  if(observer)observer.disconnect();if(raf)w.cancelAnimationFrame(raf);raf=0;touch=null;
  listeners.forEach(function(x){x[0].removeEventListener(x[1],x[2],x[3]);});listeners=[];
  controls.forEach(function(x){x[0].removeEventListener('click',x[1]);});controls=[];
  roots.forEach(cancel);roots=[];
 }
 w.FRMotionSplit={version:'3.0-scenes',refresh:schedule,destroy:destroy,getCount:function(){return roots.map(function(r){return {kind:r.root.dataset.frmsKind,count:r.count};});},getState:function(){return roots.map(function(r){return {kind:r.root.dataset.frmsKind,index:Math.round(r.position),target:r.target,animating:!!r.tween,count:r.count,duration:motion?0:duration};});}};
 if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',start,{once:true});else start();
})(window,document);
