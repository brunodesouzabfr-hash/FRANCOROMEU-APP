# CHECKPOINT 8 — Homologação integrada e reconciliação de analytics

Data: 16/10/2026.
Branch: `feature/fr-motion-phase1-2026-10-15`.
Escopo: estabilização técnica da branch, auditoria real em navegador e preparação para reconciliação com `main`. Nenhum merge, rebase ou publicação manual em produção foi autorizado/executado.

## 1. Resolução do GA4 legado
Diagnóstico confirmado no código:
- `index.html` da branch e `main/src/public-site-meta.cjs` já referenciavam a medição `G-22Z85RCGQC`.
- `src/public-site-meta.cjs` da branch ainda utilizava `G-C3FMZ4NGGY` na composição das páginas derivadas.
- `tests/integration-release.test.cjs` exigia a medição obsoleta, e falhava em todas as compilações por `0 !== 1`.

Correções executadas:
- Sincronizada `TRACKING.ga4` em `src/public-site-meta.cjs` com `G-22Z85RCGQC`, a mesma tag presente no código de `main`.
- Teste exige o ID canônico aprovado, exatamente um carregamento e um `gtag config` por arquivo público gerado.
- O teste rejeita explicitamente o ID antigo em todo o HTML de saída.
- Ahrefs, Clarity, verificação Google e Pinterest preservados.

Evidência de CI: https://github.com/brunodesouzabfr-hash/FRANCOROMEU-APP/actions/runs/38975193401 (suite completa aprovada após a mudança de analytics).

Esta verificação técnica não substitui a conferência dos dados recebidos pela propriedade GA4 na interface Google Analytics.

## 2. Auditoria integrada — Chromium

Novo `tests/fr-phase8-browser-audit.cjs` lê o build isolado `dist` em localhost e verifica:
- As seis rotas canônicas: Home, Sobre, Ambientes, Projetos 3D, Portfólio e Orçamento.
- Dois viewports: desktop `1440×900` e mobile `390×844`.
- Exatamente uma seção SPA ativa e visível, rotas e link com `aria-current=page`, navegação responsiva e estado do IQE.
- Centro geométrico e arredondamento da navbar.
- Nas cinco rotas normais, dock inferior após scroll profundo; Orçamento fixo no topo.
- Contatos Instagram e WhatsApp; ausência de quebra no acesso ao assistente.
- Integridade observável das imagens *já concluídas* no momento da amostragem e coleta de `pageerror` JS, tempos de DOMContentLoaded como informação diagnóstica.
- Abertura e fechamento do menu nativo no mobile, navegação SPA via menu e validação de uma tag GA4.

Resultado Chromium verificado:
- **12/12 cenários aprovados**.
- **0** erros JavaScript não tratados registrados durante a amostragem.
- **0** imagens locais *concluídas* quebradas nas telas amostradas.
- Nav desktop centralizada em `x=720 px`; mobile em `x=195 px`.
- Orçamento mantido no header; as demais rotas chegam ao dock.
- Capturas e relatório JSON disponíveis no artefato CI:
  https://github.com/brunodesouzabfr-hash/FRANCOROMEU-APP/actions/runs/38975312143/artifacts/12079220554
- Pipeline geral: https://github.com/brunodesouzabfr-hash/FRANCOROMEU-APP/actions/runs/38975312143

O job `phase8-integrated` em `.github/workflows/fr-motion-branch-qa.yml` passa a executar essa auditoria após o build em um ambiente de CI isolado. O QA específico da Fase 7 continua independente.

## 3. Divergência da main — comparação sem mesclagem

No último compare antes deste documento, a branch estava **93 commits à frente e 8 atrás** de `main` (a contagem pode variar com os commits de documentação). Os arquivos principais pendentes de reconciliação da linha `main` incluem:
- `index.html` (introdução e elementos de identidade).
- `assets/intro/fr-intro-cinematic.js`, `intro-franco-romeu-laboratorio.html` e otimizações da introdução V05.
- Dois arquivos de marca em `assets/brand` (medalhão esmeralda e monograma dourado).
- `scripts/build-site.cjs`, `scripts/check-html.js`, `package.json`.
- Testes `fr-intro-performance.test.cjs`, `public-build.test.cjs`, `seo-brand-godmode.test.cjs`.
- Documentos de intro e SEO.
- Analytics `src/public-site-meta.cjs` e `tests/integration-release.test.cjs`: **diferença crítica de ID conciliada nesta Fase 8**, sem mesclagem geral.

**Não cherrypick, merge, reset ou rebase automático nesta etapa.** Para não sobrescrever as Fases 1–7, a migração do conjunto V05 e da identidade deve ser conferida lado a lado, incluindo conteúdo, imagens, contratos de build, scripts e testes e, então, aplicada de modo atômico em branch de integração/mesma branch com checkpoints. A atualização isolada de GA4 não implica que a divergência inteira foi eliminada.

## 4. Limitações e critérios para publicação

- Auditoria automatizada em Chromium não substitui testes em dispositivos físicos, leitores de tela e redes lentas.
- `DOMContentLoaded` não é LCP, INP ou CLS reais; Core Web Vitals de campo ainda precisam ser medidos.
- Uma imagem `loading=lazy` que ainda não terminou o carregamento não é classificada como falha de asset; revisão de todas as imagens e correspondência documental antes/depois precisa de conferência editorial.
- Analytics: falta comprovar recebimento dos eventos na propriedade GA4 oficial, mesmo com tags consistentes.
- Introdução cinematográfica V05, marca e SEO de `main` continuam pendentes de reconciliação explícita.
- Não executar deploy em produção nem merge até revisão do diff, validação visual manual das capturas e aprovação do responsável.

## 5. Arquivos alterados na Fase 8
- `src/public-site-meta.cjs` — ID GA4 reconciliado.
- `tests/integration-release.test.cjs` — verificação estrita da tag/initialization por rota.
- `tests/fr-phase8-browser-audit.cjs` — novos testes reais de UI e inventário de evidências.
- `.github/workflows/fr-motion-branch-qa.yml` — job independente Chromium Phase 8.
- `docs/fr-motion/CHECKPOINT_8.md` — este checkpoint.

Checkpoint interrompido aqui; sem merge nem publicação manual de produção.
