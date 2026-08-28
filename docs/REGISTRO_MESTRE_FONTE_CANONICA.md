# FR — Registro Mestre de Fonte Canônica e Plano de Evolução

## 1. Fonte de verdade

- Repositório: https://github.com/brunodesouzabfr-hash/FRANCOROMEU-APP
- Branch canônica: `main`
- Commit auditado: `d3848928daabc39e400cb1391156dbbfcf787aa0`
- HTML canônico: `base-original/FRANCO_ROMEU_ETAPA13_ORIGINAL.html`
- Versão preparada: `13.1.3`
- Inventário detalhado: `docs/ANEXO_EVOLUCAO_VISUAL_AWWWARDS.md`
- Brief para IA: `docs/fr_awwwards_redesign_brief.json`

O HTML anexado antes deste trabalho era byte a byte igual ao arquivo do GitHub (`Git blob 12bf5a9c823ac3ad62f628b5b2d2d0af271bf9a1`). O GitHub passa a prevalecer em toda decisão de código e histórico.

## 2. O que esta etapa fez

### Implementado no código

- Corrigiu o erro `Núcleo de PDF ainda não inicializado`.
- Restaurou o contrato `window.FR_PERFORMANCE.ensurePDFStack`.
- Carrega `html2canvas 1.4.1` e `jsPDF 2.5.1` somente ao gerar PDF.
- Deduplica chamadas simultâneas, valida a API, aplica timeout e permite retry.
- Preservou paginação, motor financeiro, 115 serviços, 15 categorias, IQE, CEP, WhatsApp, persistência e navegação.

### Atualizado nas fontes

- O GitHub foi registrado como fonte canônica.
- O anexo passou a separar claramente `implementado`, `corrigido`, `proposto`, `dependente de conteúdo`, `não comprovado` e `proibido`.
- As referências Awwwards foram verificadas e associadas a princípios específicos de cada aba.
- O JSON foi reconstruído como contrato de prompt e roadmap executável.
- Alegações inventadas, escassez artificial e associação de imagens Unsplash a obras executadas foram rejeitadas.

### Não implementado nesta etapa

- Remake visual das abas.
- Three.js/WebGL/GSAP/Lenis.
- Museu 3D, matriz arquitetônica 3D ou configurador 3D.
- Rotas públicas, SEO completo, backend autenticado, site publicado ou APK.

## 3. Estado factual do produto

| Área | Estado atual |
|---|---|
| Arquitetura | SPA em um HTML único, CSS estático e JavaScript nativo. |
| Motion | DOM/CSS, Canvas 2D e `requestAnimationFrame`. |
| Three.js/WebGL | Não carregado. |
| GSAP/ScrollTrigger | Há código preparado, mas as bibliotecas não são carregadas; o fallback nativo é efetivo. |
| Tailwind | Configuração presente; runtime CDN ausente; CSS utilitário estático incorporado. |
| Calculadora | 115 serviços e 15 categorias progressivas. |
| Portfólio | 16 itens padrão com imagens Unsplash; devem ser tratados como referências. |
| GODMODE | Administração local, sem autenticação/backend seguro. |
| SEO | Somente base mínima; domínio e rotas ainda não definidos. |

## 4. Direção criativa consolidada

### Núcleo da marca

- Verde-petróleo: autoridade e base.
- Laranja-forja: energia e ação.
- Ouro: precisão e detalhe.
- Osso mineral: texto e refinamento.
- Ciano/azul: apenas telemetria/Projetos 3D.
- Luxo silencioso: espaço, matéria, ritmo e ausência de ruído.
- Engenharia inteligente: transparência, método, reversibilidade e execução.

### Uma experiência diferente por aba

| Aba | Universo | Mecânica exclusiva proposta |
|---|---|---|
| Home | Forja Mineral | Fluido mineral e entrada cinematográfica curta. |
| Sobre | Manifesto de Matéria | Capítulos verticais bruto/refinado. |
| Ambientes | Galeria de Linguagens | Trilho de salas e ficha curatorial. |
| Projetos 3D | Matriz Arquitetônica | Frames em profundidade, waypoints e minimapa, com atlas 2D. |
| Portfólio | Museu de Ofícios | Acervo temporal de cases comprovados. |
| Orçamento | Cockpit de Custo | Divulgação progressiva, telemetria e resumo editável. |

## 5. Referências principais verificadas

### Sobre

- [David Whyte Experience](https://www.awwwards.com/sites/david-whyte-experience) — SOTD, 7,63.
- [Horizonte Village](https://www.awwwards.com/sites/horizonte-village) — SOTD, 7,41.
- [Silver Pinewood Residences](https://www.awwwards.com/sites/silver-pinewood-residences) — SOTD, 7,25.

### Ambientes

- [The Unconventional Gallery](https://www.awwwards.com/sites/the-unconventional-gallery) — SOTD, 7,79.
- [Magical Reflections](https://www.awwwards.com/sites/magical-reflections) — SOTD, 7,85.
- [Southern Guild](https://www.awwwards.com/sites/southern-guild) — SOTD, 7,43.

### Projetos 3D

- [E.C.H.O.](https://www.awwwards.com/sites/e-c-h-o) — SOTD, 7,90.
- [Loftgarten](https://www.awwwards.com/sites/loftgarten) — SOTD, 7,74.
- [iyO](https://www.awwwards.com/sites/iyo) — SOTD, 7,68.

### Portfólio

- [Elektra Virtual Museum](https://www.awwwards.com/sites/elektra-virtual-museum) — SOTD, 7,72.
- [365 — A Year of Cartier](https://www.awwwards.com/sites/365-a-year-of-cartier) — SOTD, 7,41.
- [Immersive WebGL Museums](https://www.awwwards.com/immersive-webgl-virtual-gallery-exhibition-collection.html) — coleção Awwwards.

### Orçamento

- [iyO](https://www.awwwards.com/sites/iyo) — configurador e feedback.
- [National Grid CO2 Calculator](https://www.awwwards.com/sites/national-grid-co2-calculator) — Nominee; fluxo progressivo, não SOTD.
- [Brunello Cucinelli AI E-com](https://www.awwwards.com/sites/brunello-cucinelli-ai-e-com) — SOTD, 7,19; linguagem de luxo com cautela de usabilidade.

As referências são repertório de princípios. Não autorizam cópia de layout, código, ativos ou narrativa.

## 6. Psicologia de decisão sem dark patterns

Usar:

- autoridade técnica comprovável;
- transparência da estimativa e da faixa ±12%;
- progresso visível;
- edição e reversibilidade;
- personalização com dados fornecidos;
- cases reais autorizados;
- exclusividade somente quando derivada de capacidade real.

Não usar:

- contagem regressiva falsa;
- agenda limitada inventada;
- métricas como “150+ projetos” ou “98%” sem fonte;
- depoimento/prêmio não verificável;
- imagem de banco como trabalho executado;
- custo escondido, seleção forçada ou dificuldade para remover/voltar.

Base: [Nielsen Norman Group — cognitive load](https://www.nngroup.com/articles/4-principles-reduce-cognitive-load/), [progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/), [scrolljacking](https://www.nngroup.com/articles/scrolljacking-101/) e [CDC, arts. 36–38](https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm).

## 7. Lentes solicitadas e como foram incorporadas

| Lente | Resultado no projeto |
|---|---|
| SEO audit | Identificou ausência de description, canonical, OG, JSON-LD e deep links; implementação aguardará domínio e dados reais. |
| UX copy | Removeu claims agressivos/inventados; adotou precisão, estimativa e próximo passo claro. |
| Testing strategy | Definiu unitários, estrutura, runtime, PDF, visual, teclado, reduced motion, WebGL e APK. |
| System design | Mapeou monólito atual, modularização progressiva, site e shell Android futuro. |
| Brand review | Reforçou verde-petróleo, laranja, ouro e osso; azul restrito a telemetria. |
| Variance analysis | Separou faixa ±12%, regras do software e validações comerciais pendentes. |
| Productivity update | Este registro substitui textos contraditórios e aponta as fontes canônicas. |
| Design system | Especificou tokens, mecânica exclusiva por aba, Motion Director e fallbacks. |
| Product brainstorming | Converteu o desejo de imersão em seis universos distintos. |
| Roadmap update | Ordenou verdade/estabilidade → sistema → conteúdo → 3D → site → APK. |
| Capacity plan | Identificou produto, criação, frontend/motion, 3D, conteúdo, QA e segurança como capacidades necessárias. |

Essas lentes foram aplicadas como método; os plugins nomeados originalmente não estavam instalados neste ambiente.

## 8. Roadmap autorizado para prototipagem futura

1. Verdade e estabilidade: PDF, regras comerciais, manifesto de ativos e contratos de dados.
2. Design system: componentes e Motion Director únicos.
3. Sobre + Ambientes: primeiras experiências distintivas, menor risco.
4. Portfólio: acervo real comprovado antes do museu.
5. Projetos 3D: protótipo isolado com atlas 2D e recuperação de context loss.
6. Calculadora: refinamento baseado em testes sem tocar no motor sem necessidade.
7. Site: rotas, SEO, CSP, observabilidade, consentimento e backend quando necessário.
8. APK: assets críticos locais, PDF offline e testes em WebView.

## 9. Critério de aceite invariável

- 115 serviços e 15 categorias preservados.
- Cálculo, PDF, WhatsApp, CEP, IQE, busca, resumo e persistência sem regressão.
- Zero erro de sintaxe/runtime e zero ID estático duplicado.
- Teclado, foco visível e reduced motion.
- Nenhuma obra, métrica, urgência, benefício ou credencial sem prova.
- Fallback equivalente para falha de CDN/WebGL e para dispositivos móveis.
- Changelog explícito com o que foi realmente alterado.

## 10. Resultado de QA desta revisão

- 25 scripts inline analisados; zero erro de sintaxe.
- 200 IDs estáticos; zero duplicação.
- 115 serviços; zero divergência entre chave e ID.
- Smoke runtime: seis views, 15 categorias, bridge do PDF e zero erro de execução.
- Bridge do PDF testado com duas chamadas concorrentes; duas dependências inseridas uma única vez.
- Chromium do ambiente encerrou com `SIGSEGV`; nenhuma aprovação visual em navegador real foi inventada.

Este arquivo é um resumo operacional. O inventário completo e o contrato estruturado estão, respectivamente, no anexo `.md` e no brief `.json`.
