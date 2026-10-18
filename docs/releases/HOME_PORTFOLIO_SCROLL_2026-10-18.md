# Home e Portfólio — navegação por comparação

Base: `main` em `3f1ac7560fe20980378a324c3244e5b1373b7147`.
Branch: `fix/home-portfolio-scroll-scenes-2026-10-18`.

## Resultado preparado

- Home e Portfólio compartilham dimensões, cartões e revelação vertical em sentidos opostos. O Portfólio contém os 60 pares canônicos (120 imagens), sem gerar a lista duplicada de comparações.
- O estágio original é movido para dentro do contêiner ativo `fr16-portfolio`, preservando os nós e os links dos projetos. O alias `frpm-before-after` continua válido, e o CTA de transformações aponta para ele.
- Cada gesto de roda avança uma comparação em 680 ms, com aceleração e desaceleração cúbicas. Eventos de inércia do trackpad são agrupados; novos gestos e pulsos repetidos da roda podem entrar na fila. A distância do evento não determina quantas imagens avançam.
- A rolagem pela barra também termina em uma cena inteira. Toque vertical e teclado têm navegação por cena. Os limites liberam a rolagem da página; zoom, controles de formulário e diálogos abertos permanecem acessíveis. Índice, setas e pular sequência oferecem rotas alternativas.
- Movimento reduzido elimina a interpolação e mantém as 60 comparações acessíveis pelos controles.
- As 48 mídias elegíveis de `FR-C001` ficam em uma única pasta: **Reforma de cozinha e lavanderia — quartzo e móveis**. As duas galerias abertas que repetiam o projeto no Portfólio deixam de ser montadas. O dossier usa o visualizador existente e conserva os rótulos e relações de cada mídia.
- A página própria `/projetos/cozinha-lavanderia` continua com sua galeria. Seu gerador passou a renderizá-la independentemente do Portfólio.
- Descoberta de serviços e galeria de apoio da Home são inseridas antes do percurso horizontal. O percurso passa a ser o último conteúdo, seguido apenas pelo rodapé original.

## Evidências e validação

| Verificação | Estado | Evidência |
| --- | --- | --- |
| Base e trabalho anterior | PASS | Clone limpo da main; branch de tarefa isolada; sem mudanças anteriores |
| 60 pares apenas na animação | PASS | DOM gerado: 60 cartões, 120 imagens; zero `.frpm-pair` no Portfólio |
| Pasta única do projeto | PASS | DOM gerado: um cartão em `frpm-portfolio-projects`; 48 IDs únicos no dossier; zero galerias antigas do projeto no Portfólio |
| Ordem final da Home | PASS | DOM gerado termina em `froutro4` e `.fr6-footer` |
| Interações por cena | PASS | `tests/fr-motion-phase1.test.cjs`: roda pequena/grande, inércia, fila, reversão, limites, toque, zoom, teclado, barra, movimento reduzido e cancelamento |
| Montagem e preservação de rotas | PASS | Testes verificam identidade dos nós movidos, alias, CTA e galeria da página própria |
| Suíte geral | PASS | `npm test` |
| Estrutura HTML e invariantes | PASS | `npm run check:html`: seis views, IDs únicos, núcleo financeiro e ponte PDF |
| Build público | PASS | `npm run build` |
| Revisão visual em desktop e 390×844 | BLOCKED | Prévia local sem acesso pelos navegadores; supervisor informa `bwrap: Can't mount proc on /newroot/proc: Operation not permitted` |

A verificação de toque acima usa eventos simulados. Sensibilidade em mouse/trackpad físicos, inspeção das seis views, console e conferência visual em desktop/390×844 continuam pendentes antes do aceite de release. Os testes não são medições de desempenho real nem certificação de fidelidade fotográfica.

## Preservação, risco e reversão

Arquivos de origem de mídia, hashes históricos, IDs de serviço, fórmulas, preços, cupons, persistência, IQE e arquivos de SEO/canonical não são alterados. O ajuste atua na apresentação e na navegação do acervo existente. Não há dependência de produção nova.

Risco a conferir: ritmo e distinção de inércia/pulsos variam por dispositivo. A sequência não captura roda/toque fora de um estágio ativo, libera seus limites e possui controles explícitos. A seleção visual no navegador ainda precisa de aceite.

Reversão: reverter o commit desta tarefa e executar o build padrão. Nenhuma migração de dados nem movimentação física de fotos é necessária. Produção não foi promovida por esta tarefa.
