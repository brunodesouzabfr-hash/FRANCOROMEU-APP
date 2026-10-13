# Auditoria de Estratégia Digital — Franco Romeu

**Data:** 2026-10-13  
**Domínio canônico:** https://www.francoromeufr.com.br/  
**Base auditada:** `main` no commit `17c27f28ceea1e0a1517ef47de81b4ba418c2bd4`  
**Branch de correção:** `audit/estrategia-digital-2026-10-13`

## Resumo executivo

A infraestrutura externa já avançou para o domínio próprio, mas a fonte canônica da aplicação ainda declarava `francoromeu-app.vercel.app` em canonical, Open Graph, Twitter, JSON-LD, roteador SPA, robots e sitemap. Isso criava sinais conflitantes para mecanismos de busca e explica a persistência do host Vercel legado em resultados e perfis externos.

A correção desta auditoria consolida `www.francoromeufr.com.br` como host canônico, preserva as seis rotas atuais da SPA em reload direto, adiciona redirect permanente do host Vercel legado e reduz duplicidade na integração IndexNow.

## Achados críticos

### P0 — domínio canônico divergente no código
- `index.html` tinha dezenas de referências absolutas ao host Vercel legado.
- `robots.txt` e `sitemap.xml` apontavam para o host legado.
- os testes protegiam o valor antigo, portanto uma correção somente de produção seria revertida pelo CI.
- `AGENTS.md` ainda descrevia o host Vercel como aplicação publicada canônica.

**Correção:** migrar a camada operacional para `https://www.francoromeufr.com.br` e atualizar testes.

### P0 — deep links SPA
O site depende de rotas de History API. A configuração da Vercel precisa resolver explicitamente:
- `/sobre`
- `/ambientes`
- `/projetos-3d`
- `/portfolio`
- `/orcamento`

sem transformar qualquer URL desconhecida em Home, para preservar 404 real.

### P1 — IndexNow duplicado
Foram encontrados dois workflows idênticos em `.github/workflows/` e uma cópia adicional na raiz.

**Correção:** manter um único workflow, com URLs extraídas do `sitemap.xml`.

### P1 — grafo de entidade incompleto
O `sameAs` continha apenas Instagram, Pinterest antigo e WhatsApp. O host canônico e os IDs do grafo também apontavam para Vercel.

**Correção:** atualizar entidade e perfis oficiais informados; remover coordenadas/endereço genéricos que não representavam uma localização comercial verificada.

### P1 — LinkedIn externo ainda aponta para o host antigo
A presença externa precisa ser atualizada manualmente para que o site oficial seja `https://www.francoromeufr.com.br/`.

### P2 — mídia e Google Images
A `main` ainda não possui um `sitemap-images.xml` operacional. O candidato do PR #14 possui uma pipeline mais avançada de mídia, mas está divergente da `main` e não deve ser mesclado sem reconciliação.

### P2 — PR #14 divergente
`codex/site-refactor-release-1` está atrás da `main` por commits recentes de Bing/IndexNow e à frente com uma grande refatoração. Um merge cego pode reintroduzir canonical sem `www`, sobrescrever `vercel.json` e perder ajustes de indexação.

## Correções executadas nesta branch

- canonical, OG, Twitter e URLs internas absolutas migrados para `www.francoromeufr.com.br`;
- JSON-LD migrado para o domínio oficial;
- nome principal da entidade normalizado para `Franco Romeu`;
- `sameAs` ampliado para perfis oficiais informados;
- endereço/geo genéricos retirados do JSON-LD até confirmação de dados públicos adequados;
- `SearchAction` removido do `WebSite`;
- `robots.txt` migrado;
- `sitemap.xml` migrado;
- redirect permanente do host `.vercel.app` configurado;
- rewrites explícitos para as seis rotas atuais;
- testes SEO atualizados para o domínio oficial;
- `AGENTS.md` e documentação operacional atualizados;
- workflows IndexNow duplicados removidos;
- IndexNow passa a ler as URLs canônicas do sitemap.

## Decisões estratégicas

### Entidade
Usar **Franco Romeu** como nome principal. `FR`, `ꟻR` e `Franco Romeu — Arte & Engenharia` são identidade/alternateName, não marcas concorrentes.

### Posicionamento
O diferencial mais defensável é a combinação:
- projeto;
- materialidade;
- execução controlada;
- engenharia de custo;
- visualização 3D;
- orçamento estruturado;
- documentação de processo.

A presença digital deve demonstrar isso com casos reais, não apenas afirmar.

### Conteúdo
Prioridade de hubs:
1. Projetos/cases;
2. Serviços;
3. Ambientes;
4. Materiais;
5. Processo;
6. Caderno técnico;
7. Inspirações claramente separadas de trabalhos executados.

Evitar páginas programáticas finas por cidade. Uma landing local só deve existir quando tiver serviço real, evidência local e conteúdo próprio.

### Prova e E-E-A-T
Criar biblioteca de evidência para cada case:
- origem e autoria da mídia;
- antes/processo/depois;
- escopo;
- materiais;
- decisões técnicas;
- data/local em granularidade publicável;
- autorização;
- distinção entre execução, render e referência.

### Google / AI Search
Não criar markup “para IA”. Conteúdo elegível para Search, rastreável, textual, original e com dados estruturados coerentes é a base também para AI Overviews/AI Mode.

### Analytics
Implementar GTM + GA4 após estabilizar a release e definir consentimento/LGPD. Eventos prioritários:
- `view_project`
- `view_service`
- `start_budget`
- `budget_add_service`
- `complete_budget`
- `generate_pdf`
- `click_whatsapp`
- `google_review_click`

Pixels de Meta/Pinterest/LinkedIn/TikTok devem ser adicionados somente quando houver objetivo de mídia e política de consentimento; não carregar todos por padrão.

## Não fazer

- não usar Google Indexing API para páginas normais;
- não criar AMP como projeto paralelo;
- não criar `hreflang` sem versões internacionais reais;
- não criar centenas de páginas por cidade/serviço sem conteúdo próprio;
- não inventar reviews, prêmios, certificações, endereço, prazos ou obras;
- não mesclar PR #14 antes de rebasing/reconciliação;
- não publicar endereço residencial como local comercial.

## Próxima sequência recomendada

1. CI desta branch.
2. Revisão e merge autorizado da canonicalização.
3. Deploy Vercel e teste real das seis rotas/redirects.
4. Search Console: confirmar propriedade de domínio e reenviar sitemap canônico.
5. Atualizar LinkedIn e outros perfis externos para o domínio oficial.
6. Rebase/reconciliação do PR #14 sobre a `main` atual.
7. Incorporar pipeline de imagens e `sitemap-images.xml`.
8. Implementar Google Business/reviews em servidor com fallback.
9. GTM/GA4 e consentimento.
10. Arquitetura editorial de cases/serviços/materiais.
