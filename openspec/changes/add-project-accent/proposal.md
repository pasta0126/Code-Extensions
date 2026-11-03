## Why

Hoy no hay forma de distinguir de un vistazo a qué proyecto pertenece cada tarjeta (solo existen `labels` libres). Además, el diálogo de detalle de la tarjeta solo se cierra con los botones o con Esc, lo que resulta incómodo. Por último, GitHub mantiene abierta la alerta de Dependabot nº 9 (moderada) sobre `@vitest/mocker`.

## What Changes

- **Cerrar al hacer clic fuera**: el diálogo de detalle (editar/nueva tarea) se cierra, sin guardar, al hacer clic en el fondo oscuro que lo rodea.
- **Proyectos**: nuevo bloque opcional `projects` en `kanban.json` (`{ id, name, color? }`) y campo opcional `project` en la tarea (id del proyecto). Sigue el patrón del bloque `priorities`.
- **Acento de color**: la tarjeta muestra una franja de color en el lateral izquierdo según el color de su proyecto.
- **Color**: 16 colores fijos con nombre, elegibles desde un selector de cuadrículas (sin selector de color avanzado). Para un color personalizado se escribe un hexadecimal (`#RRGGBB` o `#RGB`) en el campo `color` del proyecto, editando el JSON a mano.
- **Selector de proyecto** en el diálogo de la tarea, con opción vacía y alta/edición de proyectos (nombre + color) desde la propia UI.
- **Dependabot nº 9**: `@vitest/mocker` < 4.1.12 (inyección de código vía registro manual de mocks). Verificar que el lockfile ya resuelve 4.1.12 (así es hoy) y que la alerta se cierra; si no, actualizar `vitest`. Sin cambio de comportamiento.
- Versión prevista: 0.3.0 → **0.4.0** (aditivo, no breaking).

## Capabilities

### New Capabilities
- `kanban-json/dialog-dismiss`: cierre del diálogo de detalle al hacer clic fuera.
- `kanban-json/projects`: modelo del bloque `projects`, campo `project` de la tarea, paleta de 16 colores, color hexadecimal personalizado, proyectos desconocidos y conservación al serializar.
- `kanban-json/project-accent`: franja de color de la tarjeta y selección de proyecto/color en la vista Kanban.

### Modified Capabilities
<!-- Ninguna en openspec/specs/ (aún vacío). -->

## Impact

- `extensions/kanban-json/src/board/model.ts`, `json.ts`, `operations.ts` (proyecto en tarea y alta/edición de proyectos), `src/editor/protocol.ts` y `KanbanEditorProvider.ts` (mensajes y datos a la webview).
- `extensions/kanban-json/media/board.js` y `board.css` (franja, diálogos, clic fuera, cuadrícula de 16 colores).
- Tests de `test/`, `README.md` y `CHANGELOG.md` (en inglés), `package.json`/`package-lock.json`.
- Dependabot: solo `package-lock.json` si hiciera falta.
