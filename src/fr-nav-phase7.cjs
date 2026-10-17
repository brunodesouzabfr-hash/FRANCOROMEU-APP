'use strict';
/* Franco Romeu Phase 7. Additive navigation skin, no route or popup handlers replaced. */
module.exports=function installNav7(doc){
 if(!doc)throw Error('FR Nav7 requires a build document');
 const nav=doc.getElementById('smart-nav'),brand=doc.getElementById('smart-nav-brand'),menu=doc.getElementById('fr-site-menu');
 if(!nav||!brand||!menu||!doc.getElementById('fr-site-menu-open')||!doc.getElementById('fr-site-menu-close'))throw Error('FR Nav7: canonical navigation contract missing');
 if(doc.getElementById('fr-nav7-marker'))throw Error('FR Nav7: duplicate installation');
 const marker=doc.createElement('meta');marker.id='fr-nav7-marker';marker.setAttribute('name','fr-nav-phase7');marker.content='7.0';doc.head.appendChild(marker);
 const style=doc.createElement('link');style.rel='stylesheet';style.href='/assets/css/fr-nav-phase7.css';doc.head.appendChild(style);
 const script=doc.createElement('script');script.defer=true;script.src='/assets/js/fr-nav-phase7.js';doc.body.appendChild(script);
 return {originalNav:true,originalMenu:true,originalSpaRouter:true,originalIQE:true};
};