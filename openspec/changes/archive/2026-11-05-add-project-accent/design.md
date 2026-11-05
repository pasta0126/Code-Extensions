## Context

El modelo (`Board > Column > Task`) no tiene noción de proyecto; solo `labels` libres. Ya existe el patrón de bloque configurable `priorities` (`add-custom-priorities`): bloque opcional en `kanban.json`, `id` único, `color?`, desconocidos tolerados con aviso, sin reescritura si no se edita. Los diálogos de la webview son `<dialog>` nativos abiertos con `showModal()` (`media/board.js`). Ver `proposal.md` para la motivación.

## Goals / Non-Goals

**Goals:**
- Reutilizar el patrón de `priorities` para `projects` y mantener el round-trip.
- Paleta cerrada de 16 colores + hex manual en el JSON.
- Clic fuera cierra el diálogo sin pérdidas inesperadas por arrastres.

**Non-Goals:**
- Selector de color libre / rueda de color en la UI.
- Borrar o reordenar proyectos desde la UI (se hace en el JSON).
- Filtrar o agrupar el tablero por proyecto.
- Cambiar `labels`.

## Decisions

1. **Proyecto = bloque de tablero + id en la tarea** (`projects: [{id,name,color?}]`, `task.project`). Alternativa descartada: derivarlo de `labels` (sin nombre/color estables) o un campo `projectColor` por tarea (duplica datos y no permite renombrar). `project` se modela como campo tipado de `Task` y se incluye en `TaskPatch` (`null` lo quita).
2. **`color` acepta nombre de paleta o hex.** Se resuelve en un único punto del núcleo puro (`resolveProjectColor`) a un valor CSS; la webview solo aplica `--project-color` inline y la franja usa `border-left`/pseudo-elemento con esa variable. Nombres → hex fijos definidos en el núcleo (p. ej. tonos medios que funcionen en tema claro y oscuro). Un color inválido no rompe la carga (coherente con prioridades desconocidas): se avisa.
3. **Los 16 nombres**: `red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, pink, gray`. Se guarda el **nombre** (legible y re-tematizable), no el hex, cuando se elige en la UI.
4. **UI de proyectos**: opción «New project…» en el selector del diálogo de tarea y un botón de edición junto a él abren un segundo `<dialog>` (nombre + cuadrícula de 16 casillas). Nuevo mensaje en `protocol.ts` (`addProject`, `updateProject`), operaciones puras en `operations.ts`; id generado por slug del nombre con sufijo si colisiona. Se actualizan a la vez `protocol.ts`, `KanbanEditorProvider.ts` y `board.js`.
5. **Clic fuera**: listener en el `<dialog>`; el cierre solo ocurre si `mousedown` y `click` tienen como `target` el propio `<dialog>` (el backdrop se reporta como el dialog) y el punto cae fuera de su `getBoundingClientRect()`. Así un arrastre que termina fuera no cierra. Cierra con valor `cancel` (no guarda).
6. **Aviso unificado** de ids de proyecto desconocidos y colores inválidos, una vez por carga, como el de prioridades.
7. **Dependabot nº 9** (`@vitest/mocker` < 4.1.12): `package.json` pide `vitest ^4.1.12` y el lockfile resuelve `@vitest/mocker` 4.1.12 (versión parcheada) y `npm audit` da 0 vulnerabilidades. La alerta parece pendiente de reescaneo; la tarea es verificarlo en GitHub tras el push y, si sigue abierta, forzar la actualización (`npm update vitest`) o descartarla con motivo.

## Risks / Trade-offs

- **Pérdida de edición por clic accidental fuera**: se mitiga con la regla del arrastre; riesgo residual aceptado (ver pregunta abierta).
- **Contraste de la franja** en temas muy claros/oscuros: se eligen tonos medios y se muestra también el nombre.
- **Alta de proyectos desde la UI amplía el protocolo** (más superficie que `priorities`, que no tenía UI): necesario para «elegir entre 16 colores».
- **Hex arbitrario inyectado en CSS**: se valida con regex estricta antes de aplicar; nunca se inserta texto de usuario en `innerHTML`.

## Open Questions

- ¿El clic fuera descarta siempre, o solo si el formulario no tiene cambios (y si los tiene, pide confirmación / no hace nada)? Supuesto actual: descarta siempre, como «Cancel».
- ¿También deben cerrarse con clic fuera los demás diálogos (confirmaciones, alta de proyecto), o solo el de detalle? Supuesto actual: todos los `<dialog>` de la webview.
- ¿Tarjeta con franja únicamente, o también chip con el nombre del proyecto? Supuesto: franja + nombre en una línea pequeña.
- ¿Se permite editar/crear proyectos desde la UI (supuesto actual) o solo desde el JSON, con la UI limitada a elegir uno?
- ¿Valores exactos de los 16 colores? Se fijan en la implementación y se revisan en la prueba manual.
