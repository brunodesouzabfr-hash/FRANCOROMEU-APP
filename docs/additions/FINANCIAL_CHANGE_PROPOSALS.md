# Propostas comerciais pendentes — sem alteração do cálculo

As 17 famílias estão mapeadas em `SERVICE_RECONCILIATION.csv`. Uma relação com um ID existente não prova equivalência de escopo nem autoriza reutilizar seu preço. Nenhum item novo entrou no total automático; esta candidata mantém 115 serviços, 15 categorias e 7 cupons.

Para habilitar uma modalidade, a FR precisa confirmar capacidade de atendimento, unidade, inclusão/exclusão, condição da base/produto e composição do valor: tempo produtivo, deslocamento, consumíveis, retrabalho, tributos e margem. Definir se material é fornecido pela FR ou pelo contratante. Depois disso, apresentar o diff do catálogo e testar orçamento legado antes de ativar.

Decisões numéricas específicas:

1. `chuveiro` R$ 80 e `ele_chuveiro_eletrico` R$ 150: instalação hidráulica e ligação elétrica são escopos distintos ou sobrepostos? Registrar quando ambos são necessários.
2. Cuba/pia R$ 170/R$ 200 e purificador R$ 150/R$ 180: confirmar produto, fixação, ligações e adaptações; definir aliases ou variantes sem duplicar cobrança.
3. Estruturas de telhado madeira R$ 2.800/m², ferro R$ 3.500/m² e steelframe R$ 4.000/m²: confirmar unidade, alcance e composição antes de qualquer ajuste.
4. `pac_reforma_residencial` com R$ 0/ambiente: tratar publicamente como “sob avaliação”, nunca como serviço gratuito. Definir se deve permanecer selecionável na calculadora antes de mudar a regra.
5. Bancadas, marcenaria, telhados e pacotes: separar mão de obra, materiais, fabricação, instalação, transporte e preparo.
6. Portas e fechaduras: distinguir kit/folha, material, ferragens, sobrepor/embutir e montagem.
7. Vinílico em área molhada: substituir a alegação genérica apenas com sistema/produto compatível e documentação do fabricante.
8. Visita técnica: manter uma única cobrança da regra atual; confirmar valor R$ 99 e o limiar R$ 450/R$ 451 com cenários de teste antes de alterar cálculos.

Não usar preços de terceiro como preço FR, nem inserir uma segunda visita por item. A remoção da interface pública de pesquisa não apagou os arquivos privados de comparação.
