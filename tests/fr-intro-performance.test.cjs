'use strict';
const fs=require('node:fs');
const test=require('node:test');
const assert=require('node:assert/strict');
const js=fs.readFileSync('assets/intro/fr-intro-cinematic.js','utf8');
const html=fs.readFileSync('index.html','utf8');
test('Intro finaliza por quadro visual e nao por timeout',()=>{
 assert.match(js,/if\(position>=1\)/);
 assert.match(js,/finish\('visual-complete'\)/);
 assert.doesNotMatch(js,/deadline\s*=\s*setTimeout/);
 assert.doesNotMatch(js,/skip-site|PULAR INTRODUÇÃO|function skip\(/);
});
test('Modo adaptativo e acessibilidade',()=>{
 assert.match(js,/navigator\.deviceMemory/);
 assert.match(js,/navigator\.hardwareConcurrency/);
 assert.match(js,/switchToLite\(\)/);
 assert.match(js,/DPR=Math\.min\(devicePixelRatio\|\|1,lite\?1:1\.5\)/);
 assert.match(js,/prefers-reduced-motion: reduce/);
});
test('Preserva configuracao, SPA e bloqueio de pintura de fundo',()=>{
 for(const field of ["entry:'cascade'","exit:'fracture'","background:'fault'","color:'#E6D6B5'","duration:17","speed:1.8","motion:2.5","fog:100"])assert.ok(js.includes(field),field);
 assert.match(html,/html\.fr-intro-active body > :not\(#fr-cinema-overlay\)\{visibility:hidden!important\}/);
 assert.match(html,/src="\/assets\/intro\/fr-intro-cinematic\.js"/);
 assert.ok(html.includes('id="fr-budget-core"'));
});
