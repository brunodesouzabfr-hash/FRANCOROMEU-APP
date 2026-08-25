# Briefing dirigido — Portfólio / arquivo de mídia orbital

## Papel das referências

Este briefing pode acompanhar duas capturas independentes. Identifique a origem pelo host e use cada uma somente para seu papel:

- `sd-spiral-gallery.vercel.app`: profundidade, percurso helicoidal/espiral, distribuição de planos no espaço, relação entre câmera, arraste e progressão da galeria.
- `inspiring.nk.studio/es`: tela de entrada preservada, transição deliberada para um arquivo explorável, navegação lateral/horizontal, sensação gravitacional, contador, orientação de gesto e foco em um item por vez.

Trate ambas como referências comportamentais. Não una marcas, textos, imagens ou código das duas páginas.

## Regra inviolável: preservar a entrada do Portfólio

A tela inicial atualmente existente na aba **Portfólio** do FRANCOROMEU-APP é patrimônio funcional e visual. Ela deve continuar sendo a primeira experiência apresentada, com a mesma identidade, conteúdo, animações, controles, IDs, eventos e responsividade.

A experiência nova deve ser aditiva e provisoriamente chamada `FRMediaOrbitRail`. Ela pode começar:

1. depois da primeira dobra e do conteúdo introdutório atual; ou
2. por uma ação explícita original FR, como “Explorar arquivo FR”.

Não substituir o hero, não apagar a grade atual, não mudar a rota inicial e não sequestrar o scroll imediatamente ao entrar na aba. Ao sair do arquivo orbital, restaurar foco, posição de scroll e item selecionado.

## Observar e documentar

1. Estado anterior à entrada, ação que inicia a galeria e transformação entre entrada e arquivo.
2. Geometria observável do percurso: espiral, anéis, profundidade, inclinação, espaçamento aparente e orientação dos planos. Não inventar medidas ausentes.
3. Relação entre wheel, scroll, arraste, ponteiro, toque, teclado, câmera e índice ativo.
4. Regras de foco: escala, desfoque, opacidade, paralaxe, rotação, oclusão e distância aparente dos cartões.
5. Contador/progresso, instrução de exploração, retorno, fechamento e estados de início/fim.
6. Densidade de partículas, atmosfera, vinheta, ruído, gradiente e resposta ao movimento, sempre separando Canvas/WebGL de camadas DOM/CSS.
7. Comportamento desktop e mobile, inclusive quando WebGL, GPU, autoplay ou mídia incorporada não estão disponíveis.
8. Dependências observadas e custo provável, marcando claramente o que for inferido.

## Excluir integralmente

- Não copiar logotipo, nomes, redação, imagens, vídeos, pessoas, depoimentos, tipografia-assinatura, assets, áudio, classes, código, modelos 3D, shaders ou matemática exata das referências.
- Não reproduzir uma cópia pixel a pixel. Traduzir a mesma classe de sensação espacial para uma composição original da Franco Romeu.
- Não extrair a paleta das referências quando a captura usar `--omit-colors`.
- Não transformar o Portfólio em um corredor ilegível, com neon excessivo, cintilação, motion blur permanente ou partículas sobre textos e controles.
- Não carregar dezenas de iframes simultaneamente.

## Tradução visual FR

O espaço pode combinar petróleo profundo e ouro queimado como atmosfera, preservando a paleta-base e os contrastes da Franco Romeu. Os tons informados pelo usuário, `#0A2F26` e `#F6A700`, devem ser tratados como tokens atmosféricos da experiência, não como substitutos globais da marca.

Um verde-água luminoso pode aparecer somente como emissão, foco, rastro ou feedback de interação, derivado e testado contra os verdes/petróleos FR. Não aplicar esse acento a valores financeiros, calculadora, IQE ou textos longos.

As partículas ficam atrás do conteúdo. Títulos, controles e cartões permanecem DOM semântico e legível.

## Conteúdo do arquivo orbital

O módulo deve aceitar muitos itens por dados, sem duplicar marcação manual. Cada item pode representar:

- imagem própria/licenciada da Franco Romeu;
- vídeo YouTube;
- publicação Instagram;
- publicação Facebook;
- publicação X;
- outro provedor explicitamente aprovado.

Proponha um contrato de dados original, sem implementar nesta análise. Cada item precisa de ID estável, provedor, URL canônica, título acessível, texto alternativo, imagem-pôster local/licenciada, proporção e estado de disponibilidade.

Código HTML arbitrário de incorporação não deve ser injetado diretamente. A implementação futura deve usar adaptadores por provedor e lista de origens permitidas. Para iframes, especificar `title`, `loading="lazy"`, `sandbox`, `allow`, `referrerpolicy` e política CSP compatível. Provedor desconhecido deve virar link externo seguro.

## Estratégia obrigatória para muitos cards

1. Renderizar inicialmente pôsteres leves, nunca todos os players sociais.
2. Ativar o embed somente por consentimento/ação do usuário ou quando o item focado exigir reprodução.
3. Manter ativo apenas o item em foco e, se necessário, vizinhos imediatos; suspender ou descarregar itens distantes.
4. Virtualizar listas extensas e limitar texturas WebGL simultâneas conforme auditoria no hardware real.
5. Preservar a grade atual como fallback completo e indexável por busca/SEO.
6. Não depender de cookies de terceiros para que o Portfólio continue navegável.

## Interação original proposta

Use um único eixo principal previsível. Wheel, arraste e teclas podem avançar o índice com snap; não crie duas barras concorrentes nem scroll trapping. O movimento atmosférico responde ao progresso, mas não deve continuar acelerando quando o usuário para.

Entregue uma máquina de estados para `FRMediaOrbitRail`, contemplando no mínimo:

- `entry-preserved`;
- `transition-in`;
- `orbit-browse`;
- `card-focused`;
- `embed-activating` / `embed-active`;
- `transition-out`;
- `fallback`.

Defina equivalência por teclado, botões anterior/próximo, contador e anúncio acessível do item ativo.

## Desempenho e fallback obrigatórios

- Desktop capaz: Canvas/WebGL com partículas e percurso espacial.
- GPU/WebGL indisponível: composição CSS/Canvas 2D com gradiente, paralaxe moderada e rail nativo totalmente funcional.
- Mobile: rail nativo com snap ou fluxo vertical; não exigir túnel 3D pesado.
- `prefers-reduced-motion`: retirar rotação contínua, zoom profundo e blur animado, mantendo navegação direta.
- Pausar render loop quando a aba, o módulo ou a janela não estiver visível.
- Não introduzir uma segunda instância de biblioteca 3D se a aplicação já possuir uma reutilizável e compatível; primeiro auditar.

## Entregáveis adicionais nos três relatórios padrão

1. Comparação clara do papel das duas referências, sem misturar evidências entre hosts.
2. Máquina de estados observada de cada captura e máquina proposta do módulo FR.
3. Contrato de dados para cards e adaptadores de embeds.
4. Plano de preservação da tela inicial e da grade atual do Portfólio.
5. Arquitetura progressiva WebGL → Canvas 2D/CSS → rail nativo.
6. Matriz de controles desktop/mobile/teclado/toque/reduced motion.
7. Riscos de privacidade, CSP, cookies, autoplay, scroll trapping, memória de GPU, iframes e regressão.
8. Plano incremental: baseline da aba real, protótipo isolado com conteúdo fictício FR, integração aditiva, testes e rollback.

Não altere o repositório do FRANCOROMEU-APP nesta análise.
