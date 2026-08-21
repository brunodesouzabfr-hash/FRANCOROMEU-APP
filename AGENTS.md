# Instruções do Codex — Franco Romeu

## Base canônica

- A base funcional e visual autorizada para todo novo desenvolvimento é a branch `codex/etapa-15-materialidade-imersiva` e seu PR #6.
- Comece novos trabalhos a partir dessa branch enquanto o PR #6 não estiver aprovado e integrado à `main`.
- A `main` continua sendo a versão estável oficial, mas ainda não representa a direção visual escolhida para o próximo lançamento.
- As branches das Etapas 13, 14 e `codex/etapa-15-sites-individuais` são apenas histórico. Não continue o desenvolvimento nelas.
- Não restaure nem reutilize o layout, a navegação ou as decisões visuais da Etapa 15 “sites individuais”, que foi rejeitada.
- Fundamentos técnicos anteriores já incorporados à Materialidade Imersiva podem e devem ser preservados.

## Invariantes protegidos

Antes de alterar código, confirme e preserve, salvo autorização explícita do proprietário:

- `FRBudgetCore`, preços, fórmulas e regras financeiras;
- 115 serviços, 15 categorias e 6 views;
- IQE, Calculadora, geração de PDF, busca, fidelidade, estado/persistência e navegação responsiva;
- os motores protegidos `fr-stage2-portfolio-engine` e `fr-pdf-stack-loader`;
- acessibilidade por teclado, foco visível, alvos de toque e suporte a movimento reduzido;
- fallbacks para WebGL/GPU, rede lenta e falhas de dependências externas.

Não trate imagens externas ou referências conceituais como obras executadas pela Franco Romeu. Não exponha controles administrativos locais como se fossem autenticação segura de produção.

## Direção de marca e produto

- Preserve as cores, tipografia, logotipo e a identidade Franco Romeu existentes na base canônica.
- Mantenha o posicionamento “luxo silencioso + engenharia inteligente”.
- Prefira “solução inteligente”, “tradição com precisão”, “engenharia de custo”, “curadoria material” e “permanência”.
- Evite “baratinho”, “promoção”, “reforma barata”, falsa urgência, números sem fonte e promessas comerciais não comprovadas.
- Evolua a Materialidade Imersiva de forma incremental; não faça um novo redesign completo sem autorização explícita.

## Fluxo de trabalho no GitHub

- Não edite a `main` diretamente. Crie uma branch curta a partir da base canônica e abra um Pull Request.
- Mantenha o PR #6 como rascunho até concluir a validação visual real.
- Não faça merge, publicação, exclusão de branch ou alteração destrutiva sem autorização explícita.
- Explique no PR o que mudou, o que foi preservado, os testes executados e qualquer limitação.
- Não declare uma verificação como aprovada se ela não foi realmente executada.

## Verificação mínima

Para mudanças de código, execute quando os comandos estiverem disponíveis:

```bash
npm test
npm run check:html
git diff --check
```

Valide também em navegador real, quando possível:

- Chrome, Safari e Firefox;
- largura de 390 px e dispositivos de toque;
- GPU/WebGL e respectivos fallbacks;
- Calculadora, IQE e geração de PDF;
- navegação por teclado, foco e movimento reduzido.

Se alguma verificação não puder ser executada, registre isso claramente no PR.

## Regras de revisão

Sinalize como regressão ou risco relevante:

- alteração não autorizada em preços, fórmulas, motores protegidos ou contagens canônicas;
- retorno de decisões visuais rejeitadas;
- IDs duplicados, quebra de persistência ou de navegação;
- autenticação administrativa somente no cliente exposta como segurança real;
- imagens de referência apresentadas como portfólio executado;
- métricas, escassez ou promessas sem comprovação;
- remoção de acessibilidade ou de fallbacks.
