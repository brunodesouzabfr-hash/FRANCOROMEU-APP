# Relatório de implementação — Master Prompt v2.0

Data de validação: 13/10/2026  
Branch: `codex/implementacao-imagens-portfolio-seo`  
Prévia local: `http://127.0.0.1:4183/`

Este documento descreve a candidata local. Não autoriza commit, merge, deploy, publicação, mudança de preço ou ativação de indexação.

## A. Alterações implementadas

| Página | Alteração | Arquivos principais | Status |
|---|---|---|---|
| Home | Manifesto e três cards reais de especialidade receberam o novo acervo | `index.html` | Validado em desktop e mobile |
| Projetos 3D | Quatro vistas de Calacatta, seletor visual quadrado e layout horizontal móvel | `index.html` | Validado; cubo e painel preservados |
| Projetos 3D | Matriz arquitetônica arquivada e Cadernos de modelagem retirados da interface | `index.html`, `docs/archive/matriz-arquitetonica/` | Validado |
| Sobre | Arquivo de Visualização removido; Google reposicionado e redesenhado | `assets/js/fr-media-case.js`, `scripts/build-site.cjs`, `index.html` | Validado |
| Ambientes | Arquivo redundante removido e dossier escalável Cozinha + Lavanderia adicionado | `assets/js/fr-project-media.js`, `assets/css/fr-project-media.css`, `scripts/prepare-project-library.cjs` | Validado |
| Portfólio | Blocos densos e seção final removidos; apresentação visual e CTA técnico preservados | `index.html`, `assets/js/fr-media-case.js` | Validado |
| Jornal Técnico | Capa `/projetos/`, índices, leituras, taxonomias, navegação Explorar e templates editoriais | `scripts/build-journal.cjs`, `scripts/build-editorial-ecosystem.cjs`, `scripts/build-project-pages.cjs`, `assets/css/fr-journal.css`, `assets/js/fr-journal.js` | Validado |
| SEO/rotas | Canonicals, metadados, Open Graph, breadcrumbs, JSON-LD e redirects | scripts de build, `vercel.json` | Implementado; liberação de indexação pendente |

## B. Home — imagens

| Elemento | Imagem anterior | Imagem nova | Resultado |
|---|---|---|---|
| Manifesto | `assets/media/manifesto-proporcao-01.jpg` | `cozinha-env-lavanderia-imagem-ilustrativa-986cf34222.webp` | Validado |
| Superfícies Autorais | `assets/media/home-servico-superficies.jpg` | `cozinha-bancada-l-imagem-ilustrativa-b239e59121.webp` | Validado |
| Design & Marcenaria | `assets/media/home-servico-marcenaria.jpg` | `cozinha-torre-quente-imagem-ilustrativa-78d797da36.webp` | Validado; a implementação possui um único card combinado |
| Projeto 3D | `assets/media/home-servico-projeto-3d.jpg` | `cozinha-ilha-cooktop-estudo-3d-ilustrativo-55a2676b5d.webp` | Validado |

## C. Projetos 3D

- Capa: `cozinha-bancada-l-imagem-ilustrativa-029-960w.webp`.
- Antes: `cozinha-env-lavanderia-antes-reconstituido-ilustrativo-76e8550654-960w.webp`, apresentado como reconstrução ilustrativa.
- Projeto 3D: `cozinha-bancada-l-estudo-3d-ilustrativo-025-960w.webp`.
- Materialidade: `cozinha-bancada-l-imagem-ilustrativa-b239e59121-960w.webp`.
- O seletor contém 10 controles com capas distintas, nomes, números, foco visível e estado `aria-current`.
- No desktop, as miniaturas formam uma coluna vertical rolável; em 390/360/320 px, formam uma faixa horizontal de 126 px sem overflow da página.
- O cubo, seus modos e controles continuam presentes. O painel direito mantém título, descrição, ficha e ações.

## D. Áreas removidas e arquivadas

- `Matriz arquitetônica`: retirada da produção; CSS, JavaScript e documentação preservados em `docs/archive/matriz-arquitetonica/`. O carregamento exclusivo de Three.js e o boot da matriz foram removidos.
- `Cadernos de modelagem`: cards públicos redundantes removidos; a base de projetos e mídias compartilhadas foi mantida.
- Sobre — `O método em leitura visual`: seção e elementos exclusivos removidos; `Serviços em matéria` preservado.
- Ambientes — `FRANCO ROMEU / ARQUIVO DE VISUALIZAÇÃO`: seção redundante removida.
- Portfólio — `Materialidade: encontros e planos`: seção final exclusiva removida.

## E. Portfólio

Foram retirados da experiência principal:

- `ANTES → PROJETO → APLICAÇÃO / Transformação é decisão acumulada`;
- `MÉTODO FR / DO DIAGNÓSTICO À ENTREGA` e suas sete etapas;
- `ESCOPO / COMPARAÇÃO TRANSPARENTE` e sua tabela;
- `ENGENHARIA DE CUSTO / CONTEXTO PRIMEIRO` e os cards/listas associados;
- `Materialidade: encontros e planos`.

O registro técnico de pricing necessário ao contrato Stage16 foi preservado como JSON inerte; ele não renderiza a tabela removida e não altera preços. Galeria, cards, frases autorais, motion, busca, calculadora e links para o Jornal continuam ativos. O CTA secundário agora abre `/projetos/`.

## F. Jornal Técnico

- Rotas históricas identificadas: **111 endereços únicos**, incluindo a capa, 109 leituras do índice antigo e o dossier direto Cozinha + Lavanderia.
- Status do mapa: **103 reconstruídas**, **7 redirects permanentes** e **1 preservada**.
- Leituras de projeto disponíveis na capa: **109**.
- Templates/páginas gerados: **60** antes/depois, **48** estudos 3D/materialidade, **147** materiais, **18** serviços, **24** ambientes e **5** índices taxonômicos.
- Navegação `Explorar`: capa, antes/depois, estudos 3D, materiais, serviços e ambientes; relações de próximo contexto continuam pelos índices e cards relacionados.
- A rota de exemplo `/projetos/antes-depois/suite-piso-madeira-casa-014/` usa o mesmo cabeçalho, tipografia, breadcrumbs e linguagem do Jornal.
- Mapa integral: `docs/additions/LEGACY_PROJECT_ROUTES_MAP.md` e `.json`.
- O registro FR-I124 permanece excluído: não fazia parte das 109 leituras históricas e seu ambiente continua sem confirmação.

Cada página tem HTML próprio, H1, title, description, canonical, Open Graph, breadcrumbs, relações internas e JSON-LD compatível. As páginas novas permanecem `noindex,follow,noimageindex`, e o preview acrescenta `X-Robots-Tag: noindex, nofollow`, porque autoria/direitos/indexabilidade das mídias ainda não foram liberados no acervo. Não foi criada alegação de execução para contornar esse gate.

## G. Testes e evidências

- `npm run build`: PASS — 840 artefatos; fonte não mutada pelo build.
- `npm test`: PASS — 41 testes no grupo final, além das suítes Stage14/15/16, busca e SEO executadas na mesma cadeia; zero falha.
- `npm run check:html`: PASS — 253 IDs, seis views, núcleo financeiro e bridge PDF preservados.
- `node --check` nos novos JS/CJS: PASS.
- `git diff --check`: PASS.
- `node scripts/check-project-library.cjs`: PASS — 332 rotas, 6.788 links, 2.919 imagens, 332 blocos JSON-LD e zero erro.
- `node scripts/check-build-idempotence.cjs`: PASS — fingerprint estável, 840 artefatos, 284 mídias e 332 rotas.
- Chromium: desktop 1440×900, mobile 390×844 e larguras 360/320; sete rotas principais sem overflow e sem erro de runtime.
- Interações verificadas: seleção Calacatta, 10 miniaturas, dossier aberto com 48 mídias e seis filtros factuais, menu Explorar, página interna, canonicals e schemas.
- Evidências: `docs/additions/evidence/master-v2-final/`; auditoria estruturada em `audit.json` e `post-fix-audit.json`.

Limitações: Safari/iOS físico, Search Console, Rich Results remoto e redirects no ambiente Vercel não foram executados. O preview local não simula redirects de plataforma.

Uma repetição intermediária de `npm test` excedeu o limite temporal do runtime Stage15 sem falha de asserção. O teste Stage15 passou isoladamente e a suíte integral final foi repetida e passou com 41/41 no grupo Node, além das suítes anteriores da mesma cadeia.

## H. Git e publicação

- Branch final: `codex/implementacao-imagens-portfolio-seo`.
- Nenhum commit, merge, push ou deploy foi realizado.
- O worktree permanece deliberadamente sujo, incluindo material já existente antes desta continuação (`AGENTS.md`, `CODEX USE AQUI/`, conteúdo, mídia preparada e documentação).
- Nenhum arquivo foi removido por `reset`, `clean` ou checkout destrutivo.
- A revisão deve continuar em `http://127.0.0.1:4183/` antes de qualquer autorização de publicação.
