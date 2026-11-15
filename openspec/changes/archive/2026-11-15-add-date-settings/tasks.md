## 1. Núcleo

- [x] 1.1 `src/board/dates.ts`: `DEFAULT_DATE_FORMAT`, `resolveDateFormat`, `resolveFirstDay`, `formatDate`, `parseDate`
- [x] 1.2 `Board.dateFormat?`/`firstDayOfWeek?` en `model.ts`; parseo en `json.ts` (tipo cadena) y serialización solo si existen
- [x] 1.3 Tests en `test/` (defectos, formatos, inválidos, fecha imposible, round-trip)

## 2. Host

- [x] 2.1 `StateMessage`: `dateFormat` y `firstDayOfWeek` resueltos; aviso por valores inválidos
- [x] 2.2 `addTask` y demás siguen usando ISO (sin cambios de lógica)

## 3. Webview

- [x] 3.1 Mostrar `dueDate` con `dateFormat` en la tarjeta
- [x] 3.2 Campo de texto + calendario propio en el diálogo de tarea (CSS incluido)
- [x] 3.3 Validación del texto y guardado en ISO

## 4. Documentación y cierre

- [x] 4.1 README (en inglés): claves `dateFormat` y `firstDayOfWeek`; CHANGELOG y versión 0.7.0
- [x] 4.2 `npm test`, `npm run typecheck`, `npm run build`, `openspec validate add-date-settings`
