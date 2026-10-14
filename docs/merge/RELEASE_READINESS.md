# Readiness da integração

Versão avaliada: branch `codex/integracao-portfolio-seo-main-2026-10-13`, build local de 14/10/2026.

## Gate consolidado

| Área | Estado | Evidência | Pendência |
| --- | --- | --- | --- |
| Git/preservação | PASS | worktree isolada; branches originais e stash intactos | confirmar status final após commits |
| Build | PASS | 832 arquivos; 332 rotas; fingerprint reproduzido em checkout limpo do commit `a969729` | validar também no preview Git |
| Orçamento | PASS | 115 serviços, 15 categorias, 7 cupons; núcleo com hash idêntico | nenhuma mudança financeira autorizada ou feita |
| SEO técnico local | PASS | canonical `www`, 16 serviços, FAQ coerente, sitemaps XML, robots, redirects e 404 | indexação real é UNKNOWN até publicação/GSC |
| Rastreadores | PASS local | GA4, Ahrefs e Clarity únicos por HTML aplicável | política de consentimento externa |
| Bing/IndexNow | PASS local | arquivos na `dist`, um workflow e payload derivado do sitemap | nenhuma submissão real executada |
| Mídia/fidelidade | PASS conservador | 284 mídias; SHA/dimensões; rótulos; 0 imagem indexável | aprovação humana de direitos/autoria |
| QA responsivo | PASS emulado | 320, 360, 390, 412, 768, 1024, 1280, 1440 e 1920; 54 checks de view | aparelho físico não testado |
| Acessibilidade funcional | PASS no escopo testado | teclado, Escape, restauração de foco, 44 px, reduced motion, overflow zero | não equivale a certificação WCAG completa |
| Orçamento/persistência | PASS | CTA real, edição de quantidade, reload, export/import e rejeição atômica | nenhuma |
| PDF | PASS sintético | caso curto de 1 página e longo de 3 páginas, inspeção visual sem corte/sobreposição | dados usados são sintéticos |
| Performance lab | FAIL | LCP mediano 3.896 ms; CLS 0,00276; CPU 4×, 150 ms, 200 KB/s, cache frio | otimizar LCP/HTML/recursos antes de aprovar performance |
| INP/field data | BLOCKED | não há CrUX/GSC de campo nesta sessão | medir após tráfego suficiente |
| Vercel candidata histórica | FAIL diagnosticado | `ENOENT` em `CODEX USE AQUI`; correção local implementada | validar novo preview Git e logs |
| Cloudflare Workers | BLOCKED | check `Workers Builds: francoromeu-app` falhou em `f9a5f11` | acesso/logs da integração Cloudflare e decisão do proprietário |
| Produção | NOT_APPLICABLE | tarefa não autoriza deploy/merge | aprovação posterior obrigatória |

## QA observado

- Não houve overflow horizontal, imagem quebrada ou erro de página nos viewports finais auditados.
- Três links da Home foram encontrados abaixo de 44 px, corrigidos de forma localizada e revalidados em 390×844 e 1440×900.
- Menu mobile, Escape, foco, history/back, seis rotas diretas, 404, God Mode público ausente, busca, orçamento, persistência e estados Google sucesso/vazio/indisponível passaram.
- Os scripts de analytics foram bloqueados durante QA local; a aplicação permaneceu funcional.

## Decisão atual

**PR de integração em rascunho: permitido. Merge em `main` ou promoção para produção: bloqueados.**

Bloqueadores antes de qualquer merge/publicação:

1. Preview Vercel do commit final em estado `READY`, com rotas e arquivos públicos verificados.
2. Diagnóstico ou desativação explicitamente autorizada do check Cloudflare Workers; não contornar silenciosamente.
3. Decisão consciente sobre o LCP acima de 2,5 s ou correção com nova medição equivalente.
4. Revisão humana das mídias ainda não liberadas e manutenção de `noindex` enquanto isso.
5. Decisão específica sobre endereço/geo se houver fonte comprovada; não reutilizar as coordenadas genéricas.

## Rollback

O rollback de código é manter `main` no SHA auditado `9b2b5d37b67b222fb272a03f54da948859bcf976` e fechar o PR sem merge. Nenhum domínio, deployment de produção ou conta externa foi alterado nesta integração.

