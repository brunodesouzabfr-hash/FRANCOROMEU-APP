# Fase 9.2 — SEO local e captação comercial (Franco Romeu)
Data: 17/10/2026. Base da branch: `main` em `16b834ef1a1bcbaa20e16d1caf091480aa0e657f`.

## Evidência antes da alteração
- GSC propriedade `sc-domain:francoromeufr.com.br`: nos 28 dias consolidados até 14/10, 1 clique, 9 impressões e CTR 11,11%. Amostra insuficiente para conclusões de ranking.
- O sitemap enviado em 17/10 contém 6 URLs; relatório de sitemap mostrou 0 indexadas, **mas a inspeção de URL confirmou a Home como `PASS / Submitted and indexed`**, rastreamento mobile em 15/10, `INDEXING_ALLOWED`, canonical Google `https://www.francoromeufr.com.br/`. Os números do relatório de sitemap não são contagem de todo o índice.
- Organização e cidades atendidas derivadas exclusivamente de `content/media/organization.json`. Não inventar segunda filial nem endereço de escritório.

## Entrega 9.2
- Um hub público `/solucoes/` e quatro páginas detalhadas `/solucoes/marcenaria-sob-medida/`, `/solucoes/drywall/`, `/solucoes/pisos/` e `/solucoes/revestimentos-e-acabamentos/`.
- Conteúdo curado de modo independente por serviço: aplicação, etapas, exigências materiais, perguntas e CTA para a calculadora de orçamento existente. Nenhum preço, depoimento, nota, endereço de visitação, obra específica ou prazo fictício.
- Fonte de verdade de IDs: `content/services/media-service-map.json`; instituição, telefone e cidades: `content/media/organization.json`. A apresentação não altera os 115 serviços do núcleo de orçamento.
- Indexação permitida em produção **apenas** para essas cinco novas páginas previamente revisadas e para as seis páginas SPA existentes; demais páginas de estudos continuam `noindex` conforme guardrails editoriais.
- `WebPage`, `CollectionPage`, `Service`, `BreadcrumbList` em JSON-LD com uma única identidade institucional por página; sem avaliações não verificadas, coordenadas fabricadas ou preços.
- Links internos nos blocos de descoberta das views Home, Sobre e Orçamento. Contato direto via WhatsApp oficial e CTA de orçamento existente.
- Em preview, as novas páginas usam `noindex,nofollow,noimageindex`; cada página tem canonical absoluto `www`.
- O módulo de intenção Fase 9.1 pode medir o clique nos links oficiais como **interesse**, não conversa concluída ou contrato fechado.

## Portões de qualidade
1. `npm test`, `npm run check:html`, `npm run build`, `npm run check:project-library`, `npm run check:idempotence` e FR Quality Gate.
2. Teste `tests/fr-local-services-phase92.test.cjs`: apenas quatro IDs aprovados, um H1/canonical por página, título/descrição únicos, links internos, Schema.org coerente, 5 URLs em sitemap, nenhuma mídia não aprovada.
3. Compatibilidade desktop/mobile, acessibilidade de teclado e `prefers-reduced-motion`; sem captura adicional de dados pessoais.
4. Após integração: verificar `READY` na Vercel e HTTP 200 de `/solucoes/` e das quatro páginas no domínio oficial. Inspecionar sitemap completo antes de submeter ao GSC.

## Limites e próximos passos
Esta fase não cria automação de mensagens nem um CRM com PII. `/orcamento` e WhatsApp ainda recebem o usuário no fluxo atual.
Um CRM legítimo exigirá origem de consentimento, política de retenção, escopo de acesso, etapas comerciais e um canal de integração seguro. O modelo recomendado é:
`intenção web → contato consentido → avaliação → proposta → negociação → aprovado/perdido → pós-obra`.
Não inserir e-mail, endereço, telefone do cliente, cupom, projeto privado ou texto livre em GA4 ou URL analítica. O cadastro de lead deve ocorrer num sistema restrito e sob LGPD.
O crescimento orgânico e a indexação de novas páginas são resultados externos e **não garantidos** pela publicação de uma rota ou pelo aceite do sitemap.

## Rollback
Reverter o merge/PR em `main` sem force push. Remover geração das 5 rotas e a injeção de links, executar build e conferir sitemap. Não mexer em `FRBudgetCore`, navbar, intro ou arquivos originais.
