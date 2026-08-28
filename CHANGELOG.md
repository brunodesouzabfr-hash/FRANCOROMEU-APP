# Changelog

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

## 13.2.0 — Ecossistema de autoridade e SEO local

- Promovido `index.html` a artefato principal, com metadados locais, canonical, social cards e grafo JSON-LD para negócio, site, breadcrumbs, FAQ e 16 serviços reais do catálogo.
- Convertida a navegação principal e do rodapé em links rastreáveis, com rotas amigáveis, History API, metadados dinâmicos e fallback de rewrite na Vercel.
- Criados `sitemap.xml`, `robots.txt` e o plano operacional de conteúdo, GBP, Instagram, citações, backlinks, Q&A, analytics e evolução técnica.
- Corrigidos textos alternativos críticos de logo e hero, sem atribuir imagens de referência a obras executadas.

## 13.2.1 — Consolidação da branch principal

- Consolidada a linha de desenvolvimento na branch `main`, preservando os merges históricos das etapas 13.1.1 e 13.1.2 e a implementação de SEO local 13.2.0.
- Confirmado o versionamento dos artefatos úteis de aplicação, documentação, rastreamento, deploy, núcleo financeiro e testes automatizados.
