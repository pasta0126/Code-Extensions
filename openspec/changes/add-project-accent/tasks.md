## 1. Modelo y parseo

- [x] 1.1 En `src/board/model.ts`: tipo `Project { id, name, color? }`, `Board.projects?`, `Task.project?`, `TaskPatch.project`, paleta `PROJECT_COLORS` (16 nombres → hex) y `resolveProjectColor` (nombre o `#RGB`/`#RRGGBB`)
- [x] 1.2 En `src/board/json.ts`: parsear y validar `projects` (array, `id` único, `name`) y `project` de la tarea; colores inválidos y proyectos desconocidos sin error de carga
- [x] 1.3 Serializar `projects` y `project` solo si existen (round-trip, orden de claves)
- [x] 1.4 En `src/board/operations.ts`: `addProject`, `updateProject` (id por slug único) y `project` en `updateTask`/`addTask`
- [x] 1.5 Función `unknownProjects`/colores inválidos para el aviso

## 2. Extensión y webview

- [x] 2.1 `protocol.ts`, `KanbanEditorProvider.ts` y `board.js`: enviar proyectos a la webview, mensajes de alta/edición y aviso de desconocidos/colores inválidos
- [x] 2.2 Tarjeta: franja izquierda con `--project-color` y nombre del proyecto; sin franja si no hay color
- [x] 2.3 Diálogo de tarea: selector de proyecto con opción vacía y «New project…»
- [x] 2.4 Diálogo de proyecto: nombre + cuadrícula de 16 colores (sin color libre)
- [x] 2.5 Cierre con clic fuera en los `<dialog>` (mousedown y click en el backdrop; un arrastre que termina fuera no cierra)
- [x] 2.6 CSS (`board.css`): franja, cuadrícula de colores y estado seleccionado

## 3. Pruebas y documentación

- [x] 3.1 Tests de parser: bloque válido, duplicados, sin `name`, color por nombre, hex válido (3 y 6 dígitos), color inválido, proyecto desconocido
- [x] 3.2 Tests de round-trip con y sin `projects`/`project`, y de las operaciones de proyecto
- [x] 3.3 Actualizar `README.md` y `CHANGELOG.md` (en inglés), documentando la paleta y el hex manual; subir versión a 0.4.0 en `package.json`/`package-lock.json`
- [ ] 3.4 Prueba manual: clic fuera, arrastre de selección, crear/editar proyecto, color hex a mano, color inválido, tema claro y oscuro

## 4. Dependabot

- [ ] 4.1 Tras el push, comprobar el estado de la alerta nº 9 en GitHub; si sigue abierta, `npm update vitest` en `extensions/kanban-json` (lockfile con `@vitest/mocker` ≥ 4.1.12) o descartarla con motivo
- [x] 4.2 Ejecutar `npm audit`, `npm test` y `npm run typecheck`; validar con `npx @fission-ai/openspec validate add-project-accent`
