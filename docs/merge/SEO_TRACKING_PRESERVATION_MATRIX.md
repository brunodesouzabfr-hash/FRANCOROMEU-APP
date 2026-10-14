# Matriz de preservação de SEO e rastreamento

Ambiente validado: build local `dist/` da branch de integração em 14/10/2026.

| Controle | Existia na main | Existia no Codex | Estado combinado | Evidência/status |
| --- | --- | --- | --- | --- |
| Canonical | `https://www.francoromeufr.com.br` | origem apex antiga em pontos do roteador | `www` em metadados, roteador, páginas estáticas, JSON-LD e sitemaps | PASS em 332 rotas |
| Entidade institucional | grafo consolidado com dados comerciais | build reduzia o grafo | função central `composeGraph`; uma entidade com `Organization`, `LocalBusiness` e `HomeAndConstructionBusiness` | PASS |
| Serviços estruturados | 16 serviços reais | incompleto no build gerado | 16 serviços nas seis páginas institucionais | PASS |
| FAQ | 5 perguntas no grafo | não preservada pelo gerador | apenas em `/orcamento`, com as mesmas 5 perguntas visíveis | PASS |
| Geo | coordenadas genéricas do centro de São Paulo | não era fonte verificável | removido do schema público; pendência registrada | REQUER APROVAÇÃO HUMANA para futura localização verificada |
| SearchAction | decisão histórica | comportamento não ligava a query à busca | `/orcamento?busca=` chama `FR_ASSISTANT.search()` após inicialização | PASS funcional/estático |
| GA4 | `G-22Z85RCGQC` | templates novos sem injeção única | ponto central de injeção e uma instância por HTML aplicável | PASS |
| Ahrefs | chave aprovada | templates novos sem cobertura uniforme | uma instância por HTML aplicável | PASS |
| Clarity | `yvdvt0rcy6` | cobertura parcial | uma instância por HTML aplicável | PASS |
| Google verification | valor vigente da main | parcial | preservada e injetada nos templates | PASS |
| Pinterest verification | valor vigente da main | parcial | preservada e injetada nos templates | PASS |
| Bing | `BingSiteAuth.xml` | não copiado para `dist` | allowlist pública explícita | PASS byte a byte |
| IndexNow | workflow e chave pública | chave não copiada para `dist` | um workflow; chave preservada na saída | PASS local; submissão externa NÃO EXECUTADA |
| Sitemap principal | host `www` | gerador por rotas | 6 URLs institucionais existentes e indexáveis | PASS XML |
| Sitemaps de imagem | infraestrutura do Codex | anunciava famílias geradas | mantidos, atualmente vazios porque não há imagem liberada para indexação | PASS conservador |
| Robots | sitemap canônico | geração adicional | aponta para os 4 sitemaps válidos | PASS |
| JSON-LD editorial | não cobria todo o novo acervo | `CreativeWork`/coleções isolados | instituição + página + breadcrumb/coleção com IDs estáveis | PASS |
| Reviews/AggregateRating | não autorizado | endpoint opcional | ausentes do schema; endpoint segue fail-closed e não ativado externamente | PASS |

## Política de indexabilidade

- Página pública não significa página indexável.
- As seis rotas institucionais estão `index, follow, max-image-preview:large` em produção e `noindex, nofollow, noimageindex` quando `VERCEL_ENV=preview`.
- As páginas editoriais novas são públicas para QA, mas continuam `noindex`.
- Nenhuma mídia possui `active_indexable=true`; por isso não há `ImageObject` público nem `<image:image>` ativo.
- Estado de indexação real em Google/Bing: **UNKNOWN**. Sitemap e canonical demonstram indexabilidade, não indexação. A inspeção em GSC/Bing só deve ocorrer depois de publicação autorizada.

## Privacidade e resiliência

O orçamento não envia dados pessoais às tags de analytics. O funcionamento comercial foi testado com analytics bloqueado. Consentimento e política de privacidade continuam sendo uma decisão jurídica/operacional externa ao merge técnico.

