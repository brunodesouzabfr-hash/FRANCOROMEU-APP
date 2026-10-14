'use strict';
// Central editorial adapter. Source envelopes remain immutable PRE_IMPLEMENTATION.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const VERSION='fr-editorial-1.0.0',ORIGIN='https://www.francoromeufr.com.br';
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function csv(text){
 const rows=[];let row=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(!quoted&&c===','){row.push(cell);cell='';}else if(!quoted&&(c==='\n'||c==='\r')){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(Boolean))rows.push(row);row=[];cell='';}else cell+=c;}
 if(cell||row.length){row.push(cell);rows.push(row);}if(quoted)throw Error('Unclosed CSV quote');
 const header=rows.shift().map(x=>x.replace(/^\uFEFF/,''));return rows.map(r=>Object.fromEntries(header.map((k,i)=>[k,r[i]||''])));
}
function loadLibrary(root=process.cwd()){
 const repoRoot=fs.realpathSync(root),codexCandidate=path.join(root,'CODEX USE AQUI');
 const codexRoot=fs.existsSync(codexCandidate)?fs.realpathSync(codexCandidate):null;
 const packageCandidate=codexRoot?path.join(codexRoot,'FRANCO_ROMEU_ACERVO_EDITORIAL'):null;
 const roots={REPO_ROOT:repoRoot,CODEX_ROOT:codexRoot,PACKAGE_ROOT:packageCandidate&&fs.existsSync(packageCandidate)?fs.realpathSync(packageCandidate):null};
 const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
 const definitions=[['media/media-master','media','media_id'],['projects/projects','projects','project_id'],['environments/environments','environments','environment_id'],['materials/materials','materials','material_id'],['services/media-service-map','services','service_id'],['inspirations/inspiration-trails','trails','trail_id'],['before-after/before-after-pairs','pairs','pair_id'],['social/social-archive','socialArchive','id']];
 const arrays={},maps={};
 for(const [file,key,id] of definitions){const envelope=read('content/'+file+'.json');if(envelope.schema_version!==VERSION||envelope.canonical!==ORIGIN)throw Error('Unsupported editorial envelope: '+file);arrays[key]=envelope[key];maps[key]=new Map(arrays[key].map(x=>[x[id],x]));if(maps[key].size!==arrays[key].length)throw Error('Duplicate '+id);}
 const organization=read('content/media/organization.json'),references=read('content/media/design-references.json');
 for(const x of [organization,references])if(x.schema_version!==VERSION||x.canonical!==ORIGIN)throw Error('Unsupported supplemental envelope');
 let sourceHashes=null;const relocated=[];
 function sourceByHash(sha){if(!roots.CODEX_ROOT)return null;if(!sourceHashes){sourceHashes=new Map();function walk(dir){if(!fs.existsSync(dir))return;for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())walk(f);else if(e.isFile()){const h=hash(f);if(!sourceHashes.has(h))sourceHashes.set(h,f);}}}for(const dir of ['before_after_organized','IMAGENS-CODEX','reels_design_organized'])walk(path.join(roots.CODEX_ROOT,dir));}return sourceHashes.get(sha)||null;}
 function resolve(ref){if(!ref||!roots[ref.root]||!ref.path)return null;const file=path.resolve(roots[ref.root],ref.path);if(!file.startsWith(roots[ref.root]+path.sep))throw Error('Source path escape');if(!fs.existsSync(file)||!fs.statSync(file).isFile()){const relocatedFile=ref.root==='CODEX_ROOT'&&ref.sha256?sourceByHash(ref.sha256):null;if(relocatedFile)relocated.push({expected:ref.path,resolved:path.relative(roots.CODEX_ROOT,relocatedFile),sha256:ref.sha256});return relocatedFile;}if(ref.sha256&&hash(file)!==ref.sha256)throw Error('Source SHA mismatch: '+ref.path);return file;}
 for(const m of arrays.media){for(const [ids,lookup] of [[m.project_ids,'projects'],[m.environment_slugs,'environments'],[m.materials,'materials'],[m.services,'services']])for(const id of ids||[])if(!maps[lookup].has(id))throw Error('Broken media relation '+m.media_id+' -> '+id);}
 const renames=csv(fs.readFileSync(path.join(root,'docs/media/RENAMING_MAP.csv'),'utf8'));
 const execution=csv(fs.readFileSync(path.join(root,'docs/media/RENAMING_EXECUTION.csv'),'utf8'));
 const destinations=new Map();for(const row of renames){if(!maps.media.has(row.media_id))throw Error('Unknown rename ID');const prior=destinations.get(row.planned_public_path);if(prior&&prior!==row.media_id)throw Error('Rename collision');destinations.set(row.planned_public_path,row.media_id);}
 const prepared=new Map();for(const row of execution)if(row.new_path.startsWith('prepared-media/editorial/')){if(prepared.has(row.media_id)&&prepared.get(row.media_id).new_sha256!==row.new_sha256)throw Error('Ambiguous prepared derivative');prepared.set(row.media_id,row);}
 const selected=[],rejected=[],seen=new Map();
 for(const m of arrays.media){
  const reasons=[];
  if(!['PRIMARY','SECONDARY'].includes(m.editorial_rank))reasons.push('RANK_'+m.editorial_rank);
  if(m.media_type!=='IMAGE'||['REFERENCE','UNKNOWN'].includes(m.nature)||m.confidence==='HOLD'||m.stage==='HOLD')reasons.push('EDITORIAL_BLOCK');
  if(m.publication.status!=='READY_WITH_LABEL'||!m.required_public_label||!m.alt||!m.caption)reasons.push('NOT_READY_WITH_CONTEXT');
  if(m.hold_reasons?.length)reasons.push(...m.hold_reasons);
  const row=prepared.get(m.media_id);if(!row)reasons.push('NO_PREPARED_DERIVATIVE');
  if(reasons.length){rejected.push({media_id:m.media_id,reasons});continue;}
  const source=resolve(m.publication_source);
  const derivative=resolve({root:'REPO_ROOT',path:row.new_path,sha256:row.new_sha256});if(!derivative){rejected.push({media_id:m.media_id,reasons:['PREPARED_MISSING']});continue;}
  const duplicate=seen.get(m.identity_sha256);if(duplicate){rejected.push({media_id:m.media_id,reasons:['HASH_ALIAS_OF_'+duplicate]});continue;}seen.set(m.identity_sha256,m.media_id);
  const authored=m.authorship?.creator_verified===true&&!!m.authorship.creator;
  const canIndex=m.publication.published===true&&m.publication.auto_publish===true&&m.seo.active_indexable===true&&m.seo.indexable===true&&authored&&m.authorship.rights_verified===true;
  selected.push({raw:m,media_id:m.media_id,source:source||derivative,sourceAvailable:!!source,sourceStatus:source?'HASH_VERIFIED_SOURCE':'VERIFIED_PREPARED_DERIVATIVE_ONLY',derivative,derivativeSha256:row.new_sha256,localPreviewAllowed:true,indexable:canIndex&&!!source,publicationBlockers:canIndex&&source?[]:['PUBLICATION_NOT_RELEASED','ACTIVE_INDEXING_DISABLED',...(!source?['PUBLICATION_SOURCE_MISSING']:[]),...(!authored?['AUTHOR_AND_RIGHTS_UNCONFIRMED']:[])],title:m.title,alt:m.alt,caption:m.caption,label:m.required_public_label,project_ids:m.project_ids,environment_ids:m.environment_slugs,material_ids:m.materials,service_ids:m.services,authorship:m.authorship});
 }
 const eligible=new Map(selected.map(x=>[x.media_id,x]));
 const pairs=[];for(const p of arrays.pairs){if(!maps.projects.has(p.project_id))throw Error('Pair project missing');const before=eligible.get(p.before_media_id),after=eligible.get(p.after_media_id);if(!before||!after){rejected.push({pair_id:p.pair_id,reasons:['PAIR_ENDPOINT_BLOCKED']});continue;}if(before.raw.narrative_stage!=='RECONSTRUCTED_BEFORE'||after.raw.narrative_stage!=='ILLUSTRATIVE_AFTER'||before.raw.project_id!==p.project_id||after.raw.project_id!==p.project_id)throw Error('Pair narrative mismatch '+p.pair_id);const project=maps.projects.get(p.project_id),source=resolve(p.source_document);pairs.push({...p,project,markdown:source?fs.readFileSync(source,'utf8'):null,source,sourceStatus:source?'SOURCE_AVAILABLE':'SOURCE_UNAVAILABLE',route:'/projetos/antes-depois/'+project.legacy_slug+'/',display:'SIDE_BY_SIDE'});}
 const physicalOrder=['adega','area-gourmet','atelie','banheiro','biblioteca','cinema','closet','cozinha','escada','escritorio','fachada','hall','lavabo','pavilhao-piscina','quarto','sala-audio','sala-estar','sala-gamer','sala-jantar','suite'];
 const physicalNames={'suite':'Suíte','cinema':'Cinema residencial','atelie':'Ateliê','area-gourmet':'Área gourmet','pavilhao-piscina':'Pavilhão de piscina'};
 const groups=[];
 for(const physical of physicalOrder){const trails=arrays.trails.filter(t=>t.status==='COMPLETE_ILLUSTRATIVE'&&t.source_document?.path.startsWith('reels_design_organized/ambientes/'+physical+'/')).sort((a,b)=>a.trail_id.localeCompare(b.trail_id,'pt-BR',{numeric:true}));if(!trails.length)continue;const valid=[];for(const t of trails){const steps=t.steps.slice().sort((a,b)=>a.order-b.order);if(steps.length!==3||steps.some(s=>!eligible.has(s.media_id))){rejected.push({trail_id:t.trail_id,reasons:['TRAIL_ENDPOINT_BLOCKED']});continue;}const file=resolve(t.source_document);valid.push({...t,markdown:file?fs.readFileSync(file,'utf8'):null,sourceStatus:file?'SOURCE_AVAILABLE':'SOURCE_UNAVAILABLE'});}if(!valid.length)continue;const eid=valid[0].environment_id,env=maps.environments.get(eid);if(!env)throw Error('Trail environment missing');const cover=valid[0].steps.find(s=>s.type==='ENVIRONMENT').media_id;const sequence=[{media_id:cover,type:'COVER',project_id:null}];for(const t of valid)for(const s of t.steps.slice().sort((a,b)=>a.order-b.order).filter(s=>s.type!=='ENVIRONMENT'))sequence.push({media_id:s.media_id,type:s.type,project_id:t.project_id,trail_id:t.trail_id});groups.push({physical,environment_id:eid,name:physicalNames[physical]||env.name,cover,route:'/portfolio/ambientes/'+physical+'/',trails:valid,sequence});}
 const legacyWindow={};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/js/media-catalog.js'),'utf8'),{window:legacyWindow});
 const legacy=legacyWindow.FR_MEDIA_CATALOG;
 return {roots,organization,references,arrays,maps,resolve,renames,execution,selected,eligible,rejected,pairs,groups,legacy,hash,csv,ORIGIN,relocated};
}
module.exports={loadLibrary,csv,hash,ORIGIN,VERSION};
