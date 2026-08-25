# Changelog — Etapa 15 Materialidade Imersiva

Base canônica: `FRANCO_ROMEU_ETAPA14_AWWWARDS_UNIVERSES.html`  
SHA-256 da base: `328aa8aa4e6ea04e77048b978b07c1ccdca23c353f7f9d5d716509e150ca0a31`  
SHA-256 da entrega: `5fd200a1d29f68817488fde432033e0602b87b757735d33e0eec612ca00551bf`

## Adicionado

- Laboratório editorial “Matéria em órbita” na aba Projetos 3D.
- Dez novos cadernos: reforma residencial, retrofit comercial, Calacatta, marcenaria, Brinquedomóvel, Futebol X1, tabela de basquete em aço, patinação DMX, luz integrada ao móvel e suíte de luxo silencioso.
- Volume 3D manipulável com modos Render, Wireframe e Luz cênica.
- Inspetor imersivo com quatro ângulos e sequência Antes → Projeto 3D → Materialidade.
- Slot explícito para vídeo futuro verificado, sem incorporar conteúdo aleatório como prova de execução.
- Integração de um clique dos cadernos com IDs existentes do `FRBudgetCore`.
- Arquivo Vivo horizontal de tela cheia com quatro grupos de loop, drag/touch, inércia, Shift+wheel, setas e Home.
- Fundo espiral móvel em Canvas com imagens do acervo e fallback cromático.
- Filtros do Portfólio preservando as 16 entradas canônicas.
- Atlas de 12 linguagens arquitetônicas inspirado em navegação editorial de projetos.
- Dossiê de ambiente com três referências, descrição técnica, paleta, serviços e CTA em lote.
- Normalização por `MutationObserver` de botões dinâmicos sem `type`.
- API pública `window.FR_STAGE15` com seleção, filtros e auditoria.

## Alterado

- Portfólio deixa de exibir a composição anterior quando a nova experiência está pronta; DOM, dados e motor antigos continuam disponíveis como camada protegida.
- Museu anterior de Ambientes fica oculto somente após o Atlas inicializar com sucesso.
- Motion executa apenas na aba ativa e pausa quando o documento está oculto.
- `package.json` aponta a suíte oficial para a regressão Etapa 14 + aceitação Etapa 15.

## Removido da interface

- Selos redundantes “Estimativa orientativa” e “Retorno pelo WhatsApp”.
- Faixa sem finalidade com “115 serviços / Catálogo técnico preservado”, “Escopo editável” e “Faixa orientativa”.
- O bridge de carregamento do PDF foi mantido mesmo sem o bloco visual removido.

## Preservado

- seis views e navbar global;
- 115 serviços e 15 categorias progressivas;
- seis projetos 3D originais;
- 16 projetos de Portfólio;
- 12 linguagens de Ambientes;
- Calculadora, IQE, busca, dock, fidelidade, estado e PDF;
- scripts `fr-stage2-portfolio-engine`, `fr-pdf-stack-loader` e `fr-budget-core` byte a byte.

## Corrigido

- Botões gerados após rerender da Calculadora recebem `type="button"`.
- Elementos em movimento não consomem RAF em views inativas.
- Diálogos restauram o foco ao fechar.
- Portfólio horizontal não abre uma obra após um gesto de arrasto.
