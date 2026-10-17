# Franco Romeu — Block Lab (sandbox isolado)

Laboratório de demonstração do mascote digital Block. Nenhuma leitura ou alteração no site principal, seus dados ou seus componentes IQE.

## Execução

Abra `index.html` em navegador moderno ou sirva a pasta por um servidor HTTP estático. A engine usa Canvas 2D e não depende de Three.js, WebGL ou backend.

## Funcionalidades

5 paletas FR para estudo, expressões procedurais variáveis, clima opcional/simulado, calendário mensal (feriados nacionais, feriado de SP e datas comemorativas selecionadas), rotina por horário de São Paulo, simulação de cenários de cliente e fidelidade. Não utiliza dados reais.

## Atenção

Os níveis de fidelidade são hipotéticos. Este sandbox NÃO substitui o IQE real e não calcula orçamentos. Feriados municipais não estão incluídos; feriados religiosos locais estão identificados como tal. Não representar referências visuais como trabalhos realizados.

## Testes

Rodar a suíte Playwright localmente contra o HTML ou servir a pasta. Testados: canvas visível, 5 paletas, calendário, horários, exportação JSON, reset e layout móvel.