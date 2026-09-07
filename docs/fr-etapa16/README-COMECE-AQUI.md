# FR Etapa 16 — comece aqui

Este kit transforma as capturas do FR Lab em contexto curto, versionável e utilizável pelo Codex. Ele não altera o HTML, não usa API e não copia milhares de arquivos brutos para o repositório.

## Decisão simples

- **Implementar código:** abra o Codex no terminal, na raiz do repositório `FRANCOROMEU-APP`.
- **Discutir estratégia ou revisar uma entrega:** use o projeto do ChatGPT e anexe somente o brief, o diff ou os arquivos diretamente envolvidos.
- **Guardar histórico e colaborar:** use uma branch do GitHub. Não envie as capturas brutas; versione apenas os relatórios curados e o código aprovado.

## Antes de começar

Localize o repositório:

```bash
find "$HOME" -maxdepth 5 -type d -name FRANCOROMEU-APP -print
```

Entre no caminho retornado e verifique o estado:

```bash
cd /CAMINHO/RETORNADO/FRANCOROMEU-APP
git status --short
```

Se `git status --short` imprimir qualquer linha, **pare**. Não misture a Etapa 16 com alterações ainda não guardadas. Peça ao Codex para explicar o estado ou faça um commit/backup consciente antes de continuar.

## 1. Criar o ponto de retorno

A base registrada para este projeto é `codex/etapa-15-materialidade-imersiva`.

```bash
git fetch origin
git switch codex/etapa-15-materialidade-imersiva
git pull --ff-only origin codex/etapa-15-materialidade-imersiva
git branch backup/etapa-15-antes-da-etapa-16
git switch -c codex/etapa-16-portfolio-ambientes
```

Se a branch de backup ou da Etapa 16 já existir, não a recrie. Rode `git branch --list` e use a existente somente depois de confirmar que ela é a correta.

## 2. Instalar este contexto no repositório

No diretório em que este kit foi extraído, rode:

```bash
node tools/install-into-repo.mjs /CAMINHO/RETORNADO/FRANCOROMEU-APP
```

O instalador cria apenas documentação, prompts, exemplos de dados e ferramentas de contexto. Ele se recusa a sobrescrever um arquivo diferente e nunca toca no HTML da aplicação.

## 3. Selecionar os relatórios úteis das capturas

Volte à raiz do repositório:

```bash
cd /CAMINHO/RETORNADO/FRANCOROMEU-APP
node tools/fr-context-prepare.mjs --lab-root "$HOME/FR-Design-Lab"
node tools/fr-context-validate.mjs
```

O organizador procura a captura analisada mais recente de cada URL, usando `capture-meta.json`. Ele copia para `docs/fr-etapa16/references/` somente:

- metadados e evidências resumidas;
- `analysis-brief.md` e/ou `codex-summary.md`;
- `design-system-reference.md` e `design-system.json`;
- `fr-translation-plan.md`.

Screenshots úteis ficam em `.fr-context/`, ignorados localmente pelo Git. HTML capturado, animações, CSS, manifests e mapas gigantes permanecem em `~/FR-Design-Lab`.

## 4. Registrar somente o contexto curado

```bash
git status --short
git add docs/fr-etapa16 prompts content/examples tools/fr-context-prepare.mjs tools/fr-context-validate.mjs
git commit -m "docs(etapa16): adiciona contexto curado e plano de implementação"
```

Não use `git add .` nesta fase.

## 5. Abrir o Codex no lugar correto

Ainda na raiz de `FRANCOROMEU-APP`:

```bash
codex
```

No Codex, rode `/status` e confirme que o diretório exibido termina em `FRANCOROMEU-APP`. Depois envie esta instrução curta:

```text
Leia AGENTS.md, todos os arquivos em docs/fr-etapa16/ e prompts/CODEX-IMPLEMENTAR-ETAPA16.md. Execute SOMENTE o CHECKPOINT 0 (auditoria e baseline). Não altere arquivos ainda. Entregue o mapa de contratos, os arquivos que pretende tocar, os testes atuais e qualquer divergência entre o repositório e o brief. Pare para minha aprovação.
```

Após conferir a auditoria, libere **um checkpoint por vez**. Não peça a implementação inteira em um único salto.

## 6. Ciclo de cada checkpoint

Depois de cada fase implementada:

```bash
git diff --stat
git diff --check
git status --short
```

No Codex, use `/review` para revisar as alterações não commitadas. Abra a aplicação em desktop e mobile, execute o checklist em `docs/fr-etapa16/REGRESSION-CHECKLIST.md` e só então registre o checkpoint:

```bash
git add CAMINHOS_EXATOS_QUE_FORAM_REVISADOS
git commit -m "feat(etapa16): descreva o checkpoint concluído"
```

Não faça `push`, PR, merge ou deploy até a regressão final e sua aprovação explícita.

## O que enviar ao ChatGPT

Para uma segunda revisão no projeto do ChatGPT, envie apenas:

1. `docs/fr-etapa16/MASTER-BRIEF.md`;
2. `docs/fr-etapa16/HTML-AUDIT-ETAPA15.md`;
3. `docs/fr-etapa16/references/INDEX.md`;
4. o `git diff` do checkpoint;
5. screenshots da versão antes/depois.

Isso fornece contexto suficiente sem tentar colocar milhares de linhas de captura em uma conversa.

