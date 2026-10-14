/* Arquivo histórico. Não carregado pela aplicação. Requer os utilitários da Etapa 14. */
const THREE_CDN='https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.min.js';
let threePromise=null,threeRuntime=null;
function loadThree(){
  if(window.THREE?.WebGLRenderer)return Promise.resolve(window.THREE);
  if(threePromise)return threePromise;
  threePromise=new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error('Tempo esgotado ao carregar o núcleo 3D.')),9000);
    import(THREE_CDN).then(module=>{clearTimeout(timer);if(!module.WebGLRenderer)return reject(new Error('API Three.js indisponível.'));window.THREE=module;resolve(module)}).catch(error=>{clearTimeout(timer);reject(error)});
  }).catch(error=>{threePromise=null;throw error});
  return threePromise;
}
function projectTitles(){
  const source=Array.isArray(window.P3D_PROJECTS)?window.P3D_PROJECTS:[];
  return Array.from({length:6},(_,i)=>source[i]?.title||source[i]?.name||['Suíte Master','Living Integrado','Cozinha Autoral','Home Office','Banho Spa','Área Gourmet'][i]);
}
function selectP3D(index,source='matrix'){
  const safe=((Number(index)||0)%6+6)%6;
  window.p3dSetActive?.(safe);
  const titles=projectTitles();
  $('#fr14-matrix-index')&&( $('#fr14-matrix-index').textContent=String(safe+1).padStart(2,'0') );
  $('#fr14-matrix-title')&&( $('#fr14-matrix-title').textContent=titles[safe] );
  $$('.fr14-matrix-fallback button').forEach((button,i)=>button.setAttribute('aria-current',i===safe?'true':'false'));
  threeRuntime?.select?.(safe);
  safeEvent('fr14MatrixSelect',{index:safe,source});
}
function webGLPossible(){
  try{const test=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(test.getContext('webgl2')||test.getContext('webgl')))}catch(_){return false}
}
function useMatrixFallback(stage,reason){
  stage.classList.add('is-fallback');stage.dataset.fallbackReason=reason||'compatibility';
}
function initThreeMatrix(stage){
  if(threeRuntime)return Promise.resolve(threeRuntime);
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||innerWidth<720||!webGLPossible()){useMatrixFallback(stage,'compatibility');return Promise.resolve(null)}
  return loadThree().then(THREE=>{
    const canvas=$('#fr14-three-canvas'),host=$('.fr14-matrix-viewport',stage);if(!canvas||!host)return null;
    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(44,1,.1,80),root=new THREE.Group();camera.position.set(0,2.4,13);scene.add(root);
    const frames=[];for(let i=0;i<6;i++){const geometry=new THREE.BoxGeometry(3.1,2.05,.12),material=new THREE.MeshBasicMaterial({color:i===0?0xfc7016:0x71e5f4,wireframe:true,transparent:true,opacity:i===0?.88:.42}),mesh=new THREE.Mesh(geometry,material),angle=(i-2.5)*.48;mesh.position.set(Math.sin(angle)*7,(i%2?-.45:.35),-Math.cos(angle)*2.8+(Math.abs(i-2.5)*-.65));mesh.rotation.y=-angle*.72;mesh.userData.index=i;root.add(mesh);frames.push(mesh)}
    let active=true,raf=0,targetY=0;
    function size(){const width=Math.max(1,host.clientWidth),height=Math.max(1,host.clientHeight);renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix()}
    function render(){if(!active||document.hidden)return;root.rotation.y+=(targetY-root.rotation.y)*.055;renderer.render(scene,camera);raf=requestAnimationFrame(render)}
    function setActive(next){active=next;cancelAnimationFrame(raf);if(next&&!document.hidden)raf=requestAnimationFrame(render)}
    function select(index){frames.forEach((mesh,i)=>{mesh.material.color.setHex(i===index?0xfc7016:0x71e5f4);mesh.material.opacity=i===index?.92:.34;mesh.scale.setScalar(i===index?1.08:1)})}
    const ro=new ResizeObserver(size);ro.observe(host);size();select(0);threeRuntime={setActive,select,dispose(){setActive(false);ro.disconnect();frames.forEach(mesh=>{mesh.geometry.dispose();mesh.material.dispose()});renderer.dispose();threeRuntime=null}};setActive(true);return threeRuntime;
  }).catch(error=>{useMatrixFallback(stage,'load-failure');console.warn(error);return null});
}
function installP3D(){
  const view=$('#view-projetos3d'),showcase=$('.p3d-showcase',view);if(!view||!showcase||$('.fr14-matrix-stage',view))return;
  const titles=projectTitles(),stage=document.createElement('section');stage.className='fr14-matrix-stage';
  stage.innerHTML='<div class="fr14-matrix-viewport"><canvas id="fr14-three-canvas"></canvas><div class="fr14-matrix-fallback"><div class="fr14-matrix-fallback-grid">'+titles.map((title,i)=>'<button type="button" data-fr14-matrix="'+i+'">'+String(i+1).padStart(2,'0')+' / '+title+'</button>').join('')+'</div></div></div><aside class="fr14-matrix-ui"><div><span>Matriz arquitetônica</span><div class="fr14-matrix-index" id="fr14-matrix-index">01</div><h2 id="fr14-matrix-title">'+titles[0]+'</h2></div><div class="fr14-matrix-actions"><button type="button">Frame anterior</button><button type="button">Próximo frame</button></div></aside>';
  showcase.before(stage);
}

