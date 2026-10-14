# Matriz de rotas e redirects

## Hosts

| Entrada | Destino | Preserva path/query | Estado |
| --- | --- | --- | --- |
| `francoromeu-app.vercel.app/:path*` | `https://www.francoromeufr.com.br/:path*` | sim | 308 remoto verificado com `/sobre?utm_test=codex` |
| `francoromeufr.com.br/:path*` | `https://www.francoromeufr.com.br/:path*` | sim | 308 remoto verificado com `/sobre?utm_test=codex` |
| `www.francoromeufr.com.br` | conteúdo canônico | n/a | domínio vinculado; Home atual 200; novas rotas validadas no preview integrado |

## Rotas institucionais

| Rota | Arquivo do build | Canonical próprio | Indexável | QA HTTP local |
| --- | --- | --- | --- | --- |
| `/` | `index.html` | sim | sim | 200 PASS |
| `/sobre` | `sobre.html` | sim | sim | 200 PASS |
| `/ambientes` | `ambientes.html` | sim | sim | 200 PASS |
| `/projetos-3d` | `projetos-3d.html` | sim | sim | 200 PASS |
| `/portfolio` | `portfolio.html` | sim | sim | 200 PASS |
| `/orcamento` | `orcamento.html` | sim | sim | 200 PASS |

## Redirects editoriais preservados

| Origem | Destino | Tipo |
| --- | --- | --- |
| `/jornal` | `/projetos/` | permanente |
| `/projetos.html` | `/projetos/` | permanente |
| 6 slugs antigos de estudos | respectivos destinos em `/projetos/antes-depois/.../` | permanente |
| `/projetos-3d/cozinha-lavanderia-estudo-fr` | `/projetos/cozinha-lavanderia` | permanente |
| `/materiais/:slug` | `/projetos/materiais/:slug/` | permanente |
| `/servicos/:slug` | `/projetos/servicos/:slug/` | permanente |
| `/ambientes/:slug` | `/projetos/ambientes/:slug/` | permanente |

## Rotas editoriais

O mapa gerado contém 332 rotas e arquivos correspondentes. As 326 rotas além das seis institucionais estão publicamente navegáveis para preview, mas permanecem `noindex` por política de liberação progressiva. Incluem Jornal, antes/depois, estudos 3D, materiais, serviços, ambientes, inspirações e páginas individuais.

## 404 e segurança de roteamento

- Não existe rewrite SPA genérico para `index.html`.
- URL inexistente responde 404 no servidor local e no preview Vercel.
- `/base-original/FRANCO_ROMEU_ETAPA13_ORIGINAL.html` responde 404 no output público.
- History API, navegação interna e `popstate` mantêm path e canonical da rota.
- O preview Vercel integrado respondeu 200 nas seis rotas institucionais, em `/projetos/` e em uma rota editorial individual. A produção anterior ainda responde 404 em `/sobre`; esse delta só será corrigido após merge e promoção autorizados.

