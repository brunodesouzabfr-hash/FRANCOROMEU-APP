# Anexo técnico e editorial — evolução Franco Romeu

> Documento de comentário e rastreabilidade. Não é uma autorização para copiar interfaces, imagens ou código de terceiros. Toda referência deve ser reinterpretada pelo algoritmo FORJA e pelas regras de veracidade da marca.

**Base comparada:** Etapa 13 oficial (`bd11827`) → Etapa 13.1.1 (`294e0ac`) → correção atual do hero.
**Objetivo futuro:** transformar a SPA/HTML em site corporativo e, somente após estabilização da experiência web, avaliar empacotamento como PWA e aplicativo Android (`.apk`).

---

## 1. Alterações realmente implementadas desde a base Etapa 13

### 1.1 Distribuição e arquitetura

1. O núcleo financeiro foi extraído para `src/budget-core.js`, permitindo testes fora do navegador.
2. O mesmo núcleo foi incorporado ao HTML em `<script id="fr-budget-core">`; o aplicativo principal pode ser baixado como um único arquivo.
3. Foram adicionados `package.json`, testes automatizados, verificador estrutural do HTML, README ampliado e changelog.
4. O HTML continua monolítico e as seis views, `appState`, `localStorage`, `window.__frCore`, IQE, God Mode, busca, fidelidade e motores visuais foram preservados.

### 1.2 Orçamento e regras financeiras

1. `resolveConfigOption` passou a aceitar ID estável e índice numérico legado.
2. Novas escolhas manuais são persistidas por ID, evitando que uma reordenação do catálogo altere seu significado.
3. O cálculo passou a ser uma função pura que recebe catálogo, estado e política.
4. Preços são arredondados em centavos por uma função central.
5. Markups de ambiente, cupom, condição de pagamento e visita são calculados em ordem explícita.
6. A taxa de visita é exibida como cobrada ou abatida; a fronteira atual permanece `subtotal > R$ 450`.
7. O resultado comercial passou de “total definitivo” para faixa orientativa de ±12%, com referência central, confiança, avisos e premissas.
8. Itens informados pelo cliente e itens sugeridos/estimados pelo IQE são diferenciados.
9. Configurações obrigatórias de serviço são verificadas antes da inclusão.
10. A finalização verifica serviço, quantidade, configurações, nome, telefone, CEP, rua/número, pagamento e aceite dos termos.
11. Serviços adicionados podem ser editados, duplicados ou removidos no resumo.

### 1.3 Persistência, administração e segurança

1. Foi criada uma fronteira `storage.get/set/remove` para capturar falhas de armazenamento.
2. A finalização não descarta o rascunho quando o navegador não consegue salvar.
3. Valores de usuário interpolados no HTML passaram a usar escape de conteúdo/atributo nos pontos modificados.
4. A importação do God Mode valida estrutura, IDs, categorias, preços, opções, adicionais, ícones e cupons.
5. Uma cópia preventiva do banco administrativo é criada antes de importações válidas.
6. Cupons administrativos recebem validação de formato, duplicidade e intervalo.
7. A senha administrativa literal foi removida; o acesso local documentado não é apresentado como autenticação real.
8. O CNPJ demonstrativo foi removido das áreas públicas e do PDF.

### 1.4 Formulários, CEP, PDF e WhatsApp

1. Labels passaram a possuir associação com IDs estáveis em inputs gerados.
2. Foram adicionados `required`, `autocomplete`, `inputmode`, validade semântica, foco no primeiro erro, texto de erro e `aria-invalid`.
3. Datas preferenciais recebem mínimo futuro.
4. O CEP é normalizado, validado e consultado com timeout, `AbortController`, verificação HTTP e mensagens distintas.
5. O preenchimento manual de endereço é preservado se o ViaCEP falhar.
6. O WhatsApp utiliza link real com isolamento da nova aba.
7. O PDF passou a criar páginas adicionais quando o conteúdo excede uma folha A4.
8. Arquivo, título e conteúdo do PDF passaram a usar “estimativa” e “referência central”.

### 1.5 Acessibilidade, veracidade e apresentação

1. Opções de serviço e pagamento foram convertidas de `div` clicável para botões com estado `aria-pressed`.
2. Botões sem tipo recebem `type="button"`; links externos recebem `noopener noreferrer`.
3. Links sociais e botões de ícone recebem nomes acessíveis.
4. Modais receberam `role="dialog"`, título/descrição associados, foco inicial e fechamento por `Escape`.
5. Alvos essenciais receberam dimensão mínima de 44 px e foco visível.
6. `prefers-reduced-motion` pausa movimentos decorativos adicionados nesta etapa.
7. Imagens do Unsplash recebem a ressalva “Referência visual — não representa obra executada pela Franco Romeu”.
8. Título, versão, copyright e comentários corrompidos foram atualizados.

---

## 2. Correção do hero da Home nesta etapa

### Sintoma

A fotografia aparecia como um bloco normal e todo o conjunto “Studio em operação / Espaços Forjados Para durar / CTAs” era empurrado para baixo, em vez de permanecer sobre a imagem.

### Causa confirmada

O aperfeiçoamento que adiciona a ressalva em imagens externas aplicava `.fr-reference-media { position: relative !important }` ao pai de toda imagem do Unsplash. No hero, esse pai é `.fr6-hero-media`, originalmente absoluto. O `!important` substituía `position:absolute`, retirava a imagem do plano de fundo e a transformava em conteúdo normal do grid.

### Correção

1. `.fr-reference-media` deixou de alterar `position` indiscriminadamente.
2. A classe auxiliar `.fr-reference-positioned` só é aplicada quando o pai era originalmente `position: static`.
3. Contêineres já posicionados — como o fundo absoluto do hero — preservam seu contexto e continuam aptos a ancorar o selo.
4. O verificador estrutural agora falha se `.fr-reference-media` voltar a definir posição ou se `.fr6-hero-media` deixar de ser absoluta.

---

## 3. Pesquisa e referências Awwwards

### Transparência da pesquisa

Foi tentado acesso às coleções oficiais de [Arquitetura](https://www.awwwards.com/websites/architecture/), [Arte](https://www.awwwards.com/websites/art/), [3D](https://www.awwwards.com/websites/3d/) e [Museus](https://www.awwwards.com/websites/museum/). O ambiente automatizado respondeu `403` no túnel de acesso e a busca web respondeu `401`; por isso **notas, posições e premiações atuais não foram declaradas como verificadas**. Antes da fase visual, a equipe deve abrir as coleções e registrar score, data e prêmio vigentes.

As referências abaixo são pontos de estudo reconhecíveis no ecossistema de experiências digitais; devem ser avaliadas funcionalmente, não copiadas:

| Referência | O que estudar | Aplicação FR proposta |
|---|---|---|
| [Bruno Simon](https://bruno-simon.com/) · [busca Awwwards](https://www.awwwards.com/search-websites/?text=Bruno%20Simon) | Navegação 3D compreensível, descoberta e controle pelo usuário | Projetos 3D: viewport navegável com alternativa em lista e instrução progressiva |
| [Active Theory](https://activetheory.net/) · [busca Awwwards](https://www.awwwards.com/search-websites/?text=Active%20Theory) | WebGL usado como linguagem espacial, transições de mundo | Passagem entre as seis views sem perder localização ou contexto |
| [Lusion](https://lusion.co/) · [busca Awwwards](https://www.awwwards.com/search-websites/?text=Lusion) | Objetos digitais responsivos e performance adaptativa | Matriz arquitetônica e materiais reativos em Projetos 3D |
| [Locomotive](https://locomotive.ca/) · [busca Awwwards](https://www.awwwards.com/search-websites/?text=Locomotive) | Direção editorial, tipografia cinética e ritmo de scroll | Sobre: manifesto bruto/refinado e costura das linguagens FR |
| [Obys Agency](https://obys.agency/) · [busca Awwwards](https://www.awwwards.com/search-websites/?text=Obys) | Brutalismo controlado, composição editorial e contraste | Sobre: pranchas, matéria, manifesto e método, sem ruído gratuito |
| [Resn](https://resn.co.nz/) · [busca Awwwards](https://www.awwwards.com/search-websites/?text=Resn) | Narrativas experimentais e interação com personalidade | Ambientes: curadoria sensorial sem sacrificar entendimento |
| [Gucci Garden](https://guccigarden.gucci.com/) · [busca Awwwards](https://www.awwwards.com/search-websites/?text=Gucci%20Garden) | Exposição digital, salas temáticas e exploração | Portfólio/Arquivo Vivo: salas curatoriais e obras documentadas |
| [The Museum of Annoying Experiences](https://annoyingmuseum.zendesk.com/) · [busca Awwwards](https://www.awwwards.com/search-websites/?text=Museum%20of%20Annoying%20Experiences) | Metáfora museológica aplicada à navegação e ao conteúdo | Portfólio como museu interativo com percurso e índice acessível |

### Critério de seleção futuro

Cada referência candidata deve ser registrada com: URL oficial, página Awwwards, prêmio/menção, notas de Design/Usability/Creativity/Content, data, tecnologia, custo estimado de renderização, comportamento mobile, teclado, reduced-motion e utilidade concreta para a jornada FR.

---

## 4. Direção visual proposta por view (ainda não implementada)

### 4.1 Home — portal da Forja

**Função:** orientar em até cinco segundos: quem é a FR, o que faz e qual o próximo passo.
**Experiência:** fotografia em tela cheia, matéria escura, headline sobreposta, campo técnico sutil e CTAs inequívocos. A imagem reage com profundidade mínima ao ponteiro; texto permanece estável.
**Interações:** reveal inicial curto, parallax limitado, transição de forja ao trocar de mundo.
**Guardrails:** LCP prioritário; hero legível sem imagem, Canvas ou animação; nenhum selo pode alterar seu layout novamente.

### 4.2 Sobre — matéria, método e manifesto

**Conceito:** “mesa de oficina + arquivo editorial”. Deve mesclar forja, galeria, blueprint e arquivo, mas no estado mais bruto e refinado da marca.
**Estrutura:** manifesto → tensões reais → método FORJA → competências → processo → limites/veracidade → contato.
**Visual:** grandes tipos stencil, Cormorant nos momentos humanos, diagramas de medida, macros de matéria, grids que se desmontam e recompõem.
**Interação:** capítulos que se encaixam como pranchas; scrub apenas onde explica processo; resumo fixo acessível.

### 4.3 Ambientes — galeria de linguagens arquitetônicas

**Conceito:** curadoria, não catálogo. Cada ambiente é uma sala/exposição com paleta, matéria, luz, serviço e aplicação.
**Estrutura:** foyer curatorial → filtro por sensação/material → sala individual → composição recomendada → enviar para orçamento.
**Visual:** paredes virtuais discretas, molduras, luz rasante e legendas museológicas.
**Interação:** trilho horizontal no desktop, lista vertical no mobile, aproximação progressiva de detalhes e áudio sempre opcional/desligado por padrão.
**Verdade:** enquanto forem imagens externas, o selo de referência permanece visível; obras reais devem trazer ficha de execução verificável.

### 4.4 Projetos 3D — matriz arquitetônica

**Conceito:** viewport de modelagem, não carrossel decorativo.
**Estrutura:** matriz de frames → seleção de estudo → órbita/plantas/cortes → decisões testadas → CTA de diagnóstico.
**Visual:** azul/ciano técnico, eixos XYZ, snapping, wireframe, pranchas e camadas de materiais.
**Interação:** navegação espacial assistida, mini-mapa, teclado/setas, controles de órbita limitados e botão “voltar ao enquadramento”.
**Fallback:** cards, imagens e ficha técnica completos sem WebGL.

### 4.5 Portfólio — Arquivo Vivo / museu de execução

**Conceito:** cada serviço executado é uma obra documentada; o conjunto é um acervo em permanente expansão.
**Estrutura:** hall → coleção/categoria → peça → processo → evidência → materiais → serviço relacionado.
**Visual:** bordô, carvão, etiquetas de arquivo, números de inventário, escala museológica e imagens com espaço de contemplação.
**Interação:** mapa do museu, salas temáticas, zoom de detalhe, antes/depois controlado e retorno imediato ao índice.
**Verdade:** só chamar de “obra executada” quando houver autoria e comprovação; referências e renders permanecem explicitamente rotulados.

### 4.6 Orçamento — central de engenharia de custo

**Conceito:** a área mais clara e previsível da experiência, mesmo mantendo a identidade imersiva.
**Estrutura:** diagnóstico → ambiente → serviços → dados → visita → estimativa → próximos passos.
**Visual:** máquina/central, verde de validação funcional, progresso persistente e resumo legível.
**Interação:** uma decisão por vez, salvamento contínuo, edição reversível, explicação de premissas e confiança.
**Guardrail:** motion nunca pode atrasar input, cálculo, validação ou envio.

---

## 5. Sistema comum para experiências diferentes

As views devem parecer mundos diferentes sem se tornarem seis sites desconectados. Permanecem comuns:

- marca, navegação, atalhos, grid-base, tokens e contraste;
- transição entre mundos e indicação de localização;
- linguagem direta/técnica/material;
- foco, teclado, toque ≥44 px, safe areas e reduced-motion;
- performance adaptativa e fallbacks sem WebGL/CDN;
- CTA “Vamos dimensionar sua obra” e ponte consistente para o orçamento;
- veracidade de imagens, números, preços e afirmações.

---

## 6. Ordem recomendada de implementação

1. **Estabilização:** regressão visual, screenshots em 390/768/1440 px, console, performance e acessibilidade.
2. **Design tokens:** consolidar tipografia, cor, ritmo, profundidade e motion.
3. **Sobre:** construir a síntese editorial que define o vocabulário dos outros mundos.
4. **Ambientes:** implementar o primeiro sistema curatorial.
5. **Projetos 3D:** prototipar viewport + fallback antes de expandir WebGL.
6. **Arquivo Vivo:** migrar somente trabalhos comprovados para fichas museológicas.
7. **Orçamento:** integrar entradas curatoriais sem alterar o núcleo financeiro.
8. **Site/PWA:** modularizar, criar rotas indexáveis, SEO, analytics consentido e cache.
9. **Android:** somente após estabilidade web; preferir PWA/TWA ou wrapper auditado antes de manter uma base nativa separada.

## 7. Critério de “pronto” para a fase Awwwards

- Cada view tem tese, interação principal e fallback próprios.
- O usuário sempre sabe onde está, o que pode fazer e como voltar.
- Lighthouse e testes de campo são registrados, não presumidos.
- Nenhum conteúdo fica inacessível sem motion, Canvas, WebGL, hover ou áudio.
- O orçamento permanece mais simples que o portfólio.
- Nenhuma referência visual é apresentada como obra executada.
- O site continua reconhecível como Franco Romeu sem depender do logotipo.
