## Resultado esperado

<!-- Explique o comportamento final, não apenas os arquivos alterados. -->

## Motivo e contexto

<!-- Qual problema, risco ou oportunidade este PR resolve? -->

## Escopo

- Arquivos alterados:
- Fora do escopo:
- Base/branch de origem confirmada:

## Classe de risco

- [ ] Documentação/governança
- [ ] Visual/CSS/motion
- [ ] JavaScript/estado/persistência
- [ ] Calculadora/FRBudgetCore/preços/cupons
- [ ] IQE/busca/PDF
- [ ] Dados canônicos/serviceId
- [ ] Segurança/administração/publicação

## Invariantes Franco Romeu

- [ ] Não reutiliza `codex/etapa-15-sites-individuais`.
- [ ] Preserva `FRBudgetCore`, `window.__frCore` e o núcleo incorporado.
- [ ] Preserva `appState`, `selectedServices`, `serviceId`, `quantidade` e `configs`.
- [ ] Preserva 115 serviços, 15 categorias, 7 cupons e as seis views, ou documenta autorização e migração.
- [ ] Não altera fórmula, preço, desconto, cupom ou visita sem autorização explícita.
- [ ] Não expõe segredo, dado pessoal ou God Mode como autenticação pública.
- [ ] Não inventa claim, obra, cliente, métrica, certificado, prazo ou resultado.
- [ ] Logo, renders e imagens de referência seguem as regras de identidade e verdade visual.

## Verificações executadas

```text
npm test
npm run check:html
```

- Resultado dos testes:
- Teste em 390x844:
- Teste desktop/navegadores:
- Teclado/foco/toque:
- IQE e cálculo manual:
- Persistência após recarga:
- PDF curto e longo:
- Console sem erro:
- Itens não executados e motivo:

## Evidência visual

<!-- Para UI, inclua antes/depois ou descreva exatamente como reproduzir. Não apresente referência como obra real. -->

## Riscos e rollback

- Riscos conhecidos:
- Como observar regressão:
- Como reverter com segurança:

## Publicação

- [ ] Este PR não publica automaticamente o site ou APK.
- [ ] `docs/CHECKLIST_PUBLICACAO.md` foi revisado quando aplicável.
- [ ] Changelog, versão, tag e artefatos serão tratados em etapa própria.

## Aprovação

- [ ] O PR permanece em rascunho enquanto houver teste ou decisão pendente.
- [ ] Os checks obrigatórios passaram.
- [ ] O responsável autorizou o merge.
