# Spike incremental de arquitetura — 11/10/2026

## Resultado

Página estática independente `/projetos/cozinha-lavanderia` gerada pelo build atual, com HTML e imagens disponíveis sem JS. JavaScript somente para filtro/modal. O visitante continua na calculadora original por link HTTP; estado e motor não são duplicados.

O HTML final do spike mediu 60.124 B / 7.790 B gzip offline. Isso é peso de arquivo, não tempo de carregamento ou CWV em campo. O relatório de build vincula a revisão final aos hashes de HTML **e** de assets.

| Alternativa | Evidência atual | Decisão nesta release |
|---|---|---|
| HTML gerado + módulos progressivos | Spike implementado e testável sobre dependências já instaladas | Usar neste case e preservar a SPA |
| Framework híbrido/Next.js | Não instalado nem ensaiado; requer autorização e adaptação dos contratos | Candidato futuro, não migração aprovada automaticamente |

## Limites

- Estudo ilustrativo, não obra documentada; sem cotas, modelo manipulável ou serviços “executados” inferidos.
- As seis rotas antigas ainda compartilham o DOM e scripts da SPA. Sua pré-renderização não é isolamento completo por rota.
- Hubs de serviço, materiais, ambientes e cases de execução não foram criados sem conteúdo específico suficiente.
- Header do spike conserva os mesmos links/contatos e identidade, mas o componente compartilhado de navegação para a arquitetura-alvo ainda exige extração.
- Não houve consulta a branches rejeitadas, framework/bundler novo ou motor paralelo.

## Rollback

Retirar o gerador do case, seu link e suas entradas de sitemap no mesmo diff. As seis views e a calculadora permanecem. Não apagar originais; os 162 derivados possuem inventário para remoção futura deliberada.
