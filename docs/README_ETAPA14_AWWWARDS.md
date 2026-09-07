# Franco Romeu — Etapa 14 / Seis Universos Awwwards

Protótipo standalone da Franco Romeu — Arte & Engenharia, construído sobre a Etapa 13.1.3 canônica.

## Abrir

Abra `FRANCO_ROMEU_ETAPA14_AWWWARDS_UNIVERSES.html` em um navegador moderno com conexão para os recursos CDN. A calculadora, o catálogo e os fallbacks continuam utilizáveis mesmo quando o núcleo 3D não estiver disponível.

## Entregáveis

- `FRANCO_ROMEU_ETAPA14_AWWWARDS_UNIVERSES.html` — aplicação completa.
- `ANEXO_EVOLUCAO_VISUAL_AWWWARDS_ETAPA14.md` — changelog, referências, variância e roadmap.
- `fr_awwwards_stage14_prompt_brief.json` — fonte estruturada para prompts de IA.
- `QA_STAGE14_AWWWARDS.md` — evidências, riscos e roteiro de aceite.
- `tests/fr-stage14-universes.test.cjs` — suíte automatizada.
- `stage14-visual-qa.mjs` — matriz Playwright para ambiente com Chromium funcional.
- `fr-universe-blueprint.html` — mapa interativo dos seis universos.

## Testar

```bash
npm run test:stage14
```

Se `jsdom` estiver instalado em outro diretório:

```bash
NODE_PATH=qa-tools/node_modules node --test tests/fr-stage14-universes.test.cjs
```

## Estado

- 6/6 testes Stage 14 aprovados.
- 115 serviços e 15 categorias preservados.
- Portfólio e PDF protegidos por comparação byte a byte.
- Aceite visual em navegador real e WebGL real pendente; detalhes em `QA_STAGE14_AWWWARDS.md`.

## Fonte canônica

[github.com/brunodesouzabfr-hash/FRANCOROMEU-APP](https://github.com/brunodesouzabfr-hash/FRANCOROMEU-APP)
