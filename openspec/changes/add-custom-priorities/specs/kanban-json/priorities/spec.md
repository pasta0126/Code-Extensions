## ADDED Requirements

### Requirement: Bloque opcional de prioridades
El sistema SHALL aceptar en `kanban.json` un array opcional `priorities` donde cada elemento tiene `id` (cadena no vacía, único), `name` (cadena no vacía) y opcionalmente `color` (cadena). El orden del array SHALL ser el orden de severidad. Un bloque mal formado SHALL provocar un error de carga que indica el elemento.

#### Scenario: Bloque válido
- **WHEN** se carga un tablero con `priorities` = `critical`, `high`, `medium`, `low`
- **THEN** el tablero expone esas cuatro prioridades en ese orden

#### Scenario: Ids de prioridad duplicados
- **WHEN** dos elementos de `priorities` comparten `id`
- **THEN** la carga falla indicando el id duplicado

#### Scenario: Elemento sin nombre
- **WHEN** un elemento de `priorities` no tiene `name`
- **THEN** la carga falla indicando la posición del elemento

### Requirement: Prioridades por defecto
Cuando `priorities` no existe, el sistema SHALL usar `high` (High), `medium` (Medium) y `low` (Low), en ese orden.

#### Scenario: Tablero sin bloque
- **WHEN** se carga un tablero sin `priorities`
- **THEN** las prioridades disponibles son `high`, `medium` y `low` con sus nombres por defecto

### Requirement: Alias de ids legacy
Cuando `priorities` no existe, el sistema SHALL interpretar `alta`, `media` y `baja` como `high`, `medium` y `low`. El sistema SHALL NOT reescribir el valor de una tarea por este motivo; solo cambia si el usuario edita la prioridad de esa tarea.

#### Scenario: Fichero antiguo
- **WHEN** se carga un tablero sin `priorities` con una tarea `priority: "alta"`
- **THEN** la tarea se trata como `high`
- **AND** al serializar sin editar la tarea, el fichero conserva `"alta"`

#### Scenario: Alias con bloque presente
- **WHEN** el tablero tiene `priorities` y una tarea usa `priority: "alta"` que no está definida en el bloque
- **THEN** se trata como prioridad desconocida

### Requirement: Prioridad desconocida
El sistema SHALL cargar un tablero cuyas tareas usen una prioridad no definida, conservando el valor original, y SHALL avisar al usuario con un mensaje que lista los ids desconocidos.

#### Scenario: Id no definido
- **WHEN** una tarea tiene `priority: "urgent"` y `priorities` no lo define
- **THEN** el tablero se carga y la tarea conserva `urgent`
- **AND** se muestra un aviso que menciona `urgent`

### Requirement: Conservación al serializar
El sistema SHALL conservar el bloque `priorities` al reescribir el fichero, con su orden y claves, y SHALL NOT añadirlo si el fichero original no lo tenía.

#### Scenario: Round-trip con bloque
- **WHEN** se carga y se serializa un tablero con `priorities`
- **THEN** el JSON resultante contiene el mismo bloque

#### Scenario: Round-trip sin bloque
- **WHEN** se carga y se serializa un tablero sin `priorities`
- **THEN** el JSON resultante no contiene `priorities`

### Requirement: Inicialización con prioridades
Los `kanban.json` nuevos (comando de creación y documento vacío) SHALL incluir el bloque `priorities` por defecto: `high` (High), `medium` (Medium), `low` (Low).

#### Scenario: Crear tablero nuevo
- **WHEN** el usuario crea un `kanban.json` nuevo
- **THEN** el fichero contiene `priorities` con `high`, `medium` y `low`

#### Scenario: Documento vacío
- **WHEN** se abre como tablero un `kanban.json` vacío y se inicializa
- **THEN** el contenido incluye el bloque `priorities` por defecto
