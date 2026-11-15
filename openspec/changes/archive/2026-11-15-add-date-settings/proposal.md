## Why

Las fechas se muestran como vienen (`yyyy-mm-dd`) y el calendario del editor es el `<input type="date">` nativo, cuyo formato y primer día de la semana dependen del sistema y no se pueden controlar. Cada tablero debería poder fijar cómo se ven las fechas y desde qué día empieza la semana.

## What Changes

- Dos claves opcionales en la raíz de `kanban.json`:
  - `dateFormat`: patrón con `yyyy`, `mm` y `dd` y separadores libres (p. ej. `dd/mm/yyyy`). Por defecto `yyyy-mm-dd`.
  - `firstDayOfWeek`: `monday`…`sunday`. Por defecto `monday`.
- La fecha límite (`dueDate`) y `createdAt` se **siguen guardando en ISO `yyyy-mm-dd`**; el formato solo afecta a lo que se muestra y se escribe en la UI.
- Las tarjetas muestran la fecha límite con `dateFormat`.
- El editor de tarea sustituye el `<input type="date">` por un campo de texto con `dateFormat` y un calendario propio (botón 📅) que empieza la semana en `firstDayOfWeek`.
- Valores inválidos: se usan los por defecto y se avisa; el valor inválido se conserva en el fichero.

## Non-goals

- Localizar nombres de mes/día (siempre en inglés).
- Cambiar el formato de almacenamiento de `dueDate`/`createdAt`.
- Opciones de usuario fuera del fichero (ajustes de VS Code).
- Hora o zonas horarias.

## Capabilities

### New Capabilities
- `kanban-json/date-settings`: formato de fecha y primer día de la semana configurables por tablero.

### Modified Capabilities
