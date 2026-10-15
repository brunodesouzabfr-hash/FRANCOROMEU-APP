'use strict';
/* Phase 4: make the canonical journal look like Jornal FR without changing its route,
   navigation, 109 readings, filters or the already-animated five-entry patch. */
function replaceOnce(html,find,replacement,why) {
 const n=html.split(find).length-1;
 if(n!==1)throw Error('Jornal FR: '+why+' expected once; found '+n);
 return html.replace(find,replacement);
}
module.exports=function decorateJournal(html){
 if(typeof html!=='string'||!html.includes('class="frj-index-grid"'))throw Error('Jornal FR: archive markup missing');
 // Add only one visually hidden decorative paper-collage background, not new articles.
 const sheets='<div class="frj4-paperwall" aria-hidden="true">'+
  '<div class="frj4-paper frj4-sheet-one"><span>JORNAL FR</span><b>ARQUITETURA / MATÉRIA</b><i></i><i></i><i></i></div>'+
  '<div class="frj4-paper frj4-sheet-two"><span>FRANCO ROMEU</span><b>PROCESSO / PRECISÃO</b><i></i><i></i><i></i></div>'+
  '<div class="frj4-paper frj4-sheet-three"><span>CADERNO FR</span><b>LUZ / MATERIALIDADE</b><i></i><i></i><i></i></div>'+
  '</div>';
 html=replaceOnce(html,'<a class="frj-return" href="/"',sheets+'<a class="frj-return" href="/"','background anchor');
 html=replaceOnce(html,'ARTE + ENGENHARIA<br>JORNAL / CADERNO 01','ARTE + ENGENHARIA<br>JORNAL FR / CADERNO 01','visible masthead');
 html=replaceOnce(html,'JORNAL TÉCNICO FRANCO ROMEU · PROJETO / MATÉRIA / MÉTODO','JORNAL FR · PROJETO / MATÉRIA / MÉTODO','visible eyebrow');
 html=replaceOnce(html,'<link rel="stylesheet" href="/assets/css/fr-journal.css">','<link rel="stylesheet" href="/assets/css/fr-journal.css"><link rel="stylesheet" href="/assets/css/fr-journal-phase4.css">','stylesheet');
 html=replaceOnce(html,'<script src="/assets/js/fr-journal.js"></script>','<script src="/assets/js/fr-journal.js"></script><script defer src="/assets/js/fr-journal-phase4.js"></script>','runtime');
 return html;
};
