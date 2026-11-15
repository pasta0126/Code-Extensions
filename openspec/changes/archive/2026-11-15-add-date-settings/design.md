## Context

`Board` solo modela `board`, `priorities`, `projects` y `columns`. La tarjeta pinta `task.dueDate` tal cual y el diálogo usa `<input type="date">`, que sigue la configuración del navegador/SO.

## Goals / Non-Goals

**Goals:** formato y primer día configurables en el JSON, valores por defecto estables, round-trip sin perder claves.
**Non-Goals:** ver `proposal.md`.

## Decisions

1. **Claves de primer nivel** `dateFormat` y `firstDayOfWeek` (mismo estilo que `priorities`/`projects`), opcionales y serializadas solo si existían. Un tablero nuevo no las escribe: los defectos viven en código.
2. **Almacenamiento ISO**: `dueDate` y `createdAt` no cambian; así el orden/comparación (`isOverdue`) y los ficheros existentes siguen valiendo.
3. **Patrón de formato**: debe contener exactamente una vez `yyyy`, `mm` y `dd` (minúsculas, sin distinguir mayúsculas al leer); el resto son separadores literales. Si no cumple → defecto + aviso.
4. **`firstDayOfWeek`**: nombre inglés en minúsculas (sin distinguir mayúsculas). Se traduce a índice 0-6 (domingo = 0) en el host.
5. **Núcleo puro** `src/board/dates.ts` (sin `vscode`): `resolveDateFormat`, `resolveFirstDay`, `formatDate`, `parseDate`; con tests. Se conserva el valor crudo en `Board` (`dateFormat?`, `firstDayOfWeek?`) para el round-trip, y `StateMessage` envía los valores ya resueltos (`dateFormat`, `firstDayOfWeek` numérico).
6. **Webview sin build**: `media/board.js` no puede importar el TS, por lo que lleva una copia mínima de `formatDate`/`parseDate` que opera sobre el patrón ya validado por el host. Se mantiene pequeña y se cubre con los mismos casos en una prueba jsdom manual.
7. **Selector propio**: campo de texto + botón 📅 que abre un popover con rejilla mensual (cabecera de días ordenada según `firstDayOfWeek`, navegación mes anterior/siguiente, hoy resaltado, día elegido resaltado). Elegir un día rellena el texto. El texto inválido bloquea el envío con `setCustomValidity`; vacío = sin fecha. Cierra con Esc/clic fuera sin cerrar el diálogo de la tarea.
8. **Fechas sin formato ISO en el fichero** (valores heredados): se muestran crudas en la tarjeta y se editan como texto vacío si no se pueden interpretar.

## Risks / Trade-offs

- Dos implementaciones (TS y JS) de formato/parseo pueden divergir → casos idénticos en ambas y algoritmo trivial (sustitución de tokens).
- Mantener un calendario propio añade UI que mantener; es el precio de controlar el primer día de la semana, imposible con el input nativo.
