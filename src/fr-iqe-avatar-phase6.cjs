'use strict';
/**
 * Phase 6: progressive avatar-only enhancement for the persistent FR/IQE assistant.
 * The original IQE wizard, persistent assistant events, financial logic, and
 * accessible buttons/dialog structure remain unchanged.
 */
module.exports=function installFRIQEAvatar(doc){
 if(!doc)throw Error('FR IQE avatar: missing canonical document');
 const source=doc.querySelector('#fr-stage5-assistant-styles');
 const engine=doc.querySelector('#fr-stage5-assistant-engine');
 if(!source||!engine)throw Error('FR IQE avatar: original persistent assistant contracts missing');
 if(doc.getElementById('fr6iqe-avatar-version'))throw Error('FR IQE avatar: duplicate install');
 const marker=doc.createElement('meta');marker.id='fr6iqe-avatar-version';
 marker.setAttribute('name','fr-iqe-avatar-phase6');marker.content='6.0';
 doc.head.append(marker);
 const css=doc.createElement('link');css.rel='stylesheet';css.href='/assets/css/fr-iqe-avatar-phase6.css';doc.head.append(css);
 const script=doc.createElement('script');script.defer=true;script.src='/assets/js/fr-iqe-avatar-phase6.js';doc.body.append(script);
 return {preservesWizard:true,preservesAssistant:true,visualOnly:true};
};