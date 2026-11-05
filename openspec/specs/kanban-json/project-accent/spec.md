# kanban-json/project-accent Specification

## Purpose
Mostrar a qué proyecto pertenece cada tarjeta mediante una franja de color y permitir elegir proyecto y color desde la vista Kanban.

## Requirements

### Requirement: Franja de color en la tarjeta
La vista Kanban SHALL mostrar en el lateral izquierdo de cada tarjeta una franja con el color efectivo de su proyecto. Una tarjeta sin proyecto, con proyecto desconocido o con proyecto sin color efectivo SHALL mostrarse sin franja de color (o con la neutra del tema).

#### Scenario: Tarjeta con proyecto coloreado
- **WHEN** una tarea pertenece a un proyecto con `color: "blue"`
- **THEN** su tarjeta muestra la franja izquierda en el azul de la paleta

#### Scenario: Tarjeta sin proyecto
- **WHEN** una tarea no tiene `project`
- **THEN** su tarjeta no muestra franja de color

### Requirement: Nombre del proyecto en la tarjeta
La tarjeta SHALL indicar el nombre del proyecto (texto visible o `title` de la franja) para que el color no sea la única señal.

#### Scenario: Identificar el proyecto
- **WHEN** una tarea pertenece al proyecto «Darwin»
- **THEN** la tarjeta expone el nombre «Darwin»

### Requirement: Selector de proyecto en el diálogo
El diálogo de la tarea SHALL incluir un selector de proyecto con los proyectos del tablero y una opción vacía. Elegir una opción SHALL asignar o quitar el `project` de la tarea al guardar.

#### Scenario: Asignar proyecto
- **WHEN** el usuario elige «Portal Informes» y guarda
- **THEN** la tarea queda con `project: "portal"`

#### Scenario: Quitar proyecto
- **WHEN** el usuario elige la opción vacía y guarda
- **THEN** la tarea ya no tiene el campo `project`

### Requirement: Alta y edición de proyectos con selector de 16 colores
La vista SHALL permitir crear un proyecto y cambiar el nombre y el color de uno existente. El color SHALL elegirse en una cuadrícula con exactamente los 16 colores de la paleta, sin selector de color libre. El proyecto nuevo SHALL recibir un `id` único derivado de su nombre.

#### Scenario: Crear proyecto
- **WHEN** el usuario crea el proyecto «Bullhorn» con el color `orange`
- **THEN** `projects` contiene `{ id, name: "Bullhorn", color: "orange" }`

#### Scenario: Cambiar color
- **WHEN** el usuario cambia el color de un proyecto a `pink`
- **THEN** el `color` del proyecto pasa a `pink` y sus tarjetas actualizan la franja

#### Scenario: Color personalizado ya definido
- **WHEN** el proyecto tiene un `color` hexadecimal escrito a mano y el usuario abre su edición
- **THEN** ninguna casilla de la cuadrícula aparece seleccionada
- **AND** el hexadecimal solo cambia si el usuario elige un color de la cuadrícula
