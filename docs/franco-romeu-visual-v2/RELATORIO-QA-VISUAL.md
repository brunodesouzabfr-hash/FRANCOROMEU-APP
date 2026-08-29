# Relatório de QA — integração visual Franco Romeu v2

Data de validação: 28/08/2026

## Resultado

| Verificação | Resultado |
|---|---:|
| Identificadores fotográficos externos substituídos | 62 |
| Referências locais verificadas no HTML | 113 |
| Imagens externas de interface em Unsplash/i.ibb | 0 |
| JPGs locais decodificados sem erro | 138 |
| SVGs XML válidos | 38 |
| Favicons/ícones entregues | 7 |
| Blocos JavaScript executáveis com sintaxe válida | 30 |
| Marcadores funcionais críticos preservados | 9 |
| Núcleo `DEFAULT_DATA` comparado por SHA-256 | idêntico |
| Arquivos vazios ou truncados | 0 |

## Funções protegidas

Foram verificados no HTML final os marcadores do núcleo de orçamento, cálculo,
navegação SPA, assistente, IQE, busca, Projetos 3D, Portfólio e Ambientes.
Nenhum `serviceId`, fórmula de preço ou conjunto de serviços foi removido por
esta integração. O bloco integral `DEFAULT_DATA` manteve o SHA-256
`01861482b150dc3e779cc5042eed1b2e0a82c73a6432946e8859a663a2a04306`.

## Política de imagens

- A interface não depende mais de Unsplash nem i.ibb.
- As imagens conceituais continuam marcadas como referência nos componentes que
  já possuíam essa indicação.
- O `localStorage` migra somente URLs antigas desses dois hosts; imagens
  personalizadas inseridas pelo usuário são preservadas.
- Os recursos visuais gerados não constituem prova de obra executada.

## Identidade e navegador

- SVG principal, premium, lockups, selo, marca-d'água e coleção completa de
  mestres vetoriais foram incluídos.
- Favicon SVG, ICO multirresolução, PNG 16/32, Apple Touch 180, PWA 192/512 e
  Safari pinned tab foram integrados.
- Open Graph, Twitter Card e JSON-LD apontam para URLs absolutas no domínio
  canônico `francoromeu.com.br`.

## Limite de validação

A validação de arquivos, caminhos e sintaxe foi concluída localmente. O ambiente
não possuía um binário Chromium instalado para uma captura automatizada do DOM;
por isso, a inspeção visual final deve ser repetida após o deploy real, com as
CDNs de tipografia e scripts disponíveis.
