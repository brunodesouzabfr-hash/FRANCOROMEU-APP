# Validação e revisão interna

Data: 2026-10-14
Branch: `codex/patch-adicoes-imersivas-fr-2026-10-14`
Base: `ee983ed9eb1d600aa42dd57ae6e61c84431e528b` (`origin/main`)
Artefato: `fr-additions-2026-10-14`

## Matriz do pedido

| Requisito | Status | Evidência |
|---|---|---|
| Preservar a `main` como layout canônico | PASS | branch criada diretamente de `origin/main`; nenhum arquivo da implementação imersiva rejeitada foi usado como base |
| Extrair todas as novas caixas/textos/imagens | PASS | oito módulos em `additions-manifest.json` e lista completa em `CONTENT_INVENTORY.md` |
| Separar todas as animações | PASS | runtime, CSS, shader e preview isolados; mapa em `ANIMATIONS.md` |
| Incluir os dois painéis da Home | PASS | `#frap-home-structure` e `#frap-home-surface`, observados no navegador |
| Incluir Sobre e Ambientes | PASS | `#frap-about-palimpsest` e `#frap-environments`, observados no navegador |
| Incluir o Jornal sem retirar seu arquivo | PASS | cinco cards antes de `#arquivo`; navegador confirmou `109 DE 109 LEITURAS` |
| Não substituir conteúdo existente | PASS | teste de `destroy()` preserva os pontos canônicos; CSS aplica apenas seletores `.frap-*` |
| Preservar motor de orçamento | PASS | `src/budget-core.js` idêntico à base; 115 serviços no mapa; testes financeiros focados passaram |
| Criar commit estreito e reversível | PASS | caminhos delimitados; rollback por flags, `destroy()` ou reversão de um único commit |
| Push, merge ou deploy | NOT_APPLICABLE | não autorizados e não executados |

## Testes executados

| Comando / verificação | Resultado | Observação |
|---|---|---|
| `npm ci` | PASS | instalação limpa; zero vulnerabilidades informadas pelo npm |
| `node --check` nos JS/CJS novos | PASS | todos os arquivos sintaticamente válidos |
| `npm run build:additions-map` | PASS | 115 serviços; 31 `mapped`; 84 `needs_review`; saída idempotente por SHA-256 |
| `npm run test:additions` | PASS | 6/6 testes específicos |
| `npm run build` | PASS | 838 artefatos; `buildMutatesSource: false`; JSON do mapa presente em `dist` |
| `npm run check:html` | PASS | seis views, 253 IDs, núcleo de orçamento, PDF e SEO preservados |
| `npm run check:project-library` | PASS | 332 rotas, 6793 links, 2924 imagens, 0 protegidos publicados |
| `npm run check:idempotence` | PASS | fingerprint público estável `0baee9f19920c1dac1733a91b150df7aa63e23ad74cb67e85d4ef01398a20e14` |
| `npm run check:source-media` | BLOCKED | o worktree limpo não contém os originais privados externos; retornou `INCOMPLETE_EXTERNAL_SOURCES`, preservou `publication_enabled: false` e verificou 57 contextos públicos. O relatório gerado pelo diagnóstico foi descartado para não sobrescrever o gate canônico da `main` |
| testes focados de catálogo, busca, Quiety, build público, mídia, orçamento e SEO | PASS | 68 verificações observadas sem falha |
| HTTP local | PASS | `/`, cinco rotas SPA, `/projetos/` e cinco assets do patch retornaram 200 |
| navegador desktop | PASS | Home, Sobre, Ambientes e Jornal observados; conteúdo canônico e adições coexistem |
| navegador `390x844` | PASS | `scrollWidth` 375 em viewport 390; sem overflow; 0 imagens quebradas nas raízes do patch |
| `npm test` | PASS | gate completo executado após estabilização do runner: patch 6/6, Stage14 6/6, Stage15 6/6, Stage16 12/12 e todas as suítes subsequentes sem falha |
| execuções diagnósticas anteriores de Stage14/15/16 | PASS com observação | houve timeouts sensíveis à carga nas primeiras execuções; Stage14 e Stage15 também reproduziram timeout na exportação limpa da `main`; a repetição integrada final passou integralmente |

## Invariantes

- `src/budget-core.js`: SHA-256 `d9b8181bce2387f8087a82d1c82958efd42c0778882598941e2de2c267c9b1cc`, sem diff contra a base.
- `FRANCO_ROMEU_ETAPA15_MATERIALIDADE_IMERSIVA.html`: SHA-256 `164d8eed8a17475a85952f35c25e369b553d7d43cee348dda27ae45e526a1e47`, igual na candidata e na exportação limpa.
- Sem alteração de preço, fórmula, cupom, categoria, `serviceId`, quantidade, configuração, persistência, PDF ou WhatsApp.
- Mídias externas de referência não foram copiadas; os componentes usam somente caminhos locais já existentes.

## Revisão final

- `reviewer`: Codex, revisão interna do mesmo executor.
- `artifact_version`: `fr-additions-2026-10-14`.
- `findings`: nenhum bloqueador de escopo; os timeouts diagnósticos permanecem registrados como evidência de variância do runner, mas o gate integrado final passou. O único bloqueio externo é a ausência dos originais privados exigidos por `check:source-media` neste worktree portátil.
- `severity`: informativa; não há falha aberta na execução final.
- `regressions`: nenhuma regressão funcional identificada nos testes focados e no navegador.
- `recommendation`: aplicar por cherry-pick do commit único e revisar visualmente antes de qualquer merge/publicação.
- `independence_limit`: revisão interna, não independente; nenhum push, merge ou deploy foi usado como evidência.

## Rollback

1. Runtime imediato: definir `window.FR_ADDITIONS_PATCH_FLAGS.enabled = false` antes dos scripts.
2. Por família: desligar `home`, `about`, `environments`, `project3d`, `portfolio`, `servicePreview`, `journal` ou `webgl`.
3. Em sessão: chamar `window.FRAdditionsPatch.destroy()` e `window.FRAdditionsServicePreview.destroy()`.
4. Em Git: reverter o commit único deste patch. Nenhuma etapa apaga `localStorage` ou dados do cliente.
