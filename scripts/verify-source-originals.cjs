'use strict';
// Local source gate: masters are intentionally not committed or published.
const fs=require('node:fs'),crypto=require('node:crypto');
const manifest=JSON.parse(fs.readFileSync('docs/site-refactor/case-media-verification.json','utf8'));
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const library=require('../src/media-library.cjs').loadLibrary();
const verified=[],missing=[];
for(const original of manifest.originals){
  const file=fs.existsSync(original.file)?original.file:library.resolve({root:'CODEX_ROOT',path:original.file.replace(/^IMAGENS\//,'IMAGENS-CODEX/'),sha256:original.sha256});
  if(!file){missing.push(original);continue;}
  if(hash(file)!==original.sha256)throw new Error('Original modificado: '+original.file);
  verified.push({...original,resolved_file:file});
}
const sourceContextsMissing=[];
for(const asset of manifest.assets){
  // context/contextSha256 is the verified repository copy; sourceContext is a
  // legacy external path and may be absent from the new binary-only intake.
  if(!fs.existsSync(asset.context)||hash(asset.context)!==asset.contextSha256)throw new Error('Ficha verificada modificada: '+asset.context);
  if(!fs.existsSync(asset.sourceContext))sourceContextsMissing.push(asset.sourceContext);
  else if(hash(asset.sourceContext)!==asset.contextSha256)throw new Error('Ficha de origem divergente: '+asset.sourceContext);
}
const report={status:missing.length||sourceContextsMissing.length?'INCOMPLETE_EXTERNAL_SOURCES':'PASS',expected:manifest.originals.length,verified:verified.length,missing,contexts_verified:manifest.assets.length,source_contexts_missing:sourceContextsMissing,publication_enabled:false,relocated:library.relocated};
fs.writeFileSync('docs/media/IMAGE_SOURCE_GATE.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,missing:missing.map(x=>x.file)},null,2));
if(missing.length||sourceContextsMissing.length)process.exitCode=1;
