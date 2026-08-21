# ANEXO DE EVOLUÇÃO VISUAL — FRANCO ROMEU ETAPA 15

## 1. Registro canônico

- Marca: **Franco Romeu (FR) — Arte & Engenharia**
- Repositório: <https://github.com/brunodesouzabfr-hash/FRANCOROMEU-APP>
- Base visual herdada: `FRANCO_ROMEU_ETAPA14_AWWWARDS_UNIVERSES.html`
- Nova versão: `FRANCO_ROMEU_ETAPA15_SITES_INDIVIDUAIS.html`
- Princípio: cada aba deixa de parecer uma seção do mesmo template e passa a operar como um site autônomo, sem separar o estado, o catálogo ou o motor financeiro.

## 2. O que permanece intocável desde a base técnica

- 115 serviços e 15 categorias progressivas.
- IDs de serviços, unidades, preços, adicionais ambientais, descontos e taxa de visita.
- `FRBudgetCore`, armazenamento resiliente, CRUD, máscaras, validação final e integração com WhatsApp.
- `fr-stage2-portfolio-engine` e `fr-pdf-stack-loader` preservados byte a byte.
- Navbar global, IQE, Busca, GODMODE, fidelidade, barra contextual do Orçamento e posição do scroll.
- Política de verdade: fotografia de banco continua rotulada como referência visual, nunca como obra executada.

## 3. Evolução acumulada desde a Etapa 13

### Etapa 14 — fundação visual herdada

- Seis mundos cromáticos e atmosféricos: Forja, Manifesto, Arte Material, Modeling Space, Arquivo Vivo e Engenharia de Custo.
- Canvas conceitual por aba, motion controlado por visibilidade e fallback para `prefers-reduced-motion`.
- SEO básico, Open Graph, JSON-LD e remoção de promessas comerciais sem comprovação.
- Three.js carregado sob demanda e PDF aquecido sem bloquear o primeiro carregamento.

### Etapa 15 — reconstrução desta rodada

#### Ambientes / Arte Material

- A grade anterior e o modal compacto foram substituídos por um **Atlas de Atmosferas** em fundo mineral claro.
- Cada uma das 12 linguagens agora é um projeto autônomo com capa, segunda imagem em hover e hierarquia tipográfica própria.
- O clique abre uma página dedicada dentro da SPA, com:
  - título e narrativa da linguagem;
  - paleta conceitual;
  - quatro imagens de referência em composição editorial;
  - selo visível “Referência visual — não representa obra executada” em todas as imagens;
  - lista das soluções técnicas compatíveis;
  - navegação Atlas / Próximo;
  - CTA “Adicionar este serviço”, ligado ao mesmo `appState` da Calculadora.
- A adição ignora serviços já selecionados, preserva configurações padrão por ID estável, grava a linguagem escolhida e usa o render/save existente.

**Referência traduzida:** [Bloom 3D Studio](https://www.bloom3d.studio/) e sua estrutura [Projetos](https://www.bloom3d.studio/projects): grade editorial → página dedicada → galeria completa → descrição → contato. A mecânica foi adaptada para curadoria arquitetônica e orçamento FR; nenhuma interface, texto ou ativo foi copiado.

#### Projetos 3D / Modeling Space

- A matriz em perspectiva e o coverflow foram retirados da experiência ativa.
- A nova abertura exige uma intenção antes do conteúdo: o visitante escolhe uma disciplina e só então aciona **Entrar**.
- Disciplinas: Ambientes completos, Cozinhas, Fachadas & externos e Banheiros.
- A jornada usa Back / Next e mostra um projeto por vez, evitando competição entre frames.
- O centro virou uma moldura arquitetônica cinematográfica com:
  - entrada e troca por `clip-path: inset()`;
  - saída direcional com `translateX`;
  - HUD de área, fase e resolução;
  - expansão para ficha técnica;
  - ação “Vincular projeto à Calculadora”.
- Three.js foi deliberadamente removido desta aba: a fidelidade às referências e a fluidez são obtidas com CSS/DOM, reduzindo carga gráfica.

**Referências traduzidas:** [Sergio Ayala — Illustration](https://www.sergio-ayala.com/#illustration), pela orientação por disciplinas, entrada deliberada e ritmo Back/Next; e [van Lent](https://vanlent.dev/), pelo uso de revelação por `clip-path`, transição lateral e peça central de destaque.

#### Portfólio / Arquivo Vivo

- O percurso serpentino descentralizado foi substituído por um único eixo de leitura.
- As 16 peças são duplicadas apenas na camada de apresentação para criar um loop horizontal contínuo; os dados continuam existindo uma única vez.
- Navegação por arrasto, touch, roda do mouse e setas, com inércia física e velocidade residual.
- Filtros editoriais são reconstruídos a partir das categorias reais do acervo.
- Cada card mantém título, classificação, microtexto e “Ver ficha”; o clique usa a ficha técnica e CTA já existentes.
- Um túnel helicoidal em Three.js usa até 12 imagens do próprio acervo em baixa resolução e baixa opacidade.
- O WebGL:
  - só carrega quando Portfólio está ativo;
  - pausa fora da aba ou com documento oculto;
  - respeita economia de dados e movimento reduzido;
  - possui timeout, proteção contra inicialização duplicada e fallback CSS;
  - reage à perda de contexto sem derrubar a trilha principal.

**Referências traduzidas:** [Infinite Horizontal Scroll](https://sd-infinite-horizontal-scroll.vercel.app/) para loop, drag/inércia e card editorial; [Spiral Gallery](https://sd-spiral-gallery.vercel.app/) para profundidade helicoidal atmosférica. A camada 3D é decorativa: a navegação e a conversão continuam funcionais sem WebGL.

#### Orçamento / Engenharia de Custo

- Removidos do hero:
  - “ESTIMATIVA ORIENTATIVA”;
  - “RETORNO PELO WHATSAPP”.
- Removida integralmente a faixa com:
  - “115 serviços / Catálogo técnico preservado”;
  - “Escopo editável / Inclua, revise e remova”;
  - “Faixa orientativa / Validação antes da contratação”;
  - “PDF resiliente / Núcleo carregado sob demanda”.
- O pré-aquecimento não bloqueante do PDF foi preservado sem componente visual redundante.

## 4. Decisões de marca e conversão

- Verde-petróleo continua como estrutura; laranja industrial marca ação e ouro queimado marca acervo.
- A conversão ocorre no ponto em que a intenção já está clara: ambiente escolhido, projeto expandido ou peça de acervo aberta.
- Não foram adicionadas falsa escassez, contadores fictícios, descontos artificiais ou provas sociais sem fonte.
- “Baixo custo” permanece traduzido como engenharia de custo, solução inteligente e tradição com precisão.

## 5. Resiliência e acessibilidade

- Alvos interativos mínimos de 44 px.
- Navegação por teclado nas disciplinas, Back/Next, Atlas e trilha horizontal.
- Escape fecha a ficha 3D ou retorna do ambiente dedicado.
- Foco devolvido ao elemento de origem após fechamento.
- Movimento reduzido troca a trilha animada por overflow horizontal nativo e desativa a espiral.
- Todas as experiências continuam utilizáveis sem Three.js, GSAP ou imagens remotas.

## 6. Aceite automatizado

- 34 testes totais aprovados.
- 8/8 testes específicos da Etapa 15 aprovados, incluindo a distribuição compacta.
- 27 scripts inline válidos.
- 115 serviços, 15 categorias, 12 ambientes, 6 projetos 3D e 16 peças de acervo.
- Zero IDs duplicados no runtime simulado.
- Contrato do PDF aprovado quando `html2canvas` e `jsPDF` ficam disponíveis.

## 7. Limite de validação

O aceite automatizado cobre estrutura, runtime simulado, integração e fallback. WebGL real, qualidade de textura, FPS e sensação tátil ainda devem ser aceitos em Chrome/Firefox/Safari e aparelhos físicos antes de publicação ou empacotamento APK.
