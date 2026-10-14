# Auditoria de integração main + Codex

Data da integração: 14/10/2026  
Branch de integração: `codex/integracao-portfolio-seo-main-2026-10-13`

## Base confirmada

- `origin/main`: `9b2b5d37b67b222fb272a03f54da948859bcf976`
- `origin/codex/implementacao-imagens-portfolio-seo`: `f9a5f1147719afeb92d825adb24f27e17193c68e`
- Merge base: `49295469979958569d2f6f5a32c397853f2fb7a9`
- Divergência confirmada após novo `git fetch`: 16 commits exclusivos na main e 2 na candidata.
- A integração foi feita em `/tmp/franco-romeu-integracao-2026-10-13`, sem alterar a worktree original da candidata.
- A worktree original conservou os itens preexistentes não rastreados `.vercel/`, `CODEX USE AQUI/` e `FR_PLANO_MESTRE_SITE_CODEX_2026-10-10 (1).md`, além do stash histórico existente.

## Estratégia aplicada

O merge partiu de `origin/main` e incorporou a candidata com `--no-commit --no-ff`. A experiência visual, o acervo estruturado, o Jornal Técnico, as páginas editoriais e o build estático vieram da candidata. Domínio, identidade comercial, rastreamento confirmado, verificações e infraestrutura de indexação vieram da main. Nenhuma versão inteira de `index.html` ou `vercel.json` substituiu a outra.

## Conflitos resolvidos

| Arquivo | Regra da main preservada | Recurso da candidata preservado | Solução | Validação |
| --- | --- | --- | --- | --- |
| `AGENTS.md` | main canônica e domínio oficial | governança compatível | versão vigente da main | inspeção do diff |
| `index.html` | `www`, identidade, contatos, verificações, GA4, Ahrefs e grafo de 16 serviços | visual, navegação, mídia, Jornal, portfólio e componentes novos | composição seletiva; entidade institucional única; FAQ visível no orçamento; roteador canônico | `npm test`, `check:html`, QA Chromium |
| `robots.txt` | host `www` | geração de sitemaps do build | fonte canônica e saída gerada coerente | XML/robots nos testes de integração |
| `sitemap.xml` | host `www` | inventário gerado por rotas efetivas | fonte mínima preservada; `dist` regenerada a partir do mapa público | 5 sitemaps validados |
| `tests/search-control.test.cjs` | dados comerciais e serviços | contratos do novo roteador | teste combinado, sem geo não comprovada | PASS |
| `tests/seo-brand-godmode.test.cjs` | marca e segurança pública | walker seguro e novos ativos | teste combinado | PASS |
| `vercel.json` | redirect do host Vercel legado e apex | build em `dist`, redirects editoriais e cache | configuração única sem rewrite SPA | teste específico e parse JSON |

## Arquivos e histórias preservados

Foram mantidos os relatórios digitais da main, inclusive `docs/DIGITAL_STRATEGY_AUDIT_2026-10-13.md`, as duas auditorias em `docs/audits/` e `docs/SEARCH_CONTROL_ENGINEERING.md`. Também foram mantidos os catálogos, relatórios e evidências da candidata em `docs/media/`, `docs/additions/`, `content/`, `prepared-media/editorial/` e `assets/media/`.

Os relatórios históricos não foram reescritos para aparentar publicação atual. `docs/media/PUBLIC_MEDIA_MAP.json` continua como snapshot histórico; a versão transitória do build é gerada em `.artifacts/build/PUBLIC_MEDIA_MAP.json`.

## Decisões de preservação

- `src/budget-core.js` permaneceu byte a byte igual nas duas branches e na integração: SHA-256 `d9b8181bce2387f8087a82d1c82958efd42c0778882598941e2de2c267c9b1cc`.
- Permanecem 115 serviços, 15 categorias e 7 cupons.
- Não foram alterados preços, fórmulas, descontos, IDs, unidades ou índices.
- O God Mode permanece na fonte de desenvolvimento e é removido do output público.
- Fontes históricas locais ausentes permanecem `SOURCE_UNAVAILABLE`; nenhum derivado foi promovido a prova de autoria ou execução.
- As coordenadas genéricas do centro de São Paulo foram removidas do JSON-LD público. A área comercial foi preservada sem afirmar uma sede pontual.

## Itens propositalmente não publicados

- `CODEX USE AQUI`, ZIPs, backups, CSVs internos, documentação, artefatos de QA e fontes administrativas.
- Mídias `HOLD`, `ARCHIVE`, `DUPLICATE` ou `REFERENCE` fora do catálogo público normalizado.
- Indexação de imagens: 0 das 284 mídias normalizadas têm liberação ativa nesta integração.
- 326 rotas editoriais permanecem `noindex` até aprovação de direitos, autoria e intenção de publicação; apenas as seis rotas institucionais estão indexáveis.
- Geo pontual, reviews, `AggregateRating`, prêmios, certificações e obras executadas sem fonte.

## Resultado atual

O build local reproduz a nova arquitetura e elimina a causa comprovada da falha Vercel da candidata. O gate técnico local passa; a release permanece em rascunho porque o LCP sintético mediano foi 3.896 ms e o check Cloudflare Workers da candidata segue como falha externa ainda não diagnosticada por logs acessíveis nesta sessão.

