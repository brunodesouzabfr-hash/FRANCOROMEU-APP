# Auditoria estratégica independente — Franco Romeu

**Data:** 2026-10-13  
**Base:** `main` após os commits de canonicalização, IndexNow e documentação de SEO do Codex.  
**Domínio público canônico:** `https://www.francoromeufr.com.br/`

## Estado validado

- `main` é a base canônica do produto.
- Canonical/OG/JSON-LD/sitemap foram migrados do host automático da Vercel para o domínio próprio.
- `robots.txt` aponta para o sitemap canônico.
- `vercel.json` contém redirect do host `.vercel.app` e rewrites para as cinco rotas não-raiz da SPA.
- IndexNow foi consolidado em um único workflow que aguarda a produção, valida a chave pública e envia URLs do sitemap.
- O fluxo vigente de produção é estático na raiz; `package.json` não possui `build` nem gera `dist/`.
- BingSiteAuth e a chave IndexNow estão versionados na raiz.
- O PR #14 permanece rascunho e não deve ser mesclado integralmente sobre a `main` atual.

## Problemas encontrados nesta auditoria

### 1. Entidade estruturada
O JSON-LD ainda misturava identidade de marca com dados operacionais não confirmados:
- telefone;
- Gmail;
- endereço/geo genéricos;
- horário;
- meios de pagamento;
- faixa de preço;
- cidades atendidas.

Esses campos foram removidos nesta branch até confirmação explícita como dados comerciais públicos.

### 2. Nome da entidade
O nome principal deve ser **Franco Romeu**. Descrições de serviço não devem ser usadas como `alternateName` para inserir palavras-chave.

Configuração proposta:
- `name`: Franco Romeu
- `alternateName`: FR, ꟻR, Franco Romeu — Arte & Engenharia

### 3. sameAs
O grafo foi ampliado para os perfis oficiais informados:
- Instagram
- Facebook
- LinkedIn
- YouTube
- Pinterest
- GitHub Organization

### 4. SearchAction
Removido do `WebSite`; não é estratégia de SERP vigente.

### 5. Links externos
A busca pública confirmou o perfil LinkedIn, porém ele ainda expõe o host Vercel legado como “Blog”. Esse campo deve ser alterado manualmente para o domínio oficial.

As demais redes fornecidas não retornaram resultados confiáveis no mecanismo de busca desta auditoria; por isso não foi inferido estado além das URLs declaradas pelo proprietário.

## PR #14 — estratégia correta

O PR #14 contém trabalho valioso:
- build público sem God Mode;
- PDF corrigido;
- pipeline de mídia;
- primeiro case independente;
- Google Reviews server-side opt-in;
- controles de quantidade;
- comparativo de referência;
- evidências de QA.

Mas ele parte de uma `main` antiga, altera 480 arquivos e está `mergeable: false`.

**Não mesclar integralmente.** Reaproveitar por módulos sobre a `main` atual, mantendo domínio, IndexNow, documentação e testes recentes.

## Prioridades seguintes

1. validar Search Console e reenviar sitemap canônico;
2. atualizar LinkedIn e demais perfis externos para `www.francoromeufr.com.br`;
3. reconciliar seletivamente os módulos do PR #14;
4. incorporar pipeline de imagens + `sitemap-images.xml`;
5. criar páginas/cases indexáveis e conteúdo técnico de prova;
6. ativar Google Reviews server-side somente com chave/quota/faturamento corretos;
7. implementar GTM/GA4 e consentimento LGPD;
8. auditar Core Web Vitals em produção;
9. só depois decidir migração estrutural para Next.js.

## Não fazer

- Google Indexing API para páginas normais;
- AMP como projeto paralelo;
- páginas em massa por cidade sem conteúdo/prova local;
- schema com reviews ou métricas inventadas;
- endereço residencial ou contatos pessoais no schema sem confirmação;
- merge amplo do PR #14.
