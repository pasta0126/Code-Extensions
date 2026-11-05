## Why

Los niveles de prioridad (`alta`, `media`, `baja`) están fijos en el código, con ids en español y etiquetas duplicadas en la webview. Hay quien necesita más niveles (p. ej. "Critical") y nombres propios por tablero. Las columnas ya son configurables en el propio `kanban.json`; las prioridades deberían serlo igual.

## What Changes

- Nuevo bloque opcional `priorities` en `kanban.json`: lista ordenada de `{ id, name, color? }`. El orden del array es el orden de severidad.
- Si el bloque falta, se usan por defecto `high` / `medium` / `low` (nombres `High` / `Medium` / `Low`). **BREAKING:** cambian los ids por defecto de `alta/media/baja` a `high/medium/low`; un `kanban.json` creado con la nueva versión no es válido en la anterior.
- Compatibilidad: sin bloque `priorities`, los ids legacy `alta/media/baja` se tratan como alias de `high/medium/low`. Los ficheros no se reescriben salvo que el usuario edite esa tarea.
- Una tarea con prioridad desconocida deja de ser un error de carga: se muestra el id tal cual con estilo neutro y se avisa al usuario.
- La inicialización de un `kanban.json` nuevo (comando "create board" y documento vacío) escribe el bloque `priorities` por defecto.
- El combo de prioridad y las etiquetas de la tarjeta leen las prioridades del tablero; el color opcional se aplica con una variable CSS inline.
- Sin UI para editar prioridades: se editan solo en el fichero.

## Capabilities

### New Capabilities
- `kanban-json/priorities`: modelo del bloque `priorities`, valores por defecto, alias legacy, prioridades desconocidas, conservación al serializar e inicialización.
- `kanban-json/priority-display`: cómo la vista Kanban muestra y selecciona prioridades a partir del tablero.

### Modified Capabilities
<!-- Ninguna en openspec/specs/ (aún vacío). Nota: sustituye el escenario "Prioridad desconocida" de board-model del cambio activo add-kanban-json-editor; ver design.md. -->

## Impact

- `extensions/kanban-json/src/board/model.ts`, `src/board/json.ts` (parseo, validación, serialización, `createInitialBoard`), `src/extension.ts` (`SAMPLE`), `src/editor/KanbanEditorProvider.ts` (aviso y datos a la webview).
- `extensions/kanban-json/media/board.js` y CSS (combo, etiquetas, color).
- Tests de `test/` y `README.md`/`CHANGELOG.md` de la extensión (en inglés).
- Cambio de comportamiento observable: ids por defecto nuevos y fin del error por prioridad desconocida.
- Versión: al ser breaking en 0.x, la extensión sube de 0.2.2 a **0.3.0** (minor), y el CHANGELOG lo marca como **BREAKING**.
