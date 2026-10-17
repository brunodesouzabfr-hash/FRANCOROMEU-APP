# CHECKPOINT 6 — IQE / Avatar 3D Quiet Luxury

**Data:** 15/10/2026  
**Branch:** `feature/fr-motion-phase1-2026-10-15`  
**Base:** Checkpoints 1–5 preservados  
**Estado:** Fase 6 implementada e verificada no CI isolado, sem merge ou deploy.

## Escopo executado

O IQE tem duas implementações distintas: o questionário original de composição automática de orçamento (módulo com `#iqe-overlay`) e o assistente persistente Stage 5 (`#fr-ai-root`) com busca global, sugestões e balões. A Fase 6 altera **somente** a aparência do avatar no launcher `#fr-ai-launcher .fr-ai-robot` e no cabeçalho `.fr-ai-avatar` do Stage 5, sem reescrever HTML e handlers de orçamento.

O HTML original do avatar é preservado em memória e restaurável com `window.FRIQEAvatar6.destroy()`.

### Geometria e materialidade
- **Cubo 3D real em CSS**, com seis faces, orientação orgânica por `transform` e perspectiva; **sem WebGL, canvas ou looping de `requestAnimationFrame`**.
- Acabamento osso fosco `#E6D6B5`, chanfros poligonais em cada face, linhas técnicas em ouro `#F6A700`, sombras discretas verde profundo e luz laranja `#FF6B00`.
- Sem glossy, textura plastificada, ruído gerado nem fonte de imagem externa.
- Monograma `ꟻR` na face posterior (identidade original preservada).
- Dois olhos com **matriz 5×5 de pixels** no painel frontal e boca mínima.

### 12 expressões
`neutral`, `blink`, `smile`, `happy`, `focus`, `curious`, `surprise`, `wink`, `thinking`, `sleepy`, `determined`, `glitch`.

As expressões são controladas apenas pelo avatar, seguindo leitura de eventos já existentes. Exemplos: abertura do assistente, busca, dicas, orçamento e balão contextual. Não disparar nem suprimir qualquer ação da lógica original.

### Desempenho e acessibilidade
- CSS animation composta com `transform`, pequena geometria, sem canvas/WebGL.
- Alteração periódica de expressão em intervalo esparso de 12 segundos e somente com página visível, preferências normais e modo de potência normal.
- `prefers-reduced-motion:reduce`, `document.hidden` e `html.fr7-low-power` suspendem animação e intervalos; expressão neutra estática.
- Os novos elementos são `aria-hidden="true"`; `aria-label`, `aria-controls`, `aria-expanded` e eventos dos botões originais continuam intactos.
- `destroy()` limpa timer, timeout, observers, listeners e restaura filhos originais dos dois avatares.
- `mount()` monta novamente; ausência de qualquer âncora essencial mantém o original sem alterações.

## Arquivos

- `src/fr-iqe-avatar-phase6.cjs` — hook visual do build, com validação de contratos originais.
- `assets/css/fr-iqe-avatar-phase6.css` — materiais, geometria, chanfros, luz, animação e fallbacks.
- `assets/js/fr-iqe-avatar-phase6.js` — duas vistas do cubo, expressões, lifecycle e rollback.
- `tests/fr-iqe-avatar-phase6.test.cjs` — sete testes: montagem, 12 expressões, preservação de botões/lógica, painel, modo baixo consumo, fallback e CSS.
- `scripts/build-site.cjs` — inclusão isolada após fase 5.
- `package.json` e `.github/workflows/fr-motion-branch-qa.yml` — execução dos testes no pipeline de QA da branch.
- Este relatório.

## Evidências

CI isolado da branch: [workflow 38825942402](https://github.com/brunodesouzabfr-hash/FRANCOROMEU-APP/actions/runs/38825942402).

- **PASS:** fase 6 e as anteriores na suíte isolada `node --test` (concluído antes da criação deste relatório).
- A suíte completa `npm test` e checks de build precisam ser observados até conclusão. A falha anterior de GA4 (`tests/integration-release.test.cjs`, comparação 0 != 1) permanece fora do escopo desta fase e **não** deve ser mascarada.
- **PENDENTE:** QA visual em Chromium desktop e viewport 390×844; inspeção de legibilidade dos pixels, fluidez em dispositivos fracos e foco de acessibilidade.
- A branch estava **59 commits à frente e 7 atrás** de `main` na conferência anterior. Não fazer rebase nem merge sem reconciliação de mudanças paralelas.

## Rollback

```javascript
window.FRIQEAvatar6.destroy();
```

A aparência original do robô e o ícone no cabeçalho retornam, preservados os elementos existentes e os handlers da aplicação. Reativação: `window.FRIQEAvatar6.mount()`.

Para reverter no GitHub, remover os hooks e os arquivos exclusivos da Fase 6 com revert dos commits correspondentes. Não afetar Fases 1–5, IQE financeiro ou SEO.

## Restrição da continuidade
Parar no CHECKPOINT 6. Não iniciar remasterização da navbar nem outros módulos sem aprovação do proprietário. **Sem merge e sem deploy.**
