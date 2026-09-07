# QA — Etapa 15 Materialidade Imersiva

## Resultado automatizado

Comando:

```bash
npm test
```

Resultado: **12/12 testes aprovados**.

| Escopo | Evidência |
|---|---|
| Regressão Etapa 14 | 6 testes aprovados |
| Aceitação Etapa 15 | 6 testes aprovados |
| Serviços | 115 preservados |
| Categorias | 15 após render da etapa 2 |
| Projetos 3D | 6 existentes + 10 novos |
| Portfólio | 16 obras canônicas |
| Ambientes | 12 linguagens |
| Motores protegidos | 3 hashes idênticos |
| Scripts inline | 28 blocos válidos |
| IDs duplicados no runtime | 0 |
| Bridge de PDF | disponível e inicializa quando as bibliotecas existem |

## Cenário integral automatizado

1. Inicializa a SPA e aguarda o loading.
2. Confere contagens, APIs e ausência do bloco removido do Orçamento.
3. Seleciona “Bancada Calacatta em Órbita”.
4. Injeta `proj_bancada` e `proj_interiores` no orçamento.
5. Abre o inspetor 3D e alterna para Materialidade.
6. Abre o ambiente Industrial, confere três referências e injeta o pacote.
7. Filtra o Arquivo Vivo por Mármore e abre o modal protegido.
8. Renderiza a etapa 2 da Calculadora e confirma 15 categorias.
9. Simula o núcleo de PDF inicializado.
10. Confere tipos de botão, IDs duplicados e erros de runtime.

## Checklist obrigatório em navegador real

### Desktop — 1440 × 900

- [ ] Loading conclui sem salto de layout.
- [ ] Navbar permanece horizontal, legível e não cobre o conteúdo.
- [ ] Projetos 3D: orbit, hover, modos e quatro ângulos respondem sem tremor.
- [ ] A matriz WebGL anterior continua acessível e possui fallback quando a GPU falha.
- [ ] Portfólio: arrasto, roda com Shift, filtros e loop não apresentam emenda visível.
- [ ] Canvas espiral fica em segundo plano e não compromete contraste.
- [ ] Ambientes: hover não abre o dossiê por acidente; clique abre e foco permanece preso.
- [ ] Calculadora mantém os serviços adicionados e não salta o scroll.
- [ ] PDF é gerado após o carregamento preguiçoso das bibliotecas.

### Mobile — 390 × 844

- [ ] Todos os alvos possuem pelo menos 44 × 44 px.
- [ ] Galeria horizontal acompanha o dedo sem disparar modal durante drag.
- [ ] Atlas mantém título, imagens e CTA dentro da viewport.
- [ ] Inspetor 3D pode ser fechado e não prende o scroll após fechar.
- [ ] Dock do Orçamento não encobre campos ou botões.
- [ ] Orientação paisagem não produz overflow lateral involuntário.

### Acessibilidade

- [ ] Percurso completo somente com `Tab`, `Shift+Tab`, setas, `Enter`, `Espaço` e `Escape`.
- [ ] Foco visível em todos os controles.
- [ ] Leitor de tela anuncia seleção 3D, feedback de orçamento e títulos dos diálogos.
- [ ] `prefers-reduced-motion: reduce` desativa movimento contínuo sem esconder conteúdo.
- [ ] Contraste conferido por ferramenta automatizada e inspeção humana.

### Resiliência

- [ ] Testar offline após primeira carga e registrar quais recursos externos precisam ser empacotados para PWA/APK.
- [ ] Testar rede lenta e falha de Unsplash; fallback deve conservar estrutura e copy.
- [ ] Simular `webglcontextlost`; a matriz deve cair para o modo de fallback.
- [ ] Testar Android WebView com back button fechando primeiro o diálogo ativo.

## Limitação do ambiente de QA

Os binários Chromium disponíveis nesta sessão estavam vazios ou encerraram com falha nativa. Por isso não foram produzidas capturas automatizadas. A validação entregue é estrutural e de runtime simulado; o checklist visual acima continua sendo gate de publicação.
