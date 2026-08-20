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
