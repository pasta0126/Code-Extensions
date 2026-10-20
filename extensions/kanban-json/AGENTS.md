# AGENTS.md — kanban-json

Extensión de VS Code (`kanban-json`) que muestra y mantiene un tablero Kanban a partir de un `kanban.json`; el JSON se edita con «Abrir como texto». Ver también el `AGENTS.md` de la raíz (`../../AGENTS.md`) (metodología SDD con OpenSpec y convenciones del repo).

Specs: `openspec/changes/<cambio>/specs/kanban-json/`.

## Comandos (ejecutar en `extensions/kanban-json/`)

```bash
npm install
npm test            # vitest, tests del núcleo (src/board)
npm run typecheck   # tsc --noEmit
npm run build       # esbuild -> dist/extension.js
npm run watch
```

Para probarla: F5 en VS Code abriendo la raíz del repo (configuración "Run kanban-json" en `.vscode/launch.json`; abre `examples/` en un Extension Development Host).

## Estructura

```
src/board/       Núcleo puro: model.ts, json.ts (parse/serialize/validación), operations.ts (Board -> Board)
src/editor/      CustomTextEditorProvider (KanbanEditorProvider.ts) y protocolo de mensajes (protocol.ts)
src/extension.ts Activación y comandos
media/           Webview vanilla (board.js, board.css), sin framework ni build
test/            Tests vitest del núcleo
examples/        kanban.json de ejemplo (también fixture de los tests)
```

## Reglas de arquitectura

- `src/board` **no importa `vscode`**. Solo `src/editor` y `src/extension.ts` lo hacen. Así el núcleo se testea sin VS Code.
- Las operaciones de `operations.ts` son funciones puras `Board -> Board`: no mutan la entrada (clonan) y lanzan `BoardError` si se rompe un invariante.
- El `TextDocument` es la fuente de verdad. Los cambios del webview llegan como mensajes (`protocol.ts`), se aplican sobre el tablero parseado del documento y se reescribe el documento completo con `WorkspaceEdit`. No guardes estado del tablero en el webview.
- Los campos desconocidos de una tarea (`startedAt`, `completedAt`, `reviewer`, ...) viven en `Task.extras` y deben sobrevivir a cualquier round-trip. No añadas claves ausentes (p. ej. `dueDate: null`) al serializar.
- Webview: CSP con nonce; el contenido de usuario se inserta siempre con `textContent`/nodos de texto, nunca `innerHTML`. `window.prompt/confirm/alert` no funcionan en webviews: usa `<dialog>` o confirma desde el host.
- Si cambias `protocol.ts`, actualiza a la vez `KanbanEditorProvider.ts` y `media/board.js`.

## Convenciones

- Todo texto visible al usuario (UI, mensajes, descripción, README, CHANGELOG) en inglés.
- TypeScript estricto (`noUncheckedIndexedAccess` activo). Sin dependencias de runtime nuevas salvo necesidad clara; el bundle va con esbuild.
- Todo cambio en `src/board` debe llevar tests en `test/`. Ejecuta `npm test` y `npm run typecheck` antes de dar algo por terminado.
