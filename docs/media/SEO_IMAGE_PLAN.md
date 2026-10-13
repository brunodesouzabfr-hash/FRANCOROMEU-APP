# Plano de SEO visual — Franco Romeu

Canônico: https://www.francoromeufr.com.br. Esta estratégia e seus exemplos são preparação editorial. Não há URLs novas publicadas nem sitemap ativo nesta entrega.

## Nomes e identidade

`media_id` é estável e independente do filename. `public_slug`, `public_filename` e `planned_public_path` são nomes planejados; `source_path` e `publication_source` preservam a origem. Duplicatas exatas convergem para um mesmo nome público. Variantes recebem sufixo de largura. Não repetir franco-romeu em todas as imagens nem acrescentar localizações, modelos comerciais ou materiais não confirmados.

Os nomes usam ambiente/objeto/material quando sustentado, função e distinção ilustrativa. Antes não herda os materiais pretendidos do depois. Exemplos no catálogo: `...-antes-reconstituido-055.webp`, `...-efeito-calacatta-depois-ilustrativo-055.webp`, `...-estudo-3d-ilustrativo-...webp`. A exportação WebP ainda precisa acontecer: mudar a extensão de PNG/JPG não faz conversão.

## Alt, título e legenda

Alt descreve o que os pixels e o apoio documental sustentam, de maneira curta e contextual. Ilustração inclui essa informação; não declarar execução, cliente, local ou produto por leitura visual. O título identifica o assunto; a legenda acrescenta relação de material/serviço e limite de evidência. Para elementos estritamente decorativos, alt vazio e nenhuma elegibilidade ImageObject/sitemap. Cards com texto preservam contain e leitura integral; evitar descrição de palavras-chave em série.

## ImageObject, autoria e entidade

Usar ImageObject para mídias semanticamente úteis e elegíveis, vinculadas à página/CreativeWork correto e à Organization central. Não gerar um objeto para cada fundo, CTA, logotipo repetido ou alias do mesmo arquivo. A elegibilidade está marcada por mídia; só emitir após liberação dos gates. `contentUrl` deve ser a URL real e rastreável da imagem, nunca um caminho local ou um placeholder.

`creator` é o autor efetivo, e não deve ser atribuído automaticamente à FR porque ela recebeu ou curou o arquivo. Quando confirmado, poderá apontar para `https://www.francoromeufr.com.br/#organization` ou para a pessoa/entidade correta. Enquanto desconhecido, omitir creator, copyrightNotice e license. `creditText` pode registrar a curadoria FR e a natureza ilustrativa. Usar `publisher` para associar a publicação à Organization. O exemplo `examples/imageobject.DRAFT.json` ilustra esse contrato sem inventar autoria.

Organization: name Franco Romeu, alternateName FR e ꟻR, URL canônica e @id /#organization. Logo: ativo existente `assets/brand/franco-romeu-logo-remaster-800.webp`, hash em organization.json, URL pública a validar. sameAs permanece vazio até perfis oficiais verificados. Não emitir LocalBusiness com endereço, telefone, CNPJ, coordenadas ou área de atendimento inventados. CreativeWork representa estudo ilustrativo de projeto; não representa obra construída comprovada.

## Sitemap específico de imagens

Entregues `sitemap-images.DRAFT.xml` e `IMAGE_SITEMAP_PLAN.json`. O XML agrupa 264 imagens elegíveis em suas páginas futuras e usa namespaces oficiais, `url/loc`, `image:image` e `image:loc`. Ele é rascunho sob docs/media, com aviso DO NOT DEPLOY: páginas e derivados ainda não existem. Não instalar em sitemap/robots antes de resolver todas as URLs e liberar status editorial.

Na implementação, emitir apenas imagens com active_indexable=true, página indexável, imagem acessível e contexto visível. Limite de 1.000 imagens por URL. Não incluir HOLD, referências externas, arquivos de transporte, duplicatas, decoração, CTA ou fontes arquivadas. `image:caption`, `image:title`, `image:geo_location` e `image:license` foram descontinuados pelo Google; legendas e títulos ficam no HTML/JSON-LD, não nessas tags. Não inventar lastmod: data de curadoria não é automaticamente data de alteração da página.

## Google Images e HTML

Usar `<img src>` com fallback quando houver srcset; conteúdo relevante não depende apenas de background CSS, canvas ou interação. Informar width/height, nomes breves, alt preciso e texto próximo. As relações projeto/ambiente/material/serviço formam o contexto da imagem e seus links. A mesma imagem pode aparecer em páginas relacionadas usando a mesma URL; não criar cópias por categoria. Conteúdo indexável essencial deve existir no HTML entregue ao rastreador. Nenhuma técnica garante posição ou indexação.

## OG e hero

Candidatos são explícitos no manifesto. A vista integrada do case e alguns panoramas são adequados; peças com texto pequeno, capas genéricas, pranchas cotadas, referências e HOLD não são OG/hero. Produzir derivado OG separado somente depois de validar um crop que preserve o objeto e o rótulo; registrar crop, hash e origem. Não ampliar variantes pequenas nem remover “ilustrativo”. Não inventar OG URLs antes da exportação.

## Arquivo social

As 49 entradas são assets e roteiros, não posts publicados. provider/url/publishedAt permanecem nulos; embedStrategy LOCAL_POSTER_NO_EMBED. Sem VideoObject, embedUrl ou uploadDate de publicação inexistente. O MP4 de 19,67 s é referência de edição externa, não Reel FR e não recebe publisher/creator FR por inferência. Verificar URLs, datas, autoria e direitos antes de inserir posts oficiais; sameAs exige a mesma confirmação.

## Gates para ativação

1. Mídia e página editorialmente liberadas, com status permitido e label visível.
2. Fonte, hash, dimensões e variante/crop conferidos; autoria/direitos confirmados.
3. URL da imagem e URL canônica da página existentes e rastreáveis; alt e legenda no contexto certo.
4. Emissão condicional de ImageObject e sitemap por elegibilidade; OG escolhido pela composição.
5. Validar HTML/JSON-LD/XML e revisar Search Console após uma publicação autorizada.

## Fontes técnicas oficiais consultadas

- Google Search Central — Image SEO: https://developers.google.com/search/docs/appearance/google-images
- Google Search Central — Image sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
- Schema.org — ImageObject: https://schema.org/ImageObject
- Schema.org — creator: https://schema.org/creator
- Schema.org — creditText: https://schema.org/creditText

Consulta em 2026-10-11. A documentação original do acervo é evidência de origem, mas suas instruções antigas de embed, domínio e indexação são substituídas por este contrato quando faltam URLs, fontes ou confirmação de autoria.
