## Why

El filtro por proyecto (0.5.0) permite centrarse en uno, pero no ver el reparto de trabajo entre varios a la vez. Agrupar las tarjetas por proyecto dentro de cada columna da esa visión sin ocultar nada.

## What Changes

- Selector de agrupación en la barra superior: «No grouping» (por defecto) y «Group by project».
- Con agrupación activa, cada columna muestra sus tarjetas en bloques con cabecera por proyecto (nombre y franja de color): proyectos en orden alfabético, y al final el bloque «No project». Los bloques vacíos no se muestran.
- Funciona junto con el filtro: se agrupa lo que el filtro deja visible.
- Arrastrar y soltar sigue funcionando; soltar sobre un bloque sitúa la tarea en esa posición. No cambia el proyecto de la tarea (eso se hace en el editor).
- La agrupación es solo de vista: no modifica `kanban.json` ni el orden de las tareas.

## Non-goals

- Swimlanes en filas a través de todas las columnas.
- Cambiar el proyecto de una tarea al soltarla en un bloque.
- Colapsar/expandir bloques.
- Persistir la agrupación entre sesiones o en el fichero.

## Capabilities

### New Capabilities
- `kanban-json/project-grouping`: agrupación de las tarjetas de cada columna por proyecto.

### Modified Capabilities
<!-- Ninguna: el filtro y el orden alfabético no cambian de requisitos. -->

## Impact

- `extensions/kanban-json/media/board.js` y `board.css` (selector, bloques, arrastre).
- Cambio de comportamiento visible → versión 0.6.0 y CHANGELOG.
- Supuesto: «swimlanes» se interpreta como bloques dentro de cada columna (mantiene el diseño en columnas); filas transversales quedan como futuro.
