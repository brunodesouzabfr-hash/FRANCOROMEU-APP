# Franco Romeu — contrato de medição e governança de tags

Atualizado em 15/10/2026. Estado **observado**, não certificação de coleta.

## Configuração verificada no código (branch main)

- Domínio oficial: `https://www.francoromeufr.com.br/`.
- Google Analytics 4: `G-C3FMZ4NGGY`, configurado em `src/public-site-meta.cjs`, por `gtag.js` direto no `<head>`.
- Propriedade histórica: `G-22Z85RCGQC`. Não reinstalar esse ID automaticamente e não eliminar dados históricos do Analytics.
- Outros rastreadores preservados: Microsoft Clarity e Ahrefs Web Analytics; validações Google e Pinterest.
- Nenhum snippet de contêiner `GTM-...` foi localizado na pesquisa do código da `main` desta auditoria. Um ID `GT-...` é uma tag do Google, não prova instalação de um contêiner GTM.
- Vercel: domínio antigo `francoromeu-app.vercel.app` -> 301 para `www`; apex `francoromeufr.com.br` -> 308 para `www`.
- O deployment de produção da alteração do GA4 foi marcado `READY` na Vercel; isso **não comprova** recebimento de dados/eventos no GA4.

## Pendência de acesso aos dados

O GSC Wizard consegue listar as duas propriedades GA4, mas no acesso verificado em 15/10/2026 **não havia vínculo GA4 com o site `https://www.francoromeufr.com.br/` na conta do Wizard atual**. É necessário vincular a propriedade correta na página Analytics do site em `tool.gscwizard.com` e então validar relatórios por hostname, eventos, sessões e conversões.

O conector disponível tem escopo `analytics.readonly`; não presume permissão para editar administração do Google Analytics ou Google Tag Manager.

## Contrato proposto de eventos (ainda não comprovados em produção)

`view_service`, `view_project`, `view_environment`, `view_material`, `project_3d_open`, `before_after_interaction`, `social_archive_open`, `social_embed_open`, `budget_start`, `budget_add_service`, `budget_remove_service`, `budget_complete`, `pdf_generate`, `whatsapp_click`, `instagram_click`, `google_profile_click`, `google_review_click`.

As buscas em código da `main` não localizaram implementação de `gtag('event', ...)` para esses eventos; **não contar esses eventos como implementados** sem prova de execução.

## Critérios obrigatórios antes de ativar conversões ou mudar para GTM

1. Confirmar o ID do fluxo de dados GA4 e a propriedade de destino, os direitos de acesso e o consentimento de privacidade aplicável (LGPD).
2. Definir uma fonte única de `page_view` por navegação SPA; não duplicar eventos via `gtag.js` + GTM em paralelo.
3. Emitir eventos somente para interações reais, nunca para conteúdo meramente renderizado; não enviar nome, telefone, endereço, texto livre nem parâmetros com dados pessoais.
4. Não compartilhar identificadores pessoais, dados de orçamento, preços privados ou dados livres do atendimento com a analítica.
5. Validar no Tag Assistant, Tempo Real/DebugView, com aceite e recusa de consentimento; orçamento, PDF e WhatsApp devem permanecer funcionais sem Analytics.
6. Registrar contagens, hostnames, período e origem antes de definir eventos principais (key events) ou importar conversões ao Google Ads.
7. Executar testes do repositório e release control antes de publicar mudança funcional; conservar rollback.

## Operação

- O sitemap e a indexação do Search Console são independentes do GA4; não alterar canonical, DNS ou redirecionamentos para solucionar falta de eventos.
- URLs efêmeras de preview `*.vercel.app` não devem ser automaticamente adicionadas à medição entre domínios.
- Não adicionar um contêiner GTM ou outra tag GA4 apenas para limpar um alerta de diagnóstico sem verificar a causa.
- Informações históricas de auditorias anteriores devem continuar identificadas como históricas.
