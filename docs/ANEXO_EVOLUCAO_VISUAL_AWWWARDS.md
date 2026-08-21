# ANEXO COMENTADO — Auditoria canônica, evolução real e direção Awwwards

**Marca:** Franco Romeu (FR) — Arte & Engenharia  
**Repositório canônico:** https://github.com/brunodesouzabfr-hash/FRANCOROMEU-APP  
**Branch canônica auditada:** `main`  
**Commit canônico auditado:** `d3848928daabc39e400cb1391156dbbfcf787aa0`  
**Base importada:** `base-original/FRANCO_ROMEU_ETAPA13_ORIGINAL.html`  
**Versão preparada neste trabalho:** Etapa `13.1.3`  
**Data da auditoria e da pesquisa:** 20/08/2026  
**Escopo:** inventário factual do que mudou, correção do PDF, auditoria de marca/UX/SEO/sistema/testes e roteiro visual. Este documento não declara como implementada nenhuma proposta futura.

---

## 1. Regra de fonte de verdade

1. O GitHub acima passa a ser a fonte canônica do código.
2. Antes da correção desta etapa, o HTML anexado e o arquivo da branch `main` eram idênticos pelo Git blob SHA: `12bf5a9c823ac3ad62f628b5b2d2d0af271bf9a1`.
3. O HTML preparado neste trabalho altera essa base somente para restaurar o contrato de carregamento do PDF e atualizar a identificação para `13.1.3`.
4. Documentos de marca continuam válidos como princípios; em caso de conflito sobre comportamento da aplicação, prevalecem código, testes e histórico do repositório.
5. A migração para site publicado e APK permanece futura. Antes dela, URLs públicas, analytics, autenticação, política de privacidade e ativos finais precisam ser definidos.

### Vocabulário de status usado neste anexo

| Status | Significado |
|---|---|
| `IMPLEMENTADO` | Existe no HTML/repositório e foi localizado no código. |
| `CORRIGIDO_13_1_3` | Foi alterado neste trabalho e passou no teste correspondente. |
| `PROPOSTO` | Direção aprovada para prototipagem futura; não existe no produto atual. |
| `DEPENDENTE_DE_CONTEUDO` | Só pode ser publicado após receber imagens/dados reais e autorização. |
| `NAO_COMPROVADO` | Alegação presente em textos anteriores sem evidência suficiente. |
| `PROIBIDO` | Não deve ser usado por risco de engano, dark pattern ou dano à marca. |

---

## 2. Estrutura real da aplicação atual

| Universo | ID real | Nome FR | Estado técnico verificado |
|---|---|---|---|
| Home | `view-home` | `•FR / 01/ FORJA` | Hero editorial, Canvas 2D, imagem de referência e motion próprio. |
| Sobre | `view-sobre` | `•FR / 02/ MANIFESTO` | Narrativa institucional em DOM/CSS/JS; sem cena 3D real. |
| Ambientes | `view-ambientes` | `•FR / 03/ ARTE MATERIAL` | Curadoria em grid/painel, integração com serviços e referências visuais. |
| Projetos 3D | `view-projetos3d` | `•FR / 04/ MODELING SPACE` | Simulação espacial 2D em Canvas/DOM; não carrega Three.js/WebGL. |
| Portfólio | `view-projetos` | `•FR / 05/ ARQUIVO VIVO` | Arquivo filtrável/serpentino; imagens padrão atuais vêm do Unsplash. |
| Orçamento | `view-orcamento` | `•FR / 06/ ENGENHARIA DE CUSTO` | SPA com 115 serviços, 15 categorias progressivas, IQE, fidelidade, resumo e PDF. |

### Stack realmente carregada

- HTML, CSS estático e JavaScript nativo em um único arquivo.
- Configuração Tailwind presente, porém sem runtime Tailwind carregado; a interface depende do CSS utilitário estático incorporado.
- Fontes e Font Awesome são recursos diferidos.
- Dois canvases usam contexto 2D.
- Existem trechos preparados para GSAP/ScrollTrigger, mas as bibliotecas não são carregadas; o fallback nativo é o caminho efetivo.
- Não há Three.js, Lenis nem motor WebGL ativo.

**Comentário:** documentos anteriores confundiam código preparado com biblioteca instalada. O roteiro novo separa claramente inspiração, protótipo e produção.

---

## 3. Todas as alterações efetivamente realizadas desde a Etapa 13 importada

O histórico foi reconstituído a partir dos commits e do diff entre a Etapa 13 e a base atual. A lista abaixo descreve mudanças reais; não inclui propostas Awwwards.

### 3.1 Repositório e governança — `IMPLEMENTADO`

1. O HTML original foi preservado em `base-original/`.
2. Foram adicionados `.gitignore`, `README.md`, `CHANGELOG.md` e `package.json`.
3. O motor financeiro reutilizável foi extraído para `src/budget-core.js` e também incorporado ao HTML standalone.
4. Foram adicionados `tests/budget-core.test.js` e `scripts/check-html.js`.
5. A Etapa 13.1.2 adicionou este anexo em `docs/` e ampliou a checagem estrutural do hero.
6. O fluxo Git registrado utiliza branches de feature e pull requests; `main` é a referência estável.

### 3.2 Motor financeiro e compatibilidade — `IMPLEMENTADO`

7. O cálculo passou a ser função pura em `FRBudgetCore.calculateBudget`.
8. A resolução de configurações aceita ID estável e índice numérico legado.
9. Valores monetários são arredondados a duas casas por função central.
10. Quantidades inválidas e serviços desconhecidos geram aviso em vez de contaminar o total.
11. Os acréscimos ambientais existentes são calculados de forma explícita.
12. Cupom e desconto por forma de pagamento são separados no resultado.
13. A visita técnica de R$ 99 é mantida e deixa de ser cobrada quando o subtotal supera R$ 450, conforme regra atual do aplicativo.
14. O resultado exibe faixa orientativa de ±12%, fonte estimada/confirmada e nível de confiança.
15. Itens adicionados manualmente, pelo IQE ou por Ambientes recebem origem rastreável.
16. Os 115 serviços e os 15 agrupamentos primários foram preservados.

**Guardrail financeiro:** descontos de `cash`, `pix` e `crypto`, cupons, patentes e benefícios são regras configuradas no software, não fatos de mercado. Precisam de aprovação comercial/jurídica antes de produção.

### 3.3 Jornada do orçamento — `IMPLEMENTADO`

17. Configurações obrigatórias agora bloqueiam a inclusão incompleta de um serviço.
18. A finalização, o WhatsApp, a visualização e o PDF validam cliente, ambiente, serviços, endereço, pagamento e termos.
19. Campos inválidos recebem mensagem e `aria-invalid`.
20. A navegação por etapa foi centralizada e limitada ao intervalo válido.
21. Itens do resumo podem ser editados, duplicados e removidos.
22. Novos itens usam identificador próprio sem quebrar seleções legadas.
23. O catálogo usa divulgação progressiva: primeiro categorias, depois serviços da categoria aberta.
24. A posição de scroll do catálogo é preservada durante seleção e renderização.
25. A consulta de CEP possui timeout, fallback manual e preserva dados já digitados.
26. O link de WhatsApp é montado apenas após validação.
27. A finalização trata indisponibilidade do armazenamento e mantém a estimativa aberta.

### 3.4 Persistência e administração — `IMPLEMENTADO_COM_LIMITES`

28. Acesso a `localStorage` foi concentrado em adaptador com tratamento de exceções.
29. Configuração antiga/corrompida cai para dados padrão utilizáveis.
30. Importação administrativa valida estrutura mínima, IDs, categorias, serviços, ícones e cupons.
31. Um backup do banco anterior é criado antes da importação.
32. CRUD administrativo de serviços permanece disponível no dispositivo.
33. Gatilhos administrativos secretos expostos no conteúdo foram removidos na fundação técnica.

**Limite:** o GODMODE/local admin não é autenticação nem backend. Não deve ser exposto como painel seguro em site público ou APK conectado.

### 3.5 Segurança de conteúdo e honestidade — `IMPLEMENTADO`

34. Conteúdo dinâmico crítico passou a usar escape de HTML/atributos.
35. IDs derivados de dados são normalizados antes de entrar no DOM.
36. Cupons administrativos são limitados ao intervalo aceito pelo motor.
37. Uma identificação empresarial/CNPJ demonstrativos e não comprovados foram removidos do PDF.
38. Imagens do Unsplash recebem automaticamente o aviso: “Referência visual — não representa obra executada pela Franco Romeu”.
39. Links externos e nomes acessíveis receberam normalização defensiva.

**Achado prioritário:** os 16 itens padrão de Portfólio usam imagens do Unsplash. Portanto, hoje eles não podem ser apresentados como “obras executadas”. O rótulo de referência deve permanecer até a substituição por acervo real comprovado.

### 3.6 Acessibilidade e robustez — `IMPLEMENTADO`

40. Botões sem `type` são normalizados para evitar submissões acidentais.
41. Foco visível, áreas de toque e mensagens acessíveis foram reforçados.
42. Imagens sem texto alternativo recebem fallback; referências recebem descrição explícita.
43. Diálogos recebem foco quando abertos.
44. Há tratamento para `prefers-reduced-motion` sem remover conteúdo ou impedir navegação.
45. Loops recentes de Canvas usam `requestAnimationFrame`, visibilidade da aba/view e observadores para reduzir trabalho invisível.

### 3.7 Hero e camada visual — `IMPLEMENTADO`

46. A Etapa 13.1.2 corrigiu a camada do hero da Home que podia desaparecer após o rótulo automático de imagem.
47. `.fr-reference-media` deixou de forçar posicionamento em todo host.
48. A classe `.fr-reference-positioned` passou a ser aplicada somente quando o host realmente precisa de contexto de posicionamento.
49. Nenhum remake WebGL/Awwwards foi implementado pelos commits 13.1.1/13.1.2; houve fundação técnica, correção do hero e documentação.

### 3.8 PDF — `CORRIGIDO_13_1_3`

50. A causa do erro “Núcleo de PDF ainda não inicializado” foi localizada: `generatePDF()` chamava `window.FR_PERFORMANCE.ensurePDFStack()`, mas a Etapa 13 não definia mais esse contrato.
51. Foi adicionado o bridge `fr-pdf-stack-loader`.
52. `html2canvas@1.4.1` e `jsPDF@2.5.1` são carregados somente quando o usuário gera o PDF.
53. Chamadas simultâneas compartilham uma única Promise por dependência.
54. O bridge valida se as APIs esperadas foram realmente expostas.
55. Falha de rede, biblioteca inválida e timeout de 15 segundos retornam mensagens específicas e permitem nova tentativa.
56. Listeners são registrados antes de anexar scripts, removendo a corrida de inicialização.
57. O bridge preserva qualquer propriedade já existente em `window.FR_PERFORMANCE`.
58. A paginação A4 já existente continua preservada.

**Validação executada:** 25 scripts inline sem erro de sintaxe; 200 IDs estáticos sem duplicação; 115/115 IDs de serviços coerentes; smoke runtime simulado com as seis views, 15 categorias e zero erro; duas chamadas concorrentes carregaram exatamente duas dependências uma única vez. O Chromium disponível no ambiente encerrou com `SIGSEGV`, por isso não há screenshot declarado como aprovado nesta etapa.

---

## 4. Débitos técnicos reais antes do remake visual

| Prioridade | Achado | Consequência | Ação recomendada |
|---|---|---|---|
| P0 | PDF depende de CDN em runtime | Offline/APK pode não gerar documento | Web: bridge atual. APK/PWA: empacotar versões licenciadas/localizadas e aplicar CSP/SRI. |
| P0 | Portfólio usa Unsplash | Risco de representar referência como obra | Criar manifesto de ativos e bloquear o selo “executado” sem prova/autorização. |
| P0 | Admin é local | Não há segurança multiusuário | Remover em produção ou criar backend autenticado com autorização e auditoria. |
| P1 | HTML monolítico com sucessivas camadas `stage*` | Colisões CSS/JS, peso e regressão | Modularizar mantendo saída standalone gerada; remover motores superseded após testes de equivalência. |
| P1 | Sem deep links por aba | SEO, compartilhamento e retorno de navegação frágeis | Adotar rotas/hash estáveis, título e foco por view. |
| P1 | SEO mínimo | Sem description, OG/Twitter, canonical ou schema | Adicionar apenas quando domínio, textos e imagens públicas forem aprovados. |
| P1 | Dependências visuais externas | Privacidade, disponibilidade e CORS | Manifesto de terceiros, cache, fallback e política de atualização. |
| P2 | Motion distribuído em muitos motores | Ritmo inconsistente e custo imprevisível | Criar Motion Director único com tokens de duração, easing, prioridade e orçamento de frame. |
| P2 | WebGL ainda inexistente | A aba “3D” é conceitual, não tridimensional | Prototipar isoladamente; só integrar após orçamento de performance e fallback 2D. |

---

## 5. Curadoria Awwwards verificável

As notas abaixo são as exibidas pelo Awwwards na data desta auditoria. Elas são sinais editoriais/comunitários, não prova de conversão nem licença para copiar layout ou código.

### Home / Forja

| Referência | Reconhecimento | O que estudar | O que não copiar |
|---|---|---|---|
| [House of Wonders](https://www.awwwards.com/sites/the-house-of-wonders) | SOTD, 7,23 | Entrada cinematográfica, luxo material e transição narrativa. | Ornamento de moda sem vínculo com obra/engenharia. |
| [Urban Jürgensen](https://www.awwwards.com/sites/urban-jurgensen) | SOTD, 7,27 | Continuidade entre eixos e ritmo editorial de luxo. | Scroll que esconda orientação ou impeça controle. |
| [25 Residences](https://www.awwwards.com/sites/25-residences) | SOTD, 7,31 | Fotografia arquitetônica, tipografia contida e progressão espacial. | Promessas imobiliárias ou conteúdo não FR. |

**Tradução FR — `PROPOSTO`:** hero-forja com líquido mineral âmbar/verde-petróleo, uma única ação primária e progressão para o Manifesto; sem introdução mais longa que o loading já existente.

### Sobre / Manifesto — bruto + refinado

| Referência | Reconhecimento | Princípio transferível |
|---|---|---|
| [David Whyte Experience](https://www.awwwards.com/sites/david-whyte-experience) | SOTD, 7,63 | Storytelling em capítulos, texto como espaço e transições que servem à leitura. |
| [Horizonte Village](https://www.awwwards.com/sites/horizonte-village) | SOTD, 7,41 | Narrativa de arquitetura, atmosfera e conteúdo estruturado. |
| [Silver Pinewood Residences](https://www.awwwards.com/sites/silver-pinewood-residences) | SOTD, 7,25 | Quiet luxury, profundidade controlada e composição arquitetônica. |

**Tradução FR — `PROPOSTO`:** capítulos “matéria → método → precisão → assinatura”; aço/concreto no grid, couro/madeira/luz na camada sensorial; movimento lento apenas em planos de fundo, texto sempre estável e legível.

### Ambientes / Arte Material — galeria curatorial

| Referência | Reconhecimento | Princípio transferível |
|---|---|---|
| [The Unconventional Gallery](https://www.awwwards.com/sites/the-unconventional-gallery) | SOTD, 7,79 | Galeria WebGL explorável e gesto como mecanismo curatorial. |
| [Magical Reflections](https://www.awwwards.com/sites/magical-reflections) | SOTD, 7,85 | Espaço expositivo, foco na obra e alto valor de conteúdo/criatividade. |
| [Southern Guild](https://www.awwwards.com/sites/southern-guild) | SOTD, 7,43 | Galeria real, hierarquia editorial e fichas de obra utilizáveis. |

**Tradução FR — `PROPOSTO`:** trilho de salas/linguagens, parede expositiva assimétrica, paleta material e ficha curatorial. Não duplicar o movimento serpentino do Portfólio. Touch, teclado e grid 2D devem ser equivalentes ao gesto.

### Projetos 3D / Modeling Space — matriz arquitetônica

| Referência | Reconhecimento | Princípio transferível |
|---|---|---|
| [E.C.H.O.](https://www.awwwards.com/sites/e-c-h-o) | SOTD, 7,90 | Transições de estado, exploração espacial e densidade técnica. |
| [Loftgarten](https://www.awwwards.com/sites/loftgarten) | SOTD, 7,74 | Visualização arquitetônica, câmera e composição de empreendimento. |
| [iyO](https://www.awwwards.com/sites/iyo) | SOTD, 7,68 | Configurador 3D responsivo, estados claros e feedback imediato. |
| [Scale & Form](https://www.awwwards.com/sites/scale-form) | Nominee | Navegação por teclado e experiência 3D em tempo real como referência de fallback. |

**Tradução FR — `PROPOSTO`:** matriz de frames em três profundidades, waypoints de câmera, minimapa e dossiê lateral. Nunca amarrar toda a navegação a scrolljacking. Se WebGL falhar/perder contexto, retornar ao mesmo projeto no atlas 2D.

### Portfólio / Arquivo Vivo — museu de trabalhos

| Referência | Reconhecimento | Princípio transferível |
|---|---|---|
| [Elektra Virtual Museum](https://www.awwwards.com/sites/elektra-virtual-museum) | SOTD, 7,72 | Navegação museológica e mediação de acervo. |
| [365 — A Year of Cartier](https://www.awwwards.com/sites/365-a-year-of-cartier) | SOTD, 7,41 | Arquivo temporal, continuidade de coleção e conteúdo como objeto. |
| [The Museum of the World](https://www.awwwards.com/sites/the-museum-of-the-world) | 7,23 | Relações entre itens, tempo e contexto em vez de cards isolados. |
| [Coleção Immersive WebGL Museums](https://www.awwwards.com/immersive-webgl-virtual-gallery-exhibition-collection.html) | Curadoria Awwwards | Padrões de sala, tour e exposição virtual. |

**Tradução FR — `DEPENDENTE_DE_CONTEUDO`:** cada obra precisa de `project_id`, título, cidade aproximada, ano, escopo, materialidade, antes/depois, autoria da foto, autorização e serviços relacionados. Sem esse pacote, o item continua “referência”, não “obra executada”.

### Calculadora / Engenharia de Custo — clareza e conversão

| Referência | Reconhecimento | Princípio transferível |
|---|---|---|
| [iyO](https://www.awwwards.com/sites/iyo) | SOTD, 7,68; Design 7,90; Usabilidade 7,11 | Configuração de alto valor com resposta imediata. |
| [National Grid CO2 Calculator](https://www.awwwards.com/sites/national-grid-co2-calculator) | Nominee | Etapas, cálculo e visualização progressiva. Não tratá-lo como SOTD. |
| [Brunello Cucinelli AI E-com](https://www.awwwards.com/sites/brunello-cucinelli-ai-e-com) | SOTD, 7,19 | Linguagem de luxo e descoberta orientada por intenção; a usabilidade mais modesta recomenda cautela. |

**Tradução FR — `PROPOSTO`:** manter o catálogo progressivo, transformar o resumo em instrumento de decisão, explicar incerteza antes do total e mostrar próximo passo humano. Evitar WebGL pesado no caminho de receita.

---

## 6. Neuromarketing ético e UX de conversão

O termo “gatilho” não autoriza pressão artificial. A referência correta é reduzir carga cognitiva, incerteza e risco percebido.

### Padrões permitidos

| Princípio | Aplicação FR | Condição |
|---|---|---|
| Autoridade técnica | Método, escopo, memorial, responsável e critérios verificáveis. | Só publicar dados comprovados. |
| Transparência | “Estimativa orientativa”, faixa ±12%, itens estimados e visita técnica. | Linguagem visível antes do CTA. |
| Progresso | Etapas e resumo persistente. | Permitir voltar/editar sem perder dados. |
| Personalização | Nome do cliente e composição escolhida. | Usar somente dados fornecidos, com privacidade. |
| Compromisso | Salvar composição e retomar. | Sem seleção pré-marcada ou custo oculto. |
| Exclusividade legítima | Processo autoral e atendimento compatível com capacidade real. | Nunca inventar agenda limitada. |
| Prova social | Case real com escopo, data e autorização. | Sem números ou avaliações não verificadas. |

### Padrões proibidos

- Contadores falsos, escassez fabricada e “últimas vagas” sem agenda real.
- “150+ projetos”, “98% de aprovação”, prêmios, clientes ou depoimentos sem fonte.
- Apresentar imagens de banco como obras executadas.
- Esconder taxa, condição, desconto ou caráter estimativo.
- Pré-selecionar opção mais cara ou dificultar voltar/remover.
- Usar animação para bloquear, confundir ou empurrar a confirmação.

### Fontes primárias de UX e compliance

- Nielsen Norman Group, [quatro princípios para reduzir carga cognitiva](https://www.nngroup.com/articles/4-principles-reduce-cognitive-load/).
- Nielsen Norman Group, [progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/).
- Nielsen Norman Group, [scrolljacking e desorientação](https://www.nngroup.com/articles/scrolljacking-101/).
- Chernev, Böckenholt e Goodman, [meta-análise sobre choice overload](https://doi.org/10.1016/j.jcps.2014.08.002): o efeito depende do contexto; não sustenta a regra simplista “menos opções sempre converte mais”.
- Código de Defesa do Consumidor, [arts. 36–38](https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm): publicidade identificável, sustentação factual/técnica e proibição de comunicação enganosa.

---

## 7. Sistema de design e gramática de movimento

### Núcleo compartilhado

- Verde-petróleo `#0A2F26` e `#123F34`: base e autoridade.
- Laranja `#FF6B00`: energia da Forja e ação primária.
- Ouro `#F6A700`: precisão, detalhe e valor.
- Osso `#E6D6B5`: texto/contraste refinado.
- Ciano/azul: somente telemetria e Modeling Space; nunca cor dominante da marca.
- Tipografia atual: `Stardos Stencil` para títulos industriais, `Rokkitt` para narrativa, `Share Tech Mono` para dados.

### Uma mecânica exclusiva por universo

| Universo | Mecânica exclusiva | Evitar repetição |
|---|---|---|
| Home | Fluido mineral + forja luminosa | Não usar grade de museu. |
| Sobre | Capítulos verticais e matéria em camadas | Não usar carrossel 3D. |
| Ambientes | Trilho curatorial/salas | Não usar serpentina do Arquivo Vivo. |
| Projetos 3D | Matriz espacial + waypoints | Não transformar tudo em scroll vertical. |
| Portfólio | Acervo temporal/museológico | Não reutilizar cards da aba Ambientes. |
| Orçamento | Cockpit progressivo e resumo persistente | Não usar efeitos que atrasem entrada/seleção. |

### Orçamento de motion e resiliência

1. Animar preferencialmente `transform` e `opacity`.
2. Coalescer eventos de scroll/pointer em `requestAnimationFrame`.
3. Suspender cenas quando view/documento não estiver visível.
4. Evitar leitura/escrita alternada de layout no mesmo frame.
5. Definir fallback de conteúdo equivalente para `prefers-reduced-motion` e WebGL indisponível.
6. Alvo de qualidade: medir INP, LCP, CLS, memória e FPS por dispositivo; não prometer “60 fps” sem ensaio.
7. Em WebGL, tratar `webglcontextlost`/`webglcontextrestored`, limitar DPR, texturas e draw calls.

Referências técnicas: [INP](https://web.dev/articles/optimize-inp), [layout thrashing](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing), [`content-visibility`](https://web.dev/articles/content-visibility), [WCAG — animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html), [WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices).

---

## 8. SEO e arquitetura futura

### Estado atual

- `lang="pt-BR"`, `charset`, viewport e `theme-color` existem.
- Não há meta description, canonical, Open Graph, Twitter Card ou JSON-LD.
- As seis views não têm URL própria; a navegação é controlada no DOM.
- O título não muda por universo.

### Antes do site público

1. Definir domínio e ambiente canônico; só então publicar `<link rel="canonical">`.
2. Criar rota/deep link para cada universo e título/description únicos.
3. Adicionar `Organization`/`LocalBusiness` apenas com razão social, endereço, área atendida e identificadores verificados.
4. Gerar sitemap/robots no ambiente web, não no HTML local.
5. Usar cases reais como páginas indexáveis; não indexar referências de banco como portfólio.
6. Medir eventos de navegação, expansão de categoria, serviço adicionado, erro de validação, PDF, WhatsApp e conclusão — com consentimento e minimização de dados.

---

## 9. Roadmap de implementação

| Fase | Entrega | Critério de saída |
|---|---|---|
| 0 — Verdade e estabilidade | PDF, manifesto de ativos, termos comerciais e contratos de dados | Testes críticos verdes; nenhuma obra/alegação sem prova. |
| 1 — Design system | Tokens, componentes, Motion Director e estados de fallback | Inventário visual aprovado em desktop/mobile/teclado/reduced motion. |
| 2 — Sobre + Ambientes | Manifesto em capítulos e galeria curatorial | Sem duplicar mecânica; conteúdo acessível no fallback. |
| 3 — Portfólio real | CMS/manifesto de cases e Arquivo Vivo | Cada item tem proveniência e autorização. |
| 4 — Projetos 3D | Protótipo WebGL isolado + atlas 2D | INP/LCP/memória dentro do orçamento acordado; context loss recuperável. |
| 5 — Calculadora | Clareza, telemetria, acessibilidade e teste com usuários | Sem regressão nos 115 serviços/cálculo/PDF/WhatsApp. |
| 6 — Site | Rotas, SEO, CSP, analytics/consentimento, backend quando necessário | Lighthouse e testes reais; deploy observável e reversível. |
| 7 — APK | Empacotamento, assets locais, permissões e testes WebView | PDF offline, navegação, armazenamento e links externos testados em Android. |

---

## 10. Critérios de aceite para qualquer próxima mudança

- Zero redução dos 115 serviços e 15 categorias.
- Valores e configurações idênticos nos testes de regressão.
- PDF, WhatsApp, CEP, IQE, busca, resumo e persistência operacionais.
- Uma única aba ativa e URL/estado coerentes.
- Nenhum ID estático duplicado nem erro de sintaxe/runtime.
- Operação por teclado, foco visível e nomes acessíveis.
- Sem obra, métrica, prêmio, urgência ou benefício não comprovado.
- Fallback equivalente em mobile, reduced motion e indisponibilidade de WebGL/CDN.
- Registro em `CHANGELOG.md` distinguindo `implemented`, `proposed`, `content-dependent` e `rejected`.

---

## 11. Conclusão executiva

A base atual já possui uma identidade forte e um motor de orçamento substancial, mas ainda não é uma experiência 3D/WebGL e não deve ser descrita como tal. A prioridade correta é: verdade do acervo, resiliência do PDF e da conversão, unificação do motion e só então experiências distintas por aba. O padrão Awwwards deve funcionar como repertório de princípios — narrativa, materialidade, orientação e resposta — sem cópia de composição, código ou claims.
