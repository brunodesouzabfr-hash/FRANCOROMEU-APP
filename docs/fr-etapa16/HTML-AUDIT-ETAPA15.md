# Auditoria dirigida — HTML Etapa 15

## Artefato auditado

- Arquivo fornecido: `FRANCO_ROMEU_ETAPA15_MATERIALIDADE_IMERSIVA.html`
- Tamanho observado: 1.119.411 bytes
- Linhas observadas: 15.910
- SHA-256: `5fd200a1d29f68817488fde432033e0602b87b757735d33e0eec612ca00551bf`

O hash serve apenas para identificar o anexo auditado. O Codex deve calcular o hash do arquivo real no repositório e registrar se é idêntico ou divergente.

## Arquitetura encontrada

O arquivo é monolítico e contém várias camadas históricas. A Etapa 15 é um aprimoramento tardio, não a única implementação:

- `window.FRBudgetCore` é exposto no núcleo financeiro;
- `window.__frCore` é a ponte usada por módulos posteriores;
- `fr-stage2-portfolio-engine` expõe `openProjectModal`;
- `AMB_STYLES` é definido muito antes da Etapa 15 e permanece como fonte de verdade;
- Etapas 8, 9 e posteriores sobrepõem cursor, transições e universos;
- a Etapa 15 começa no bloco CSS `fr-stage15-materialidade-css` e no motor `fr-stage15-materialidade-engine`.

Por isso, mudanças globais ou substituições por busca/replace são de alto risco.

## Achado 1 — cursor desaparece em popups

### Evidência

1. Há uma regra global antiga que aplica `cursor: none !important` a todos os elementos e pseudoelementos.
2. O motor ativo observado movimenta `#cursor-dot` e `#cursor-ring` antigos.
3. Camadas posteriores ocultam pelo menos parte desse cursor antigo e introduzem `#fr8-cursor-dot`, `#fr8-cursor-ring` e `#fr8-cursor-label`.
4. Não foi encontrado, no anexo, um motor equivalente que mova os elementos `fr8` e ative consistentemente `body.fr8-cursor-active`.
5. Os overlays da Etapa 15 usam `z-index` aproximadamente `12040–12050`; o cursor `fr8` usa `10001–10002`. Mesmo que visível, ele fica atrás desses overlays.

### Causa provável

Há dois sistemas de cursor parcialmente sobrepostos: o sistema que recebe eventos não é o mesmo que permanece visualmente disponível em todas as camadas. O cursor nativo está globalmente proibido, então a falha do cursor customizado deixa o usuário sem indicação.

### Correção exigida

- consolidar um único `FRCursorController`;
- ativar ocultação do cursor nativo somente em `hover:hover` + `pointer:fine` e depois do controlador estar pronto;
- nunca ocultar cursor nativo em touch/coarse pointer;
- preservar `cursor:text` em campos editáveis e `cursor:auto` como fallback de modal;
- mover um único root visual, com `pointer-events:none`, acima dos overlays autorizados;
- ao abrir/fechar modal, manter o controlador vivo e atualizar rótulo/estado;
- remover ou neutralizar listeners/DOM duplicados sem quebrar estilos legados;
- testar projeto, Ambientes, IQE, assistente, busca, God Mode e modal de orçamento.

### Aceite

- desktop: ponteiro sempre identificável sobre backdrop, painel, close, botões, inputs e links;
- teclado: nenhum conteúdo depende do cursor;
- mobile: nenhum círculo artificial segue o toque;
- fechar popup restaura foco e não deixa classe de lock/cursor presa.

## Achado 2 — o cubo não possui arraste

### Evidência

Na Etapa 15:

- `.fr15-p3d-orbit` anuncia `cursor: grab` e `touch-action: pan-y`;
- `p3dState` não contém estado de ponteiro/arraste;
- `p3dPointer(event)` calcula yaw/pitch pela posição absoluta do ponteiro dentro do viewport;
- o listener registrado é apenas `pointermove` passivo;
- não há `pointerdown`, `pointerup`, `pointercancel`, captura de ponteiro ou limiar de intenção.

### Causa

A interface comunica “agarrar”, mas implementa somente orientação por hover. Portanto clicar e arrastar não tem semântica própria e, no toque, o gesto não é controlado.

### Correção exigida

- adicionar estado `dragging`, `pointerId`, `lastX`, `lastY`, `moved`, `velocity` opcional;
- iniciar apenas com botão principal no mouse;
- usar `setPointerCapture`/`releasePointerCapture`;
- atualizar yaw/pitch por delta, com pitch limitado;
- adicionar classe `is-dragging` para retirar transição durante o gesto;
- pausar auto-rotação durante interação e retomar com atraso suave;
- suportar `pointercancel`, perda de captura e mudança de aba;
- usar limiar direcional no touch: vertical mantém o scroll; horizontal assume rotação;
- ampliar teclado para quatro setas e anunciar orientação/projeto de forma útil.

### Aceite

- arraste curto e longo são estáveis e não saltam ao primeiro movimento;
- o cubo não continua “preso” depois de sair da área;
- mobile continua rolando a página verticalmente;
- reduced motion desliga rotação automática, mas mantém controle direto;
- a seleção de projeto e os botões de modo continuam funcionando.

## Achado 3 — Ambientes canônico ainda existe

### Evidência

O anexo contém:

- `<main id="view-ambientes">`;
- hero `.amb-hero` com a tese “Arquitetura é a linguagem que você escolhe para viver”;
- `.amb-museum` e `#amb-grid-container`;
- manifesto e ticker;
- array `AMB_STYLES` com 12 linguagens e IDs de serviço;
- motor de detalhe anterior.

A Etapa 15 cria `.fr15-amb-atlas`, adiciona a classe `.fr15-amb-ready` ao view e aplica uma regra que esconde `.amb-museum` e `.fr14-curator-desk`.

### Conclusão

Não é necessário recriar a versão anterior. A base canônica permanece no DOM e nos dados. A estratégia segura é:

1. preservar `AMB_STYLES` e o hero;
2. desativar/ocultar somente a substituição da Etapa 15 sob uma flag `fr16`;
3. adaptar o grid/lista canônico para a nova apresentação;
4. manter rollback imediato para a Etapa 15.

Antes de aplicar, o Codex deve comparar o arquivo real com o histórico Git para confirmar qual commit/branch representa a versão canônica aprovada.

## Achado 4 — Portfólio atual é substituição tardia

### Evidência

A Etapa 15:

- adiciona `.fr15-portfolio-universe` ao `#view-projetos`;
- esconde outras implementações da aba por seletores tardios;
- lê projetos de `window.GM_PROJECTS` ou `window.FR_DEFAULT_PROJECTS`;
- continua usando `window.openProjectModal(project)`;
- cria galeria horizontal, filtro e Canvas 2D em espiral.

### Conclusão

A nova aba pode reaproveitar os contratos de dados e modal, mas deve substituir apenas a apresentação. Não alterar a origem de projetos, IDs, categorias, ordem ou comportamento da calculadora.

## Achado 5 — lock de body e foco precisam de teste integrado

A Etapa 15 possui `bodyLock.count`, salva `body.style.overflow` e retorna foco. Outras etapas também alteram `body.style.position`, `top`, `overflow` e classes de modal. Múltiplos locks podem competir.

Correção:

- inventariar todos os controladores de lock;
- escolher um coordenador ou garantir composição por contador;
- nunca zerar estilos de outro modal ainda aberto;
- testar overlays aninhados e fechamento por Escape/backdrop/botão;
- garantir que o scroll retorne à posição anterior.

## Pontos de integração protegidos

| Área | Contrato observado | Regra |
| --- | --- | --- |
| Orçamento | `window.FRBudgetCore`, `window.__frCore` | não modificar fórmulas, payloads ou IDs |
| Serviços | `SERVICES`, `selectedServices` | usar IDs atuais; não criar catálogo paralelo |
| Portfólio | `fr-stage2-portfolio-engine`, `openProjectModal` | adaptar visualmente, preservar modal/dados |
| Ambientes | `AMB_STYLES`, `services[].id` | enriquecer campos, não duplicar fonte |
| Rotas | `switchView`, `view-*` | preservar IDs, foco e histórico |
| Acessibilidade | dialogs, `aria-hidden`, focus trap | manter Escape, Tab e retorno de foco |
| Performance | RAFs de cubo e canvas | rodar só quando visível/ativo |

## Arquivos e linhas

As linhas acima são referências do anexo, não contratos fixos. No repositório, o Codex deve localizar símbolos com `rg` em vez de editar por número de linha.

## Primeira tarefa do Codex

Sem editar nada:

```bash
rg -n "FRBudgetCore|window.__frCore|fr-stage2-portfolio-engine|AMB_STYLES|fr-stage15-materialidade|p3dPointer|fr8-cursor|cursor: none|bodyLock|openProjectModal" .
```

Depois, produzir uma tabela com símbolo, arquivo, responsabilidade, consumidores e teste de caracterização.

