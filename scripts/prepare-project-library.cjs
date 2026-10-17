'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const {loadLibrary,hash,ORIGIN}=require('../src/media-library.cjs');
function publicLabel(raw){
 if(/(?:01-capa\/|_CAPAS_AUTORAIS_POR_AMBIENTE\/)/.test(raw.source_path||''))return 'Capa editorial';
 if(raw.narrative_stage==='RECONSTRUCTED_BEFORE')return 'Antes — reconstituição técnica';
 if(raw.narrative_stage==='ILLUSTRATIVE_AFTER')return 'Depois — realização Franco Romeu';
 if(raw.represented_stage==='projeto_3d'||/3D/.test(raw.required_public_label||''))return 'Estudo 3D';
 if(raw.narrative_stage==='MATERIAL_PANEL')return 'Materialidade';
 return 'Projeto realizado · Franco Romeu';
}
function publicCaption(text){
 return String(text||'').replace(/\s*(?:Visualização ilustrativa; não comprova execução real\.|Estudo ilustrativo; não comprova execução física\.|Estudo ilustrativo de textura e combinação\.|Composição física e fornecedor dependem de confirmação\.|A aparência da imagem não comprova especificação ou execução da obra\.|Nomes comerciais seguem o painel; produto e fornecedor não comprovados\.|Comparativo ilustrativo; não comprova obra executada\.)/gi,'').replace(/\bestudo ilustrativo\b/gi,'projeto Franco Romeu')
  .replace(/\bimagem ilustrativa\b/gi,'registro visual')
  .replace(/\breconstituição ilustrativa\b/gi,'reconstituição técnica')
  .replace(/\bcomparativo ilustrativo\b/gi,'comparativo do projeto')
  .trim();
}
function displayTitle(title){return String(title||'').replace(/^Estudo ilustrativo\s*[—:-]\s*/i,'').trim();}
function displayMediaText(text){
 return String(text||'').replace(/^Imagem ilustrativa\s*[—:,]\s*/i,'')
  .replace(/^Estudo 3d ilustrativo\s*[—:,]\s*/i,'Estudo 3D: ')
  .replace(/^Depois ilustrativo\s*[—:,]\s*/i,'Depois em estudo: ')
  .replace(/^Antes reconstituído,?\s*imagem ilustrativa\s*[—:,]\s*/i,'Antes reconstituído: ')
  .replace(/^Capa editorial ilustrativa Franco Romeu para\s*/i,'Capa editorial de ')
  .replace(/\bestudo ilustrativo\b/gi,'projeto Franco Romeu')
  .replace(/\bimagem ilustrativa\b/gi,'registro visual')
  .replace(/\breconstituição ilustrativa\b/gi,'reconstituição técnica')
  .replace(/\bcomparativo ilustrativo\b/gi,'comparativo do projeto')
  .trim();
}
function prepare(output){
 const l=loadLibrary(),artifactDir=path.resolve(process.env.FR_ARTIFACT_DIR||'.artifacts/build'),used=new Set([...l.pairs.flatMap(p=>[p.before_media_id,p.after_media_id]),...l.groups.flatMap(g=>g.sequence.map(s=>s.media_id)),...l.selected.filter(m=>m.raw.project_id==='FR-C001').map(m=>m.media_id)]);
 const files=new Map();for(const m of l.selected.filter(m=>used.has(m.media_id))){files.set(m.derivative,{file:m.derivative,media_id:m.media_id,kind:'PREPARED'});for(const v of m.raw.variants){const file=l.resolve(v);if(!file)throw Error('Variant missing '+v.path);files.set(file,{file,media_id:m.media_id,kind:'VARIANT'});}files.set(m.source,{file:m.source,media_id:m.media_id,kind:'PUBLICATION_SOURCE'});}
 const decoderHash=hash('scripts/verify-image-files.py'),cacheFile=path.join(artifactDir,'IMAGE_DECODE_CACHE.json'),seedCache='docs/media/IMAGE_DECODE_CACHE.json';
 const oldCache=fs.existsSync(cacheFile)?JSON.parse(fs.readFileSync(cacheFile,'utf8')):fs.existsSync(seedCache)?JSON.parse(fs.readFileSync(seedCache,'utf8')):{decoderHash,files:[]};
 const cache=oldCache.decoderHash===decoderHash?new Map(oldCache.files.map(x=>[x.sha256,x])):new Map();
 const pending=[],cached=[];
 for(const row of files.values()){row.sha256=hash(row.file);const hit=cache.get(row.sha256);if(hit&&hit.decode_ok)cached.push({...hit,...row});else pending.push(row);}
 const fresh=pending.length?JSON.parse(execFileSync('python3',['scripts/verify-image-files.py'],{input:JSON.stringify(pending),encoding:'utf8',maxBuffer:20e6})):[];
 const decoded=[...cached,...fresh];
 fs.mkdirSync(artifactDir,{recursive:true});fs.writeFileSync(cacheFile,JSON.stringify({decoderHash,files:decoded},null,2)+'\n');
 const sizes=new Map(decoded.map(x=>[x.file,x]));
 for(const d of decoded)if(!d.decode_ok)throw Error('Full decode failed: '+d.file+' '+d.error);
 const byId={},inventory=[],publicMap=[],destinations=new Map(),executionRows=[];
 for(const m of l.selected){
  const r=m.raw,size=sizes.get(m.derivative);
  if(size&&(size.width>r.dimensions.width||size.height>r.dimensions.height||size.format!=='WEBP'))throw Error('Invalid WebP or native resolution exceeded: '+m.media_id);
  inventory.push({media_id:m.media_id,project_ids:m.project_ids,environment_ids:m.environment_ids,original_root:r.source_root,original_path:r.source_path,original_sha256:r.source_sha256,publication_source:r.publication_source,dimensions:r.dimensions,source_decode_ok:r.source_decode_ok,represented_stage:r.represented_stage,narrative_stage:r.narrative_stage,nature:r.nature,description_sources:r.evidence_refs,authorship:r.authorship,required_public_label:m.label,local_preview_allowed:m.localPreviewAllowed,indexable:m.indexable,publication_blockers:m.publicationBlockers,used:used.has(m.media_id)});
  if(!used.has(m.media_id))continue;
  const original=r.source_path,group=original.startsWith('before_after_organized/')?'projects/before-after/'+l.maps.projects.get(r.project_id).legacy_slug: r.project_id==='FR-C001'?'projects/cozinha-lavanderia':'environments/'+(r.environment||'contexto');
  const canonicalFile='assets/media/'+group+'/'+r.public_filename;
  const candidates=[{file:m.derivative,sha256:m.derivativeSha256,width:size.width,height:size.height,canonical:true}];
  for(const v of r.variants){const file=l.resolve(v),s=sizes.get(file);if(s.width!==v.width||s.height!==v.height||s.width>size.width||s.height>size.height)throw Error('Variant dimensions/upscale '+m.media_id);if(v.sha256!==m.derivativeSha256&&!candidates.some(x=>x.width===s.width))candidates.push({file,sha256:v.sha256,width:s.width,height:s.height,canonical:false});}
  const variants=[];
  for(const v of candidates.sort((a,b)=>a.width-b.width)){
   const target=v.canonical?canonicalFile:canonicalFile.replace(/\.webp$/,'-'+v.width+'w.webp');
   if(destinations.has(target)&&destinations.get(target)!==v.sha256)throw Error('Public filename collision');destinations.set(target,v.sha256);
   const destination=path.join(output,target);fs.mkdirSync(path.dirname(destination),{recursive:true});if(fs.existsSync(destination)&&hash(destination)!==v.sha256)throw Error('Candidate collision with preexisting asset '+target);if(!fs.existsSync(destination))fs.copyFileSync(v.file,destination);
   if(hash(destination)!==v.sha256)throw Error('Copy SHA mismatch');
   variants.push({file:target,width:v.width,height:v.height,sha256:v.sha256,canonical:v.canonical});
   executionRows.push({media_id:m.media_id,original_path:r.original_path,original_filename:r.original_filename,source_sha256:r.original_sha256,new_path:path.relative(process.cwd(),destination),new_filename:path.basename(target),new_sha256:v.sha256,status:'LOCAL_CANDIDATE_REUSED',motivo:'Derivado WebP íntegro reutilizado; original preservado; publicação e direitos pendentes'});
  }
  const normalized={media_id:m.media_id,title:displayMediaText(m.title),alt:displayMediaText(m.alt),caption:publicCaption(m.caption)||displayMediaText(m.title),label:publicLabel(r),nature:r.nature,stage:r.stage,variants,canonicalFile,indexable:m.indexable,creditText:r.authorship.creditText||null,project_ids:m.project_ids,environment_ids:m.environment_ids,material_ids:m.material_ids,service_ids:m.service_ids};byId[m.media_id]=normalized;
  publicMap.push({...normalized,required_public_label:r.required_public_label,source_sha256:r.original_sha256,publication_source_sha256:r.publication_source.sha256,prepared_sha256:m.derivativeSha256,public_url:ORIGIN+'/'+canonicalFile,local_preview_only:!m.indexable,pages:[],authorship:r.authorship,publication:r.publication,seo:r.seo});
 }
 const selectedInventory=new Map(inventory.map(x=>[x.media_id,x]));
 for(const raw of l.arrays.media){const original=l.resolve({root:raw.source_root,path:raw.source_path,sha256:raw.source_sha256}),sourceRoot=l.roots[raw.source_root];const originalRecord={original_available:!!original&&raw.original_source_available!==false,source_file_available:!!original,original_source_available:raw.original_source_available??null,source_resolved_path:original&&sourceRoot?path.relative(sourceRoot,original):null,source_status:l.eligible.get(raw.media_id)?.sourceStatus||(!sourceRoot?'SOURCE_UNAVAILABLE':null)};if(selectedInventory.has(raw.media_id))Object.assign(selectedInventory.get(raw.media_id),originalRecord);else inventory.push({media_id:raw.media_id,project_ids:raw.project_ids,environment_ids:raw.environment_slugs,original_root:raw.source_root,original_path:raw.source_path,original_sha256:raw.source_sha256,dimensions:raw.dimensions,source_format:raw.source_format,source_decode_ok:raw.source_decode_ok,narrative_stage:raw.narrative_stage,nature:raw.nature,authorship:raw.authorship,description_sources:raw.evidence_refs,required_public_label:raw.required_public_label,used:false,local_preview_allowed:false,indexable:false,publication_blockers:l.rejected.find(x=>x.media_id===raw.media_id)?.reasons,...originalRecord});}
 const names=(ids,map)=>ids.map(id=>l.maps[map].get(id)?.name).filter(Boolean);
 const pairs=l.pairs.map(p=>({pair_id:p.pair_id,project_id:p.project_id,title:displayTitle(p.project.title),environment_ids:p.project.environment_ids,environment:names(p.project.environment_ids,'environments').join(' / '),route:p.route,label:p.required_public_label,before_media_id:p.before_media_id,after_media_id:p.after_media_id,initial_condition:p.initial_condition,interventions:p.interventions,result:p.project.narrative.result_description,materials:names(p.material_ids,'materials'),services:names(p.service_ids,'services'),display:p.display,indexable:[p.before_media_id,p.after_media_id].every(id=>byId[id].indexable),source_status:p.sourceStatus,source_markdown_sha256:p.source?hash(p.source):null}));
 const groups=l.groups.map(g=>({physical:g.physical,environment_id:g.environment_id,name:g.name,cover:g.cover,route:g.route,sequence:g.sequence,trails:g.trails.map(t=>({trail_id:t.trail_id,project_id:t.project_id,title:t.title,label:t.required_public_label,materials:names(t.material_ids,'materials'),services:names(t.service_ids,'services'),description:l.maps.projects.get(t.project_id)?.narrative?.result_description||null})),indexable:g.sequence.every(s=>byId[s.media_id].indexable)}));
  const caseAssets=l.legacy.assets.flatMap(a=>{const m=l.selected.find(m=>m.raw.legacy_media_ids?.includes(a.media_id));if(!m||!byId[m.media_id])return[];const n=byId[m.media_id];return[{...a,media_id:m.media_id,legacy_media_id:a.media_id,front_view:/frontal/i.test(m.raw.source_path+' '+m.raw.object),title:n.title,alt:n.alt,description:n.caption,publication_label:n.label,variants:n.variants.map(v=>({...v,status:'READY_WITH_LABEL',publication_label:n.label})),ficha:undefined}];});
 const dossierMedia=Object.values(byId).filter(m=>m.project_ids.includes('FR-C001')).sort((a,b)=>a.canonicalFile.localeCompare(b.canonicalFile,'pt-BR',{numeric:true}));
 const dossierCategory=m=>m.label==='Antes reconstituído'?'before':m.label==='Estudo 3D'?'project-3d':m.label==='Materialidade'||m.canonicalFile.includes('cozinha-bancada-l-imagem-ilustrativa-b239e59121')?'materiality':/(bancada|cuba|torre|ripado|marcenaria|ilha|cooktop|detalhe)/i.test(m.canonicalFile)?'details':'overview';
 const dossierMaterials=[...new Set(dossierMedia.flatMap(m=>names(m.material_ids,'materials')))];
 const dossierServices=[...new Set(dossierMedia.flatMap(m=>names(m.service_ids,'services')))];
 const dossiers=[{id:'cozinha-lavanderia',title:'Cozinha + Lavanderia',description:'Dossier visual do estudo integrado: vistas gerais, estado anterior reconstituído, estudos 3D, materialidade e detalhes da proposta.',cover:'FR-M-986CF342224E81F1',type:'Estudo integrado de interiores',order:1,journalRoute:'/projetos/cozinha-lavanderia/',executionDocumented:true,classifications:['Projeto executado pela Franco Romeu','Reconstituição técnica identificada quando aplicável'],materials:dossierMaterials,services:dossierServices,media:dossierMedia.map(m=>({media_id:m.media_id,category:dossierCategory(m)}))}];
 const data={version:'fr-site-media-1.0.0',origin:ORIGIN,localPreviewOnly:true,media:byId,pairs,groups,dossiers,caseCatalog:{...l.legacy,assets:caseAssets}};
 fs.mkdirSync(path.join(output,'assets/js'),{recursive:true});fs.writeFileSync(path.join(output,'assets/js/fr-project-library.js'),'window.FR_MEDIA_LIBRARY='+JSON.stringify(data).replaceAll('<','\\u003c')+';');
 const sources=[];function readSources(dir){if(!fs.existsSync(dir))return;for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(e.isSymbolicLink())continue;const f=path.join(dir,e.name);if(e.isDirectory())readSources(f);else if(e.isFile()&&/\.(md|txt|csv|json|sha256)$/i.test(e.name)){const body=fs.readFileSync(f,'utf8');if(e.name.endsWith('.json'))JSON.parse(body);if(e.name.endsWith('.csv'))l.csv(body);sources.push({path:path.relative(l.roots.CODEX_ROOT,f),sha256:hash(f),bytes:Buffer.byteLength(body)});}}}
 if(l.roots.CODEX_ROOT)for(const dir of ['before_after_organized','IMAGENS-CODEX','reels_design_organized'])readSources(path.join(l.roots.CODEX_ROOT,dir));
 for(const name of ['HUMAN_DECISIONS.json','SOURCE_CORRECTIONS.json','SOURCE_REFERENCE_GAPS.json'])JSON.parse(fs.readFileSync('docs/media/'+name,'utf8'));
 for(const name of ['DUPLICATES.csv','HOLD.csv'])l.csv(fs.readFileSync('docs/media/'+name,'utf8'));
 return {l,data,publicMap,inventory,sources,executionRows,decoded,output,artifactDir};
}
module.exports=prepare;
