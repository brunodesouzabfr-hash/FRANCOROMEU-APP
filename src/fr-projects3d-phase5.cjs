'use strict';
/* FR Phase 5 / present the existing Stage 15 3D lab; never clone its cube, projects or inspector. */
module.exports=function installProject3DPhase5(doc) {
 if(!doc)throw Error('FR Phase 5 requires the canonical build document');
 const view=doc.getElementById('view-projetos3d');
 if(!view||!view.querySelector('.p3d-hero')||!view.querySelector('.p3d-showcase')||!view.querySelector('.p3d-process'))throw Error('FR Phase 5: missing original P3D anchors');
 if(doc.getElementById('fr5d-module-marker'))throw Error('FR Phase 5: duplicate mount');
 const marker=doc.createElement('meta');marker.id='fr5d-module-marker';marker.setAttribute('name','fr5d-presentation');marker.setAttribute('content','5.0');
 doc.head.appendChild(marker);
 const css=doc.createElement('link');css.rel='stylesheet';css.href='/assets/css/fr-projects3d-phase5.css';doc.head.appendChild(css);
 const script=doc.createElement('script');script.src='/assets/js/fr-projects3d-phase5.js';script.defer=true;doc.body.appendChild(script);
 return {originalShowcase:true,originalCube:true,originalInspector:true,originalP3dProcess:true};
};
