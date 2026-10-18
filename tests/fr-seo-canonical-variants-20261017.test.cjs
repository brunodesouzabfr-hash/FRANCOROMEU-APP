'use strict';
const { test }=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ORIGIN='https://www.francoromeufr.com.br';
const SPA=['sobre','ambientes','projetos-3d','portfolio','orcamento'];
const SOLUTIONS=['solucoes','solucoes/marcenaria-sob-medida','solucoes/drywall','solucoes/pisos','solucoes/revestimentos-e-acabamentos'];
const vercel=JSON.parse(fs.readFileSync('vercel.json','utf8'));
const redirects=vercel.redirects;
const count=source=>redirects.filter(r=>r.source===source);
test('2026-10-17 canonical variants redirect instead of returning SPA home with HTTP 200',()=>{
 assert.equal(vercel.cleanUrls,true);
 for(const name of SPA){
  const source='/'+name+'/';
  const rows=count(source);
  assert.equal(rows.length,1,source);
  assert.equal(rows[0].destination,'/'+name,source);
  assert.equal(rows[0].permanent,true,source);
 }
 for(const name of SOLUTIONS){
  const source='/'+name;
  const rows=count(source);
  assert.equal(rows.length,1,source);
  assert.equal(rows[0].destination,source+'/',source);
  assert.equal(rows[0].permanent,true,source);
 }
 for(const name of SPA){
  assert.equal(count('/'+name).length,0,'SPA canonical must not redirect');
 }
 for(const name of SOLUTIONS){
  assert.equal(count('/'+name+'/').length,0,'solution canonical must not redirect');
 }
 assert.equal(new Set(redirects.map(r=>r.source+JSON.stringify(r.has||[]))).size,redirects.length,'duplicate redirect matchers');
});
test('canonical host migration and other legacy redirects stay intact',()=>{
 const hosts=['francoromeu-app.vercel.app','francoromeufr.com.br'];
 for(const host of hosts){
  const redirect=redirects.find(r=>r.source==='/:path*'&&r.has?.some(h=>h.type==='host'&&h.value===host));
  assert.ok(redirect,host);
  assert.equal(redirect.destination,ORIGIN+'/:path*');
  assert.equal(redirect.permanent,true);
 }
 assert.ok(redirects.some(r=>r.source==='/jornal'&&r.destination==='/projetos/'));
 assert.ok(redirects.some(r=>r.source==='/projetos.html'&&r.destination==='/projetos/'));
});
test('sitemap contains only canonical URL versions and no redirect sources',()=>{
 const target=fs.existsSync('dist/sitemap.xml')?'dist/sitemap.xml':'sitemap.xml';
 const xml=fs.readFileSync(target,'utf8');
 const loc=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 const paths=['/',...SPA.map(x=>'/'+x),...SOLUTIONS.map(x=>'/'+x+'/')];
 if(target==='dist/sitemap.xml'){
  assert.deepEqual(loc.sort(),paths.map(p=>ORIGIN+p).sort());
 }else{
  for(const p of ['/',...SPA.map(x=>'/'+x)])assert.ok(loc.includes(ORIGIN+p));
 }
 for(const name of SPA)assert.ok(!loc.includes(ORIGIN+'/'+name+'/'));
 for(const name of SOLUTIONS)assert.ok(!loc.includes(ORIGIN+'/'+name));
});
test('generated pages expose self canonicals and remain indexable',()=>{
 if(!fs.existsSync('dist/index.html'))return;
 const cases=[
  ...SPA.map(name=>({file:name+'.html',canonical:ORIGIN+'/'+name})),
  ...SOLUTIONS.map(name=>({file:path.join(name,'index.html'),canonical:ORIGIN+'/'+name+'/'}))
 ];
 for(const item of cases){
  const html=fs.readFileSync(path.join('dist',item.file),'utf8');
  const head=html.slice(0,80000);
  const tag=head.match(/<link\b[^>]*rel="canonical"[^>]*>/i)?.[0];
  assert.ok(tag,item.file+' has canonical');
  assert.ok(tag.includes('href="'+item.canonical+'"'),item.file+' self canonical');
  assert.match(head,/<meta name="robots" content="index[, ]/i,item.file+' indexable');
 }
});
