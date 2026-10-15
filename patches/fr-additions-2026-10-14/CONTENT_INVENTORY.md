# Inventário de conteúdo do patch aditivo

Base examinada: `origin/main@ee983ed9eb1d600aa42dd57ae6e61c84431e528b`.

Este documento responde onde cada caixa entra, qual código a monta e qual mídia aparece. Há 16 utilizações de imagem em páginas, correspondentes a 15 arquivos únicos porque a primeira imagem da Home também abre o percurso do Jornal. Nenhuma dessas mídias é copiada para a pasta do patch: os componentes apontam para derivados já existentes e preservam seus rótulos factuais.

## Caixas e pontos de montagem

| ID | Rota | Nó criado | Ponto canônico preservado | Código de montagem | Conteúdo adicional |
|---|---|---|---|---|---|
| `HOME-01` | `/` | `#frap-home-structure` | inserido depois de `#fr6-manifesto` | `fr-additions.js` → `mountHome()` | `FORJA / O INVISÍVEL`; título “O que sustenta o resultado também merece ser visto.”; dois CTAs |
| `HOME-02` | `/` | `#frap-home-surface` | inserido depois de `#fr6-expertise` | `fr-additions.js` → `mountHome()` | `MATÉRIA / APLICAÇÃO`; título “Observe a superfície. Entenda a aplicação.”; dois CTAs |
| `ABOUT-01` | `/sobre` | `#frap-about-palimpsest` | inserido depois de `#sobre-hero-section` | `fr-additions.js` → `mountAbout()` | três caixas: “O que se observa”, “O que se decide” e “O que se verifica” |
| `ENV-01` | `/ambientes` | `#frap-environments` | inserido antes de `.amb-museum` | `fr-additions.js` → `mountEnvironments()` | cabeçalho “Matéria, luz e proporção.” e três cards de linguagem |
| `P3D-01` | `/projetos-3d` | `#frap-3d-wireframe` | inserido depois de `.p3d-hero` | `fr-additions.js` → `mountProject3d()` | “O espaço ensaia antes de existir.” e três etapas conceituais |
| `PORT-01` | `/portfolio` | `#frap-portfolio` | inserido antes de `.fr10-portfolio-stage` | `fr-additions.js` → `mountPortfolio()` | “Cada imagem pede contexto.” e cinco cards; grid/filtros originais continuam abaixo |
| `BUDGET-01` | `/orcamento` | `#frap-service-preview` e botões `[data-frap-service-preview]` | cada botão é irmão posterior do seletor existente | `fr-service-preview.js` → `enhance()`/`open()` | janela “Exemplo visual do acervo”; foco/hover no desktop e drawer por clique/toque |
| `JOURNAL-01` | `/projetos/` | `#frap-journal` | inserido antes de `#arquivo` | `journal-additions.cjs` → `injectJournalAdditions()` | “A imagem encontra contexto.” e cinco cards; o índice de 109 leituras permanece abaixo |

## Imagens exatas por página

### Home

1. `HOME-01` — `/assets/media/projects/cozinha-lavanderia/cozinha-env-lavanderia-imagem-ilustrativa-986cf34222.webp`
   Rótulo: `IMAGEM ILUSTRATIVA · NÃO COMPROVA EXECUÇÃO`.
2. `HOME-02` — `/assets/media/projects/cozinha-lavanderia/cozinha-bancada-l-imagem-ilustrativa-b239e59121.webp`
   Rótulo: `IMAGEM ILUSTRATIVA · MATERIAL A CONFIRMAR`.

### Sobre

`ABOUT-01` não adiciona fotografia. As três caixas são texto autoral em DOM.

### Ambientes

1. Mansory — `/assets/media/ambiente-mansory-01.jpg`.
2. Industrial — `/assets/media/ambiente-industrial-01.jpg`.
3. Contemporâneo — `/assets/media/ambiente-contemporaneo-01.jpg`.

Rótulo comum: `REFERÊNCIA VISUAL · LINGUAGEM DE AMBIENTE`. Os registros vêm dos três primeiros itens vigentes de `window.AMB_STYLES`; o código não duplica essa fonte.

### Projetos 3D

1. Suíte Master Premium — `/assets/media/p3d-suite-luxo-01.jpg`.

Rótulo: `ESTUDO 3D · VISUALIZAÇÃO CONCEITUAL`. É o primeiro registro vigente de `window.P3D_PROJECTS`, não um levantamento ou modelo fiel.

### Portfólio

1. Porcelanato Líquido Sala — `/assets/media/portfolio-porcelanato.jpg`.
2. Efeito Mármore Premium — `/assets/media/portfolio-marmore.jpg`.
3. Automação Residencial Smart — `/assets/media/portfolio-automacao.jpg`.
4. Iluminação Arquitetural — `/assets/media/portfolio-iluminacao.jpg`.
5. Produção de Eventos Corporativos — `/assets/media/portfolio-eventos.jpg`.

Rótulo comum: `CONCEITO VISUAL · NÃO COMPROVA EXECUÇÃO`. A escolha é calculada por `distinctProjects()`: os cinco primeiros registros com categorias distintas de `window.GM_PROJECTS`.

### Jornal Técnico / Jornal Institucional

1. Cozinha e lavanderia — estudo de projeto e materialidade — `/assets/media/projects/cozinha-lavanderia/cozinha-env-lavanderia-imagem-ilustrativa-986cf34222.webp` — `IMAGEM ILUSTRATIVA`.
2. Área gourmet — Cozinha planejada — 010 — `/assets/media/projects/before-after/area-gourmet-cozinha-planejada-madeira-casa-010/area-gourmet-cozinha-planejada-madeira-depois-ilustrativo-010.webp` — `DEPOIS ILUSTRATIVO`.
3. Banheiro — Bancada — 037 — `/assets/media/projects/before-after/banheiro-bancada-pedra-natural-apto-037/lavabo-bancada-pedra-clara-depois-ilustrativo-037.webp` — `DEPOIS ILUSTRATIVO`.
4. Banheiro — Bancada — 007 — `/assets/media/projects/before-after/banheiro-bancada-pedra-natural-casa-007/banheiro-bancada-pedra-clara-depois-ilustrativo-007.webp` — `DEPOIS ILUSTRATIVO`.
5. Closet — Closet planejado — 030 — `/assets/media/projects/before-after/closet-closet-planejado-madeira-apto-030/closet-closet-planejado-madeira-depois-ilustrativo-030.webp` — `DEPOIS ILUSTRATIVO`.

Os cinco registros são derivados no build a partir do catálogo editorial elegível. A injeção ocorre antes de `#arquivo`; o hero, a busca, os filtros e as 109 leituras continuam intactos.

### Orçamento

O inventário completo está em `assets/patches/fr-additions-2026-10-14/service-media-map.json`:

- `serviceCount`: 115;
- `mappedCount`: 31 vínculos visuais exatos por `serviceId`;
- `needsReviewCount`: 84 fichas sem associação publicada como certa;
- nenhum campo de preço, desconto, cupom, fórmula ou configuração comercial.

O gerador auditável é `generate-service-media-map.cjs`. Ele relê os IDs canônicos e impede que o mapa se transforme em um segundo catálogo financeiro.

## Entradas mínimas no código canônico

O patch toca o site hospedeiro somente nestes pontos:

- `index.html`: um `<link>` CSS e três `<script defer>` do diretório isolado;
- `scripts/build-journal.cjs`: chamada do injetor do Jornal;
- `scripts/build-site.cjs`: cópia correta de extensões `.json` do diretório de assets;
- `package.json`: comandos de geração e teste do patch.

Todo HTML adicional das seis views SPA nasce em runtime dentro de elementos `.frap-*`. O Jornal recebe HTML no build para continuar rastreável antes do JavaScript.
