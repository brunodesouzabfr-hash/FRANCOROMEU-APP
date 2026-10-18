'use strict';
/**
 * FR SEO / 2026-10-18 — factual, route-specific editorial support.
 * Adds one visible, keyboard-accessible reading path to the two SPA views
 * that Google crawled but had not indexed. Leaves all original nodes in place.
 */
const blocks=Object.freeze([
 {id:'view-projetos',section:'frsi-portfolio',marker:'FR / ARQUIVO DE PROJETOS',
  title:'Portfólio: materiais, contexto e decisões de execução.',
  description:'O portfólio organiza referências de interiores, superfícies e serviços. Cada estudo deve ser lido com atenção ao ambiente, ao material e ao escopo: a documentação ajuda a comparar soluções, mas não substitui levantamento ou especificação para outro imóvel.',
  links:[
   {href:'/projetos-3d',label:'Como funciona a visualização em 3D'},
   {href:'/solucoes/',label:'Conhecer os serviços e seus critérios'},
   {href:'/orcamento',label:'Descrever meu ambiente para orçamento'}
  ]},
 {id:'view-projetos3d',section:'frsi-projetos3d',marker:'FR / PROJETO E COMPATIBILIZAÇÃO',
  title:'Projeto 3D: avaliar proporção, materiais e iluminação antes da obra.',
  description:'A visualização espacial permite estudar distribuição, volumetria, materiais e pontos de luz. O render é uma representação de projeto: medidas, instalações, estrutura, disponibilidade e custos dependem de conferência técnica antes da execução.',
  links:[
   {href:'/portfolio',label:'Examinar o portfólio e as referências'},
   {href:'/solucoes/',label:'Entender materiais e serviços'},
   {href:'/orcamento',label:'Iniciar levantamento do projeto'}
  ]}
]);
function install(doc){
 if(!doc?.createElement||doc.getElementById('frsi-css'))throw Error('FR SEO: missing document or repeated install');
 const css=doc.createElement('link');css.id='frsi-css';css.rel='stylesheet';css.href='/assets/css/fr-seo-indexing-phase910.css';doc.head.appendChild(css);
 for(const item of blocks){
  const view=doc.getElementById(item.id);
  if(!view||view.querySelector('.frsi'))throw Error('FR SEO: missing view or repeated panel '+item.id);
  const section=doc.createElement('section');section.className='frsi';section.id=item.section;
  section.setAttribute('aria-labelledby',item.section+'-title');
  const marker=doc.createElement('p');marker.className='frsi-marker';marker.textContent=item.marker;
  const heading=doc.createElement('h2');heading.id=item.section+'-title';heading.textContent=item.title;
  const paragraph=doc.createElement('p');paragraph.className='frsi-description';paragraph.textContent=item.description;
  const nav=doc.createElement('nav');nav.className='frsi-links';nav.setAttribute('aria-label','Caminhos relacionados a '+item.title);
  for(const link of item.links){const a=doc.createElement('a');a.href=link.href;a.textContent=link.label;nav.appendChild(a)}
  section.append(marker,heading,paragraph,nav);view.appendChild(section);
 }
 return {sections:blocks.length,links:blocks.flatMap(item=>item.links.map(link=>link.href))};
}
module.exports={install,blocks};
