# Integração das animações no site Franco Romeu

Base: `FRANCOROMEU-APP`, `main` em `8d31ff2`. Branch de trabalho: `codex/integracao-animacoes-acervo-20261105`.

## Resultado

| Área | Comportamento |
| --- | --- |
| Portfólio / Antes & Depois | 30 comparativos em 10 posts de feed, com três fotos por carrossel, setas, indicadores e swipe nativo. Três formatos alternam retrato, enquadramento compacto e texto + imagem; três pausas editoriais apresentam os serviços do acervo. Os outros 30 permanecem no duplo scroll inverso com card central. Nenhum dos 60 pares é perdido ou duplicado entre as apresentações. |
| Projetos 3D | 11 recortes do mesmo projeto, com as etapas disponíveis em recortes progressivos, barra vertical, alça de 48 px e botões, conforme a referência. As 18 vistas públicas entram nos recortes; três vistas arquivadas não são promovidas. |
| Reels Design / Ambientes em sequência | 48 trios em 20 ambientes: capa do local → painel de materiais → aplicação no ambiente. O mesmo controle funciona nos detalhes e nos visualizadores do Portfólio. |
| Fotos do acervo | Legenda numerada com materiais e serviços da ficha. Seis imagens principais têm pontos de item com coordenadas inspecionadas; as demais usam números de legenda, sem fingir uma localização espacial ainda não conferida. O atlas de 12 estilos também reaproveita suas descrições e serviços existentes. |
| Ambientes / Luz | Cinco imagens próprias da cozinha indicada: 06h, 09h, 12h, 17h e 22h. Scroll e controle manual compartilham a mesma sequência. |

Os módulos novos usam Stardos Stencil com fontes locais licenciadas, verde FR, osso, ouro e laranja. A navegação e os módulos comerciais existentes permanecem na base canônica.

## Fontes e conteúdo

Referências de interação:

- https://imersivesite.vercel.app/projetos/cozinha-lavanderia
- https://the-quiet-evidence-fr.romeufranco.chatgpt.site/#evidence-kitchen

Foram inspecionadas no navegador. O comparador de duas camadas usa recorte lateral; a sequência de projeto usa os recortes progressivos da função `compare()` do site de referência; apenas a sequência de luz usa mistura entre estados adjacentes. Escolher uma etapa, arrastar ou abrir um ponto numerado suspende a atualização automática da respectiva cena até “Seguir scroll”.

`content/experience/project-stages.json` relaciona as vistas pelo setor e objeto. Algumas etapas usam perspectivas distintas, como nas referências. A matriz não certifica correspondência métrica. Não se cria um “antes” nem uma fotografia de execução a partir de uma imagem de outro local.

Somente a integração completa tem os quatro estados disponíveis. Outros recortes mantêm duas ou três etapas, identificadas conforme a imagem disponível. O resultado representado mantém seu rótulo de representação visual; não é convertido em fotografia documental.

As fichas distinguem o **tampo direito em MDP cinza** do **frontão claro em quartzo Calacatta**. Essa diferença está nos marcadores. O material não é inferido apenas pela cor da imagem.

As imagens de luz foram produzidas com `image_gen` usando a imagem `cozinha-env-lavanderia-imagem-ilustrativa-986cf34222.webp` como alvo de edição, alterando iluminação, reflexos e sombras. A imagem original permanece intacta. Os arquivos preservam o enquadramento na inspeção visual; não se declara identidade de pixels nem simulação fotométrica. À noite, o teto fica apagado, e o ripado, móveis, pendentes e sóculos mantêm luz quente. Às 17h, a cena continua diurna, sem pôr do sol alaranjado.

## Manutenção

- `src/fr-evidence-scenes.cjs`: composição no build e manifesto público.
- `assets/js/fr-evidence-scenes.js`: controles, propriedade da interação, fallback nativo e disclosures.
- `assets/css/fr-evidence-scenes.css`: composição responsiva e redução de movimento.
- `content/experience/`: etapas, pontos inspecionados e imagens de luz.
- `assets/experience/light-sequence/`: cinco derivados WebP, sem alterar a coleção histórica congelada.
- `docs/experience/PROJECT_VIEW_AUDIT.json`: agrupamento e lacunas das vistas.

Trocar mídia ou ponto significa editar o respectivo JSON. A biblioteca pública é gerada no build; não se edita `dist/`.

## Medição preparada

As ações emitem `frEvidenceInteraction` no documento com `type`, `scene` e `media_id`, sem informação de contato. Tipos: `scene_scrub`, `scene_state`, `scene_resume`, `image_hotspot`, `project_view` e `feed_slide` (identificado pelo post). A integração desses eventos a relatórios de conversão pode ser feita separadamente, respeitando a instrumentação existente. Nenhuma métrica de resultado comercial foi inventada.

## Reversão

Reverter o commit desta integração restaura as apresentações anteriores. Não há migração de `localStorage`, de `serviceId`, do estado do orçamento ou do motor financeiro. Nenhum preço, fórmula, cupom ou serviço foi alterado. O domínio e os rastreadores permanecem na configuração existente.

## Ajuste de 06/11/2026

A referência em produção `imersivesite.vercel.app` foi confirmada no deploy `dpl_7iNz4zcshe5jd6AsB8Ai5Sb7sSsq`, commit `d3e29906d22a3d8528dbb84bc73aa50e8d00fddd` de `FRANCOROMEU-IMMERSIVE`. A fonte consultada é `src/quiet-evidence/runtime-start.js`, função `compare()`, junto de `assets/quiet-evidence/site.css`.

Para três imagens, a segunda revela `min(100, progresso × 2)` e a terceira `max(0, (progresso − 50) × 2)`. As imagens permanecem opacas e a linha/alça acompanha o controle de 0 a 100%. O mesmo cálculo é estendido às quatro etapas da integração e aos recortes de duas etapas. A iluminação mantém a dissolução. Nos intervalos entre etapas, os marcadores espaciais ficam recolhidos para não atribuir o item a uma camada parcialmente coberta.

O feed conserva os 30 pares e seus links; os outros 30 continuam no duplo scroll. Sua rolagem vertical é livre. O gesto lateral fora da faixa central troca de foto; a faixa central controla antes/depois. Setas, indicadores e teclado oferecem as mesmas ações. Slides fora de foco ficam `inert`; a navegação do carrossel não captura as teclas do slider de comparação. Não são usados contadores de curtidas, comentários ou engajamento inventado.

Evidências visuais: [barra 3D](qa/3d-bar-20261106.png) e [feed](qa/portfolio-feed-20261106.png).
