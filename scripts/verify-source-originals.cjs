'use strict';
// Local source gate: masters are intentionally not committed or published.
const fs=require('node:fs'),crypto=require('node:crypto');
const manifest=JSON.parse(fs.readFileSync('docs/site-refactor/case-media-verification.json','utf8'));
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
for(const original of manifest.originals){if(!fs.existsSync(original.file)||hash(original.file)!==original.sha256)throw new Error('Original ausente ou modificado: '+original.file);}
for(const asset of manifest.assets){if(hash(asset.sourceContext)!==asset.contextSha256)throw new Error('Ficha de origem modificada: '+asset.sourceContext);}
console.log('PASS: '+manifest.originals.length+' originais e '+manifest.assets.length+' fichas de origem preservados byte a byte. Não publicados.');
