# Anexo técnico-criativo — Etapa 15 Materialidade Imersiva

## 1. Proveniência e decisão de base

- Repositório canônico: `https://github.com/brunodesouzabfr-hash/FRANCOROMEU-APP`.
- Arquivo-base: `FRANCO_ROMEU_ETAPA14_AWWWARDS_UNIVERSES.html`.
- A proposta anterior da Etapa 15 foi descartada e não serviu como base de código ou layout.
- Estratégia: extensão progressiva. Os novos universos só ocultam a apresentação anterior depois de inicializarem com sucesso.

## 2. Princípios FR aplicados

1. **Luxo silencioso:** escala, espaço, materialidade e ritmo substituem excesso ornamental.
2. **Tradição com precisão:** linguagem editorial convive com HUDs, medidas e compatibilização.
3. **Engenharia de custo:** todo CTA visual aponta para serviços reais, preços e fórmulas já governados pelo `FRBudgetCore`.
4. **Prova responsável:** imagens externas são rotuladas como referência; render não é apresentado como obra executada.
5. **Permanência:** animação revela conteúdo ou orientação; não existe apenas para chamar atenção.

## 3. Referências e tradução original

As referências abaixo orientaram ritmo, hierarquia e mecânicas. Nenhum layout, ativo, texto ou código foi copiado.

| Referência | Leitura aplicada | Tradução Franco Romeu |
|---|---|---|
| [Sergio Ayala](https://www.sergio-ayala.com/) | Índice editorial, taxonomia visual, passagem clara entre arquivo e detalhe | Índice de dez cadernos 3D, coordenadas, molduras e dossiê técnico |
| [Van Lent](https://vanlent.dev/) | Movimento como narrativa e resposta direta ao ponteiro | Objeto em órbita, luz, wireframe e eixo técnico sem romper a identidade FR |
| [Bloom 3D Studio](https://www.bloom3d.studio/) | Tipografia ampla, projetos como capítulos e fotografia dominante | Atlas de 12 linguagens com lista, imagem focal e contraste mineral |
| [Projeto Morven](https://www.bloom3d.studio/projects/morven) | Página de projeto aprofundada, sequência visual e descrição contextual | Dossiê fullscreen por ambiente com três imagens, materialidade, paleta e soluções |
| [Infinite Horizontal Scroll](https://sd-infinite-horizontal-scroll.vercel.app/) | Fluxo lateral contínuo | Arquivo Vivo com drag/touch/inércia e repetição sem emenda, também no mobile |
| [Codrops — Infinite GSAP gallery](https://tympanus.net/codrops/2026/07/30/building-an-infinite-gsap-scroll-gallery-with-parallax-and-flip-transitions/) | Loop, toque, parallax e transição para detalhe | Mecânica autoral sem dependência GSAP, acrescida de teclado e reduced motion |
| [Codrops — WebGL infinite gallery](https://tympanus.net/codrops/2021/01/05/creating-an-infinite-auto-scrolling-gallery-using-webgl-with-ogl-and-glsl-shaders/) | DOM acessível como fonte e camada gráfica como abstração | Cards continuam semânticos; Canvas espiral é decorativo e isolado |
| [Spiral Gallery](https://sd-spiral-gallery.vercel.app/) | Profundidade espacial de acervo | Canvas 2D em espiral com imagens e fallback cromático petróleo/ouro |

Nota: a URL da Spiral Gallery foi fornecida pelo usuário, mas não pôde ser inspecionada pelo crawler. A implementação usa apenas o conceito informado de galeria móvel em espiral e foi desenvolvida de forma original.

## 4. Alterações — Projetos 3D

### Conteúdo preservado

- hero e informação inicial da aba;
- seis conceitos originais em `window.P3D_PROJECTS`;
- matriz e coverflow da Etapa 14;
- carregamento sob demanda de Three.js e fallback de WebGL.

### Conteúdo adicionado

| Código | Caderno | Serviços vinculados |
|---|---|---|
| FR.3D/01 | Reforma Residencial Integral | `proj_interiores`, `pac_reforma_residencial` |
| FR.3D/02 | Retrofit Comercial de Precisão | `retrofit`, `proj_interiores` |
| FR.3D/03 | Bancada Calacatta em Órbita | `proj_bancada`, `proj_interiores` |
| FR.3D/04 | Armários & Guarda-Roupas Integrados | `moveis`, `mar_guarda_roupa`, `ilu_led_closet` |
| FR.3D/05 | Brinquedomóvel FR | `evt_carreta_brinquedos`, `proj_interiores` |
| FR.3D/06 | Arena Futebol X1 | `evt_estrutura_show`, `proj_interiores` |
| FR.3D/07 | Tabela de Basquete em Aço | `evt_estrutura_show`, `proj_interiores` |
| FR.3D/08 | Patinação + Luz DMX | `evt_skate`, `evt_dmx_evento`, `evt_sonorizacao` |
| FR.3D/09 | Iluminação Integrada ao Móvel | `ilu_dmx`, `ilu_led_closet`, `mar_instalacao_movel` |
| FR.3D/10 | Suíte de Luxo Silencioso | `proj_interiores`, `tex_marmore`, `ilu_dmx` |

### Componentes novos

- índice vertical editorial;
- viewport focal com cubo 3D composto por seis faces;
- rotação por ponteiro e teclado;
- modos Render, Wireframe e Luz cênica;
- HUD de escala, fase, visualização e soluções conectadas;
- galeria de dez cards sincronizados com o objeto central;
- inspetor fullscreen com quatro ângulos;
- sequência Antes / Projeto 3D / Materialidade;
- slot de vídeo futuro rotulado como não verificado;
- CTA para vincular o projeto e CTA separado para abrir o orçamento.

## 5. Alterações — Portfólio / Arquivo Vivo

### Conteúdo preservado

- 16 registros do acervo;
- taxonomia e categorias;
- motor `fr-stage2-portfolio-engine`;
- modal existente com galeria, especificações e CTA para orçamento.

### Apresentação reconstruída

- seção fullscreen centralizada;
- trilha horizontal em quatro grupos para continuidade espacial;
- primeiro grupo exposto à tecnologia assistiva; cópias do loop são decorativas;
- arrasto, touch, inércia e supressão de clique após drag;
- navegação por `Shift+wheel`, setas e `Home`;
- filtros reconstruídos a partir dos dados canônicos;
- cards numerados como `FR.01` a `FR.16`;
- fundo em Canvas com órbita espiral de miniaturas;
- Canvas pausado quando a aba deixa de estar ativa;
- clique no card delega para o modal protegido, sem duplicar regra comercial.

## 6. Alterações — Ambientes / Atlas

### Conteúdo preservado

- hero e frase inicial da aba;
- 12 linguagens de `window.AMB_STYLES`;
- IDs, paletas, citações e pacotes de serviços existentes.

### Apresentação reconstruída

- lista editorial numerada de 12 linguagens;
- preview focal que responde a hover no desktop e clique em qualquer dispositivo;
- dossiê fullscreen com três referências por linguagem;
- rótulo explícito “Referência visual — não é obra FR”;
- copy técnica específica por linguagem;
- paleta material e lista de soluções com nomes lidos do catálogo real;
- CTA “Injetar pacote de soluções na calculadora”;
- feedback `aria-live`, trap de foco e fechamento por `Escape`.

## 7. Alterações — Orçamento e PDF

Removido da apresentação:

- “Estimativa orientativa”;
- “Retorno pelo WhatsApp”;
- “115 serviços — Catálogo técnico preservado”;
- “Escopo editável — Inclua, revise e remova”;
- “Faixa orientativa — Validação antes da contratação”.

Preservado:

- `FRBudgetCore`, seus 115 serviços, preços e fórmulas;
- catálogo progressivo de 15 categorias;
- bridge `ensurePDFStack` e carregamento preguiçoso de PDF;
- dock contextual, resumo, fidelidade, estado local e validações;
- integração via IDs reais, sem valores paralelos no novo código.

## 8. Acessibilidade, performance e resiliência

- touch targets de no mínimo 44 px;
- foco visível e navegação por teclado;
- diálogos com `aria-modal`, título, `Escape` e restauração de foco;
- mensagens de integração com `aria-live`;
- `prefers-reduced-motion` desativa movimento contínuo;
- requestAnimationFrame executa apenas na view ativa;
- Canvas limitado a DPR 1.5 ou 1 com economia de dados;
- separação entre renderização visual e núcleo financeiro;
- normalização de botões dinâmicos por `MutationObserver`;
- APIs públicas agrupadas em `window.FR_STAGE15`;
- design progressivamente substitutivo: se uma camada nova falhar, o conteúdo anterior permanece no DOM.

## 9. O que não foi afirmado

- Esta entrega não foi premiada pelo Awwwards; “padrão SOTD” é uma direção de qualidade.
- 60 fps é meta de projeto, não garantia universal.
- imagens Unsplash não são provas de obra FR.
- os slots de vídeo não afirmam autoria ou execução.
- valores continuam orientativos e sujeitos às regras do núcleo existente.

## 10. Próximas fases recomendadas

1. Substituir referências por acervo FR validado, com consentimento e metadados.
2. Conectar vídeos oficiais por IDs verificados e política CSP.
3. Medir FPS, LCP, INP e memória em dispositivos reais.
4. Empacotar fontes, ícones e imagens críticas para PWA/offline.
5. Criar manifest, service worker e estratégia de atualização antes do APK WebView.
6. Executar teste de usabilidade com clientes de alto padrão e clientes orientados a engenharia de custo.
