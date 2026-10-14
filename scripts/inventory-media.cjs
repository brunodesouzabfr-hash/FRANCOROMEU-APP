'use strict';
const fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');
const source=fs.readFileSync('index.html','utf8');
const records=[];
function dimensions(bytes){
  let offset=2;
  if(bytes.readUInt16BE(0)!==0xffd8)return null;
  while(offset+8<bytes.length){if(bytes[offset]!==0xff){offset++;continue}const marker=bytes[offset+1];if(marker>=0xc0&&marker<=0xc3)return{width:bytes.readUInt16BE(offset+7),height:bytes.readUInt16BE(offset+5)};offset+=2+bytes.readUInt16BE(offset+2)}
  return null;
}
for(const name of fs.readdirSync('assets/media').sort()){
  const file=path.posix.join('assets/media',name),bytes=fs.readFileSync(file),sha256=crypto.createHash('sha256').update(bytes).digest('hex');
  records.push({file,sha256,bytes:bytes.length,mime:/\.jpe?g$/i.test(name)?'image/jpeg':'unverified',...dimensions(bytes),origin:'existing-canonical-repository',nature:'requires-editorial-origin-review',publication:'already-present; no new approval inferred',literalReferenceInSource:source.includes(file),originalPreserved:true});
}
const hashes=new Map();for(const record of records){const group=hashes.get(record.sha256)||[];group.push(record.file);hashes.set(record.sha256,group)}
const result={generatedAt:new Date().toISOString(),scope:'existing assets/media; neither all ZIP media nor visual approval',records,exactDuplicates:[...hashes.values()].filter(group=>group.length>1)};
fs.mkdirSync('docs/site-refactor',{recursive:true});fs.writeFileSync('docs/site-refactor/media-inventory.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({files:records.length,exactDuplicateGroups:result.exactDuplicates.length}));
