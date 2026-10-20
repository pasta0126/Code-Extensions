## 1. Scaffolding

- [x] 1.1 package.json, tsconfig, esbuild, vitest, launch/tasks de VS Code
- [x] 1.2 Estructura `src/board`, `src/editor`, `media/` y `examples/kanban.json`

## 2. Núcleo del tablero (`src/board`)

- [x] 2.1 Tipos del modelo, `Priority` y `BoardError`
- [x] 2.2 Validación de invariantes (ids únicos, prioridades)
- [x] 2.3 Parse/serialize JSON con conservación de campos desconocidos
- [x] 2.4 Operaciones de columnas (añadir, renombrar, eliminar) y generación de ids
- [x] 2.5 Operaciones de tareas (añadir, actualizar, eliminar, mover)

## 3. Editor de VS Code (`src/editor`)

- [x] 3.1 `KanbanEditorProvider` y protocolo de mensajes
- [x] 3.2 Webview Kanban (columnas, tarjetas, formularios, drag & drop)
- [x] 3.3 Modo Raw con validación y aviso de conflicto
- [x] 3.4 Comandos `createBoard` y `openAsText`

## 4. Verificación

- [x] 4.1 Tests unitarios del núcleo
- [x] 4.2 Typecheck y build
- [ ] 4.3 Prueba manual en Extension Development Host (F5)
