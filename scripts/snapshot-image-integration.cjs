'use strict';
// Local safety copy; never imported by the public build.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os');
const crypto = require('node:crypto'), {execFileSync} = require('node:child_process');
const {JSDOM} = require('jsdom');
const root = fs.realpathSync('.');
const backup = fs.mkdtempSync(path.join(os.tmpdir(), 'fr-image-integration-backup-'));
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const files = {};
function walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const file = path.join(dir, entry.name), relative = path.relative(root,file);
    if (entry.isSymbolicLink()) files[relative] = {symlink:fs.readlinkSync(file)};
    else if (entry.isDirectory()) walk(file);
    else if (entry.isFile()) files[relative] = {sha256:hash(fs.readFileSync(file)),bytes:fs.statSync(file).size};
  }
}
for (const dir of ['CODEX USE AQUI','prepared-media','assets','content','docs/media','src']) if(fs.existsSync(dir))walk(path.resolve(dir));
for (const file of ['index.html','package.json','package-lock.json','README.md','robots.txt','sitemap.xml','site.webmanifest','vercel.json','scripts/build-site.cjs','scripts/preview-site.cjs','scripts/build-media-case.cjs','tests/public-build.test.cjs','tests/seo-brand-godmode.test.cjs']) {
  if(fs.existsSync(file)){files[file]={sha256:hash(fs.readFileSync(file))};fs.mkdirSync(path.dirname(path.join(backup,file)),{recursive:true});fs.copyFileSync(file,path.join(backup,file));}
}
for(const dir of ['dist','content','docs/media','prepared-media','assets/js','assets/css'])if(fs.existsSync(dir))fs.cpSync(dir,path.join(backup,dir),{recursive:true,dereference:false,errorOnExist:true,force:false});
const html=fs.readFileSync('index.html','utf8'),doc=new JSDOM(html).window.document;
const embeddedCore=doc.getElementById('fr-budget-core').textContent;
const dataStart=html.indexOf('const DEFAULT_DATA'),dataEnd=html.indexOf('function loadSystemData',dataStart);
const report={root,backup,branch:execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim(),head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),status:execFileSync('git',['status','--short','--branch'],{encoding:'utf8'}),diff:execFileSync('git',['diff'],{encoding:'utf8'}),staged:execFileSync('git',['diff','--cached'],{encoding:'utf8'}),untracked:execFileSync('git',['ls-files','--others','--exclude-standard','-z'],{encoding:'utf8'}).split('\0').filter(Boolean),protected:{embeddedCore:hash(embeddedCore),defaultData:hash(html.slice(dataStart,dataEnd)),budgetCore:files['src/budget-core.js']},files};
fs.writeFileSync(path.join(backup,'snapshot.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({backup,branch:report.branch,head:report.head,files:Object.keys(files).length,protected:report.protected},null,2));
