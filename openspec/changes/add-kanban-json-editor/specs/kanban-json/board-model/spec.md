## ADDED Requirements

### Requirement: Formato de kanban.json
El sistema SHALL leer un fichero `kanban.json` con un objeto `board` (nombre) y un array `columns`; cada columna tiene `id`, `name` y `tasks`; cada tarea tiene al menos `id` y `title`, y opcionalmente `description`, `assignee`, `priority`, `labels`, `createdAt` y `dueDate`.

#### Scenario: Fichero de ejemplo válido
- **WHEN** se carga un `kanban.json` con las columnas backlog, todo, in-progress, in-review y done
- **THEN** el tablero resultante contiene esas columnas en ese orden con todas sus tareas

#### Scenario: Prioridad desconocida
- **WHEN** una tarea tiene `priority` distinta de `alta`, `media` o `baja`
- **THEN** la carga falla con un error de validación que indica la tarea y el valor

### Requirement: Unicidad de identificadores
El sistema SHALL rechazar un tablero con ids de columna duplicados o ids de tarea duplicados en todo el tablero.

#### Scenario: Id de tarea duplicado entre columnas
- **WHEN** dos tareas de columnas distintas comparten `id`
- **THEN** la carga falla indicando el id duplicado

### Requirement: Conservación de campos desconocidos
El sistema SHALL conservar al reescribir el fichero los campos de tarea que no forman parte del modelo conocido (por ejemplo `startedAt`, `completedAt`, `reviewer`) y el orden de las claves.

#### Scenario: Round-trip sin cambios
- **WHEN** se carga y se serializa de nuevo el fichero de ejemplo sin modificarlo
- **THEN** el JSON resultante es equivalente al original, incluidos `startedAt`, `completedAt` y `reviewer`

### Requirement: Generación de identificadores
El sistema SHALL generar ids de tarea con formato `TASK-<n>` donde `n` es el mayor número existente más uno, y ids de columna como slug del nombre, añadiendo sufijo numérico si ya existe.

#### Scenario: Nueva tarea en el ejemplo
- **WHEN** se crea una tarea en el tablero de ejemplo (máximo existente `TASK-110`)
- **THEN** la tarea recibe el id `TASK-111`

#### Scenario: Columna con nombre repetido
- **WHEN** se crea una columna "Bloqueado" y ya existe la columna `bloqueado`
- **THEN** la nueva columna recibe el id `bloqueado-2`
