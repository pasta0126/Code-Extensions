## 1. Agrupación

- [x] 1.1 Estado `s.groupBy` y selector «No grouping / Group by project» en la barra
- [x] 1.2 Helper `displayOrder(column)` (filtro + agrupación + orden de bloques) y pintado de `.group-head` con nombre y franja de color
- [x] 1.3 Ocultar bloques vacíos y manejar proyectos no definidos

## 2. Arrastrar y soltar

- [x] 2.1 Adaptar `visibleToRealIndex` al orden mostrado con agrupación
- [x] 2.2 Probar en jsdom: soltar entre tarjetas, al final, en columna vacía, con filtro y agrupación a la vez

## 3. Estilos y cierre

- [x] 3.1 Estilos de `.group-head` (tema claro/oscuro de VS Code)
- [x] 3.2 `npm test` y `npm run typecheck` en `extensions/kanban-json`
- [x] 3.3 Versión 0.6.0, CHANGELOG y README (en inglés)
- [x] 3.4 `npx @fission-ai/openspec validate group-by-project` y actualizar «Cambios activos» en `AGENTS.md`
