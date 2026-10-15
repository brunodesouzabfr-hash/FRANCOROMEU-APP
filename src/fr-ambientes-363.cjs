'use strict';
/* FR Ambientes 3+6+3: only add a reversible shell; preserve original DOM and IDs. */
module.exports=function install(doc){
 const view=doc.getElementById('view-ambientes');
 const museum=view&&view.querySelector('.amb-museum');
 const grid=view&&view.querySelector('#amb-grid-container');
 if(!view||!museum||!grid)throw Error('FR Ambientes 3+6+3: canonical anchors not found');
 if(doc.getElementById('framb363-atlas'))throw Error('FR Ambientes 3+6+3: duplicate shell');
 const shell=doc.createElement('section');shell.id='framb363-atlas';
 shell.className='framb363-shell';shell.dataset.framb363Status='pending';
 shell.setAttribute('aria-label','Doze ambientes Franco Romeu');
 museum.before(shell);
 const css=doc.createElement('link');css.rel='stylesheet';css.href='/assets/css/fr-ambientes-363.css';doc.head.append(css);
 const js=doc.createElement('script');js.defer=true;js.src='/assets/js/fr-ambientes-363.js';doc.body.append(js);
 return {originalAtlasPreserved:true,placeholder:true};
};
