# Contrato de embeds sociais — sem API

## Objetivo

Criar no meio do Portfólio um arquivo social horizontal que funcione primeiro como interface local e permita ativar conteúdo oficial de Instagram, TikTok, Facebook, YouTube, Pinterest e X depois, sem espalhar códigos de incorporação pelo HTML.

## Princípio

O site não depende de API nem de login. O estado inicial é sempre um card FR renderizado localmente. Ao selecionar `Carregar publicação`, o adaptador do provedor pode carregar um `iframe` ou script oficial, se o registro estiver completo, validado e autorizado.

Sem URL/ID válido, o card continua sendo uma demonstração local. Ele nunca imita métricas, nome de usuário, comentários ou prova social.

## Fonte única de manutenção

Usar um registro equivalente a `content/examples/fr-social-embeds.example.json`, adaptado ao formato monolítico do app. Em produção, o registro pode ficar em:

```html
<script type="application/json" id="fr16-social-registry">
{ "schemaVersion": "1.0", "items": [] }
</script>
```

Isso mantém o HTML autocontido e permite substituir um post sem alterar componentes.

## Campos mínimos

| Campo | Obrigatório | Regra |
| --- | --- | --- |
| `id` | sim | estável, único e sem informação pessoal |
| `provider` | sim | enum fechado: `instagram`, `tiktok`, `facebook`, `youtube`, `pinterest`, `x` |
| `status` | sim | `placeholder`, `ready`, `disabled`, `archived` |
| `title` | sim | copy FR; não copiar legenda sem autorização |
| `series` | sim | pilar editorial FR |
| `permalink` | para `ready` | HTTPS e domínio oficial permitido |
| `externalId` | conforme provedor | ID validado, nunca token/segredo |
| `aspectRatio` | sim | enum como `9/16`, `1/1`, `4/5`, `16/9` |
| `poster` | opcional | asset FR autorizado; sem hotlink de referência |
| `rightsStatus` | sim | `verified`, `pending_rights`, `not_applicable` |
| `consentRequired` | sim | `true` para conteúdo de terceiros |
| `order` | sim | inteiro; não usar ordem implícita do DOM |

## Arquitetura de componentes

```text
FRSocialArchive
  ├─ FRSocialRail
  │   └─ FRSocialCard (sempre local)
  │       ├─ poster/copy/metadados
  │       ├─ botão Carregar publicação
  │       └─ fallback Abrir na plataforma
  └─ FREmbedLoader (singleton)
      ├─ provider allowlist
      ├─ consent/state
      ├─ lazy activation
      └─ cleanup/offscreen pause
```

## Loader permitido

- Aceitar somente provedores enumerados.
- Validar `URL.hostname` contra allowlist específica.
- Nunca executar HTML arbitrário vindo de campo, query string, storage ou resposta externa.
- Criar DOM com APIs seguras; não usar `innerHTML` com embed fornecido pelo usuário.
- Carregar no máximo uma cópia de cada script oficial.
- Carregar somente após clique/consentimento e quando o card estiver próximo do viewport.
- Preservar fallback externo se bloqueador, CSP, timeout ou script falhar.
- Não inicializar autoplay, som, câmera, microfone ou fullscreen automático.
- Não armazenar cookie/identificador próprio para simular consentimento sem política definida.

## Estratégias por provedor

Os detalhes atuais devem ser conferidos na documentação oficial do provedor antes da ativação. O componente deve isolar diferenças:

| Provedor | Estratégia preferida | Dados mantidos no registro |
| --- | --- | --- |
| YouTube | `iframe` com domínio de privacidade ampliada quando aplicável | `externalId`, início opcional, título |
| Facebook | plugin oficial em `iframe` construído a partir do permalink | `permalink`, largura lógica |
| Instagram | código oficial/manual por adaptador e script único | `permalink` e ID derivado/validado |
| TikTok | player/embed oficial por ID e script único quando necessário | `externalId`, `permalink` |
| Pinterest | widget oficial carregado sob demanda | `permalink` do Pin |
| X | post oficial carregado sob demanda | `permalink`/ID do post |

Não implementar oEmbed por API nesta etapa.

## Moldura local pré-renderizada

Cada provider deve ter um card de demonstração com:

- ícone/texto do provider;
- série FR;
- título editorial;
- formato (`9:16`, `16:9` etc.);
- rótulo `DEMONSTRAÇÃO — AGUARDANDO PUBLICAÇÃO OFICIAL`;
- botão `Adicionar URL oficial` apenas em contexto administrativo, se existir;
- no site público, botão desabilitado ou `Ver conteúdo FR relacionado`.

Não inventar avatar, número de curtidas, comentários, visualizações ou data.

## Exemplo conceitual de wrapper

```html
<article class="fr16-social-card" data-provider="youtube" data-status="placeholder">
  <header>
    <span>YOUTUBE / CADERNO DE OBRA</span>
    <span>16:9</span>
  </header>
  <div class="fr16-social-frame" data-fr16-embed-slot>
    <p>Demonstração — aguardando publicação oficial.</p>
  </div>
  <h3>Do levantamento ao ambiente compatibilizado.</h3>
  <button type="button" data-fr16-load-embed disabled>Carregar publicação</button>
</article>
```

Quando `status` mudar para `ready`, o mesmo componente habilita o botão e o loader cria a incorporação. O markup editorial não muda.

## Segurança do iframe

Definir por provedor o menor conjunto funcional de permissões. Como base:

- `loading="lazy"`;
- `title` único e descritivo;
- `referrerpolicy` restritiva quando compatível;
- `allow` apenas para capacidades exigidas;
- `sandbox` quando o provedor funcionar com ele;
- sem `allow="camera; microphone"`;
- dimensões responsivas com proporção reservada para evitar CLS.

Se o provedor exigir permissões mais amplas, registrar a exceção no código e na revisão.

## Acessibilidade

- O trilho é navegável por teclado sem sequestrar Tab.
- Setas podem mover seleção quando o foco está no trilho; devem ser documentadas.
- Cada card tem heading e provider legíveis antes do embed.
- O iframe tem `title` específico, nunca apenas “vídeo”.
- Depois de carregar, o foco permanece no botão ou vai para uma ação explícita; não entra automaticamente no iframe.
- Reduced motion remove inércia/espiral, mas não remove posts.
- Mobile oferece scroll nativo e `scroll-snap`; não usa drag JavaScript obrigatório.

## Performance

- Nenhum provider é carregado no primeiro paint.
- Limitar embeds ativos simultâneos; desmontar ou pausar mídia distante quando possível.
- Posters usam dimensões, `loading=lazy` e assets otimizados.
- Reservar espaço antes do carregamento.
- Timeout produz fallback e status legível.
- Canvas do Portfólio pausa enquanto mídia pesada estiver em foco se necessário.

## Manutenção posterior

Para adicionar um post:

1. confirmar que a publicação é pública e pertence à conta aprovada;
2. confirmar direitos da mídia e pessoas exibidas;
3. copiar permalink/ID oficial, nunca token;
4. alterar apenas o item do registro;
5. definir `status: "ready"` e `rightsStatus: "verified"`;
6. validar o card, fallback e mobile;
7. registrar a mudança em branch/PR.

Para remover, usar `status: "archived"`; não apagar imediatamente o histórico do registro.

## Critérios de aceite

- A página funciona com rede externa bloqueada.
- Nenhum script social é baixado antes da ação do visitante.
- Um post inválido não quebra o trilho inteiro.
- Trocar URL/ID não exige editar o componente.
- Não há credencial, token ou cookie no repositório.
- Placeholders não parecem prova social real.

