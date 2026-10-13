# Próxima etapa de implementação — contrato de conteúdo

Esta etapa editorial está concluída. Este plano orienta o trabalho futuro; não executa redesign, migração, alteração financeira, domínio ou publicação.

## 1. Conectar fontes e validar

No checkout do branch `codex/site-refactor-release-1`, conferir o estado do Git e ler AGENTS.md. Resolver `realpath "CODEX USE AQUI"` a partir da raiz do repositório e confirmar que o diretório existe. Se houver symlink, preservar a referência; não copiar novamente o acervo inteiro. O caminho `/home/romeu/...` não existia no ambiente desta auditoria.

Extrair este pacote de entrega em uma pasta isolada. Copiar apenas `content/` e `docs/media/` para o checkout, depois de verificar ausência de colisão com trabalho atual. `media-recovery/` deve permanecer resolvível como PACKAGE_ROOT ou receber um destino explícito com atualização registrada em lote. Manter CODEX_ROOT fora de publicação automática. Executar o validador com as raízes reais e conferir todos os hashes antes de alterar nomes.

## 2. Aplicar nomenclatura e derivados em lote

Consumir `RENAMING_MAP.csv` como plano. Não fazer rename parcial. Confirmar todas as fontes por hash, os destinos, ausência de colisões e exclusão de HOLD/arquivo/referências. Criar um novo log de execução com original_path, original_filename, source_sha256, media_id, new_path, new_filename e new_sha256. Exportar `.webp` a partir de `publication_source`, sem apagar a fonte. Nunca apenas trocar a extensão. Reutilizar as 162 variantes existentes quando adequadas; não recomprimir tudo sem necessidade.

Gerar resoluções proporcionais, sem upscale; preservar orientação, enquadramento e rótulos. O tamanho máximo de cada variante é a resolução verificada disponível. Cards com texto e pranchas usam contain. Derivados que atualizem rodapés/domínio ficam separados, com autoria e transformação registradas. Recuperação aqui significa recorte de pixels íntegros do pai, sem criação de pixels por IA.

## 3. Construir adaptador dos manifests

Ler os envelopes documentados no README, validar schema_version e resolver IDs entre media, projects, environments, materials e services. `source_occurrences` contém aliases de arquivos idênticos; não duplicar as mídias. As 148 entradas de materiais são termos editoriais de catálogo, não promessa de páginas independentes.

Aplicar gates de publicação: status e rank permitidos, fonte resolvida/hash conferido, direitos/criador confirmados, contexto e label visíveis, URL canônica da página e da imagem efetivamente existentes. Mídias HOLD nunca entram por fallback. Se faltar alt, material ou ambiente, não preencher por adivinhação; preservar null e a decisão registrada.

## 4. Implementar por narrativa

Começar pelo case aprofundado C001 e atlas de ambientes/materialidade, com poucos exemplos escolhidos. Integrar os 60 comparativos como simulações; process_media_ids e project_3d_media_ids não recebem conteúdo fabricado. Consumir as 51 trilhas completas; I124 continua fora de publicação. Capas de biblioteca/gourmet usam o mapeamento corrigido.

Portfólio e Sobre separam ESTUDOS & MATERIALIDADE de EXECUÇÕES DOCUMENTADAS, atualmente vazia. Hero e OG usam candidatos sem texto pequeno. Não usar galeria para inflar quantidade. Cada bloco declara sua função editorial e uma informação útil.

## 5. Ativar SEO somente com páginas e imagens reais

Usar o canônico `https://www.francoromeufr.com.br`. Não migrar domínio com base em textos antigos do briefing. Produzir HTML rastreável para informações essenciais, imagens com src, dimensões e alt; metadados, JSON-LD e sitemap conforme SEO_IMAGE_PLAN. O arquivo sitemap-images.DRAFT.xml é um plano, não deve entrar em produção neste estado.

Organization tem nome, alternateName e canônico confirmados; o logo é ativo existente com URL pública a validar. sameAs, LocalBusiness, creator e licenças dependem de fontes verificadas. SocialArchive é DRAFT_ASSET_ONLY; nenhuma URL social ou uploadDate será inventada.

## 6. Verificar e apresentar mudança concreta

Após a implementação futura, validar o grafo e os arquivos, acessibilidade e narrativa, ausência de provas documentais falsas, labels e SEO. Executar os checks exigidos pelo repositório (`npm test`, `npm run check:html`) e revisão de diff. Versionar somente arquivos de conteúdo/código e ativos selecionados, sem `git add .`. Nunca versionar CODEX_USE_AQUI.zip, parte_aa…parte_ae ou ZIPs de transporte.

Nesta tarefa não foram alterados FRBudgetCore, preços, cupons, Home, componentes sociais, domínio ou produção; nenhuma publicação Vercel foi solicitada/executada. Uma futura publicação deve partir de um resultado revisável e dos gates existentes no projeto.
