# Plano de tradução original para o FRANCOROMEU-APP

## Direção

A referência deve informar disciplina, não aparência literal. A tradução FR absorve a ideia de uma matriz técnica que organiza navegação, conteúdo e movimento, mas a converte para a identidade Franco Romeu: luxo silencioso, tradição material, precisão financeira e engenharia inteligente. Nenhum texto, imagem, asset, palavra-marca, geometria 3D, composição proprietária ou cor de acento da referência será reutilizado.

### O que absorver conceitualmente

- **OBSERVADO na referência:** uma unidade modular governa malha, header, alinhamento e cenas (`design-tokens.json`, desktop/mobile, `--grid-block-size`; `layout-map.json`, `.section-grid`, `#header`). **Tradução FR:** criar uma régua estrutural própria e menos literal, usada para alinhamento e espaçamento, sem reproduzir células, contagens ou offsets da referência.
- **OBSERVADO:** contraste escuro, bordas finas inset e ausência quase total de raios (`design-tokens.json`, cores/shadows/radii; CSS `.s-border-*`). **Tradução FR:** superfícies `#121318` e `#043451` com filetes controlados em `#C8986A`, preservando geometria precisa e usando profundidade somente quando comunica seleção ou camada.
- **OBSERVADO:** hierarquia tipográfica muito leve e títulos com reveal vertical (`layout-map.json`, headings; CSS `.heading-reveal__inner`). **Tradução FR:** manter contraste entre títulos serenos e dados compactos, com família e escala próprias do produto; aplicar reveal apenas a narrativas editoriais, nunca a resultados financeiros essenciais.
- **OBSERVADO:** desktop usa pinning e mobile converte para fluxo vertical (`layout-map.json`, `#work-section`, `#services-section`). **Tradução FR:** experiências imersivas podem usar sticky progressivo no desktop; mobile deve priorizar continuidade, alcance de toque e ausência de bloqueio por scroll.
- **OBSERVADO:** WebGL/Three/canvas em tela cheia e avisos de stall (`dependencies.json`; `browser-console.json`). **Tradução FR:** 3D deve ser uma melhoria progressiva isolada em Projetos 3D, com fallback estático e orçamento explícito; não deve contaminar Portfólio, Ambientes ou o núcleo financeiro.
- **INFERIDO da referência:** a repetição modular cria sensação de precisão. **Tradução FR:** fazer a precisão nascer de alinhamento, ritmo, dados bem formatados e estados inequívocos — não da cópia da malha visual.

## O que não copiar

- Marca, wordmark, textos, contatos, nomes de projetos, rótulos e tom editorial da referência.
- Acentos verde-água `#57ded3`/`#43cabc`, paleta monocromática literal e combinação Montserrat/IBM Plex Mono como assinatura.
- Imagens, retrato, mockups, canvas, esfera/objeto central, modelos, shaders, ruído, ícones, assets ou sequências proprietárias.
- A malha de 75/53 px, suas contagens 18/6, offsets, alturas de 5400/2120/1325 px ou o desenho exato do header/footer.
- Código, classes, nomes de componentes, HTML, CSS ou JavaScript da referência. As evidências locais servem somente para pesquisa.
- Longas coreografias de scroll em telas financeiras, calculadora, busca, IQE ou qualquer fluxo em que o movimento atrase leitura, entrada ou confirmação.

## Tokens originais FR propostos

Os valores de cor abaixo são **DEFINIDOS PELOS GUARDRAILS FR**, não extraídos da referência. Escalas dimensionais e tipográficas finais permanecem **INDISPONÍVEIS** até inventário do FRANCOROMEU-APP e teste de integração; não serão inventadas nesta etapa.

| Token FR | Valor/direção | Origem e status |
| --- | --- | --- |
| `--fr-ink` | `#121318` | Guardrail FR; token original proposto. |
| `--fr-navy` | `#043451` | Guardrail FR; estrutura e superfícies institucionais. |
| `--fr-green` | `#165043` | Guardrail FR; estados positivos/ambientais, após validar contraste. |
| `--fr-wine` | `#8F1133` | Guardrail FR; ênfase institucional/alerta qualificado, sem substituir semântica existente. |
| `--fr-orange` | `#FC7016` | Guardrail FR; ação ou destaque raro, após validar contratos existentes. |
| `--fr-copper` | `#C8986A` | Guardrail FR; filetes, detalhes e calor material. |
| `--fr-wood` | `#693D22` | Guardrail FR; referência material e profundidade, uso contido. |
| `--fr-surface-grid` | derivado a validar | **INDISPONÍVEL:** requer contraste sobre superfícies reais do app. |
| `--fr-space-*` | preservar escala existente primeiro | **INDISPONÍVEL:** inventário da aplicação não faz parte desta captura. |
| `--fr-type-*` | preservar contratos atuais e definir após auditoria | **INDISPONÍVEL:** família/licença/escala FR atual não constam na captura. |
| `--fr-motion-standard` | curva/duração a validar em protótipo | **INDISPONÍVEL:** não copiar automaticamente `.22,1,.36,1` da referência. |

Princípios de tokenização:

1. Tokens semânticos (`surface`, `text`, `border`, `action`, `positive`, `warning`) devem apontar para a paleta FR; componentes não devem consumir hex diretamente.
2. A grade FR deve ser calculada a partir dos containers já existentes e não herdar 75/53 px.
3. Bordas e sombras devem expressar estrutura e foco, não decoração contínua.
4. `prefers-reduced-motion` deve eliminar pinning narrativo, stagger por letra, paralaxe e movimento 3D não essencial.
5. Dados financeiros mantêm contraste, ordem DOM e leitura imediata independentemente de tema, animação ou WebGL.

## Componentes FR originais

### Estrutura compartilhada

- `FRExperienceShell`: contêiner monolítico que ativa módulos por experiência sem alterar IDs ou contratos existentes. Inclui região de título, navegação contextual e slots de conteúdo.
- `FRPrecisionGrid`: camada CSS opcional e não interativa, com `pointer-events: none`, desenhada por gradientes/filetes próprios. Desligada em impressão, movimento reduzido, modo de alto contraste e superfícies densas de dados.
- `FRSectionMarker`: número, título e contexto em uma faixa compacta; sem copiar wordmark, posições ou rótulos da referência.
- `FRMaterialFrame`: moldura de filete em cobre/madeira para mídia e 3D, com cantos e proporções originais.
- `FRReveal`: utilitário restrito a `opacity`/`transform`, acionado por classe e `IntersectionObserver`; conteúdo já nasce disponível no DOM. Sem dependência nova por padrão.
- `FRDataRail`: faixa para métricas verificáveis, orçamento e estado; não usa stagger por caractere.

### Projetos 3D

- Cena 3D dentro de `FR3DViewport`, não em canvas global. Controles, legenda, estado de carregamento e fallback de imagem devem permanecer no mesmo módulo.
- `FR3DInspector` para material, dimensão, acabamento e variante, organizado por painéis semânticos FR.
- `FRSceneFallback` para dispositivos sem WebGL, preferência de dados reduzidos, falha de contexto ou limite térmico.
- Sticky pode ser usado somente para a narrativa do projeto em desktop; no mobile, viewport 3D seguido de controles em fluxo.
- **Decisão de dependência:** biblioteca 3D é **INDISPONÍVEL** até auditar o que a aplicação já usa. Não instalar Three/GSAP por semelhança com a referência.

### Portfólio

- `FRPortfolioIndex`: lista editorial com filtros existentes preservados, miniatura, tipologia, ambiente, materiais e ano.
- `FRPortfolioStage`: mídia principal com troca por clique/teclado, sem copiar mockups ou animação de galeria da referência.
- No desktop, alternar lista e detalhe com transição curta; no mobile, cartões em uma coluna e filtros em disclosure acessível.
- Integração com `fr-stage2-portfolio-engine` somente por adaptador visual: a fonte de dados, índices, IDs, ordenação e eventos permanecem intactos.

### Ambientes

- `FRAmbientNavigator`: matriz original de ambientes baseada na taxonomia real do app, com estados de foco, seleção e disponibilidade.
- `FRAmbientStory`: composição de imagem/descrição/material que pode adotar ritmo editorial, mas nunca atrasar preço, prazo, metragem ou ação principal.
- `FRAmbientSpecSheet`: painel de precisão para materiais, dimensões, compatibilidades e orçamento; segue DOM linear no mobile.
- Paleta contextual pode usar navy, green, copper e wood, sempre subordinada à semântica e ao contraste.

## Arquitetura de implementação

Manter HTML/JavaScript/CSS monolítico e autocontido. Os novos módulos devem ser namespaces CSS/JS isolados (`fr-...`) e ativados por atributos de experiência, evitando colisão com IDs e seletores atuais. JavaScript deve aprimorar conteúdo já utilizável em HTML; nenhuma informação financeira ou ação crítica pode depender de animação, canvas, import dinâmico ou CDN.

Fluxo recomendado:

```text
dados e contratos existentes
        ↓ (somente leitura/adaptação)
FRExperienceShell
  ├─ Projetos 3D → viewport isolado + fallback
  ├─ Portfólio   → fr-stage2-portfolio-engine preservado
  └─ Ambientes   → taxonomia e painéis existentes
        ↓
camada visual FR + motion progressivo
```

Este fluxo é especificação original. Não reproduz a árvore DOM, as classes ou a implementação da referência.

## Plano incremental

### Fase 0 — Baseline e proteção

1. Registrar hashes/snapshots dos arquivos e contratos que contêm FRBudgetCore, `fr-stage2-portfolio-engine`, calculadora, IQE, busca, IDs e índices.
2. Mapear seletores, eventos, storage, query params, funções globais, inputs/outputs e formatos financeiros consumidos por esses módulos.
3. Capturar testes de caracterização desktop/mobile antes de qualquer CSS novo: resultados, arredondamento, moeda, filtros, busca, navegação e persistência.
4. Definir budgets de CSS, JS, fontes, imagens e 3D a partir do baseline real. Os números são **INDISPONÍVEIS** nesta captura.

### Fase 1 — Tokens e shell sem mudança funcional

1. Introduzir tokens semânticos FR apontando inicialmente para os valores visuais já existentes onde necessário.
2. Adicionar `FRExperienceShell`, regiões e classes com namespace, sem mover ou renomear elementos protegidos.
3. Implementar temas de superfície e filetes FR somente em páginas de experiência.
4. Comparar snapshots e contratos financeiros; qualquer diferença funcional bloqueia avanço.

### Fase 2 — Portfólio

1. Aplicar `FRPortfolioIndex` e `FRPortfolioStage` por composição em torno do `fr-stage2-portfolio-engine`.
2. Preservar IDs, índices, filtros, ordem e payloads; adaptar somente apresentação.
3. Entregar navegação teclado, foco visível, alt text e fluxo mobile antes de motion.
4. Adicionar transições discretas com feature flag e fallback imediato.

### Fase 3 — Ambientes

1. Materializar `FRAmbientNavigator`, story e ficha técnica sobre a taxonomia existente.
2. Validar contraste da paleta FR, densidade de informação e leitura a 200% de zoom.
3. Testar integração com busca, IQE e calculadora sem duplicar fontes de verdade.

### Fase 4 — Projetos 3D

1. Auditar dependências existentes; reutilizar engine presente se compatível. CDN só se indispensável, com versão fixada, integridade, política de falha e aprovação.
2. Implementar canvas isolado, carregamento sob demanda, descarte de contexto/recursos e fallback estático.
3. Pausar renderização fora do viewport, com documento oculto, bateria/temperatura adversa quando detectável e movimento reduzido.
4. Instrumentar tempo de interação, memória, falhas de contexto e regressão visual em hardware representativo.

### Fase 5 — Motion e refinamento

1. Introduzir `FRReveal` apenas em títulos editoriais e mídia.
2. Proibir animação de valores, totais, inputs, mensagens de erro e confirmação financeira.
3. Validar `prefers-reduced-motion`, teclado, leitores de tela e navegação por âncora.
4. Remover flags somente após regressão completa dos módulos protegidos.

## Testes e critérios de aceite

### Desktop e mobile

- Matriz mínima de larguras deve incluir os dois pontos observados (390 e 1440 px) e pontos de quebra reais da aplicação, a descobrir; não assumir os breakpoints da referência.
- Sem overflow horizontal, salto de layout ou áreas sticky que aprisionem scroll.
- Orientação landscape, zoom 200%, fonte ampliada e teclado virtual não podem ocultar CTAs ou resultados.
- Fallback sem JavaScript mantém navegação, conteúdo essencial e resultados já renderizáveis.

### Acessibilidade

- WCAG aplicável: contraste de texto/controles, foco visível, ordem DOM, headings, nomes acessíveis, estados/erros anunciados e alvos de toque adequados.
- Não usar cor como único indicador financeiro; positivos, alertas e erros exigem texto/ícone/estado.
- `prefers-reduced-motion: reduce` remove reveals, staggers, pinning e rotação/zoom 3D não essenciais.
- Canvas possui nome, descrição, alternativa estática e controles acessíveis fora do bitmap.
- Galerias respondem a teclado e não sequestram setas/scroll sem instrução.

### Desempenho

- Comparar baseline e candidato para tamanho transferido, CSS/JS executado, LCP, INP, CLS, memória e energia; limites numéricos serão definidos após medição do app.
- 3D carrega sob demanda, não bloqueia conteúdo, reduz resolução adaptativamente e libera texturas/buffers/listeners ao sair.
- Evitar `ReadPixels` no caminho de renderização contínua; a referência registrou stalls desse tipo em `browser-console.json`.
- Nenhuma biblioteca nova apenas para reveal, stagger ou sticky; CSS, Web Animations API e `IntersectionObserver` são suficientes salvo prova em contrário.

### Regressão funcional e visual

- Golden tests para cálculos, moeda, arredondamento, índices, IQE e orçamentos.
- Snapshots por experiência/tema/viewport e estados vazio, loading, erro, parcial e completo.
- Testes de filtros, busca, deep links, histórico, persistência, exportação/compartilhamento existentes e retorno do browser.
- Testes de coexistência: desligar CSS/motion/3D novo deve restaurar apresentação-base sem alterar dados ou contratos.

## Checklist explícito de proteção do FRBudgetCore

- [ ] Não renomear, remover, duplicar ou reordenar IDs consumidos pelo FRBudgetCore.
- [ ] Não alterar `name`, `value`, `data-*`, índices, tipos de input ou ordem de serialização sem teste contratual e aprovação.
- [ ] Não modificar fórmulas, constantes, arredondamento, precisão decimal, formatação monetária, impostos, descontos ou regras de elegibilidade.
- [ ] Não mudar assinaturas, retornos, eventos, callbacks, globals, storage keys, query params ou payloads financeiros.
- [ ] Não mover o FRBudgetCore para dentro de canvas, shadow DOM, iframe ou ciclo de animação.
- [ ] Não condicionar cálculo, atualização ou confirmação a `transitionend`, `animationend`, scroll, WebGL ou disponibilidade de CDN.
- [ ] Não ocultar totais, erros ou confirmações atrás de reveal/stagger; conteúdo financeiro deve aparecer imediatamente.
- [ ] Garantir que `prefers-reduced-motion`, falha de JS visual e falha de WebGL não alterem valores nem bloqueiem ações.
- [ ] Executar golden tests antes/depois com os mesmos fixtures e comparar valores exatos, não apenas screenshots.
- [ ] Validar locale, separadores, moeda, casas decimais e arredondamento em desktop/mobile.
- [ ] Preservar integrações com calculadora, IQE, busca, `fr-stage2-portfolio-engine`, IDs, índices e contratos financeiros.
- [ ] Isolar CSS novo sob namespace FR e auditar especificidade contra seletores do FRBudgetCore.
- [ ] Isolar listeners novos; não interceptar `input`, `change`, `submit`, teclado ou pointer usados pelo núcleo.
- [ ] Manter rollback por feature flag/camada removível e registrar baseline antes da integração.
- [ ] Bloquear release diante de qualquer diferença de cálculo, contrato, serialização, foco, anúncio de erro ou navegação crítica.

## Riscos e decisões pendentes

- **INDISPONÍVEL:** tokens, componentes e dependências atuais do FRANCOROMEU-APP, pois este trabalho foi restrito à captura de referência. Eles devem ser auditados antes da implementação.
- **INDISPONÍVEL:** necessidade real de biblioteca 3D, CDN, família tipográfica nova ou curvas/durações finais.
- **INFERIDO:** uma camada de grade muito presente pode competir com plantas, renders e números; por isso a proposta FR a torna contextual e removível.
- **INFERIDO:** pinning prolongado é inadequado para tarefas financeiras; deve ficar restrito à narrativa visual não crítica.
