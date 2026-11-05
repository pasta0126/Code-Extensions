## 1. Quitar el proyecto de una tarea

- [x] 1.1 Reproducir el fallo: ni el núcleo (`updateTask` con `project: null`) ni la webview simulada en jsdom fallan; el mensaje enviado lleva `project: null`. Pendiente confirmar en F5 con los pasos exactos del usuario
- [x] 1.2 Sin defecto reproducible en código; añadido test de regresión en `test/board.test.ts` (round-trip: tarea con proyecto → sin `project`)

## 2. Orden alfabético

- [x] 2.1 Helper `sortedProjects()` en la webview (sin distinguir mayúsculas/acentos) y uso en el desplegable de proyecto del detalle
- [x] 2.2 Verificar que el orden de `projects` en el fichero no cambia al crear/editar proyectos

## 3. Filtro por proyecto

- [x] 3.1 Estado `s.projectFilter` y barra con el selector (All projects / No project / proyectos ordenados) + estilos
- [x] 3.2 Filtrar tarjetas al pintar manteniendo todas las columnas visibles
- [x] 3.3 Traducir el índice de soltar (visible → real) y probar el arrastre con filtro activo
- [x] 3.4 Preseleccionar el proyecto filtrado al crear una tarea
- [x] 3.5 Reiniciar el filtro si el proyecto desaparece tras un cambio de estado

## 4. Clic fuera en todos los diálogos

- [x] 4.1 Aplicar `dismissOnOutsideClick` en un único punto a todos los `<dialog>` (columna, proyecto, confirmaciones, detalle)
- [x] 4.2 Comprobar que cerrar el diálogo de proyecto no cierra el de detalle (las confirmaciones son modales nativos del host)

## 5. Cierre

- [x] 5.1 `npm test` y `npm run typecheck` en `extensions/kanban-json`
- [x] 5.2 Subir versión a 0.5.0, actualizar CHANGELOG y README (en inglés)
- [x] 5.3 `npx @fission-ai/openspec validate improve-project-ux` y actualizar «Cambios activos» en `AGENTS.md`
