## Context

Hoy `PRIORITIES = ['alta','media','baja']` (`src/board/model.ts`) es una constante que valida el parser (`src/board/json.ts`) y que `media/board.js` repite a mano (etiquetas y combo). El parser conserva campos de tarea desconocidos (`extras`) y el orden de claves; columnas y tareas ya siguen el patrón `id` + `name`. `createInitialBoard` y `SAMPLE` (`src/extension.ts`) crean los tableros nuevos. Motivación y alcance: ver `proposal.md`.

Los specs principales (`openspec/specs/`) están vacíos porque `add-kanban-json-editor` sigue activo; por eso este cambio usa capabilities nuevas con `ADDED`.

## Goals / Non-Goals

**Goals:**
- Una única fuente de prioridades por tablero (modelo) que consumen validación, serialización y webview.
- Cero migración forzada de ficheros existentes.

**Non-Goals:**
- Editor de prioridades en la UI.
- Ordenar o filtrar tareas por severidad (el orden del array lo permite en el futuro).
- Traducir nombres por idioma.

## Decisions

1. **`Board.priorities?: Priority[]` con `Priority = { id, name, color? }`; `priority` de tarea pasa a `string`.** El tipo literal ya no puede derivarse de una constante. Alternativa: mantener el union type y ampliarlo; descartada porque la lista es dinámica.
2. **Prioridades efectivas = `board.priorities ?? DEFAULT_PRIORITIES`**, resueltas con una función `effectivePriorities(board)` en `model.ts`, usada por el parser y enviada a la webview. `DEFAULT_PRIORITIES` es la única definición de high/medium/low. Alternativa: rellenar `board.priorities` al cargar; descartada porque haría que el serializador escribiera el bloque en ficheros que no lo tenían.
3. **Alias legacy solo en lectura y solo sin bloque.** Un mapa `LEGACY_PRIORITY_IDS = { alta: 'high', media: 'medium', baja: 'low' }` se aplica al resolver la prioridad para mostrarla (`resolvePriority(board, id)`), nunca al modelo. El valor guardado en la tarea no se toca, de modo que el round-trip no reescribe. Al editar la tarea, el combo envía el id nuevo (`high`). Con bloque presente no hay alias: sería sorprendente que `alta` coincida con algo que el usuario no definió.
4. **Prioridad desconocida: carga tolerante + aviso.** El parser ya no lanza error; el provider calcula los ids desconocidos (`unknownPriorities(board)`) y muestra un `showWarningMessage` una vez por carga del documento (no en cada refresco) si la lista no está vacía. Alternativa: banner en la webview; descartada por ser más UI para un caso raro.
5. **Validación del bloque en el parser**, con el mismo estilo de errores que `columns` (`priorities[i].id ...`). `color` se acepta como cadena sin validar formato; se aplica vía `style="--prio-color: <valor>"` asignado con `element.style.setProperty`, nunca interpolado en HTML, para evitar inyección.
6. **Serialización:** `serializeBoard` escribe `priorities` solo si `board.priorities` está definido, justo después de `board`, y conserva las claves de cada elemento. `createInitialBoard` y `SAMPLE` pasan a usar `DEFAULT_PRIORITIES`, por lo que los tableros nuevos llevan el bloque. `SAMPLE` debe reutilizar `createInitialBoard` para no duplicar.
7. **Webview:** el mensaje de estado incluye la lista de prioridades efectivas y un mapa de resolución de alias; `board.js` elimina `PRIORITY_LABELS` y la lista fija. El CSS usa `var(--prio-color)` con los colores actuales como valores por defecto para `.prio-high/.prio-medium/.prio-low` (renombradas desde `-alta/-media/-baja`) y un estilo neutro como base.

## Risks / Trade-offs

- [Un fichero con `alta` y bloque que no la define muestra "alta" neutro] → Es el comportamiento especificado y se avisa; el usuario añade la prioridad al bloque.
- [Dos fuentes de verdad si `board.js` conserva valores por defecto] → La webview solo usa lo recibido del host.
- [`priority: string` pierde comprobación de tipos] → Funciones de resolución centralizadas y tests de parser.
- [Escenario "Prioridad desconocida" de `board-model` del cambio activo contradice este diseño] → Al archivar, ese escenario debe retirarse o actualizarse con `/opsx:update` sobre `add-kanban-json-editor`.

## Migration Plan

No hay migración de datos: los ficheros existentes funcionan por el alias legacy. Rollback: revertir el cambio; los ficheros nuevos con `priorities` y ids `high/medium/low` fallarían con la versión anterior (error de prioridad desconocida), por lo que el cambio se publica como **0.3.0** (minor al ser 0.x; sería major desde 1.0) y el CHANGELOG lo marca como BREAKING.
