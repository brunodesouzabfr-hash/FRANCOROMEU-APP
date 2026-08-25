# Franco Romeu — Etapa 16

## Contrato mestre de implementação

**Projeto:** Franco Romeu (ꟻR) — Forjada Resistência · Arte + Engenharia  
**Base canônica informada:** branch `codex/etapa-15-materialidade-imersiva`  
**Escopo:** corrigir interações críticas e construir uma nova experiência para Portfólio e Ambientes, preservando todo contrato funcional da aplicação.  
**Modo de trabalho:** local, sem API, sem automação externa, sem deploy e em checkpoints reversíveis.

## Resultado pretendido

A Etapa 16 deve parecer uma evolução inevitável da FR, não uma colagem de sites de referência. O visitante deve perceber:

1. precisão técnica antes do efeito visual;
2. matéria, escala, movimento e narrativa com assinatura FR;
3. Portfólio como arquivo vivo de projetos, processo, conhecimento e mídia;
4. Ambientes como curadoria utilizável, com decisão técnica e ligação real à calculadora;
5. Projeto 3D como objeto manipulável, acessível e útil;
6. conteúdo institucional e educacional capaz de orientar uma conversa comercial sem pressão enganosa.

## O que muda

- Correção definitiva do cursor em popups, overlays e componentes interativos.
- Arraste real do cubo 3D no desktop e interação compatível com toque/teclado.
- Evolução futura do cubo para faces de projeto e painel lateral em progressão dupla, sem perder o cubo atual.
- Reimaginação completa da aba Portfólio com:
  - abertura espacial/espiral original;
  - arquivo horizontal de projetos;
  - conteúdo técnico e antes/depois verificável;
  - no meio da página, um arquivo social horizontal com embeds substituíveis;
  - encerramento institucional e CTA para diagnóstico/orçamento.
- Restauração da base canônica de Ambientes e evolução sobre ela:
  - hero original;
  - fonte `AMB_STYLES` preservada;
  - lista editorial minimalista;
  - prévia visual;
  - dossiê imersivo em tela cheia;
  - serviços compatíveis enviados à calculadora pelo contrato existente.

## O que não muda

- Home, Sobre e Orçamento não recebem redesign nesta etapa.
- O hero e a rota de Projetos 3D permanecem; somente a interação do objeto e seu dossiê evoluem.
- A tela de entrada de cada aba não pode desaparecer por efeito, loading, canvas ou transição. O conteúdo-base deve existir antes da melhoria visual.
- Nenhum cálculo, fórmula, arredondamento, moeda, serviço, ID, índice, storage, query param, evento ou payload financeiro pode mudar.
- Nenhuma imagem de referência será apresentada como obra da FR.
- Nenhum logo, texto, código, asset, paleta, shader ou composição proprietária dos sites pesquisados será copiado.

## Fonte de verdade e ordem de leitura

O agente deve ler nesta ordem:

1. `AGENTS.md` do repositório;
2. este arquivo;
3. `HTML-AUDIT-ETAPA15.md`;
4. `REFERENCE-MAP.md`;
5. `references/INDEX.md` e os relatórios curados existentes;
6. `CONTENT-BLUEPRINT.md`;
7. `EMBED-CONTRACT.md`;
8. `ETHICAL-CRO-POLICY.md`;
9. `REGRESSION-CHECKLIST.md`;
10. o HTML e o histórico Git reais.

Se o repositório contradizer este brief, o agente deve registrar a divergência e parar antes de alterar código.

## DNA visual FR

### Paleta preservada

Não fazer substituição global de hex. A Etapa 15 contém aliases históricos que precisam ser preservados até auditoria de contraste e contratos CSS.

| Papel | Token/direção | Valor atual de referência FR |
| --- | --- | --- |
| Carbono | fundo e profundidade | `#121318` |
| Azul petróleo | estrutura institucional | `#043451` |
| Verde profundo | atmosfera e superfície | `#0A2F26` |
| Verde escuro | estado e arquitetura | `#165043` / alias atual `#123F34` |
| Laranja FR | ação e energia | `#FC7016` |
| Laranja legado | compatibilidade Etapa 15 | `#FF6B00` |
| Ouro | precisão e detalhe raro | `#F6A700` |
| Bordô | arquivo, tensão e contraste | `#8F1133` |
| Cobre/couro | materialidade | `#C8986A` |
| Madeira | calor e profundidade | `#693D22` |
| Osso | texto claro | `#E6D6B5` |

Regras:

- preservar os aliases existentes e criar tokens semânticos `--fr16-*` que apontem para eles;
- usar laranja/ouro como acento, não como fundo constante;
- não importar verde-neon, ciano ou paleta de qualquer referência como assinatura principal;
- ciano já existente em Projetos 3D pode permanecer como linguagem técnica local, sem contaminar o restante do site;
- validar contraste de texto, foco e controles antes de aprovar qualquer composição.

### Tipografia preservada

- `Stardos Stencil`: títulos de assinatura e numeração monumental.
- `Rokkitt`: narrativa, explicação e corpo editorial.
- `Share Tech Mono`: metadados, índices, medidas, estados e instruções.
- `Rock Salt`/família carregada equivalente: gesto raro e humano; nunca em texto longo.

Não adicionar outra família apenas para imitar a referência. Não animar texto letra por letra de forma ilegível. Não usar efeito “criptografia”.

### Linguagem espacial

- filetes precisos, grandes áreas de respiro, grids assimétricos e poucos raios;
- profundidade obtida por escala, opacidade, material e movimento, não por excesso de glow;
- animação deve explicar estado ou percurso;
- qualquer efeito tem fallback estático e respeita `prefers-reduced-motion`;
- canvas é atmosfera, nunca fonte de conteúdo, navegação ou CTA.

## DNA verbal FR

### Voz

Elegante, direta, autoral, técnica e sensorial. A FR explica o invisível da obra sem transformar conhecimento em jargão vazio. O texto deve ligar decisão, matéria, execução e vida cotidiana.

### Frases canônicas ou aprovadas no material fornecido

- “Arquitetura é a linguagem que você escolhe para viver.”
- “Juntos, construiremos o décimo terceiro estilo. O seu.”
- “O erro está nos milímetros que você não vê.”
- “Forjada Resistência · Arte + Engenharia.”

### Novas linhas editoriais propostas

- “Antes da superfície, resolvemos o sistema.”
- “Matéria, medida e método.”
- “Transformar é compatibilizar desejo e realidade.”
- “O projeto antecipa a obra para que a obra não improvise o projeto.”
- “Cada escolha visível depende de uma decisão que quase ninguém vê.”

Essas novas linhas são rascunhos de conteúdo, não claims de desempenho.

### Termos a evitar por posicionamento

Não usar: “barato”, “desconto”, “preço justo”, “facinho”, “obra simples”, “promoção”. Não prometer economia, prazo, durabilidade, garantia, valorização ou resultado sem prova e condições explícitas.

## Arquitetura funcional protegida

Os seguintes contratos são invioláveis até que testes demonstrem equivalência:

- `window.FRBudgetCore`;
- `window.__frCore` e evento `frCoreReady`;
- `SERVICES`, `appState`, `saveAndRender`, `renderApp`;
- `fr-stage2-portfolio-engine`;
- `window.openProjectModal` e `window.closeProjectModal`;
- `GM_PROJECTS`, `FR_DEFAULT_PROJECTS`, `PROJ_CAT_LABELS`;
- `AMB_STYLES` e seus `service.id`;
- `switchView` e IDs `view-*`;
- calculadora, IQE, busca, administração e exportação;
- chaves de `localStorage`/`sessionStorage` e formatos monetários;
- controles, nomes, `data-*`, ordem de serialização e IDs consumidos por listeners.

Nenhuma camada `fr16` pode duplicar uma fonte de verdade. Ela deve adaptar os dados existentes.

## Estratégia técnica

### Regra de isolamento

- CSS novo sob `#view-projetos.fr16-*`, `#view-ambientes.fr16-*`, `#view-projetos3d.fr16-*` ou classes `fr16-*`.
- JavaScript novo atrás de uma sentinela como `window.__FR_STAGE16__`.
- Um registro explícito de flags permite desligar cada universo separadamente.
- O HTML sem a camada `fr16` volta à apresentação Etapa 15/canônica, sem alterar dados.
- Não instalar Three.js, GSAP, framework, bundler ou dependência nova por padrão.
- Reutilizar DOM, Canvas 2D, CSS e APIs nativas já disponíveis.

### Flags mínimas

```js
window.FR_STAGE16_FLAGS = {
  cursorUnified: true,
  cubeDrag: true,
  cubeNarrativeScroll: false,
  portfolioUniverse: true,
  socialArchive: true,
  ambientesCanonical: true,
  ambientesDossier: true
};
```

O valor `false` de `cubeNarrativeScroll` é intencional: primeiro corrigir o arraste e validar o cubo atual; depois liberar a coreografia de duplo scroll em checkpoint separado.

## Portfólio — arquitetura de página

### Seção 1 — Órbita de transformações

- Primeiro viewport com título, tese FR e instrução de interação imediatamente legíveis.
- Campo de partículas/quadros em espiral no fundo, Canvas 2D progressivo, usando petróleo, ouro, cobre e bordô FR.
- O canvas reage suavemente ao progresso da galeria e pausa fora do viewport, com documento oculto, economia de dados e movimento reduzido.
- Um trilho horizontal de projetos usa `GM_PROJECTS`/`FR_DEFAULT_PROJECTS`; cards continuam abrindo `openProjectModal`.
- Desktop: scroll vertical pode dirigir deslocamento horizontal em uma seção sticky finita, com entrada e saída claras. Arraste, roda, setas e teclado continuam disponíveis.
- Mobile: fluxo horizontal com `scroll-snap` ou cards verticais; nenhuma captura de scroll vertical.

### Seção 2 — O invisível da obra

Uma faixa editorial conecta projetos a decisões: levantamento, compatibilização, sequência, materialidade, iluminação, marcenaria e execução. Conteúdo no DOM, sem canvas.

### Seção 3 — Arquivo social

- Side-scrolling visualmente distinto da abertura, no meio da página.
- Estrutura de cards baseada em grid editorial próprio FR.
- Provedores previstos: Instagram, TikTok, Facebook, YouTube, Pinterest e X.
- Estado inicial é um card local de demonstração, claramente rotulado. Embeds reais são ativados apenas quando URLs/IDs oficiais forem preenchidos e o visitante solicitar o carregamento.
- Manutenção acontece em um único registro de dados; nenhum `iframe` espalhado pelo HTML.

### Seção 4 — Antes, projeto, execução

- Só exibir “antes e depois” quando as duas imagens pertencem ao mesmo projeto e têm direitos/status verificados.
- Até haver prova, renderizar “modelo editorial” ou “referência conceitual”; nunca simular case real.
- Estrutura narrativa: condição inicial → decisão → interferência técnica → solução → resultado verificável.

### Seção 5 — Método e decisão

Explicar como a FR trabalha e comparar modalidades de serviço por entregável, escopo, momento indicado e variáveis de preço. Valores numéricos só entram com região, data, fonte e aprovação.

### Seção 6 — CTA

Uma ação primária: iniciar diagnóstico/orçamento. Uma ação secundária possível: explorar Ambientes. Sem urgência sintética.

## Projetos 3D — cubo e progressão dupla

### Checkpoint imediato

- Implementar arraste real com `pointerdown`, `setPointerCapture`, `pointermove`, `pointerup` e `pointercancel`.
- Durante arraste, remover transição que cria atraso.
- Preservar rotação automática somente quando não há interação, a seção está ativa e movimento reduzido está desligado.
- Teclado: setas horizontais e verticais; instrução acessível.
- Mobile: gesto horizontal gira; gesto vertical continua rolando a página até que intenção horizontal seja confirmada.

### Checkpoint posterior — narrativa por faces

- Cada projeto ocupa um estado/face lógica; a geometria física continua com seis faces, mas a lista pode ter mais itens por ciclos indexados.
- Primeiro trecho de scroll/roda/arraste leva à face seguinte e atualiza título/dados.
- Segundo trecho abre/avança um drawer lateral com grid editorial e detalhes do projeto.
- Após o fim do drawer, o scroll da página é liberado naturalmente.
- Deve existir indicador “face N de M / painel etapa X de Y”, botão pular/fechar e alternativa sem sticky.
- Não criar scroll infinito sem saída nem sequestrar a roda em toda a página.

## Ambientes — restauração e evolução

### Base a restaurar

- `.amb-hero` original;
- `.amb-museum`;
- `#amb-grid-container`;
- ticker e manifesto existentes quando aprovados;
- array global `AMB_STYLES` como fonte única.

A Etapa 15 esconde essa base ao adicionar `.fr15-amb-ready`. A Etapa 16 deve desligar essa substituição de forma reversível, não apagar `AMB_STYLES` nem reconstruir os serviços.

### Nova experiência

- Manter o hero canônico como tela de entrada.
- Converter a grade/lista em índice editorial de 12 linguagens, com muito respiro e hierarquia suíça reinterpretada pela FR.
- Desktop: lista de títulos e prévia sticky; seleção por hover/foco apenas antecipa, clique confirma.
- Mobile: accordion ou lista sequencial; conteúdo essencial nunca depende de hover.
- Clique abre dossiê em tela cheia/drawer com:
  1. galeria autorizada/referencial rotulada;
  2. conceito e melhor aplicação;
  3. materialidade e iluminação;
  4. decisões e riscos de execução;
  5. serviços compatíveis vindos dos IDs atuais;
  6. variáveis que alteram orçamento;
  7. CTA “Adicionar soluções à calculadora”.
- O CTA usa a ponte `window.__frCore`; não reimplementa cálculo.
- O drawer preserva foco, Escape, retorno ao acionador, scroll interno e cursor funcional.

## Conteúdo, serviços e valores

- Conteúdo novo está especificado em `CONTENT-BLUEPRINT.md`.
- Itens educacionais devem separar fato, recomendação e variável de projeto.
- Termos técnicos não substituem visita, projeto, ART/RRT, laudo, fabricante ou norma aplicável.
- Faixas de preço permanecem ocultas enquanto `status !== "verified"`.
- Toda faixa precisa de cidade/região, mês/ano, escopo, unidade, inclusões, exclusões e responsável pela aprovação.
- Comparações devem normalizar escopo e total; não usar preço partido para esconder custo.

## Método editorial e de conversão

Os nomes `/ux-copy`, `/brand-review`, `/customer-research`, `/system-design`, `/architecture`, `/code-review`, `/research-synthesis`, `/ihc-script`, `/hook-generator`, `/storytelling-flow`, `/carousel-builder`, `/emotional-copy`, `/objection-breaker`, `/conversion-rate-optimization`, `/dark-patterns-audit`, `/micro-copy-tuner`, `/offer-stack-builder` e equivalentes são tratados aqui como **checklists/metodologias**, não como ferramentas instaladas.

Aplicar:

- clareza da jornada e do próximo passo;
- IHC quando houver história verdadeira: identificação → história → conteúdo;
- objeções respondidas com escopo, processo, evidência e limites;
- progressão de valor transparente;
- uma CTA principal por seção;
- prova social apenas autorizada e atribuída;
- revisão de padrões obscuros antes do aceite.

Não aplicar táticas listadas como proibidas em `ETHICAL-CRO-POLICY.md`.

## Checkpoints obrigatórios

### Checkpoint 0 — auditoria, sem alterações

- confirmar branch, arquivo canônico e hash;
- ler `AGENTS.md`;
- inventariar conflitos/alterações locais;
- mapear contratos globais, IDs, eventos, storage e módulos;
- localizar testes/comandos de execução existentes;
- produzir plano de arquivos a tocar e risco por arquivo;
- parar para aprovação.

### Checkpoint 1 — baseline e correções de interação

- capturas antes em desktop/mobile de cada aba;
- teste de caracterização do orçamento e rotas;
- cursor unificado;
- drag real do cubo;
- foco/Escape/retorno de popups;
- smoke mobile;
- parar para revisão e commit.

### Checkpoint 2 — modelo de conteúdo e adaptadores

- registros inline/estruturados para conteúdo, embeds e pricing;
- validação de provider, URL, status de direitos e status de preço;
- nenhum redesign ainda;
- parar para revisão e commit.

### Checkpoint 3 — abertura e arquivo do Portfólio

- nova abertura espacial;
- galeria horizontal ligada aos dados atuais;
- modal atual preservado;
- fallback e reduced motion;
- parar para revisão e commit.

### Checkpoint 4 — arquivo social e conteúdo editorial

- cards placeholder;
- loader consentido de embeds;
- seções técnicas, processo e antes/depois verificado;
- parar para revisão e commit.

### Checkpoint 5 — Ambientes canônico + dossiê

- restaurar base original;
- índice/lista e prévia;
- dossiê e ligação à calculadora;
- parar para revisão e commit.

### Checkpoint 6 — narrativa avançada do cubo

- implementar progressão face → drawer somente depois do arraste aprovado;
- validar roda, teclado, toque e saída da seção;
- parar para revisão e commit.

### Checkpoint 7 — regressão final

- executar `REGRESSION-CHECKLIST.md` completo;
- `/review` ou revisão equivalente do diff;
- corrigir achados altos/médios;
- relatório final com arquivos, testes, limitações e rollback;
- ainda sem push/merge/deploy automático.

## Critérios de pronto

- Nenhuma regressão no orçamento, IQE, busca, navegação, persistência ou modal de projeto.
- Cursor visível ou cursor nativo adequado em todos os overlays no desktop; cursor nativo no mobile/coarse pointer.
- Cubo arrastável com mouse, toque intencional e teclado.
- Portfólio funciona sem canvas, sem animação e sem embed externo.
- Ambientes usa `AMB_STYLES` e IDs de serviço atuais.
- Embeds são substituíveis em um único registro, lazy e consentidos.
- Nenhuma alegação, case, valor, depoimento ou escassez inventada.
- Nenhum asset ou código de referência copiado.
- Desktop, tablet, mobile, zoom 200%, reduced motion e teclado aprovados.
- Rollback por flag ou remoção da camada `fr16` comprovado.

