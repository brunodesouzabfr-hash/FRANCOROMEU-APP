# Franco Romeu — Anexo de evolução visual Awwwards / Etapa 14

**Versão:** 14.0 — Seis Universos  
**Base canônica:** `FRANCO_ROMEU_ETAPA13_PATCHED.html` / Etapa 13.1.3  
**Repositório:** [brunodesouzabfr-hash/FRANCOROMEU-APP](https://github.com/brunodesouzabfr-hash/FRANCOROMEU-APP)  
**Base técnica auditada:** PR #3, commit `96c59eb192fd3a5fa76b5e539a4891a24acfa68a`  
**Arquivo resultante:** `FRANCO_ROMEU_ETAPA14_AWWWARDS_UNIVERSES.html`

## 1. Resultado executivo

A Etapa 14 transforma a SPA monolítica em seis universos perceptualmente distintos, conectados por um único sistema de marca e por uma navegação consistente. A intervenção é aditiva: preserva os 115 serviços, as 15 categorias progressivas, as fórmulas financeiras, o Portfólio Stage 2 e o carregador resiliente de PDF.

A direção combina luxo silencioso, matéria e precisão técnica. O azul foi reservado à visualização espacial; verde-petróleo domina fundações, interfaces e áreas de decisão; laranja térmico e dourado atuam como energia e assinatura.

## 2. Invariantes preservados

- 6 views canônicas e apenas uma ativa por vez.
- 115 serviços e 15 categorias progressivas.
- Lógica financeira, visita técnica, cupons, configurações e IDs legados.
- Calculadora, IQE, busca, fidelidade, GODMODE e dock contextual.
- `fr-stage2-portfolio-engine`: SHA-256 `98dc336bb8174ab5a2d18617776c9abd8f8071fb19789d325ee8f7fb275ff844` antes e depois.
- `fr-pdf-stack-loader`: SHA-256 `b9f17ab1b6b52afc3cf215ca1ee54e6a59afa35beae5a6344bd92c2c20934015` antes e depois.
- Identidade oficial: `#0B3D3E`, `#0A2F26`, `#123F34`, `#FC7016`, `#F6A700`, `#E6D6B5` e `#121318`.

## 3. Alterações completas desde a base

### 3.1 Fundação compartilhada

- Criado o design system Stage 14 com tokens de cor, profundidade, borda, easing e zona segura de navegação.
- Criado o `AmbientDirector`: um campo Canvas 2D exclusivo para cada view, com pausa quando a aba perde visibilidade, DPR limitado a `1.5`, entrada de ponteiro agrupada em `requestAnimationFrame` e modo reduzido.
- Restaurado e atualizado o marcador contextual em todas as views: `•FR / 01 / FORJA` até `•FR / 06 / ENGENHARIA DE CUSTO`.
- Transições Stage 8 existentes foram mantidas e aceleradas; o redesign apenas retematiza os portais.
- Adicionado sistema de revelação com `IntersectionObserver` e equivalente estático para `prefers-reduced-motion`.
- Adicionado `content-visibility:auto` somente em módulos pesados selecionados, evitando interferência nos heróis e narrativas sticky.
- Removido um fechamento prematuro de `</body>` herdado, deixando uma única árvore DOM válida.
- Ocultado o placeholder visual `GM` da marca; o sistema administrativo funcional não foi removido.

### 3.2 Home — `01 / FORJA`

- Campo térmico com partículas, linhas de calor e parallax de baixa amplitude.
- Rota de decisão inserida entre hero e conteúdo: **Diagnóstico → Projeto → Execução**.
- Verde-petróleo e carbono dominam a cena; laranja térmico representa energia e conversão.
- Cards foram alinhados à estética industrial editorial, sem arredondamento genérico.
- Indicadores não comprovados foram substituídos por dados estruturais verificáveis: **115 serviços, 15 categorias e 12 linguagens de ambientes**.

### 3.3 Sobre — `02 / MANIFESTO`

- Composição dividida entre bruto e refinado, com eixo vertical de precisão e textura de blueprint.
- Nova navegação sticky por capítulos: **Tese, Essência, Pilares e Método**.
- `IntersectionObserver` sincroniza o capítulo ativo; os botões permitem salto acessível para a seção.
- Estatísticas promocionais sem fonte foram substituídas pelos mesmos dados verificáveis da aplicação.
- Cards de pilares receberam superfícies alternadas, mantendo leitura sóbria e autoria FR.

### 3.4 Ambientes — `03 / ARTE MATERIAL`

- Grid convertido em galeria de 12 colunas no desktop e composição alternada de duas colunas no mobile.
- Imagens operam como quadros contíguos, sem bordas arredondadas ou espaçamento de catálogo convencional.
- Mesa de curadoria adicionada com chips de pedra, madeira, metal, resina e luz.
- Spotlight responde ao ponteiro; saturação é revelada gradualmente na interação.
- O overlay de detalhe existente foi preservado e refinado; nenhuma segunda navegação ou modal duplicado foi criada.

### 3.5 Projetos 3D — `04 / MODELING SPACE`

- Nova matriz arquitetônica Three.js com seis volumes selecionáveis, câmera, névoa, grid, raycasting e arraste horizontal.
- Seleção da matriz sincroniza o carrossel e o dossiê técnico existentes por `window.p3dSetActive`.
- Three.js `0.161.0` é a única dependência nova e só é solicitada ao entrar nesta view.
- Renderização é pausada fora da view ou com o documento oculto; pixel ratio é limitado.
- Tratamento de `webglcontextlost`, descarte de geometrias/materiais/renderer em `pagehide` e prevenção de múltiplos contextos.
- Mobile, economia de dados, movimento reduzido, indisponibilidade de WebGL ou falha de CDN acionam uma matriz CSS 2D/3D equivalente, ainda selecionável e animada.
- O scroll da página não é sequestrado; a roda apenas orienta levemente a matriz.

### 3.6 Portfólio — `05 / ARQUIVO VIVO`

- Linguagem mudou de catálogo para museu: salas contíguas, grid full-bleed de 12 colunas e ritmos de escala alternados.
- Criada visita guiada manual, sem autoplay e sem popup; cada acionamento avança para a próxima sala visível.
- Filtros existentes foram preservados e reiniciam o roteiro de visita.
- Imagens Unsplash permanecem explicitamente marcadas como **referência visual — não representa obra executada pela Franco Romeu**.
- Copy “Portfólio Exclusivo / obras executadas” foi substituída por **Arquivo visual em curadoria**, eliminando alegação sem evidência.

### 3.7 Orçamento — `06 / ENGENHARIA DE CUSTO`

- Área tratada como cockpit calmo de decisão, não como espetáculo que compete com o preenchimento.
- Nova faixa de confiança: **115 serviços, escopo editável, faixa orientativa e PDF resiliente**.
- Divulgação progressiva de 15 categorias e 115 serviços foi mantida.
- Header, conteúdo, resumo e categorias ganharam geometria técnica mais precisa; navbar global e dock contextual permanecem independentes.
- “Gratuito” e “Resposta em 2h” foram substituídos por **Estimativa orientativa** e **Retorno pelo WhatsApp**.
- Escassez artificial foi rejeitada. A alternativa aprovada é: **Disponibilidade confirmada após diagnóstico técnico**.
- Ao apontar para uma ação de PDF, a aplicação pré-aquece o carregador sem bloquear a interface.

### 3.8 PDF — correção e resiliência

O bug “Núcleo de PDF ainda não inicializado” já estava corrigido na base 13.1.3 e foi preservado byte a byte. O fluxo atual:

1. deduplica requisições por URL;
2. carrega `html2canvas 1.4.1` e `jsPDF 2.5.1` sob demanda;
3. verifica se as APIs esperadas foram expostas;
4. aplica timeout de 15 segundos;
5. remove a dependência quebrada e permite nova tentativa;
6. só então executa a geração.

A Etapa 14 acrescenta apenas pré-aquecimento não bloqueante e testes de contrato; não reescreve o núcleo protegido.

### 3.9 SEO, acessibilidade e UX copy

- Novo título descritivo, `meta description`, robots, Open Graph, Twitter Card e JSON-LD `Organization` com contatos já presentes na base.
- Views recebem rótulos acessíveis; controles novos são `button type="button"`, possuem `aria-current`, `aria-live` ou rótulos quando necessário.
- Equivalentes para movimento reduzido, economia de dados, WebGL ausente e navegação por teclado.
- Promessas sem fonte, falsa urgência e números de reputação foram removidos.
- Não foi incluída tag canonical porque ainda não existe domínio de produção aprovado.

## 4. Referências Awwwards e tradução para a FR

As referências abaixo orientam mecanismos, ritmo e princípios — nenhum layout foi copiado.

| Universo | Referências verificadas | Princípio traduzido |
|---|---|---|
| Sobre | [Silver Pinewood Residences](https://www.awwwards.com/sites/silver-pinewood-residences), [David Whyte Experience](https://www.awwwards.com/sites/david-whyte-experience) | luxo silencioso, narrativa por capítulos, tensão entre matéria e vazio |
| Ambientes | [The Unconventional Gallery — 7.79](https://www.awwwards.com/sites/the-unconventional-gallery), [Magical Reflections — 7.85](https://www.awwwards.com/sites/magical-reflections), [Elektra Virtual Museum — 7.72](https://www.awwwards.com/sites/elektra-virtual-museum) | visita espacial, luz curatorial e gesto de descoberta |
| Projetos 3D | [iyO — 7.68](https://www.awwwards.com/sites/iyo), [Loftgarten — 7.74](https://www.awwwards.com/sites/loftgarten), [E.C.H.O — 7.90](https://www.awwwards.com/sites/e-c-h-o) | objeto 3D de alta fidelidade, orientação espacial e narrativa cinematográfica |
| Portfólio | [20 Years of Xbox Museum — 7.93](https://www.awwwards.com/sites/20-years-of-xbox-museum), [Cristóbal Balenciaga Museum — 7.51](https://www.awwwards.com/sites/cristobal-balenciaga-museum), [The Covid Art Museum — 7.72](https://www.awwwards.com/sites/the-covid-art-museum) | arquivo vivo, visita guiada, salas e navegação não linear |
| Orçamento | [iyO](https://www.awwwards.com/sites/iyo), [NN/g — Accordions](https://www.nngroup.com/articles/accordions-on-desktop/) | configurador de alto valor, progressão clara e redução de carga cognitiva |

Princípios técnicos complementares: [INP](https://web.dev/articles/inp), [layout thrashing](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing), [content-visibility](https://web.dev/articles/content-visibility), [WCAG — animação por interação](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html), [WCAG C39 — reduced motion](https://www.w3.org/WAI/WCAG22/Techniques/css/C39) e [Three.js — descarte do renderer](https://threejs.org/docs/pages/Renderer.html).

## 5. Neuromarketing responsável

| Gatilho | Implementação | Limite ético |
|---|---|---|
| Autoridade | 115 serviços, método e critérios técnicos visíveis | sem certificações ou números inventados |
| Clareza | rota de decisão e resumo editável | sem esconder custo ou obrigatoriedade |
| Antecipação | matriz 3D e curadoria de ambientes | referência não é apresentada como obra real |
| Compromisso progressivo | categorias fechadas, um passo por vez | sem impedir saída ou usar dark patterns |
| Exclusividade | autoria, materialidade e diagnóstico | sem falsa escassez ou prazo artificial |
| Redução de risco | estimativa orientativa, revisão e PDF | sem prometer precisão antes da visita |

## 6. Análise de variância

| Métrica | Base 13.1.3 | Etapa 14 | Variação |
|---|---:|---:|---:|
| Tamanho HTML | 992.373 bytes | 1.038.544 bytes | +46.171 bytes / +4,65% |
| Tags `script` | 25 | 27 | +2, incluindo JSON-LD e motor Stage 14 |
| Tags `style` | 32 | 33 | +1 camada consolidada |
| Fechamentos `body` | 2 | 1 | DOM corrigido |
| Serviços | 115 | 115 | 0 |
| Categorias | 15 | 15 | 0 |
| Views | 6 | 6 | 0 |
| Dependências visuais novas | 0 | 1 | Three.js lazy apenas em Projetos 3D |

O custo adicional é controlado, mas o HTML continua acima de 1 MB. A modularização deve ser feita antes de publicar como site definitivo.

## 7. Estratégia de teste e aceite

- **Contrato protegido:** comparação byte a byte dos motores Portfólio e PDF.
- **Estrutural:** seis views, uma árvore DOM, ausência de IDs duplicados, sintaxe de todos os scripts e metadados SEO.
- **Dados:** 115 serviços, 15 categorias e rejeição de claims não comprovados.
- **Runtime:** navegação pelas seis views, componentes exclusivos, fallback 3D, calculadora e contrato do PDF.
- **Acessibilidade:** nomes, foco, `aria-current`, reduced motion e fallback sem WebGL.
- **Pendente em ambiente adequado:** screenshots em Chromium/Safari/Firefox, Lighthouse, WebGL real, rede lenta e dispositivos físicos. O Chromium empacotado deste ambiente encerrou com `SIGSEGV` antes de abrir a página.

## 8. Roadmap para site e APK

### Fase A — aceite visual

- Substituir todas as referências por fotos e cases verificáveis.
- Validar copy, política de visita, territórios atendidos e prazos reais.
- Testar em iPhone, Android intermediário, desktop com e sem GPU e conexão 4G.

### Fase B — site modular

- Separar HTML, CSS, dados e motores em módulos versionados.
- Hospedar assets próprios, adicionar CSP, cache, analytics consentido e monitoramento de erros.
- Publicar com domínio aprovado, canonical, sitemap e páginas indexáveis por serviço/região.
- Definir backend autenticado para administração, orçamento, leads e auditoria.

### Fase C — PWA e automação comercial

- Manifest, service worker, cache offline seletivo e fila resiliente de leads.
- CRM/webhook com consentimento, funil mensurável e templates de WhatsApp.
- KPIs: início do orçamento, conclusão, abandono por etapa, geração de PDF e contato qualificado.

### Fase D — APK

- Preferir PWA/TWA se o produto continuar centrado na web; usar Capacitor apenas quando integrações nativas justificarem.
- Testar armazenamento, compartilhamento de PDF, permissões, deep links e atualização segura.
- Publicar somente após política de privacidade, termos e rastreabilidade de versão.

## 9. Capacidade e prioridade

| Prioridade | Entrega | Dependência |
|---|---|---|
| P0 | aceite visual em navegadores reais e ativos verificados | dispositivo/browser disponível e acervo FR |
| P1 | modularização, performance e segurança de produção | domínio e hospedagem definidos |
| P2 | backend de leads/orçamentos e painel autenticado | regras comerciais aprovadas |
| P3 | PWA e automação de CRM | métricas e consentimento |
| P4 | APK | valor nativo comprovado |

## 10. Decisão arquitetônica

Esta etapa permanece um protótipo HTML standalone para acelerar refinamentos. O futuro site não deve simplesmente “embrulhar” o monólito: deve extrair design tokens, dados, cálculo, PDF, navegação e cada universo em módulos com contratos testáveis. O APK deve consumir a mesma camada de domínio, evitando duas fontes de verdade.
