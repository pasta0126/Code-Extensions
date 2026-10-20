## Why

Gestionar tareas en un tablero Kanban sin salir de VS Code, con un único fichero `kanban.json` versionable en git como fuente de verdad. Hoy hay que editar el JSON a mano; queremos una vista visual que lo lea y lo mantenga, sin perder la posibilidad de editar el JSON en bruto.

## What Changes

- Nueva extensión de VS Code (`kanban-json`, en la carpeta `extensions/kanban-json/` del repositorio) que abre `kanban.json` como editor personalizado.
- Vista **Kanban**: columnas y tarjetas, con crear/renombrar/borrar columnas, crear/editar/borrar tareas y mover tareas (drag & drop) entre columnas y dentro de una columna.
- Vista **Raw**: conmutable desde la vista Kanban, muestra y permite editar el JSON con validación antes de aplicar.
- El `TextDocument` es la fuente de verdad: deshacer/rehacer, guardado y cambios externos (git, otro editor) se reflejan en ambas vistas.
- Los campos desconocidos de una tarea (`startedAt`, `completedAt`, `reviewer`, ...) se conservan al reescribir el fichero.
- Desarrollo dirigido por especificaciones (SDD) con OpenSpec; la lógica del tablero vive en un módulo puro, sin dependencias de `vscode`, para poder testearla.

## Capabilities

### New Capabilities

- `board-model`: modelo de dominio del tablero, reglas de validez y (de)serialización de `kanban.json`.
- `kanban-view`: vista visual del tablero y operaciones de edición sobre columnas y tareas.
- `raw-view`: vista JSON en bruto con alternancia, edición y validación.

### Modified Capabilities

Ninguna (proyecto nuevo).

## Non-goals

- Sincronización con servicios externos (Jira, GitHub Issues, ...).
- Varios tableros por fichero o filtros/búsqueda (posible cambio futuro).
- Transiciones automáticas de estado (p. ej. rellenar `startedAt` al mover a "En progreso").

## Impact

- Código nuevo: todo el repositorio. Sin cambios en sistemas existentes.
- Dependencias de desarrollo: TypeScript, esbuild, vitest, `@types/vscode`.
