# Auditoria de Estratégia Digital — Franco Romeu

**Data:** 2026-10-13  
**Domínio canônico:** https://www.francoromeufr.com.br/  
**Base auditada:** `main` após os commits `59d4e9148978f94fb325caba8f8cb87f4e731ec4` e `a7af351219f1a7173202cd5d113f5a8973aae791`  
**Branch de correção:** `audit/estrategia-digital-2026-10-13`

## Resumo executivo

Durante a auditoria, o Codex avançou a `main` em paralelo: o commit `59d4e914` consolidou `www.francoromeufr.com.br` em canonical/OG/JSON-LD/sitemap e adicionou redirect/rewrites; o commit `a7af3512` endureceu o IndexNow e atualizou a documentação operacional. Esta auditoria foi então reconstruída sobre esse novo estado, mantendo essas melhorias e limitando o PR aos deltas ainda necessários.

O delta desta auditoria normaliza a entidade `Franco Romeu`, amplia `sameAs`, remove dados comerciais genéricos/não confirmados do schema, remove `SearchAction` sem utilidade atual na SERP, alinha rewrites com `cleanUrls: true`, fortalece testes e documenta a estratégia.

## Achados críticos

### P0 — domínio canônico divergente, corrigido pelo Codex durante a auditoria
O estado inicial ainda promovia `francoromeu-app.vercel.app`; o commit `59d4e914` corrigiu canonical, OG, JSON-LD, robots, sitemap e testes para `https://www.francoromeufr.com.br`. O commit `a7af3512` alinhou README/AGENTS/IndexNow. A auditoria preserva essas correções e marca documentação histórica antiga como superada para fins de domínio.

### P0 — deep links SPA
O site depende de rotas de History API. A configuração da Vercel precisa resolver explicitamente:
- `/sobre`
- `/ambientes`
- `/projetos-3d`
- `/portfolio`
- `/orcamento`

sem transformar qualquer URL desconhecida em Home, para preservar 404 real.

### P1 — IndexNow duplicado, corrigido pelo Codex durante a auditoria
Havia múltiplas cópias. O commit `a7af3512` deixou um único workflow que aguarda a produção, valida a chave pública e envia as URLs canônicas do sitemap. Esta auditoria preserva esse workflow mais robusto.

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
- telefone/e-mail herdados retirados do JSON-LD até confirmação explícita de que são contatos comerciais públicos;
- `SearchAction` removido do `WebSite`;
- `robots.txt` migrado;
- `sitemap.xml` migrado;
- redirect permanente do host `.vercel.app` configurado;
- rewrites explícitos para as seis rotas atuais;
- testes SEO atualizados para o domínio oficial;
- `AGENTS.md` e documentação operacional atualizados;
- o workflow IndexNow robusto já presente na `main` foi preservado sem regressão.

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

1. CI desta branch e validação do preview Vercel.
2. Revisão e merge autorizado do delta de entidade/roteamento.
3. Deploy Vercel e teste real das seis rotas/redirects.
4. Search Console: confirmar propriedade de domínio e reenviar sitemap canônico.
5. Atualizar LinkedIn e outros perfis externos para o domínio oficial.
6. Rebase/reconciliação do PR #14 sobre a `main` atual.
7. Incorporar pipeline de imagens e `sitemap-images.xml`.
8. Implementar Google Business/reviews em servidor com fallback.
9. GTM/GA4 e consentimento.
10. Arquitetura editorial de cases/serviços/materiais.
