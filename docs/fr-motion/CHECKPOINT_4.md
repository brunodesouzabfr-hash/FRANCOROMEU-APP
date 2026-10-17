# CHECKPOINT 4 — JORNAL FR + HOME SIDE SCROLL

**Data:** 15/10/2026  
**Branch:** `feature/fr-motion-phase1-2026-10-15`  
**Base da tarefa:** Fases 1–3 aprovadas em branch, pendências de GA4 legado e QA visual transportadas.  
**Situação:** Implementação real gravada na branch, sem merge nem deploy.

## 1. Jornal FR

O arquivo da rota `/projetos/` continua sendo gerado por `scripts/build-journal.cjs`. O transformador `src/fr-journal-phase4.cjs` modifica **apenas a experiência pública visual**, não o diretório, filtros, hierarquia de 109 registros, contagem, cards ou cinco artigos com o patch animado existente.

- Identificação visual na edição e kicker: **Jornal FR**.
- Fundo de jornal em camadas físicas simuladas via CSS (`frj4-paperwall`): folhas, cabeçalhos tipográficos, colunas, inclinação, sombra, desfoque; composições são **decorativas**, não matérias inventadas.
- Entrada das fotos do arquivo principal (`#arquivo .frj-index-card figure img`) via `IntersectionObserver`, com `clip-path`, profundidade e micro-rotação. Somente as imagens animam; figuras, textos, botões e cards permanecem em sua geometria original.
- O mecanismo preserva os destaques do `#frap-journal` e o `fr-journal.js` que filtra 109 leituras.
- Fallback de movimento reduzido, recursos ausentes, impressão e `destroy()` restaura CSS original do arquivo.
- Política editorial validada pelo usuário (obras executadas e autoria de projeto 3D pela FR); a reconciliação de rótulos legados no catálogo geral permanece em etapa editorial específica.

## 2. Home / Rodapé

Componente `src/fr-home-outro4.cjs` montado **entre** a seção `#view-home .fr6-final` e `.fr6-footer` no build. Nenhum elemento antigo removido.

- Quatro quadros de largura de viewport, pinagem `100svh`, movimento horizontal associado ao deslocamento vertical nativo.
- Três fotografias extraídas do catálogo vinculado aos pares FR-BA055, FR-BA034 e FR-BA059 (sem cruzar obras).
- Quarto quadro: WhatsApp `https://wa.me/5511990021603`, Instagram `https://www.instagram.com/francoromeu.fr/`, calculadora `/orcamento`.
- Ícones vetoriais Font Awesome já utilizados pelo site, CTAs grandes com foco visível, `target=_blank` e `rel=noopener noreferrer` nos contatos externos.
- Mobile mantém progressão vertical e scroll nativo; `prefers-reduced-motion` remove pinagem.
- `window.FRHomeOutro4.destroy()` desliga controles e oculta o novo painel; `mount()` o reativa. O CTA final pré-existente e o rodapé canônico ficam intactos.

## 3. Arquivos envolvidos

| Arquivo | Finalidade |
|---|---|
| `src/fr-home-outro4.cjs` | Composição de quatro quadros na Home |
| `assets/css/fr-home-outro4.css` | Estilo, responsividade, motion |
| `assets/js/fr-home-outro4.js` | Scroll sincronizado, skip, cleanup e rollback |
| `src/fr-journal-phase4.cjs` | Identidade visual e fundo sem renomear rotas |
| `assets/css/fr-journal-phase4.css` | Fundo editorial e foto-reveal |
| `assets/js/fr-journal-phase4.js` | IO de revelação apenas no índice |
| `scripts/build-site.cjs` | Hook da Home |
| `scripts/build-journal.cjs` | Hook da rota Jornal |
| `tests/fr-motion-phase4.test.cjs` | Seis testes independentes + remontagem |
| `package.json` | Inclusão no npm test |
| `.github/workflows/fr-motion-branch-qa.yml` | QA de branch isolada |

## 4. Evidências

CI [38821363591](https://github.com/brunodesouzabfr-hash/FRANCOROMEU-APP/actions/runs/38821363591) do commit imediatamente anterior à correção final de rollback:

- **PASS**: seis testes específicos Phase 4, todos os testes Phase 3 e os componentes anteriores.
- **PASS**: check:html, npm run build, check:project-library, check:idempotence.
- **BLOCK**: npm test integral continua apontando apenas `tests/integration-release.test.cjs`, que espera 1 tag GA4 no HTML e encontrou 0 na branch antiga. A `main` recebeu atualizações de SEO durante a execução da tarefa, ainda não reconciliadas.
- **PENDENTE**: QA visual real desktop / tablet / mobile (Chromium), seleção final das melhores fotografias e validação da transição visual final.
- O commit posterior corrige somente o ciclo reversível `destroy/mount` e o teste respectivo, aguardando seu próprio CI.

## 5. Reversão

Durante a sessão:
- `window.FRHomeOutro4.destroy()` oculta a montagem adicionada e mantém footer e CTA legados.
- `window.FRJornalMotion4.destroy()` desliga a revelação das imagens de arquivo; o plano de fundo visual aditivo ainda depende da folha de estilos. Para desabilitar o módulo inteiro, retirar as duas inclusões do `src/fr-journal-phase4.cjs`.

Reversão persistente: reverter os commits delimitados da Fase 4; **não** reverter Fases 1–3, não mexer em catálogo financeiro, 115 serviços ou configuração de SEO.

**Fronteira:** pare no CHECKPOINT 4; não iniciar Projeto 3D / IQE / Navbar sem aprovação.
