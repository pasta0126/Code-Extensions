## 1. Modelo y parseo

- [x] 1.1 En `src/board/model.ts`: tipo `Priority { id, name, color? }`, `Board.priorities?`, `DEFAULT_PRIORITIES` (high/medium/low), `LEGACY_PRIORITY_IDS`, y `priority` de tarea como `string`
- [x] 1.2 Añadir `effectivePriorities`, `resolvePriority` y `unknownPriorities` en `model.ts`
- [x] 1.3 En `src/board/json.ts`: parsear y validar `priorities` (array, `id` único, `name`, `color` opcional) y quitar el error por prioridad desconocida
- [x] 1.4 Serializar `priorities` solo si existe, tras `board`; `createInitialBoard` usa `DEFAULT_PRIORITIES`
- [x] 1.5 `SAMPLE` de `src/extension.ts` reutiliza `createInitialBoard` (bloque por defecto en tableros nuevos)

## 2. Extensión y webview

- [x] 2.1 En `KanbanEditorProvider`: enviar las prioridades efectivas a la webview y mostrar un aviso, una vez por carga, con los ids desconocidos
- [x] 2.2 En `media/board.js`: eliminar `PRIORITY_LABELS` y la lista fija; construir combo y etiqueta con las prioridades recibidas, con alias legacy y opción vacía
- [x] 2.3 Aplicar `color` con `style.setProperty('--prio-color', …)` y mostrar el id con estilo neutro si es desconocida
- [x] 2.4 CSS: renombrar `prio-alta/media/baja` a `prio-high/medium/low`, usar `var(--prio-color)` y estilo neutro por defecto

## 3. Pruebas y documentación

- [x] 3.1 Tests de parser: bloque válido, duplicados, sin `name`, defaults, alias legacy, alias con bloque, desconocida sin error
- [x] 3.2 Tests de round-trip con y sin `priorities` (el legacy `alta` se conserva) y de `createInitialBoard`
- [x] 3.3 Actualizar `README.md` y `CHANGELOG.md` de la extensión (en inglés), con la entrada 0.3.0 marcada **BREAKING**, y subir `package.json`/`package-lock.json` de 0.2.2 a 0.3.0
- [ ] 3.4 Prueba manual: tablero nuevo, fichero legacy, prioridades personalizadas con color y prioridad desconocida
- [x] 3.5 Ejecutar `npm test` en `extensions/kanban-json` y `npx @fission-ai/openspec validate add-custom-priorities`
