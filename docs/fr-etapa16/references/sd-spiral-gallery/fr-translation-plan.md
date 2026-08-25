# Plano de tradução original para o FRANCOROMEU-APP

## Condição obrigatória antes de implementar

Este documento é especificação, não autorização para alterar a aplicação. **Antes de qualquer implementação**, auditar a aba real e congelar baseline visual e funcional em desktop e mobile: tela inicial, primeira dobra, identidade, controles, animações, caminho de entrada, foco, scroll, seleção, estado, IDs, índices e contratos. Sem esse baseline aprovado, a implementação fica bloqueada.

A nova experiência deve ser aditiva: depois da entrada existente ou aberta por ação explícita. Nunca substituir a primeira dobra atual. Fechar, cancelar, usar `Escape`, navegar de volta ou ocorrer erro deve restaurar elemento focado, posição de scroll, seleção e estado anterior.

## O que absorver conceitualmente

- **Palco espacial com UI contida** — OBSERVADO no desktop: canvas fixo de viewport inteiro sob hero editorial e chrome fixo (`layout-map.json`, 1440×900, canvas/hero/header/footer). Traduzir como modo de exploração opcional, não como home.
- **Hierarquia por profundidade** — OBSERVADO: z-index 0/30/50 (`layout-map.json`, desktop). Traduzir em três camadas sem reutilizar os números: cena, narrativa/contexto, controles críticos.
- **Foco editorial** — OBSERVADO: uma headline dominante e um CTA central (`layout-map.json`, desktop, `.hero`). Traduzir em poucas decisões por quadro, com nomenclatura e conteúdo FR.
- **Ação compacta com alvo claro** — OBSERVADO: botão de 55px e ícone de 40px (`layout-map.json`, desktop). Traduzir em controles originais, com alvo mínimo acessível e estados completos.
- **Fallback explícito** — OBSERVADO no mobile, embora insuficiente: experiência substituída por estado não suportado (`layout-map.json`, 390×844). Absorver a ideia de degradação, mas oferecer conteúdo e navegação equivalentes no FR.

## O que não copiar

- Família Jaguar, textos, assinatura, nomes, imagens WebP, composição exata, geometria espiral, ícone rotacionado e identidade da referência.
- Valores distintivos como H1 de 92.8px, grid de 1002.48px e CTA de 184.14px como receita visual.
- Bloqueio mobile sem alternativa funcional.
- Dependência Three.js por imitação. Só adotar biblioteca após prova de indispensabilidade e orçamento de desempenho.
- Transições genéricas `all`, parâmetros 3D desconhecidos ou qualquer comportamento não comprovado.
- Assets e recursos brutos da captura; permanecem material local de pesquisa.

## Tradução para tokens e componentes originais FR

### Tokens FR propostos

Os valores abaixo são decisões de marca, **não tokens observados da referência**. Usar a paleta-base já mandatória: `#043451`, `#165043`, `#8F1133`, `#FC7016`, `#C8986A`, `#693D22`, `#121318`. Definir papéis semânticos após teste de contraste: `fr-surface-deep`, `fr-surface-heritage`, `fr-action-primary`, `fr-accent-copper`, `fr-text-on-dark`, `fr-focus-ring`.

Tipografia: preservar as famílias atuais do FRANCOROMEU-APP no baseline; criar papéis `fr-display-immersive`, `fr-title-context`, `fr-label-control` sem importar Jaguar. Espaçamento, raios, sombras e motion devem derivar da escala FR existente. Se ela não existir, defini-la somente após inventário da aplicação real — nenhuma escala numérica nova é afirmada nesta fase.

Motion: usar propriedades específicas, nunca `transition: all`; oferecer `prefers-reduced-motion`, pausa e alternativa estática. Duração e easing permanecem **INDISPONÍVEIS** na captura (`animations.json`) e deverão ser calibrados por protótipo e teste, não copiados.

### Componentes originais

1. `FRExperienceLauncher`: ação explícita inserida após a entrada atual; descreve custo/objetivo e mantém fallback.
2. `FRImmersiveShell`: dialog/modal de tela ampla ou rota interna reversível, com título acessível, fechar persistente e captura/restauração de estado.
3. `FRSpatialStage`: adaptador de renderização desacoplado do domínio; canvas opcional, fallback DOM e tratamento de context loss.
4. `FRNarrativeRail`: conteúdo FR em HTML semântico, navegável por teclado e independente do canvas.
5. `FRSceneControls`: anterior/próximo, índice, pausa e saída, com estados de foco, loading, erro e reduced motion.
6. `FRAssetLoader`: carregamento sob demanda, abortável, com limite de memória e placeholders próprios.
7. `FRStaticFallback`: lista/cartões equivalentes em mobile, hardware limitado, falha WebGL ou preferência por movimento reduzido.

## Aplicação modular por experiência

### Projetos 3D

Após a primeira dobra e o caminho de entrada existentes, oferecer “Explorar modelo” por projeto. A experiência adicional pode apresentar pontos de decisão técnicos e materiais FR, mantendo calculadora, orçamento e contratos fora do ciclo de renderização. Fallback: vistas estáticas e ficha técnica completa em DOM.

### Portfólio

Adicionar “Percurso curado” após o portfólio já apresentado. A navegação espacial organiza projetos por relação editorial própria da FR, enquanto índice, busca e filtros atuais continuam como fonte de verdade. Ao sair, restaurar projeto selecionado, filtros, índice, foco e scroll.

### Ambientes

Adicionar “Navegar pelo ambiente” a partir de uma seleção explícita. Usar hotspots semânticos para materiais e soluções; nenhum hotspot pode ser a única forma de acessar informação. Fallback: sequência de imagens FR autorizadas e painel de especificações.

## Plano incremental, reversível e condicionado ao baseline

1. **Auditoria sem alterações**: mapear monólito, entradas das três abas, IDs, listeners, globals, armazenamento, foco/scroll e contratos do FRBudgetCore, `fr-stage2-portfolio-engine`, calculadora, IQE e busca. Capturar baselines desktop/mobile e estados de entrada/saída.
2. **Contrato de isolamento**: documentar namespaces, eventos permitidos, ownership do canvas, limites de memória e snapshot/restore. Criar feature flag desligada por padrão e kill switch.
3. **Shell DOM estático**: inserir launcher abaixo da entrada atual e implementar shell, focus trap, `Escape`, histórico e restauração, sem motor 3D.
4. **Fallback primeiro**: entregar narrativa e navegação completas em HTML, incluindo mobile e reduced motion. Validar equivalência de conteúdo.
5. **Spike de renderização isolado**: testar Canvas/WebGL nativo antes de considerar Three.js via CDN. A biblioteca só entra se reduzir risco/custo de forma demonstrável; versionar, aplicar integridade quando viável e manter fallback.
6. **Integração por módulo**: ativar separadamente em Projetos 3D, Portfólio e Ambientes, sem reorganizar a primeira dobra. Qualquer reorganização abaixo dela deve preservar dados/funções e ter mapeamento antes/depois e rollback.
7. **Canário e rollback**: liberar por feature flag, medir erros, long tasks, memória, perda de contexto e conclusão; rollback é desativar flag e remover launcher sem migração de dados.

## Testes de aceitação

### Desktop e mobile

- Regressão visual da entrada de cada aba nos baselines aprovados; tolerância definida antes do teste.
- Viewports de baseline, 1024px, 1025px, orientação, zoom 200%, resize e densidades distintas.
- Abrir/fechar/reabrir; back/forward; scroll anterior; filtros/seleção; múltiplas aberturas; carregamento lento; offline; falha de asset e context loss.
- Mobile deve manter conteúdo, navegação e saída funcionais mesmo sem canvas.

### Acessibilidade

- Ordem DOM coerente, título e nome acessível, landmarks, foco visível, trap apenas enquanto aberto e retorno ao invocador.
- Teclado completo, `Escape`, leitores de tela, contraste de todos os papéis FR e alvos de toque adequados.
- `prefers-reduced-motion`, pausa de movimento, ausência de autoplay indispensável e fallback equivalente.
- Canvas com descrição textual e conteúdo informacional duplicado em DOM semântico.

### Desempenho

- Lazy-load somente após ação; nenhum custo 3D no carregamento inicial das abas.
- Orçamentos mensuráveis definidos após baseline: JS adicional, bytes de imagem, tempo de inicialização, FPS, memória e long tasks.
- Limitar resolução por DPR/capacidade; descarregar listeners, RAF, texturas e contexto ao fechar.
- Evitar leitura síncrona de pixels no loop. A captura registrou stall de GPU associado a `ReadPixels` (`browser-console.json`, desktop), portanto criar teste específico para esse risco.

### Regressão funcional

- Testes de contrato antes/depois para orçamento, cálculo, IQE, busca, IDs, índices, deep links, persistência e eventos globais.
- Detectar colisão de IDs, estilos, z-index, atalhos, globals e listeners.
- Comparar snapshots de estado antes de abrir e após fechar a experiência.

## Checklist explícito de proteção do FRBudgetCore

- [ ] Baseline de todos os cenários financeiros gravado antes de alterar HTML/CSS/JS.
- [ ] `FRBudgetCore` não é renomeado, movido, sombreado, reordenado nem reimplementado.
- [ ] IDs, índices, contratos, formatos, precisão, arredondamento e ordem de cálculo permanecem idênticos.
- [ ] `fr-stage2-portfolio-engine`, calculadora, IQE e busca mantêm assinaturas, eventos e fonte de dados.
- [ ] Experiência adicional usa namespace próprio e não escreve em estado financeiro.
- [ ] Nenhum listener, RAF ou erro do canvas bloqueia submit, input, busca ou cálculo.
- [ ] Abrir/fechar preserva valores de formulário, seleção, foco, scroll e histórico.
- [ ] Testes golden com entradas/saídas financeiras passam sem diferenças.
- [ ] Feature flag e kill switch removem a experiência sem migração nem perda de dados.
- [ ] Rollback testado em desktop/mobile antes da ativação.
- [ ] Revisão manual confirma primeira dobra, identidade, controles, animações e caminho de entrada intactos em cada aba.

