# Changelog

## 14.0.0 — Seis Universos Awwwards

- cria seis universos visuais e campos Canvas 2D exclusivos;
- adiciona matriz Three.js lazy com fallback compatível;
- transforma Ambientes em galeria e Portfólio em Arquivo Vivo sem modal;
- adiciona capítulos ao Sobre e rota de decisão à Home;
- refina Orçamento como cockpit com confiança e divulgação progressiva;
- preserva byte a byte os motores de Portfólio e PDF;
- mantém 115 serviços, 15 categorias e fórmulas financeiras;
- remove claims e escassez não comprovados;
- adiciona SEO, JSON-LD, reduced motion, QA, brief JSON e roadmap Site/PWA/APK;
- corrige o fechamento prematuro de `body` herdado;
- registra limitação do Chromium empacotado, que encerrou com `SIGSEGV` antes do aceite visual.

## 13.1.3 — PDF resiliente e fonte canônica

- Restaurado o contrato `window.FR_PERFORMANCE.ensurePDFStack`, ausente apesar de ainda ser chamado por `generatePDF()`.
- Adicionado carregamento sob demanda de `html2canvas@1.4.1` e `jsPDF@2.5.1`, com deduplicação de chamadas concorrentes, validação da API, timeout e nova tentativa após falha.
- Mantida a paginação A4 e preservados motor financeiro, 115 serviços, 15 categorias, IQE, CEP, WhatsApp e persistência.
- Ampliado `check:html` para impedir nova remoção silenciosa do bridge/dependências do PDF.
- Definido o GitHub como fonte canônica e adicionados registro mestre, anexo factual e brief JSON para futuras IAs.
- Separadas mudanças implementadas de propostas Awwwards; claims não comprovados, escassez artificial e uso de Unsplash como obra executada foram explicitamente rejeitados.
- QA: sintaxe dos 25 scripts inline, 200 IDs estáticos, 115 IDs de serviços, seis views, 15 categorias e concorrência do loader aprovados. Chromium visual indisponível no ambiente por `SIGSEGV`, sem aprovação visual presumida.

## 13.1.0 — Fundação técnica

- Criado núcleo financeiro puro e testável com arredondamento monetário, opções por ID e compatibilidade com índices legados.
- Transformado o total em faixa de estimativa orientativa, com premissas, confiança, itens confirmados/estimados e regra explícita da visita.
- Adicionadas validações de configurações obrigatórias e de completude antes de enviar, visualizar, salvar ou gerar PDF.
- Protegidas as operações críticas de armazenamento; importações administrativas agora passam por validação estrutural e backup preventivo.
- Removida a senha administrativa do código; acesso local de desenvolvimento documentado.
- Reforçados escape de campos, validação semântica, consulta de CEP, edição/duplicação de serviços e paginação do PDF.
- Melhoradas semântica, foco, alvos de toque, links externos, rótulos e suporte a movimento reduzido.
- Imagens externas do Unsplash agora recebem ressalva automática de referência visual.
- Removido o CNPJ demonstrativo das áreas públicas e consolidada a versão como Etapa 13.1.

## 13.1.1 — Distribuição em arquivo único

- Incorporado o núcleo financeiro no HTML principal para permitir download, envio e abertura sem arquivos JavaScript locais auxiliares.
- Documentado o download pelo GitHub e pelo botão “Baixar HTML definitivo” do God Mode.

## 13.1.2 — Hero e auditoria de evolução visual

- Corrigido o fundo absoluto da Home, que era convertido em bloco de fluxo pelo selo de imagens de referência e deslocava todo o hero.
- Adicionada regressão estrutural para preservar o empilhamento do hero.
- Criado anexo técnico/editorial com inventário completo das mudanças, referências de estudo e direção futura para os seis mundos da aplicação.
