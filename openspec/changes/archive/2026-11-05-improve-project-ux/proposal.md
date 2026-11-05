## Why

Con varios proyectos en un mismo tablero es difícil centrarse en uno: no hay forma de filtrar, el desplegable de proyectos sigue el orden del JSON (no el alfabético), una tarea con proyecto no puede volver a quedar sin él desde el editor, y solo el diálogo de detalle se cierra con clic fuera (los demás obligan a pulsar Cancel).

## What Changes

- Selector de filtro por proyecto sobre el tablero: «All projects», «No project» y los proyectos en orden alfabético. Solo afecta a la vista; no modifica el `kanban.json`.
- Los proyectos se muestran siempre en orden alfabético en cualquier desplegable de la UI (editor de tarea y filtro). El orden del array `projects` en el fichero no cambia.
- Quitar el proyecto de una tarea desde el editor (opción «—»): al guardar, la tarea queda sin `project` en el fichero. Hoy no funciona y se corrige.
- Todos los diálogos de la webview (nuevo/renombrar columna, nuevo/editar proyecto, detalle; las confirmaciones son modales nativos del host y ya se cierran con clic fuera) se cierran con clic fuera, con el mismo comportamiento que ya tiene el de detalle.

## Non-goals

- Agrupar visualmente el tablero por proyecto (swimlanes): se deja para un cambio futuro; aquí solo se filtra.
- Persistir el filtro activo en el fichero o entre sesiones.
- Filtro multiselección o combinado con otros campos (prioridad, responsable, texto).

## Capabilities

### New Capabilities
- `kanban-json/project-filter`: filtro de la vista Kanban por proyecto.

### Modified Capabilities
- `kanban-json/projects`: orden alfabético en la UI y poder quitar el proyecto de una tarea.
- `kanban-json/dialog-dismiss`: el cierre con clic fuera pasa a aplicarse a todos los diálogos.

## Impact

- `extensions/kanban-json/media/board.js` y `board.css` (barra de filtro, orden, diálogos).
- `extensions/kanban-json/src/board/operations.ts` y `test/board.test.ts` (quitar proyecto; tests).
- Cambio de comportamiento visible → versión 0.5.0 y entrada en CHANGELOG.
