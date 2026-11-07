/* A linha que fica — scene lifecycle and the five-pair living archive. */
(function (w, d) {
'use strict';
if(w.FRStory || !d.getElementById('story-manifest'))return;
const data=JSON.parse(d.getElementById('story-manifest').textContent);
const reduce=w.matchMedia('(prefers-reduced-motion: reduce)');
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const visited=new Set(), listeners=[], modules=new Map(), positions=new Map();
let active=null, swarm=null, routeJob=0, pendingService=null, lastKnownY=0, degraded=false, modalPair=null;
function on(el,type,fn,opts){el.addEventListener(type,fn,opts);listeners.push(()=>el.removeEventListener(type,fn,opts));}
function animate(el,frames,options){if(!el || typeof el.animate!=='function'||reduce.matches)return Promise.resolve();const a=el.animate(frames,options);return a.finished.catch(()=>{});}
function feedback(text){const p=d.querySelector('.view-section.active .story-feedback');if(p)p.textContent=text;}
function goService(id){const core=w.__frCore;if(!core?.SERVICES[id]){feedback('O catálogo está iniciando. Tente novamente em um instante.');return;}pendingService=id;if(!d.getElementById('view-orcamento').classList.contains('active')){w.switchView('view-orcamento');}else configureService();}
function configureService(){const core=w.__frCore;if(!pendingService||!core)return;const id=pendingService;pendingService=null;core.appState.step=2;core.saveAndRender();core.handle.selectService({dataset:{serviceId:id}});const input=d.querySelector('[data-action="updateServiceQty"]');if(input)input.focus({preventScroll:true});}
function textAction(button,action){if(typeof action==='function'){action();return;}const archive=button.closest('.story-view')?.querySelector('.story-archive');if(archive){archive.open=true;archive.scrollIntoView({behavior:reduce.matches?'auto':'smooth',block:'start'});}}
function pairMarkup(p,i){return `<article class="story-pair" data-story-pair="${esc(p.id)}" style="--order:${i}"><p>${String(i+1).padStart(2,'0')} <span>${esc(p.title)}</span></p><div class="story-pair-images">${['before','after'].map(side=>{const m=p[side];return `<button class="story-photo" type="button" data-story-open="${esc(p.id)}" data-story-side="${side}" aria-label="Ampliar ${esc(m.label)} de ${esc(p.title)}"><img src="${esc(m.src)}" alt="${esc(m.alt)}" width="${m.width}" height="${m.height}" decoding="async" data-story-media-id="${esc(m.id)}"><span>${esc(m.label)}</span></button>`;}).join('')}</div></article>`;}
const serviceByEditorial={'cozinhas-planejadas':'mar_instalacao_movel','marcenaria-sob-medida':'mar_instalacao_movel','bancadas':'proj_bancada','iluminacao':'ilu_perfil_led','forros':'forro','revestimentos':'porcelanato','pintura':'tinta','automacao':'ele_automacao','pisos':'porcelanato','drywall':'drywall','paisagismo':'jardim'};
function openPair(id,side){const p=data.pairs.find(p=>p.id===id);if(!p||typeof w.openProjectModal!=='function')return;
 const canonical=w.FR_MEDIA_LIBRARY?.pairs.find(x=>x.pair_id===id);
 const m=w.FR_MEDIA_LIBRARY?.media[p.after.id];
 const ids=[...(canonical?.calculator_service_ids||[]),...(m?.service_ids||[]).map(id=>serviceByEditorial[id])].filter(id=>w.__frCore?.SERVICES[id]);
 const serviceId=ids[0]||'proj_interiores';
 const images=side==='after'?[p.after,p.before]:[p.before,p.after];
 modalPair=p;
 w.openProjectModal({id:p.id,title:p.title,cat:'reforma',catLabel:'Projeto executado · acervo Franco Romeu',url:images[0].src,images:images.map(m=>m.src),imageLabels:images.map(m=>m.label),imageAlts:images.map(m=>m.alt),keepExactImages:true,serviceId,description:[p.interventions.join(' · '),p.materials.length?'Materiais: '+p.materials.join(', '):''].filter(Boolean).join('. '),tags:p.materials.slice(0,4)});
}
function sceneModule(view){let io,raf=0,reveal,alive=true,times=[],visible=new Set(),last=0;
 const scenes=[...view.querySelectorAll('.story-surface>.story-act,[data-story-act].story-budget-intro')];
 const progress=d.querySelector('.story-progress-line>i'),caption=d.querySelector('.story-progress-act');
 function tick(t){raf=0;if(!alive||d.hidden)return;
  if(last && t-last<500){times.push(t-last);if(times.length>60)times.shift();if(times.length===60&&times.reduce((s,n)=>s+n,0)/60>25)degraded=true;}last=t;
  // All geometry reads precede all compositor writes. No raw scroll listener.
  const vh=w.innerHeight;lastKnownY=w.scrollY;
  const reads=[...visible].map(el=>({el,rect:el.getBoundingClientRect()}));let nearest=null,dist=Infinity;
  for(const row of reads){const distance=Math.abs(row.rect.top-vh*.2);if(distance<dist){nearest=row.el;dist=distance;}row.p=reduce.matches?1:clamp((vh-row.rect.top)/(vh*.72));}
  for(const row of reads)row.el.style.setProperty('--story-p',row.p.toFixed(4));
  if(nearest){const i=scenes.indexOf(nearest);if(caption)caption.textContent=nearest.dataset.storyAct;if(progress)progress.style.transform='scaleX('+((i+1)/scenes.length)+')';}
  if(visible.size && !reduce.matches)raf=w.requestAnimationFrame(tick);
 }
 if('IntersectionObserver'in w){io=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting)visible.add(e.target);else visible.delete(e.target);}if(!raf)raf=w.requestAnimationFrame(tick);},{rootMargin:'100px 0px',threshold:0});scenes.forEach(s=>io.observe(s));
 reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('story-seen');reveal.unobserve(e.target);}}),{threshold:.06});
 view.querySelectorAll('.story-act :is(h1,h2,.story-editorial-copy>p,.story-method li,.story-decisions article,.story-branches article),.story-archive>summary').forEach(el=>{el.dataset.storyReveal='';reveal.observe(el);});
 }else scenes.forEach(el=>{el.style.setProperty('--story-p',1);el.querySelectorAll('[data-story-reveal]').forEach(n=>n.classList.add('story-seen'));});
 return {destroy(){alive=false;io?.disconnect();reveal?.disconnect();w.cancelAnimationFrame(raf);}};
}
function swarmModule(root){
 const stage=root.querySelector('.story-swarm-stage'),grid=root.querySelector('.story-swarm-grid'),count=root.querySelector('.story-swarm-count');
 const total=Math.ceil(data.pairs.length/5);let current=0,state='idle',destroyed=false,animations=[],preloaded=[],lastWheel=0,gesture=0,touchY=null,direction=0,registered=false;
 function record(){for(const p of data.pairs.slice(current*5,current*5+5))for(const m of [p.before,p.after])visited.add(m.id);registered=true;}
 function notify(){count.textContent=`Conjunto ${current+1}/${total} · imagens ${current*10+1}–${Math.min((current+1)*10,data.pairs.length*2)} de ${data.pairs.length*2}`;root.dataset.storySet=String(current+1);root.dataset.storyState=state;}
 function hash(){const target='#portfolio/conjunto-'+(current+1);if(w.location.hash!==target)w.history.replaceState(Object.assign({},w.history.state,{storySet:current+1}),'',w.location.pathname+w.location.search+target);}
 function preload(){preloaded=[];for(const p of data.pairs.slice((current+1)*5,(current+2)*5))for(const m of [p.before,p.after]){const img=new Image();img.src=m.src;img.decoding='async';preloaded.push(img);if(img.decode)img.decode().catch(()=>{});}}
 function offset(i,exit){const preset=(current+(exit?1:0))%4,col=Math.floor(i/2),side=i%2?1:-1;
  const forms=[[[side*150,160-col*12],[side*200,-120]],[[side*230,100],[side*120,180]],[[side*80,200],[side*250,-60]],[[side*180,140],[side*140,-170]]];const xy=forms[preset][exit?1:0];return `translate3d(${xy[0]}px,${xy[1]}px,0) rotate(${degraded?0:side*(2+preset%2)}deg)`;}
 async function motion(exit){const photos=[...grid.querySelectorAll('.story-photo')];if(reduce.matches||!photos[0]?.animate)return;
  animations=photos.map((el,i)=>{const a=el.animate(exit?[{transform:'translate3d(0,0,0)',opacity:1},{transform:offset(i,true),opacity:0}]:[{transform:offset(i,false),opacity:0},{transform:'translate3d(0,0,0)',opacity:1}],{duration:exit?320:480,delay:exit?(i%3)*18:(4-Math.floor(i/2))*60,fill:'both',easing:exit?'cubic-bezier(.65,0,.85,.35)':'cubic-bezier(.16,1,.3,1)'});return a;});
  await Promise.all(animations.map(a=>a.finished.catch(()=>{})));if(!exit)animations.forEach(a=>a.cancel());
 }
 function inside(){const r=stage.getBoundingClientRect();return r.top>=55 && r.bottom<=w.innerHeight-45 && root.closest('.story-view').classList.contains('active');}
 async function go(target,writeHash=true){target=clamp(target,0,total-1);if(destroyed)return;if(state==='entering'||state==='leaving'){direction=Math.sign(target-current);return;}if(target===current && state==='parked')return;
  direction=0;registered=false;const focused=grid.contains(d.activeElement);state='leaving';notify();await motion(true);if(destroyed)return;
  animations.forEach(a=>a.cancel());current=target;grid.innerHTML=data.pairs.slice(current*5,current*5+5).map(pairMarkup).join('');state='entering';notify();if(writeHash)hash();
  await motion(false);if(destroyed)return;state='parked';notify();record();preload();if(focused)stage.focus({preventScroll:true});
  // Accumulated direction informs the next deliberate gesture, never runs an
  // inertial chain that skips unread sets.
 }
 function step(delta){if(state!=='parked'){direction=Math.sign(delta);return true;}const n=current+delta;if(n<0||n>=total){root.parentElement.querySelector(n<0?'#story-portfolio-abertura':'#story-portfolio-indice')?.scrollIntoView({behavior:reduce.matches?'auto':'smooth',block:'start'});return false;}go(n);return true;}
 function wheel(e){if(!inside()||e.ctrlKey||Math.abs(e.deltaY)<Math.abs(e.deltaX))return;
  if((current===0&&e.deltaY<0)||(current===total-1&&e.deltaY>0))return;
  e.preventDefault();const now=performance.now();if(now-lastWheel>190)gesture=0;lastWheel=now;
  if(state!=='parked'){direction=Math.sign(e.deltaY);return;}gesture+=e.deltaY*(e.deltaMode===1?16:1);if(Math.abs(gesture)>55){const sign=Math.sign(gesture);gesture=0;go(current+sign);}
 }
 function key(e){if(!stage.contains(e.target)&&e.target!==stage)return;if(e.target.matches('input,textarea,select'))return;const delta=['ArrowRight','ArrowDown','PageDown',' '].includes(e.key)?1:['ArrowLeft','ArrowUp','PageUp'].includes(e.key)?-1:0;if(!delta)return;e.preventDefault();step(delta);}
 function touchstart(e){touchY=e.touches.length===1?e.touches[0].clientY:null;}
 function touchmove(e){if(touchY===null||!inside()||e.touches.length!==1)return;const diff=touchY-e.touches[0].clientY;if(Math.abs(diff)<45)return;const delta=Math.sign(diff);if((current===0&&delta<0)||(current===total-1&&delta>0)){touchY=null;return;}e.preventDefault();touchY=null;step(delta);}
 function click(e){const btn=e.target.closest('[data-story-step]');if(btn){stage.scrollIntoView({behavior:'auto',block:'center'});step(Number(btn.dataset.storyStep));}}
 root.addEventListener('click',click);stage.addEventListener('keydown',key);root.addEventListener('wheel',wheel,{passive:false});stage.addEventListener('touchstart',touchstart,{passive:true});stage.addEventListener('touchmove',touchmove,{passive:false});
 const observer='IntersectionObserver'in w?new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)&&!registered){registered=true;state='entering';notify();motion(false).then(()=>{if(!destroyed){state='parked';notify();record();}});}},{threshold:.65}):null;
 state='parked';notify();preload();observer?.observe(stage);const match=w.location.hash.match(/^#portfolio\/conjunto-(\d+)$/);if(match){go(Number(match[1])-1,false);requestAnimationFrame(()=>root.scrollIntoView({behavior:'auto',block:'start'}));}
 return {go,step,get current(){return current;},audit:()=>({state,current:current+1,total,mounted:grid.querySelectorAll('img').length,preloaded:preloaded.length,preset:current%4,direction}),destroy(){destroyed=true;observer?.disconnect();animations.forEach(a=>a.cancel());preloaded=[];root.removeEventListener('click',click);stage.removeEventListener('keydown',key);root.removeEventListener('wheel',wheel);stage.removeEventListener('touchstart',touchstart);stage.removeEventListener('touchmove',touchmove);}};
}
function gatherLegacy(){for(const [key]of data.chapters){if(key==='orcamento')continue;const view=d.getElementById('view-'+key),archive=view.querySelector('.story-archive-body');if(!archive)continue;for(const child of [...view.children])if(!child.matches('.story-surface,script,style'))archive.appendChild(child);}}
function enter(){routeJob=0;const view=d.querySelector('.story-view.active');if(!view)return;gatherLegacy();
 for(const section of d.querySelectorAll('.story-view')){const heading=section.querySelector('.story-title,.story-budget-intro>h1,.story-budget-intro>h2'),tag=section===view?'h1':'h2';if(heading&&heading.localName!==tag){const replacement=d.createElement(tag);for(const a of heading.attributes)replacement.setAttribute(a.name,a.value);while(heading.firstChild)replacement.appendChild(heading.firstChild);heading.replaceWith(replacement);}}
if(active===view.id){configureService();return;}
 if(active)positions.set(active,lastKnownY);for(const module of modules.values())module.destroy();modules.clear();swarm=null;
 active=view.id;const chapter=data.chapters.findIndex(x=>'view-'+x[0]===active);d.querySelector('.story-progress-chapter').textContent=String(chapter+1).padStart(2,'0')+' / '+data.chapters[chapter][2];
 d.querySelectorAll('.story-header [data-fr-view]').forEach(a=>{if(a.dataset.frView===active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 modules.set('scene',sceneModule(view));if(active==='view-projetos'){swarm=swarmModule(view.querySelector('.story-swarm'));modules.set('swarm',swarm);}
 const veil=d.querySelector('.story-cut');animate(veil,[{opacity:.9},{opacity:0}],{duration:550,easing:'ease-out'});animate(veil.firstElementChild,[{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:450,easing:'ease-out'});
 configureService();const target=w.location.hash.startsWith('#story-')?d.getElementById(decodeURIComponent(w.location.hash.slice(1))):null;if(target){for(let p=target.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;target.scrollIntoView({behavior:'auto',block:'start'});}
}
function boot(){gatherLegacy();d.body.classList.add('story-running');
 // The original module uses view-level MutationObservers. Its own collection
 // root is redirected into the accessible archive by the build integration.
 on(d,'frViewChanged',()=>{w.cancelAnimationFrame(routeJob);routeJob=w.requestAnimationFrame(enter);});
 on(d,'frStage16Ready',()=>{gatherLegacy();});
 on(d,'click',e=>{const b=e.target.closest('button,a');if(!b)return;
  if(b.hasAttribute('data-story-add'))goService(b.dataset.storyAdd);
  if(b.hasAttribute('data-story-amb'))textAction(b,typeof w.openAmbDetail==='function'?()=>w.openAmbDetail(+b.dataset.storyAmb):null);
  if(b.hasAttribute('data-story-p3d'))textAction(b,()=>{const archive=d.querySelector('#story-archive-projetos3d');if(archive)archive.open=true;w.p3dSetActive?.(+b.dataset.storyP3d);const showcase=d.querySelector('#view-projetos3d .p3d-showcase');showcase?.scrollIntoView({behavior:reduce.matches?'auto':'smooth',block:'start'});});
  if(b.hasAttribute('data-story-open'))openPair(b.dataset.storyOpen,b.dataset.storySide);
  if(b.hasAttribute('data-story-jump')){const root=d.getElementById('story-enxame');root.scrollIntoView({behavior:'auto',block:'start'});swarm?.go(+b.dataset.storyJump);}
  if(b.hasAttribute('data-story-result')){const view=d.querySelector('.story-view.active'),target=view?.querySelector('.story-end,.story-budget-end');if(target){target.scrollIntoView({behavior:reduce.matches?'auto':'smooth',block:'start'});target.tabIndex=-1;target.focus({preventScroll:true});}}
  if(b.hasAttribute('data-story-search')){const search=d.getElementById('fr-global-search-nav');if(search)search.click();else w.FR_ASSISTANT?.search?.('');}
  if(b.tagName==='A' && b.getAttribute('href')?.startsWith('#story-')){e.preventDefault();const el=d.getElementById(b.hash.slice(1));if(el){el.scrollIntoView({behavior:reduce.matches?'auto':'smooth',block:'start'});w.history.replaceState(w.history.state,'',b.hash);}}
 });
 on(w,'hashchange',()=>{const m=w.location.hash.match(/^#portfolio\/conjunto-(\d+)$/);if(m&&swarm)swarm.go(+m[1]-1,false);});
 on(w,'popstate',()=>{const id=Object.keys(data.pathByView).find(id=>data.pathByView[id]===w.location.pathname);const y=positions.get(id);if(y!==undefined)w.setTimeout(()=>w.scrollTo({top:y,behavior:'instant'}),700);});
 on(d,'visibilitychange',()=>{if(!d.hidden){for(const m of modules.values())m.destroy();modules.clear();active=null;enter();}});
 on(reduce,'change',()=>{for(const m of modules.values())m.destroy();modules.clear();active=null;enter();});
 enter();
}
w.FRStory={version:data.version,audit:()=>({active,modules:modules.size,visited:[...visited],expected:data.pairs.flatMap(p=>[p.before.id,p.after.id]),swarm:swarm?.audit()||null,reducedMotion:reduce.matches,degraded,canonicalServices:Object.keys(w.__frCore?.SERVICES||{}).length}),destroy(){for(const m of modules.values())m.destroy();listeners.splice(0).forEach(off=>off());d.body.classList.remove('story-running');}};
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',()=>w.requestAnimationFrame(boot),{once:true});else w.requestAnimationFrame(boot);
})(window,document);
