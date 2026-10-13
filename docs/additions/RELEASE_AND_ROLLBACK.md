# Revisão e eventual publicação — operação separada

Nesta execução não houve commit, push, merge, deploy, DNS ou alteração de produção. A candidata está em `dist/` e é servida localmente na porta 4183; a 4182 foi descontinuada. As saídas anteriores permanecem em `/tmp/fr-consolidacao-Gb1BvD/`; esse caminho temporário não é backup permanente para operação de release.

Para reverter localmente por módulo, usar o diff específico de `scripts/build-site.cjs`, `scripts/build-journal.cjs`, `scripts/build-atlas-hubs.cjs`, `assets/js/fr-project-media.js`, `assets/css/fr-project-media.css`, `index.html` e estilos novos, sem `git clean`/reset amplo nem afetar `content/` ou `prepared-media/`. Não remover trabalhos não rastreados de outra origem.

Antes de publicar: confirmar autoria/direitos e rótulos por mídia; revisar antigos domínios impressos em artes; aprovar números e escopos comerciais separadamente; resolver ou aceitar explicitamente a dívida de LCP documentada em `qa/PERFORMANCE_BASELINE.md` e executar QA físico; confirmar domínio/redirect e conta de analytics; validar saída com allowlist e orçamento/PDF; gerar snapshot permanente da versão em produção. Publicação, Search Console, Google Reviews e perfis sociais exigem autorização e registro próprios.
