# Kanban JSON

Extensión de VS Code que muestra y mantiene un tablero Kanban a partir de un `kanban.json`.

- **Vista Kanban**: columnas y tarjetas; crear/renombrar/borrar columnas, crear/editar/borrar tareas, arrastrar para mover.
- **Vista Raw**: pestaña "Raw" en el mismo editor para ver y editar el JSON, con validación antes de aplicar.
- El documento es la fuente de verdad (deshacer/rehacer, guardado y cambios externos funcionan).
- Los campos que la extensión no conoce (`startedAt`, `completedAt`, `reviewer`, ...) se conservan.

Formato de ejemplo en [`examples/kanban.json`](examples/kanban.json).

## Desarrollo

```bash
npm install
npm test            # tests del núcleo (src/board)
npm run typecheck
npm run build
```

Pulsa **F5** en VS Code para abrir un Extension Development Host con `examples/` y abre `kanban.json`.

## Desarrollo dirigido por especificaciones (OpenSpec)

Los cambios se especifican en `openspec/changes/` antes de implementarse. Cambio inicial:
[`add-kanban-json-editor`](openspec/changes/add-kanban-json-editor/). Flujo con Claude Code: `/opsx:propose`, `/opsx:apply`, `/opsx:archive`.

## Estructura

```
src/board/     núcleo puro (modelo, validación, JSON, operaciones) — sin imports de vscode
src/editor/    CustomTextEditorProvider y protocolo de mensajes
media/         webview (JS/CSS vanilla)
openspec/      specs y cambios
```
