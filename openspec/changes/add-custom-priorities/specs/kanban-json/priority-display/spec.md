## ADDED Requirements

### Requirement: Selector de prioridad según el tablero
El formulario de tarea SHALL ofrecer como opciones de prioridad las del tablero, en su orden, más una opción vacía. La opción mostrada SHALL ser el `name` de la prioridad.

#### Scenario: Prioridades personalizadas
- **WHEN** el tablero define `critical`, `high` y `low` y se abre el formulario de una tarea
- **THEN** el combo muestra las opciones vacía, Critical, High y Low en ese orden

#### Scenario: Tarea con alias legacy
- **WHEN** se edita una tarea con `priority: "alta"` en un tablero sin `priorities`
- **THEN** el combo tiene seleccionada la opción High

### Requirement: Etiqueta de prioridad en la tarjeta
La tarjeta SHALL mostrar el `name` de la prioridad de la tarea. Si la prioridad no está definida, SHALL mostrar el id tal cual con estilo neutro.

#### Scenario: Prioridad definida
- **WHEN** una tarea tiene `priority: "critical"` y el tablero la define con `name: "Critical"`
- **THEN** la tarjeta muestra "Critical"

#### Scenario: Prioridad desconocida
- **WHEN** una tarea tiene `priority: "urgent"` no definida
- **THEN** la tarjeta muestra "urgent" con estilo neutro

### Requirement: Color de prioridad
Si una prioridad define `color`, la etiqueta SHALL usar ese color mediante una variable CSS inline. Sin `color`, SHALL usar el estilo por defecto: el actual para `high`, `medium` y `low`, y neutro para el resto.

#### Scenario: Color personalizado
- **WHEN** una prioridad define `color: "#d73a49"`
- **THEN** la etiqueta de esa prioridad usa ese color

#### Scenario: Sin color
- **WHEN** una prioridad `medium` no define `color`
- **THEN** la etiqueta usa el estilo actual de media prioridad
