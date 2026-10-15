/* FR Motion phase 1: user-approved split reveal reimplemented as an isolated SPA component. */
(function (w,d) {
 'use strict';
 if(w.FRMotionSplit) return;
 var roots=[],raf=0,observer=null,destroyed=false;
 var motion=w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
 function mount(root){
  var frames=[all(root,'[data-frms-side="left"] .frms-frame'),all(root,'[data-frms-side="right"] .frms-frame')];
  var cards=all(root,'.frms-card'),total=cards.length;
  if(!total||frames[0].length!==total||frames[1].length!==total)return null;
  var record={root:root,frames:frames,cards:cards,bar:root.querySelector('.frms-progress span'),counter:root.querySelector('[data-frms-counter]'),count:total,active:-1};
  roots.push(record);
  cards.forEach(function(c,i){c.inert=i!==0;c.setAttribute('aria-hidden',String(i!==0));});
  hydrate({dataset:{},querySelectorAll:function(){return [frames[0][0].querySelector('img'),frames[1][0].querySelector('img')];}},cards[0]);
  return record;
 }
 function sceneImages(rec,index){
  return {dataset:rec.cards[index].dataset,querySelectorAll:function(){return [rec.frames[0][index].querySelector('img'),rec.frames[1][index].querySelector('img')];}};
 }
 function update(rec){
  if(destroyed||motion)return;
  var root=rec.root,view=root.closest('.view-section');
  if(view&&!view.classList.contains('active'))return;
  var rect=root.getBoundingClientRect(),h=w.innerHeight||1,travel=Math.max(1,rect.height-h);
  var p=clamp(-rect.top/travel),at=p*(rec.count-1),index=Math.min(rec.count-1,Math.floor(at)),fraction=clamp(at-index);
  if(index>=rec.count-1)fraction=0;
  if(rec.active!==index){
   rec.active=index;
   for(var look=Math.max(0,index-1);look<=Math.min(rec.count-1,index+2);look++)hydrate(sceneImages(rec,look),rec.cards[look]);
  }
  rec.frames.forEach(function(arr,side){
   arr.forEach(function(frame,i){
    var open=i<=index?1:i===index+1?fraction:0;
    frame.style.clipPath=side===0?'inset('+((1-open)*100)+'% 0 0 0)':'inset(0 0 '+((1-open)*100)+'% 0)';
    frame.style.visibility=open>0?'visible':'hidden';
    var img=frame.querySelector('img');
    if(img&&(i===index||i===index+1))img.style.transform='translateY('+((side===0?-1:1)*(1-open)*12)+'%) scale(1.055)';
    else if(img)img.style.transform='';
   });
  });
  rec.cards.forEach(function(card,i){
   var opacity=i===index?1-fraction:i===index+1?fraction:0;
   if(index===rec.count-1&&i===index)opacity=1;
   card.style.opacity=String(opacity);
   card.style.visibility=opacity>0?'visible':'hidden';
   card.style.transform='translateY('+((1-opacity)*20)+'px)';
   var active=opacity>.5;card.inert=!active;card.setAttribute('aria-hidden',String(!active));
   card.style.pointerEvents=active?'auto':'none';
  });
  if(rec.bar)rec.bar.style.width=(100*p).toFixed(2)+'%';
  if(rec.counter)rec.counter.textContent=String(index+1).padStart(2,'0')+' / '+String(rec.count).padStart(2,'0');
 }
 function tick(){raf=0;roots.forEach(update);}
 function schedule(){if(!destroyed&&!raf)raf=w.requestAnimationFrame(tick);}
 function start(){
  all(d,'.frms-section').forEach(mount);
  if(!roots.length)return;
  w.addEventListener('scroll',schedule,{passive:true});w.addEventListener('resize',schedule,{passive:true});
  observer=new MutationObserver(schedule);
  all(d,'.view-section').forEach(function(view){observer.observe(view,{attributes:true,attributeFilter:['class','hidden','style']});});
  if(!motion)schedule();
 }
 function destroy(){
  if(destroyed)return;destroyed=true;
  w.removeEventListener('scroll',schedule);w.removeEventListener('resize',schedule);
  if(observer)observer.disconnect();if(raf)w.cancelAnimationFrame(raf);raf=0;
  roots.forEach(function(rec){rec.cards.forEach(function(c,i){c.inert=i!==0;});});
  roots=[];
 }
 w.FRMotionSplit={version:'phase1.0',refresh:schedule,destroy:destroy,getCount:function(){return roots.map(function(r){return {kind:r.root.dataset.frmsKind,count:r.count};});}};
 if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',start,{once:true});else start();
})(window,document);
