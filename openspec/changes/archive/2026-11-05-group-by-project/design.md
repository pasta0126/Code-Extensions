## Context

`columnView` pinta una lista plana de tarjetas (`.tasks`) con marcador de soltado y `visibleToRealIndex` (0.5.0) para traducir posiciones cuando hay filtro. La agrupación es una segunda capa de vista sobre lo ya filtrado.

## Goals / Non-Goals

**Goals:** agrupar por proyecto dentro de cada columna, combinable con el filtro, sin tocar el fichero.
**Non-Goals:** ver `proposal.md`.

## Decisions

1. **Estado de vista** `s.groupBy` (`''` | `'project'`), junto a `s.projectFilter`; selector «No grouping / Group by project» en la barra. No se persiste.
2. **Misma lista `.tasks` con cabeceras intercaladas**: las cabeceras de bloque son elementos `.group-head` dentro de `.tasks`, no contenedores. Así `otherCards`, `dropIndex` y el marcador siguen operando sobre `.card` sin cambios, y `visibleToRealIndex` sigue valiendo, porque el orden de tarjetas en pantalla pasa a ser el de la lista agrupada.
3. **Orden visible ≠ orden del fichero**: con agrupación, el orden en pantalla es por bloque. Para traducir el soltado, `visibleToRealIndex` debe recibir la lista visible en el orden mostrado (agrupada) y colocar la tarea junto a la tarjeta de destino (antes de ella; al final de la lista, tras la última tarjeta visible de la columna). Esto se concreta en un helper `displayOrder(column)` que usan el pintado y el cálculo de índice.
4. **Clave de bloque**: id de proyecto, o `''` para sin proyecto. Nombre mostrado: el del proyecto definido o el id si no está definido. Orden: `localeCompare` base sobre ese texto (reutiliza `sortedProjects` para los definidos); «No project» siempre al final.
5. **Cabecera**: nombre y franja con el color del proyecto (`SAFE_COLOR`, igual que en la tarjeta); contenido siempre por `textContent`.

## Risks / Trade-offs

- El soltado dentro de un bloque ajeno (otro proyecto) reordena en el fichero sin cambiar el proyecto: puede parecer que la tarjeta "salta" de bloque. Se acepta y se documenta en la spec (no cambia `project`).
- Combinar filtro, agrupación y soltado es la parte delicada → extraer la traducción de índices a una función pura y probarla manualmente en jsdom como en 0.5.0.
