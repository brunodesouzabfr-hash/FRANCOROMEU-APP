# Baseline reproduzível

## Antes

Commit-base `4929546`. Auditoria capturada a partir da fonte original em 10/10 (registro UTC `2026-10-11T00:40:10Z`) por HTTP, Chromium headless emulado, 390×844 touch e 1440×900 desktop. As seis views foram abertas; nenhuma imagem quebrada ou overflow horizontal foi reproduzido nesses dois perfis. Isso não confirma outros dispositivos nem invalida o defeito de intro relatado.

- 115 serviços, 15 categorias, 7 cupons padrão.
- 12 estilos de Ambientes e 16 projetos de Portfólio.
- A camada Etapa 15 expõe 10 conceitos/projetos, além do cubo físico de 6 faces. “6 conceitos” do handoff não é o inventário total atual.
- Arquivo Social existente: 6 placeholders; sem 30 publicações reais verificadas.
- `npm test` original: 38 testes aprovados; `npm run check:html` aprovado.
- Parte da suíte verifica arquivos históricos; foram acrescentados gates para o `index.html` operacional e o build público.

## Defeitos reproduzidos no código/DOM

1. Texto técnico fora de comentário após `</head>`, aparecendo acima da navegação.
2. Intro com duração artificial e mais de uma rotina de encerramento.
3. Valores iniciais 0 nos contadores do HTML e textos duplicados usados no efeito do CTA.
4. Editores administrativos incorporados à fonte entregue ao público.
5. Carregamento de imagens de Portfólio antes da visita à view.
6. Controles menores que 44 px, especialmente no orçamento e nos pontos do 3D.
7. Metadados do host antigo e fallback de rotas para a Home.
8. Roteadores reinstalados tardiamente sobrescreviam a sincronização de URL/metadata.

Nenhum arquivo de logo original foi redesenhado. O tratamento de encaixe é de apresentação, com proporção e contain.

## Reprodução do candidato

```sh
npm test
npm run check:html
npm run build
npm run preview
```

Preview público local: `http://127.0.0.1:4181`. A fonte local não deve ser usada como publicação pública. Auditoria detalhada:

```sh
node scripts/site-audit.mjs http://127.0.0.1:4181 /tmp/fr-site-audit
node scripts/site-regression.mjs http://127.0.0.1:4181 /tmp/fr-site-regression
node scripts/site-pdf-qa.mjs http://127.0.0.1:4181 /tmp/fr-site-pdf-qa
```

Esses scripts usam Playwright/Chromium disponíveis nesta máquina, sem dependência adicional do site. Bloqueiam tags de analytics e usam apenas dados de teste. PDF exige CDNs reais; falha/timeout precisa ser registrado, não convertido em aprovação. Relatório consolidado e evidências finais: `audit-report.md` e `evidence/`.
