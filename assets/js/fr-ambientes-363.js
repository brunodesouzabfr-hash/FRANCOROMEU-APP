/* ꟻR / Ambientes 3+6+3 — Phase 3. Existing catalog and openAmbDetail remain authoritative. */
(function(w,d){
'use strict';
if(w.FRAmbientes363)return;
var root=d.getElementById('framb363-atlas'),view=d.getElementById('view-ambientes');
var museum=view&&view.querySelector('.amb-museum');
var mounted=false,raf=0,io=null,observer=null,listeners=false,styleCount=0;
function reduced(){return !!(w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches);}
function mobile(){return !!(w.matchMedia&&w.matchMedia('(max-width: 800px)').matches);}
function text(v){return String(v==null?'':v);}
function node(tag,cls,txt){var n=d.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=text(txt);return n;}
function validSource(raw){
 if(typeof raw!=='string'||!raw.trim())return null;
 try{var url=new URL(raw,w.location.origin);
  return url.origin===w.location.origin&&url.pathname.indexOf('/assets/')===0?url.pathname:null;
 }catch(e){return null;}
}
function catalog(){
 if(!Array.isArray(w.AMB_STYLES)||w.AMB_STYLES.length!==12)return null;
 var items=w.AMB_STYLES.map(function(style,index){return {
   index:index,style:style,name:text(style.name||'Ambiente '+(index+1)),
   src:validSource(style.img),
   essence:text(style.essence||'Arquitetura e materialidade'),
   desc:text(style.desc||''),
   palette:Array.isArray(style.palette)?style.palette.map(text).join(' · '):'',
   serviceIds:Array.isArray(style.services)?style.services.map(function(s){return text(s.id||s.role);}).filter(Boolean):[]
 };});
 if(items.some(function(item){return !item.src||!item.name;}))return null;
 return items;
}
function image(item,eager){
 var img=node('img');img.src=item.src;img.alt=item.name+' — imagem de ambiente criada pela Franco Romeu';
 img.loading=eager?'eager':'lazy';img.decoding='async';
 img.addEventListener('error',function(){if(mounted)destroy();},{once:true});
 return img;
}
function openButton(item,label){
 var btn=node('button','fa-open',label||'Explorar ambiente ↗');
 btn.type='button';btn.dataset.faOpen=String(item.index);
 btn.setAttribute('aria-label','Explorar '+item.name);return btn;
}
function media(item,eager){
 var box=node('div','fa-image');box.append(image(item,eager));return box;
}
function info(item,kind){
 var el=node('div',kind),index=node('span','fa-no',String(item.index+1).padStart(2,'0')+' / 12');
 var name=node('strong','fa-name',item.name);
 el.append(index,name,node('span','fa-essence',item.essence));
 if(kind==='fa-info'&&item.desc)el.append(node('p','fa-description',item.desc));
 el.append(openButton(item));return el;
}
function introCard(item){
 var article=node('article','fa-intro-card');article.dataset.faIndex=String(item.index);
 article.dataset.faVisible='false';article.dataset.faServices=item.serviceIds.join(',');
 article.append(media(item,item.index===0),info(item,'fa-info'));return article;
}
function middleCard(item){
 var article=node('article','fa-spatial');article.dataset.faIndex=String(item.index);
 article.dataset.faServices=item.serviceIds.join(',');
 var panel=node('div','fa-spatial-copy'),meta=node('div','fa-spatial-meta');
 meta.append(node('span','fa-no',String(item.index+1).padStart(2,'0')+' / 12'),
    node('strong','fa-name',item.name),node('span','fa-essence',item.essence));
 if(item.palette)meta.append(node('small','fa-palette',item.palette));
 panel.append(meta,openButton(item,'Detalhes ↗'));
 article.append(media(item,false),panel);return article;
}
function diamondCard(item){
 var article=node('article','fa-diamond');article.dataset.faIndex=String(item.index);
 article.dataset.faServices=item.serviceIds.join(',');
 article.append(media(item,false),info(item,'fa-info'));return article;
}
function content(items){
 var frag=d.createDocumentFragment();
 var head=node('header','fa-head'),wrap=node('div');
 wrap.append(node('span','fa-kicker','ꟻR / ATLAS DE AMBIENTES'),
    node('h2','fa-title','12 atmosferas. Uma assinatura.'));
 head.append(wrap,node('p','','Matéria, luz e proporção. Doze composições criadas pela Franco Romeu.'));frag.append(head);
 var first=node('section','fa-intro');first.setAttribute('aria-label','Três ambientes de abertura');
 items.slice(0,3).forEach(function(x){first.append(introCard(x));});frag.append(first);
 var mid=node('section','fa-mid');mid.setAttribute('aria-label','Seis ambientes em deslocamento espacial');
 var pin=node('div','fa-sticky'),midHead=node('header','fa-mid-head'),title=node('div');
 title.append(node('span','fa-kicker','ꟻR / PERCURSO ESPACIAL'),
   node('h3','','A arquitetura em movimento.'));
 midHead.append(title,node('p','','SEIS AMBIENTES / DESLOQUE PARA EXPLORAR →'));pin.append(midHead);
 var viewport=node('div','fa-viewport'),rail=node('div','fa-rail');
 items.slice(3,9).forEach(function(x){rail.append(middleCard(x));});
 viewport.append(rail);pin.append(viewport);
 var line=node('div','fa-line');line.append(node('span','fa-bar'));pin.append(line);mid.append(pin);frag.append(mid);
 var last=node('section','fa-final');last.setAttribute('aria-label','Três ambientes em perspectiva');
 last.append(node('h3','','Matéria em perspectiva.'));
 var diamonds=node('div','fa-diamonds');
 items.slice(9,12).forEach(function(x){diamonds.append(diamondCard(x));});
 last.append(diamonds);frag.append(last);
 var foot=node('footer','fa-end');
 foot.append(node('p','','Uma linguagem por ambiente. Explore a composição, materiais e serviços relacionados.'));
 var quote=node('a','','Solicitar uma composição sob medida ↗');quote.href='/orcamento';
 foot.append(quote);frag.append(foot);
 return frag;
}
function paint(){
 raf=0;if(!mounted||reduced()||mobile())return;
 if(view&&!view.classList.contains('active'))return;
 var mid=root.querySelector('.fa-mid'),rail=root.querySelector('.fa-rail'),bar=root.querySelector('.fa-bar');
 if(!mid||!rail)return;
 var rect=mid.getBoundingClientRect(),span=Math.max(1,rect.height-w.innerHeight);
 var p=Math.max(0,Math.min(1,-rect.top/span));
 rail.style.transform='translate3d('+(-50*p).toFixed(2)+'%,0,0)';
 if(bar)bar.style.width=(100*p).toFixed(2)+'%';
 var cards=rail.querySelectorAll('.fa-spatial');
 for(var i=0;i<cards.length;i++){
  var center=(i+.5)/6;
  cards[i].style.setProperty('--fa-tilt',((center-(p*.5+.25))*12).toFixed(2)+'deg');
 }
}
function schedule(){if(mounted&&!raf&&!reduced()&&!mobile())raf=w.requestAnimationFrame(paint);}
function handleClick(event){
 var button=event.target.closest('[data-fa-open]');
 if(!button||!root.contains(button))return;
 var id=Number(button.dataset.faOpen);
 if(!Number.isInteger(id)||id<0||id>=12)return;
 if(typeof w.openAmbDetail==='function'){
  try{w.openAmbDetail(id);return;}catch(e){if(w.console)w.console.error('FR Ambientes: popup original',e);}
 }
 // If the original details API is unavailable, restore the original interactive atlas.
 destroy();
 if(museum&&museum.scrollIntoView)museum.scrollIntoView({block:'start'});
}
function showIntro(){
 var cards=root.querySelectorAll('.fa-intro-card');
 if(reduced()||typeof w.IntersectionObserver!=='function'){
  cards.forEach(function(c){c.dataset.faVisible='true';});return;
 }
 io=new w.IntersectionObserver(function(entries){
  entries.forEach(function(entry){if(entry.isIntersecting){
    entry.target.dataset.faVisible='true';io.unobserve(entry.target);
  }});
 },{threshold:.12,rootMargin:'0px 0px -5% 0px'});
 cards.forEach(function(card){io.observe(card);});
}
function mount(){
 if(mounted||!root||!view||!museum)return false;
 var items=catalog();if(!items)return false;
 root.replaceChildren(content(items));
 if(root.querySelectorAll('[data-fa-index]').length!==12){root.replaceChildren();return false;}
 // The canonical original is hidden only after successful creation of all twelve replacement cards.
 root.addEventListener('click',handleClick);
 mounted=true;styleCount=12;
 root.dataset.framb363Status='ready';view.classList.add('framb363-ready');
 showIntro();
 w.addEventListener('scroll',schedule,{passive:true});
 w.addEventListener('resize',schedule,{passive:true});listeners=true;
 if(typeof w.MutationObserver==='function'){
  observer=new w.MutationObserver(schedule);
  observer.observe(view,{attributes:true,attributeFilter:['class','hidden','style']});
 }
 schedule();return true;
}
function destroy(){
 if(raf)w.cancelAnimationFrame(raf);raf=0;
 if(listeners){w.removeEventListener('scroll',schedule);w.removeEventListener('resize',schedule);listeners=false;}
 if(io){io.disconnect();io=null;}if(observer){observer.disconnect();observer=null;}
 if(root)root.removeEventListener('click',handleClick);
 if(view)view.classList.remove('framb363-ready');
 mounted=false;styleCount=0;
 if(root){root.replaceChildren();root.dataset.framb363Status='fallback';}
}
w.FRAmbientes363={version:'3.0',mount:mount,destroy:destroy,refresh:schedule,
 getState:function(){return {mounted:mounted,rendered:root?root.querySelectorAll('[data-fa-index]').length:0,
  sourceCount:Array.isArray(w.AMB_STYLES)?w.AMB_STYLES.length:0,originalAtlasIntact:!!(view&&view.querySelector('#amb-grid-container'))};}};
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',mount,{once:true});
else mount();
})(window,document);
