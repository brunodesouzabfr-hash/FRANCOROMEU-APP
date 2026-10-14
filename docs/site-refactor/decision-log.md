# Decisões e gates de release

## D01 — preservar a base e o motor

Usar a `main` atual, em branch de tarefa. Preservar o banco completo e `src/budget-core.js`; não criar outro estado global ou motor de cálculo. Alterações visuais e compilação pública são independentes da revisão comercial de preços.

## D02 — duas superfícies, uma fonte

`index.html` continua a fonte local, com God Mode local preservado. `npm run build` gera `dist/`, remove os dois sistemas de edição administrativa por DOM/AST e publica somente esse diretório. Não é autenticação: dados comerciais enviados ao cliente continuam sujeitos a validação adequada em fluxos transacionais.

O build usa somente ferramentas já presentes no lockfile (JSDOM, Terser, Lightning CSS e o parser do Terser). Sem novo framework ou dependência de produção. Código compilado deve ser testado, não apenas a base HTML histórica.

## D03 — domínio é um gate externo

Destino desejado: `https://francoromeufr.com.br`, sem `www`. Na verificação de 11/10, 03:15 UTC, apex `/portfolio` respondeu 308 para `www`, `www/portfolio` respondeu 404, e o domínio antigo `/portfolio` respondeu 307 para `www`. A Home em `www` respondeu 200 e ainda entregou o HTML anterior (1.393.656 bytes).

Não adicionar redirect de `www` para apex enquanto o painel redirecionar apex para `www`: produziria loop. Metadados/sitemaps novos estão preparados localmente; **não publicar antes de corrigir e testar a configuração do domínio**. DNS, Search Console, TXT, e-mail e publicação não foram alterados.

Sequência proposta no painel autorizado: novo apex serve a aplicação e HTTPS; remover redirect apex→www; validar seis caminhos; só então configurar www e host antigo para apex com 301/308, preservando path e query pertinentes. Repetir testes HTTP, inclusive 404, sem assumir que DNS delegado implica deploy correto.

## D04 — migração incremental, sem promessa de arquitetura concluída

O candidato gera HTML e metadata próprios para as seis URLs já existentes. O shell ainda conserva as views inativas e scripts da SPA para preservar contratos. Isso **não conclui** a arquitetura híbrida de páginas independentes, novos hubs/cases nem o spike Next.js. Essa mudança permanece separada da release de domínio e das correções P0.

O roteador SEO acompanha `frViewChanged`; não disputa a ponte `switchView` com os módulos de motion, que a reinstalam após a inicialização.

## D05 — origem de mídia e referências

No primeiro checkpoint, nenhuma foto/render do ZIP foi incorporada. Na continuação, 57 ilustrações liberadas entraram somente no candidato, com labels/fichas e 162 WebP; sem publicação de produção. Não converter HOLD, ilustração ou referência em prova de execução. Os originais de marca e mídia existentes permanecem intactos. O hero recebeu somente derivados técnicos responsivos (resize/compressão, sem crop ou redesenho), com natureza “referência visual, não execução”.

Referências NK, Spiral, Sergio Ayala e Skiper são direções de adaptação, não autorização para copiar código, assets ou identidade. Capturas ausentes e URLs/posters sociais não confirmados impedem a criação de 30 registros fictícios.

## D06 — avaliações Google

Endpoint opt-in com chave somente no servidor, timeout, retorno mínimo, autoria, link da avaliação, atribuições e `no-store`. Nenhuma nota fixa, scraping ou AggregateRating autorreferente. Limites em memória são por instância, não uma quota distribuída: antes de habilitar, definir quotas no Google, faturamento, restrições da chave e proteção de borda adequada.

Ativação depende de credenciais, identidade confirmada e termos/privacidade exigidos pela fonte. O fallback e os links fornecidos funcionam sem API. Não chamar isso de feed ao vivo já instalado.

## D07 — recuperação entre origens

Adicionar exportação/importação explícita de JSON para orçamento. Não ler armazenamento de outra origem e não incluir orçamento na URL. Validar IDs, quantidades e opções; recalcular com o catálogo atual; preservar backup antes de substituir. Fidelidade/recompensas do navegador de destino não são importadas de arquivo externo. Valores do arquivo não substituem o banco nem constituem preço validado.

Limite operacional: o usuário precisa exportar na origem antiga enquanto ela ainda estiver acessível com essa ferramenta. Se o host antigo já redireciona antes de servir HTML, esta UI no domínio novo não recupera retroativamente aquele localStorage. Planejar acesso de exportação controlado no host antigo antes de consolidar o redirect; não prometer migração automática de dados já inacessíveis.

## D08 — rollback e autorização

Nenhum commit, push, PR, merge ou deploy nesta entrega. Revisar os caminhos específicos do diff; não usar reset/clean/checkout destrutivo. Fontes, anexos e arquivos anteriores do usuário permanecem intactos. Para descartar o candidato, restaurar somente os hunks desta tarefa após preservar trabalho posterior; derivados novos podem ser retirados após revisar seus usos. Domínio requer snapshot e rollback próprios no painel, não um revert de código automático.

## D09 — continuação: anexo e novos pedidos sem preço aprovado

O proprietário respondeu “sim” à ampliação, sem fornecer preços FR. Integrar as 17 famílias como **solicitações de avaliação**, com WhatsApp contextual e indicação de que não entram no total. Não criar serviços calculáveis a R$ 0, copiar preços Leroy, alterar IDs ou escolher custo/margem pelo proprietário. Comparativo histórico acessível sob demanda; cenários usam exclusivamente FRBudgetCore.

## D10 — primeira página independente sem migrar o motor

O spike gera `/projetos/cozinha-lavanderia` com HTML próprio, 57 imagens identificadas, metadata, schema CreativeWork e navegação para a calculadora existente. Nenhum motor/orçamento ou Three.js é carregado nessa página. É uma prova de publicação estática incremental, **não** aprovação de Next.js ou conclusão de todos os hubs. O shell de seis views continua preservado. Páginas de execução e antes/depois documental dependem das respectivas fontes.

## D11 — correções localizadas de PDF e 3D

PDF pagina a tabela por linhas completas, repete cabeçalho e separa rodapé; rasteriza página a página em JPEG, mantendo o template e os valores do núcleo. Exibição de visita usa `visitCharged/visitWaived`, corrigindo a cobrança nominal exibida após isenção. Loader Three.js usa o módulo ESM da mesma versão 0.161.0 em vez do arquivo clássico inexistente. Sem modelo inventado, upgrade de versão ou dependência adicional.

## D12 — entrega para revisão, não release de produção

Preparar PR de rascunho conforme pedido explícito. Excluir `.vercel/`, os PNGs originais, pacotes e anexos alheios. Histórico D08 registra a fase anterior sem Git externo; o relatório de continuação deve informar os atos realmente executados. Não mergear nem publicar produção. Domínio e credenciais seguem como gates externos.

Rechecagem de domínio em 11/10/2026 05:10 UTC: resolver local não respondeu para o apex; DNS-over-HTTPS do Google respondeu A e NS `ns1.vercel-dns.com`/`ns2.vercel-dns.com`. Isso não comprova propagação em todos os resolvers. `www/portfolio` respondeu 404 e o host antigo respondeu 307 para `www/portfolio`. DNS delegado e redirect funcional não comprovam as rotas nem o canônico desejado.

## D13 — gates reais, sem transformar laboratório em aprovação

Leitura autenticada da Vercel às 05:39 UTC confirmou projeto/repositório, produção em `main` e redirects atuais; não falta acesso de leitura, mas autorização para mudar tráfego de produção. Nenhuma configuração remota foi alterada.

O trace do primeiro clique do controle de quantidade identificou `stepSlideIn` deslocando o editor em 24 px: o clique atingia um DIV. Aplicar entrada por opacidade, preservando a animação numérica e a precisão do input. Seis reconstruções por perfil 390/1440 validaram o botão real após a correção.

PDF final curto/longo revisto em quatro páginas; corrigir locale/fuso sem alterar o arredondamento `toFixed(2)` do template anterior. O formato permanece raster, não é PDF acessível completo.

Laboratório final, três execuções por versão: LCP 2.740 → 3.328 ms, CLS de carga 0,05774 → 0,00268. Não ocultar a piora do LCP nem declarar concluída a otimização/CWV. Aceite de performance e publicação continuam bloqueados; PR de rascunho serve para revisar o candidato e os próximos releases separados.
