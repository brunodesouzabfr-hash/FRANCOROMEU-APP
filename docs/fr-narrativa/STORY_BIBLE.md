# A linha que fica — direção e matriz de cenas

Base: main 8d31ff2d1bb13f51a0ec4fccb62ae219442d520d. Inventário G0 recebido e conferido novamente em 6/11/2026. As cópias anexadas têm os mesmos hashes do inventário e do prompt mestre já lidos. O pedido atual autoriza a reconstrução e um deployment de teste na Vercel. Produção e main permanecem fora desta publicação.

## Gates e premissas

G0: concluído no inventário entregue. G1: esta matriz é o roteiro de implementação. A instrução explícita de executar permite seguir os gates em modo autônomo, registrando premissas conforme seção 12 do prompt. Validação visual do proprietário continua sendo aceite de design, não é substituída por testes.

Padrão Quiet Evidence do anexo: Stardos Stencil, papel #F4F0EB, matéria #E8E2DA, tinta #2A2724, apoio #6E6660, sinal #8B7D6B e vazio #1C1A18. O monograma é o ativo oficial, sem redesenho. Uma linha de construção atravessa os seis capítulos. As transições usam o mesmo ritmo, origem e direção. Movimento livre em cenas visuais, controles imóveis durante uso. Campos e cálculos permanecem no motor original.

| Capítulo | Premissa e objeto | Atos / conteúdo do inventário | Resultado / saída |
| --- | --- | --- | --- |
| Home | Arte + Engenharia. Uma linha torna-se encontro material. | 1 tese e hero; 2 superfície; 3 design e marcenaria; 4 projeto 3D; 5 seleção original de transformações; 6 cinco estações do processo; 7 convite | Entender o método / Sobre, orçamento e IQE |
| Sobre | Decisões dão forma ao espaço. Planta em desenho. | 1 manifesto; 2 precisão, arte e materiais; 3 jornada; 4 reformas, laboratório e eventos; 5 catálogo de 115 serviços em 15 camadas; 6 FAQ existente; 7 conclusão | Perguntas convertidas em escolhas / Ambientes ou contato |
| Ambientes | O espaço se compõe antes de construir. Quatro fragmentos recompõem a imagem. | Abertura; 12 linguagens na ordem canônica, paleta, essência, descrição, frase, serviços e papéis; dossiês originais; resultado | Composição inicial revisável / detalhes originais e orçamento |
| Projetos 3D | O projeto antecipa decisões. Linha vira volume. | Vazio/medidas; proporção; circulação; luz; materiais; compatibilização; decisão. Seis conceitos canônicos e laboratório de dez projetos permanecem disponíveis. | Escopo compreensível / Portfólio ou orçamento |
| Portfólio | A transformação é lida em relações. Linha costura os pares. | Abertura; 60 pares / 120 mídias em 12 conjuntos de cinco pares; registros, cozinha/lavanderia, 20 grupos de ambientes e seleção histórica de 16 projetos; índice completo; conclusão | Inspeção de cada par no modal existente / Orçamento |
| Orçamento | A conversa torna-se escopo. Linha vira percurso. | Cliente, ambiente, serviços, dados, endereço/agendamento e finalização; IQE, PDF, persistência, WhatsApp e busca originais | Estimativa orientativa revisável / envio voluntário |

## Matriz de cobertura

| Inventário | Cena ou acesso preservado |
| --- | --- |
| Texto e seções originais das seis views | Cenas editoriais principais e painel “Explorar o capítulo completo”, mantendo os nós, IDs, texto e ações originais |
| 115 serviços / 15 categorias / 7 cupons | Sobre, ato “A obra por camadas”; catálogo canônico e orçamento original, sem alteração de preço, unidade, configurações ou IDs |
| 12 AMB_STYLES / AMB_TECH / galerias | Doze cenas com a composição e ligação para openAmbDetail original; museu preservado no capítulo completo |
| 6 conceitos / 10 projetos do laboratório 3D | Seis cenas de construção e laboratório original no capítulo completo |
| 60 pares e seus 120 media_id | Enxame determinístico, sem filtros que removam itens; índice de 60 links acessível sem JS |
| Portfólio histórico de 16 itens, 20 grupos, dossiê de 48 mídias | Seções originais preservadas no capítulo completo, com modais e serviços |
| 478 ativos referenciados | Arquivos e vínculos originais preservados; janela de imagens do enxame substitui as 120 imagens simultâneas do antigo split |
| FAQ existente em Orçamento | Reutilizado em Sobre, sem respostas comerciais novas; permanece no Orçamento |
| 337 HTMLs / rotas complementares | Build e geradores canônicos preservados; apenas a apresentação das seis views é transformada |
| Motor / IQE / busca / PDF / localStorage / analytics | Scripts originais mantidos; bridge __frCore e openProjectModal, sem segundo cálculo ou estado comercial |
| Contatos e logo | Ativos e canais canônicos já confirmados no inventário |

O painel de conteúdo completo é uma saída editorial acessível, expansível e animada, para preservar o acervo extenso sem impor dezenas de telas a quem quer tomar uma decisão. Toda seção original permanece na mesma view e rota. Não se alega cobertura visual verificada até concluir o relatório de QA.

## Enxame

Máquina idle → entering → parked → leaving. Quatro percursos determinísticos, duração total máxima 1,4 s, pares entram de baixo para cima com direções distintas. Dez imagens montadas e no máximo dez do grupo seguinte em pré-carga. Dois rótulos por par preservam a natureza real de cada mídia: reconstituição técnica / representação visual, sem desqualificar a execução física confirmada do projeto. O modal existente recebe as imagens exatas e o serviço relacionado, sem atribuir fotografias inexistentes.

Roda e toque só interceptados dentro da cena visível. Bordas liberam o scroll. Setas, PageDown, espaço, botões e hash #portfolio/conjunto-N. Fallback sem GSAP usa Web Animations; movimento reduzido troca discretamente. Registro dos IDs visitados é consultável em FRStory.audit().

## Reversão

Remover a chamada installStory do build reverte a camada de apresentação. Fonte canônica, fórmulas, IDs e persistência não são migrados. Reverter o commit de apresentação retorna o deployment ao estado original. Nenhuma promoção a produção faz parte desta entrega.
