# AGENTS.md

Extensión de VS Code (`kanban-json`) que muestra y mantiene un tablero Kanban a partir de un `kanban.json`, con una vista Raw para editar el JSON.

## Metodología: SDD con OpenSpec

Desarrollo dirigido por especificaciones. Antes de escribir código para una funcionalidad nueva o un cambio de comportamiento, define el cambio en `openspec/changes/<nombre>/` (`proposal.md`, `specs/<capability>/spec.md`, `design.md`, `tasks.md`). El código implementa las specs, no al revés.

- Flujo con Claude Code: `/opsx:propose` → `/opsx:apply` → `/opsx:archive`.
- Valida siempre con `npx @fission-ai/openspec validate <cambio>`.
- Los requisitos usan `SHALL` y cada uno lleva al menos un `#### Scenario:` con `WHEN`/`THEN`.
- Si la implementación se desvía de la spec o el diseño, actualiza los artefactos del cambio (`/opsx:update`) en lugar de dejarlos desfasados.
- Marca las tareas en `tasks.md` (`- [x]`) a medida que se completan.
- Cambio inicial: `openspec/changes/add-kanban-json-editor/` (pendiente: prueba manual 4.3).

## Comandos

```bash
npm install
npm test            # vitest, tests del núcleo (src/board)
npm run typecheck   # tsc --noEmit
npm run build       # esbuild -> dist/extension.js
npm run watch
```

Para probar la extensión: F5 en VS Code (usa `.vscode/launch.json`, abre `examples/` en un Extension Development Host).

## Estructura

```
src/board/       Núcleo puro: model.ts, json.ts (parse/serialize/validación), operations.ts (Board -> Board)
src/editor/      CustomTextEditorProvider (KanbanEditorProvider.ts) y protocolo de mensajes (protocol.ts)
src/extension.ts Activación y comandos
media/           Webview vanilla (board.js, board.css), sin framework ni build
test/            Tests vitest del núcleo
examples/        kanban.json de ejemplo (también fixture de los tests)
openspec/        specs y cambios
```

## Reglas de arquitectura

- `src/board` **no importa `vscode`**. Solo `src/editor` y `src/extension.ts` lo hacen. Así el núcleo se testea sin VS Code.
- Las operaciones de `operations.ts` son funciones puras `Board -> Board`: no mutan la entrada (clonan) y lanzan `BoardError` si se rompe un invariante.
- El `TextDocument` es la fuente de verdad. Los cambios del webview llegan como mensajes (`protocol.ts`), se aplican sobre el tablero parseado del documento y se reescribe el documento completo con `WorkspaceEdit`. No guardes estado del tablero en el webview.
- Los campos desconocidos de una tarea (`startedAt`, `completedAt`, `reviewer`, ...) viven en `Task.extras` y deben sobrevivir a cualquier round-trip. No añadas claves ausentes (p. ej. `dueDate: null`) al serializar.
- Webview: CSP con nonce; el contenido de usuario se inserta siempre con `textContent`/nodos de texto, nunca `innerHTML`. `window.prompt/confirm/alert` no funcionan en webviews: usa `<dialog>` o confirma desde el host.
- Si cambias `protocol.ts`, actualiza a la vez `KanbanEditorProvider.ts` y `media/board.js`.

## Convenciones

- Specs y documentación en español; código, identificadores y nombres de ficheros en inglés. Mensajes de error visibles al usuario en español.
- TypeScript estricto (`noUncheckedIndexedAccess` activo). Sin dependencias de runtime nuevas salvo necesidad clara; el bundle va con esbuild.
- Todo cambio en `src/board` debe llevar tests en `test/`. Ejecuta `npm test` y `npm run typecheck` antes de dar algo por terminado.
- No hagas commit salvo que se pida explícitamente.
