# kanban-json/projects Specification

## Purpose
Definir los proyectos de un tablero y su color, y asignar un proyecto a cada tarea, de forma configurable desde el propio `kanban.json`.

## Requirements

### Requirement: Bloque opcional de proyectos
El sistema SHALL aceptar en `kanban.json` un array opcional `projects` donde cada elemento tiene `id` (cadena no vacía, único), `name` (cadena no vacía) y opcionalmente `color` (cadena). Un bloque mal formado SHALL provocar un error de carga que indica el elemento. Sin bloque, el tablero no tiene proyectos.

#### Scenario: Bloque válido
- **WHEN** se carga un tablero con `projects` = `portal` (Portal Informes, `blue`) y `darwin` (Darwin, `#FF8800`)
- **THEN** el tablero expone esos dos proyectos en ese orden

#### Scenario: Ids duplicados
- **WHEN** dos elementos de `projects` comparten `id`
- **THEN** la carga falla indicando el id duplicado

#### Scenario: Elemento sin nombre
- **WHEN** un elemento de `projects` no tiene `name`
- **THEN** la carga falla indicando la posición del elemento

### Requirement: Proyecto de la tarea
El sistema SHALL aceptar en cada tarea un campo opcional `project` con el id de un proyecto. Una tarea sin `project` no pertenece a ningún proyecto.

#### Scenario: Tarea con proyecto
- **WHEN** una tarea tiene `project: "portal"` y `portal` está definido
- **THEN** la tarea pertenece al proyecto Portal Informes

### Requirement: Proyecto desconocido
El sistema SHALL cargar un tablero cuyas tareas usen un `project` no definido, conservando el valor original, SHALL tratar la tarea como sin color y SHALL avisar al usuario con un mensaje que lista los ids desconocidos.

#### Scenario: Id no definido
- **WHEN** una tarea tiene `project: "legacy"` y `projects` no lo define (o no existe)
- **THEN** el tablero se carga y la tarea conserva `legacy`
- **AND** se muestra un aviso que menciona `legacy`

### Requirement: Paleta de 16 colores fijos
El sistema SHALL ofrecer una paleta cerrada de 16 colores con nombre: `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `pink`, `gray`. El campo `color` de un proyecto SHALL aceptar el nombre de uno de ellos.

#### Scenario: Color por nombre
- **WHEN** un proyecto tiene `color: "teal"`
- **THEN** su color efectivo es el definido para `teal` en la paleta

### Requirement: Color hexadecimal personalizado
El campo `color` de un proyecto SHALL aceptar también un hexadecimal `#RRGGBB` o `#RGB` (insensible a mayúsculas), escrito editando el JSON. Un `color` que no sea ni un nombre de la paleta ni un hexadecimal válido SHALL NOT impedir la carga: el proyecto se trata como sin color y se avisa al usuario indicando el proyecto y el valor.

#### Scenario: Hexadecimal válido
- **WHEN** un proyecto tiene `color: "#ff8800"`
- **THEN** su color efectivo es `#ff8800`

#### Scenario: Color inválido
- **WHEN** un proyecto tiene `color: "azulito"`
- **THEN** el tablero se carga, el proyecto no tiene color efectivo
- **AND** se muestra un aviso que menciona el proyecto y `azulito`

### Requirement: Conservación al serializar
El sistema SHALL conservar el bloque `projects` y el campo `project` de las tareas al reescribir el fichero, con su orden y valores originales (incluido un `color` hexadecimal o inválido), y SHALL NOT añadir `projects` ni `project` si el fichero original no los tenía.

#### Scenario: Round-trip con proyectos
- **WHEN** se carga y se serializa un tablero con `projects` y tareas con `project`
- **THEN** el JSON resultante contiene los mismos valores

#### Scenario: Round-trip sin proyectos
- **WHEN** se carga y se serializa un tablero sin `projects`
- **THEN** el JSON resultante no contiene `projects` ni `project`

### Requirement: Orden alfabético de proyectos en la UI
El sistema SHALL mostrar los proyectos en orden alfabético por nombre (sin distinguir mayúsculas ni acentos) en todo desplegable de la interfaz que los liste. Esto SHALL NOT alterar el orden del array `projects` ni su serialización.

#### Scenario: Desplegable de la tarea
- **WHEN** `projects` está definido en el orden «Portal», «Darwin», «Atlas» y el usuario abre el desplegable de proyecto de una tarea
- **THEN** las opciones aparecen como Atlas, Darwin, Portal (tras «No project» y antes de «New project…»)

#### Scenario: El fichero conserva su orden
- **WHEN** se crea o edita un proyecto desde la UI
- **THEN** `projects` en el fichero mantiene el orden original, y el proyecto nuevo se añade al final

### Requirement: Quitar el proyecto de una tarea
El editor de tarea SHALL permitir dejar una tarea sin proyecto seleccionando «No project». Al guardar, la tarea SHALL quedar sin el campo `project` en el fichero y conservar el resto de campos.

#### Scenario: Quitar el proyecto
- **WHEN** la tarea `TASK-101` tiene `project: "darwin"`, el usuario elige «No project» y guarda
- **THEN** `TASK-101` ya no tiene `project` en el fichero y la tarjeta pierde la franja y el nombre del proyecto

#### Scenario: Quitar un proyecto desconocido
- **WHEN** una tarea tiene `project: "legacy"` (no definido), el usuario elige «No project» y guarda
- **THEN** la tarea queda sin `project` y el aviso de proyecto desconocido desaparece si ninguna otra tarea lo usa
