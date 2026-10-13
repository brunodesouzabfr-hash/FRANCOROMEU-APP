# Franco Romeu — Auditoria digital consolidada (original + v2)

**Data de consolidação:** 13/10/2026  
**Base de código preservada:** `main` em `79375412530cc37d0c199ba46f9416000a9271e6`  
**Origem canônica:** https://www.francoromeufr.com.br/  
**Origem 1:** `audit/estrategia-digital-2026-10-13` (`7b169b6`; comparação: 14 ahead / 7 behind)  
**Origem 2:** `audit/estrategia-digital-2026-10-13-v2` (`fe1e638`; comparação: 19 ahead / 5 behind)

> Consolidação seletiva e reversível. Os dois relatórios originais foram copiados integralmente em `docs/audits/`; esta versão **não apaga ou desautoriza a autoria**. Não é um merge literal dos históricos Git divergentes nem uma autorização para publicar.

## 1. Critério de fusão

- Primeiro, preservar `main`, código funcional, mudanças manuais de 13/10, domínio e verificações externas.
- Integrar os ganhos comuns: entidade Franco Romeu, `FR` e `ꟻR` como nomes alternativos, seis perfis oficiais, URL correta do Pinterest, documentação e regressões.
- Reaproveitar da primeira auditoria as decisões de canonical/OG/Twitter, `robots.txt`, seis URLs no sitemap, deep links SPA, 404 e consolidação de IndexNow. A `main` já incorporou versões mais recentes desses componentes; **não retroceder** para scripts antigos.
- Reaproveitar da v2 os diagnósticos de consistência de entidade, proveniência, documentação histórica, trilhas de conversão, schema e eventos, sem transportar exclusões de dados operacionais pedidas apenas nas auditorias.
- **Não** substituir `vercel.json` de `/index.html` por `/` sem teste HTTP em preview. `cleanUrls: true` sozinho não comprova comportamento correto.
- **Não** remover a meta `google-site-verification`, `BingSiteAuth.xml`, chave pública IndexNow nem o workflow mais recente da `main`.
- Não tocar FRBudgetCore, 115 serviços, 15 categorias, 7 cupons, preços, PDF, IQE, PWA, GitHub Actions ou alterações manuais recentes.

## 2. Inventário das informações removidas nas fontes históricas

| Campo JSON-LD | Na auditoria original/v2 | Resultado desta consolidação | Verificação adicional |
|---|---|---|---|
| `name` | Normalizar Franco Romeu | **Aplicado** | Não usar palavras-chave como nome fantasia |
| `alternateName` | FR, ꟻR, assinatura da marca | **Aplicado** | Nomes autorais, não serviços |
| `sameAs` | Redes e GitHub oficiais | **Aplicado** | URLs declaradas pelo proprietário |
| `telephone` | Removido na v2, sem reposição | **Preservado** `+55-11-99002-1603` | Telefone fornecido pelo proprietário |
| `email` | Removido na v2, sem reposição | **Preservado** `romeudifranco@gmail.com` | `@gmail.com.br` difere do contato anterior e precisa ser resolvido antes de alteração |
| `address` | Removido, sem reposição | **Preservado** com cidade São Paulo, SP, BR, sem rua/CEP | Não tratar cidade como sede ou endereço de atendimento |
| `geo` | Removido, sem reposição | **Preservado por pedido explícito**, valor legado -23.5505, -46.6333 | CENTRO APROXIMADO DE SÃO PAULO: não é a geolocalização verificada da Franco Romeu; corrigir com fonte primária antes de uso em mapas |
| `areaServed` | Permaneceu na v2 | **Preservado** conforme `main` | São Paulo, Guarulhos, Osasco, Barueri, Santo André, São Bernardo do Campo; confirmar cidades realmente atendidas antes de divulgar como cobertura garantida |
| `openingHoursSpecification` | Permaneceu na v2 | **Preservado** | Validar dias e 08h–18h no GBP |
| `paymentAccepted` | Permaneceu na v2 | **Preservado** | Validar meios anunciados |
| `priceRange` | Permaneceu na v2 | **Preservado** | Descrição genérica, não preço contratado |
| `WebSite.potentialAction` / `SearchAction` | Removido, sem substituição | **Preservado** | Validar comportamento real do parâmetro `/orcamento?busca=`; sem benefício de rich result prometido |
| `google-site-verification` | A v2 removia a tag | **Preservado** da `main` | Não perder método de verificação já publicado |

A diferença entre abrangência e geoponto é estrutural: `areaServed` cobre uma região comercial; `geo` deve designar um ponto do negócio, **não a região atendida**. Preservar um dado legado por cautela não valida sua precisão.

## 3. O que foi incorporado das duas auditorias

### Identidade, autoridade e dados estruturados

- Entidade única: **Franco Romeu**; aliases `FR`, `ꟻR` e `Franco Romeu — Arte & Engenharia`.
- `sameAs`: Instagram, Facebook, LinkedIn, YouTube, Pinterest e GitHub Organization informados pelo proprietário.
- Grafo conserva LocalBusiness, WebSite, BreadcrumbList, ItemList, FAQPage e 16 Services conforme `main`.
- Não introduzir reviews, notas, avaliações, prêmios, obras, certificados, garantias, cidades adicionais ou preços inventados.
- Domínio canônico `https://www.francoromeufr.com.br/`; verificar que OG, Twitter, JSON-LD, navegação e sitemap compartilham uma única origem.

### SEO técnico e infraestrutura

- Preservar `robots.txt`, `sitemap.xml` com seis rotas, meta de Google, `BingSiteAuth.xml`, chave pública de IndexNow e um único workflow `.github/workflows/indexnow.yml`.
- O workflow vigente na `main` aguarda o sitemap/chave em produção; a primeira auditoria foi precursora, mas não substitui a implementação mais robusta.
- Manter cinco rewrites de rotas, redirect do host legado e 404 de caminho desconhecido; validar rotas, query e redirects reais antes de promover mudança.
- Uma SPA com `pushState` não equivale a páginas pré-renderizadas. Considerar HTML por rota apenas após testes de build, indexabilidade e compatibilidade.
- Não usar Google Indexing API para páginas comuns; nem AMP ou `hreflang` sem necessidade comprovada.

### Conteúdo e marca

- Narrativa: projeto → materialidade → execução controlada → engenharia de custo → visualização 3D → documentação de processo.
- Hubs prioritários: 1) Projetos/cases; 2) Serviços; 3) Ambientes; 4) Materiais; 5) Processo; 6) Caderno técnico; 7) Inspirações identificadas separadamente de obras executadas.
- Para cada case: autoria, autorização, origem e SHA-256 da mídia, antes/processo/depois verificável, escopo, materiais, decisões técnicas, natureza `DOCUMENTED/RENDER/ILLUSTRATIVE/REFERENCE`, contexto local publicável e CTA contextual.
- Não promover imagens ilustrativas como execução ou criar páginas em massa por cidade sem prova/localidade distinta.
- `sitemap-images.xml` e pipeline editorial permanecem pendentes na `main`; PR #14 é fonte de estudo, sem merge automático.

### Descoberta → prova → lead → atendimento → orçamento

- Confirmar consistência de domínio, perfil Google Business, LinkedIn, demais redes, telefone comercial e áreas de serviço.
- Confirmar Search Console; enviar sitemap correto e acompanhar descoberta e indexação das seis rotas.
- Definir GTM/GA4, consentimento LGPD e os eventos `view_project`, `view_service`, `start_budget`, `budget_add_service`, `complete_budget`, `generate_pdf`, `click_whatsapp` e `google_review_click`.
- Instrumentar sem PII, evitar tags/pixels desnecessários e classificar eventos de intenção vs. leads reais.
- Métricas por período/fonte: impressões, CTR, buscas não-marca, leads válidos, contato iniciado, conversão em orçamento, CAC quando mensurável e taxa de indicação. Sem números fabricados nem garantia de ranking.

## 4. Pendências que não devem ser escondidas

1. Verificar por fonte primária o e-mail comercial — `romeudifranco@gmail.com` versus o texto posterior `romeudifranco@gmail.com.br`. Não publicar a extensão .br automaticamente.
2. Definir se o negócio exibe endereço de atendimento físico ou atua como prestador por área de serviço; não publicar moradia sem escolha explícita.
3. Validar coordenadas reais, municípios de atendimento, horários e pagamentos no Perfil da Empresa/contratos; `areaServed` não substitui endereço nem geoponto.
4. Confirmar que `?busca=` efetivamente executa a pesquisa. Se não executar, corrigir o comportamento ou remover o `SearchAction` em uma mudança futura autorizada.
5. Testar `vercel.json` (destino atual `/index.html` vs proposta v2 `/`) em preview e em caminhos inexistentes antes de trocar.
6. Conferir resultados de Search Console e sitemaps reais; a presença da tag de verificação não prova acesso ativo à propriedade.
7. Atualizar links externos antigos, inclusive LinkedIn se ainda apontar para o host automático.
8. Recuperar em etapas independentes os módulos úteis do PR #14, sem substituir `main` ou copiar 480 arquivos indiscriminadamente.
9. Testar Web Vitals e a experiência em dispositivos reais, sem confundir CI aprovado com performance publicada.

## 5. Evidências e governança

- Documentos autorais preservados integralmente em `docs/audits/estrategia-digital-2026-10-13-original.md` e `docs/audits/estrategia-digital-2026-10-13-v2.md`.
- Diferenças compiladas sobre `main`; os dois históricos de commit originais permanecem intactos e rastreáveis nas branches autorais.
- Preservação da aplicação verificada por diff restrito aos arquivos desta integração; rodar `npm test` e `npm run check:html` antes de merge e testar preview das rotas.
- `main` e produção não devem ser alteradas sem revisão, aceite e autorização específicos.
