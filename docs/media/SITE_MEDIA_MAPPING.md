# Mapeamento editorial de mídia — Franco Romeu

Canônico: https://www.francoromeufr.com.br. Todas as rotas abaixo são propostas; esta etapa não as cria.

## Regras de consumo

1. Localizar por `media_id`, resolver `publication_source.root/path` e conferir SHA. `planned_public_path` é somente plano de exportação.
2. Excluir de exportação `HOLD`, `DUPLICATE`, `ARCHIVE`, referências externas e `publication.auto_publish=false` sem liberação editorial concreta. `seo.indexable` indica elegibilidade futura; `seo.active_indexable` está falso em todas as mídias.
3. Manter visível o `required_public_label`. Não omitir “ilustrativo” do título/alt para aparentar fotografia real.
4. Usar os eixos em `relationships`; não copiar o arquivo para cada ambiente/material/serviço. Reutilizar uma URL pública por mídia e variantes de resolução.
5. Uma seção deve explicar, provar, inspirar, converter, organizar ou encantar. O acervo atual explica/inspira/organiza; ele não prova execução de obra. Prova exige novas fontes documentais.

## Áreas futuras

| Área | Fonte e uso recomendados | Restrição editorial |
| --- | --- | --- |
| HOME | C001, vista integrada PRIMARY e poucos recortes complementares | Chamar de visualização de projeto; hero com rótulo visível |
| SOBRE / Serviços em matéria | C001 e materialidade em ESTUDOS & MATERIALIDADE | EXECUÇÕES DOCUMENTADAS permanece vazio |
| SERVIÇOS | Relação representada/planejada de media-service-map; exemplos de material e detalhe | Não publicar “serviço executado neste cliente” |
| PROJETOS | Estudos com tipo e label explícitos; C001 preferencialmente em projetos-3d | Separar futuras obras documentadas dos 110 conjuntos atuais |
| PROJETOS 3D | Rasters PROJECT_3D do case e detalhes sem cotas não validadas | Sem modelo interativo/GLB/CAD inventado |
| AMBIENTES | 24 ambientes normalizados; seleção PRIMARY por narrativa | Subtipos como suíte/closet-galeria ficam como rótulos, não imóveis comprovados |
| PORTFÓLIO | ESTUDOS & MATERIALIDADE, com cards e galerias curados | Não misturar estudo e obra documental na mesma promessa |
| INSPIRAÇÕES | 48 trilhas sociais completas + três do case; comparativos simulados | Terceira etapa é EXEMPLO ILUSTRATIVO, não execução real |
| MATERIAIS | Painéis de estudo e detalhes de aplicação com material_assertions | Termo comercial não prova composição, fornecedor ou desempenho físico |
| ESTILOS | Rótulos de estilo dos conjuntos I101–I149 | Não gerar páginas duplicadas automaticamente |
| PROCESSO | Narrativa textual; mídia de processo do case permanece HOLD quando sem fonte | Não apresentar montagem gerada como registro de obra |
| CADERNO TÉCNICO | Fichas e explicações de compatibilização sustentadas pelo acervo | Não promover cotas visuais não validadas a dimensões executivas |
| ARQUIVO SOCIAL | 49 conjuntos locais e capas corretas; provider/url/publishedAt nulos | Sem posts/embeds/VideoObject até URL verificada |
| ORÇAMENTO | Referência de ambiente/material para orientar briefing | Sem alterar FRBudgetCore, preços, cupons ou garantias |
| GOOGLE IMAGES | 264 mídias semanticamente elegíveis após gates e URLs reais | Nunca exportar todo o acervo, HOLD ou decoração ao sitemap |
| CONTATO | Organization confirmada e canais oficiais posteriormente verificados | Não copiar contatos impressos antigos por inferência |

## Narrativas

Antes/depois: ANTES RECONSTITUÍDO → condição inicial → intervenção representada → materiais do estudo → serviços representados → DEPOIS ILUSTRATIVO. Os 60 pares têm endpoints válidos, mas não constituem cronologia de obra. Processo e 3D permanecem vazios quando não existem. Usar comparação lado a lado; nenhum alinhamento geométrico de slider foi validado.

Case C001: ambiente → estudo 3D ilustrativo → materialidade → detalhe aprovado → exemplo ilustrativo → serviços relacionados → briefing de orçamento. `model_3d=null`. As variantes de teto/aéreos não representam antes/depois entre si. As cenas não devem ser espelhadas nem receber novas janelas, controles ou contagem de pendentes por reconstituição automática.

Inspirações: etapa 1 é um nó semântico de ambiente (capa de família opcional); etapa 2 é painel/detalhe de material; etapa 3 é aplicação ilustrativa. A capa genérica não prova o projeto específico. I124 possui etapa 3 nula e status HOLD_INCOMPLETE.

## Curadoria e formatos

Hero/OG: a vista integrada do case é candidato forte, com composição legível e sem texto miúdo. Cards de material/ambiente com texto embutido usam contain e leitura integral; não são hero/OG. Capas de família são posters sociais, não imagens do projeto. M047_PANEL_DIREITO tem resolução nativa limitada; não ampliar para hero. Os 49 encerramentos/CTA, fundos e pranchas-fonte ficam no arquivo. Não repetir cinco vistas semelhantes na mesma galeria: preferir um panorama, um estudo, um detalhe de material, um objeto e uma relação de serviço.

## Referências interativas

`content/media/design-references.json` contém decisões REFERENCE_ONLY para Spiral Gallery, Sergio Ayala e cards orbitais porque seus arquivos não foram recebidos. Não representa avaliação visual concluída. O vídeo de ritmo é REFERENCE_ONLY; a captura de instruções externas é DISCARD para publicação. IMPLEMENT/ADAPT só depois da análise dos arquivos reais, sem cópia integral de sites externos.
