# CHECKPOINT 5 — Projetos 3D / Cubo + Galeria Horizontal 1:1

Data: 15/10/2026  
Branch: `feature/fr-motion-phase1-2026-10-15`  
Status: Implementado na branch isolada; nenhuma mesclagem ou publicação.

## Inventário de origem / preservação

A `main` fornecia dois sistemas independentes:
- Carrossel `#p3d-carousel` com seus seis projetos, setas, informações e `window.p3dSetActive`.
- Laboratório Stage 15 `.fr15-p3d-lab` com dez projetos em `window.FR_STAGE15.projects3d`, galeria vertical `.fr15-p3d-index`, cubo e suas seis faces `#fr15-p3d-orbit .fr15-p3d-cube`, modos Render / Wireframe / Luz, dossiê, vínculo à calculadora, inspector modal `#fr15-p3d-inspector` e suas vistas.

**Nenhum desses motores ou handlers foi apagado, duplicado ou substituído.**

## Implementação

1. `src/fr-projects3d-phase5.cjs`: no build canônico, apenas insere CSS e JS após verificar `p3d-hero`, `p3d-showcase` e `p3d-process`. Não reescreve o HTML original.
2. `assets/css/fr-projects3d-phase5.css`: no desktop, workbench compacto com cubo principal quadrado 1:1 e galeria lateral com **três cards quadrados 1:1 visíveis simultaneamente**; os dez projetos anteriores seguem acessíveis por scroll horizontal `scroll-snap`. Abaixo, o dossiê conserva informações, HUD, serviços e botões existentes. Mobile usa cubo quadrado e navegação horizontal nativa, sem capturar scroll vertical.
3. `assets/js/fr-projects3d-phase5.js`: progressive enhancement da UI existente. Detecta a montagem tardia do Stage 15 por `MutationObserver`, não recria projetos ou cenas.
4. Clique, setas, teclado e transição chamam `window.FR_STAGE15.selectProject3D(index,true)`; o motor canônico atualiza imagens das **seis faces do cubo**, informações e estados de seleção. Nada é inventado e não há mistura de imagens de obras distintas.
5. Transição curta em perspectiva nos **três cartões próximos ao projeto ativo**, sincronizada com uma animação de troca no cubo. Não há loop de GPU novo, render WebGL adicional ou listeners `wheel/touchmove` globais.
6. Toolbar preserva acesso direto ao inspector existente via `window.FR_STAGE15.openProject3D(index)`, com botões acessíveis para alternar três faces frontais do cubo. Os chips ficam **fora** do elemento `role=img`, preservando os gestos e pointer handlers do cubo. A opção de face `fr16P3DSnap` usa o contrato existente quando `FR_STAGE16_FLAGS.cubeNarrativeScroll` está ativo; na seleção seguinte ou `destroy()`, envia release, evitando manter o motor congelado.
7. Fallback: quando Stage 15, catalogação, inspector ou cubo ainda não estão disponíveis, a UI canônica permanece visível sem estilização da fase nova. A própria Fase 5 não altera IDs, preços, orçamento, IQE, modais nem conteúdos.

## Arquivos da fase

- `src/fr-projects3d-phase5.cjs`
- `assets/css/fr-projects3d-phase5.css`
- `assets/js/fr-projects3d-phase5.js`
- `tests/fr-projects3d-phase5.test.cjs`
- `scripts/build-site.cjs`
- `package.json`
- `.github/workflows/fr-motion-branch-qa.yml`
- `docs/fr-motion/CHECKPOINT_5.md`

## QA / evidências

- Suite dedicada de **sete testes** verifica as âncoras preservadas, montagem sem duplicação, seleção e sincronização de seis faces, popup original, orçamento, navegação e retorno à interface antiga.
- GitHub Actions da branch executa a suíte das Fases 1–5 separadamente e tenta `npm test`, `check:html`, `build`, `check:project-library` e `check:idempotence`.
- Primeiro CI do checkpoint identificou duas falhas de teste: comparação cross-realm do objeto jsdom e seletor de feedback dos botões movidos para a viewport. Ambas corrigidas no código/teste; verificar o CI do HEAD antes de homologar.
- Restrição histórica da `main`: o teste legado `tests/integration-release.test.cjs` exige GA4 no `index.html`; a branch da tarefa foi criada antes de mudanças de SEO posteriores, de modo que `npm test` pode continuar com o mesmo único bloqueio antigo.
- **Pendente:** auditoria visual real de browser desktop e 390×844; reconciliação da `main`, sem rebase automático.

## Rollback

Em uma aba de teste, chamar `window.FRProjects3DPhase5.destroy()`. A classe visual `fr5d-ready`, toolbar, controles de face e listeners da fase são removidos; o cubo e a galeria do Stage 15 voltam à aparência original. `mount()` reativa a interface. Reverter os commits específicos da Fase 5 desfaz a integração persistente, sem afetar as Fases 1–4.

Não fazer merge, deploy ou iniciar IQE/NavBar sem aprovação do usuário.
