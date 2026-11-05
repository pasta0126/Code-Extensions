## Context

La webview (`media/board.js`) pinta el tablero a partir del `Board` que envía el host. Los diálogos usan `<dialog>` y `dismissOnOutsideClick` ya existe, pero solo se aplica a algunos. Las operaciones puras viven en `src/board/operations.ts`.

## Goals / Non-Goals

**Goals:** filtro por proyecto solo de vista; orden alfabético en UI; poder quitar el proyecto; clic fuera en todos los diálogos.
**Non-Goals:** ver `proposal.md` (sin agrupación, sin persistencia del filtro).

## Decisions

1. **Filtro = estado de la webview** (`s.projectFilter`: `''` = todos, `'__none__'` = sin proyecto, o un id). No se escribe en el JSON ni usa `vscode.setState`. Si el id ya no existe tras recibir un `state`, se reinicia a todos.
2. **Selector en una barra sobre las columnas**, con las opciones «All projects», «No project» y los proyectos ordenados. Un único helper `sortedProjects()` (`localeCompare` con `sensitivity: 'base'`) lo usan el filtro y el desplegable del detalle.
3. **Las columnas se filtran al pintar**, no en el modelo. El arrastre calcula el índice sobre las tarjetas visibles; el host recibe un `toIndex` sobre la lista completa. Se traduce en la webview: si el destino tiene una tarea visible en la posición `i`, se usa su índice real en la columna (descontando la tarea movida si es la misma columna); si se suelta al final, se usa justo después de la última visible. Alternativa descartada: añadir una operación `moveTask` con ancla en el host (más cambios de protocolo).
4. **Alta con filtro**: `taskDialog` recibe el proyecto filtrado como valor inicial cuando es un id.
5. **Quitar proyecto**: `applyPatch` ya borra `project` ante `null`, y la opción «—» envía `null`, así que la causa del fallo no es evidente leyendo el código. Primer paso de la implementación: reproducirlo con un test en `operations`/`updateTask` y manualmente en el editor (F5) y corregir donde falle. Hipótesis a descartar: el valor `''` del `<select>` tras `fillProjects`/`onProjects`, el resincronizado del estado que restaura el proyecto, o la serialización del patch.
6. **Clic fuera**: `dismissOnOutsideClick` se aplica en un único punto (helper de creación de diálogos) para que cualquier diálogo nuevo lo herede. El diálogo de proyecto (que se abre sobre el de detalle) cierran solo el suyo; el clic fuera del de proyecto no llega al de detalle porque este queda inerte bajo el modal.

## Risks / Trade-offs

- La traducción de índices del arrastre con filtro es la parte delicada → cubrirla con tests de una función pura (`visibleToRealIndex`) si se extrae al núcleo, o al menos con un caso manual documentado.
- Supuesto: «Filtrar o agrupar» se interpreta como solo filtrar; si más adelante se quiere agrupar se propondrá aparte.
