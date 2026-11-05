## ADDED Requirements

### Requirement: Apertura como tablero
El sistema SHALL abrir por defecto los ficheros `kanban.json` en la vista Kanban mediante un editor personalizado, y ofrecer un comando para crear un `kanban.json` de ejemplo en el workspace si no existe.

#### Scenario: Abrir kanban.json
- **WHEN** el usuario abre un `kanban.json` desde el explorador
- **THEN** se muestra el tablero con una columna por cada columna del fichero y una tarjeta por tarea

### Requirement: Operaciones sobre columnas
La vista Kanban SHALL permitir crear, renombrar y eliminar columnas. Eliminar una columna con tareas SHALL pedir confirmación.

#### Scenario: Crear columna
- **WHEN** el usuario crea una columna llamada "Bloqueado"
- **THEN** el fichero contiene una nueva columna `bloqueado` al final, sin tareas

### Requirement: Operaciones sobre tareas
La vista Kanban SHALL permitir crear, editar y eliminar tareas, mostrando título, prioridad, etiquetas, responsable y fecha límite en la tarjeta.

#### Scenario: Editar título
- **WHEN** el usuario cambia el título de `TASK-101` y guarda el formulario
- **THEN** el fichero refleja el nuevo título y conserva el resto de campos de la tarea

### Requirement: Mover tareas
La vista Kanban SHALL permitir mover una tarea mediante arrastrar y soltar a otra columna o a otra posición de su columna.

#### Scenario: Mover entre columnas
- **WHEN** el usuario arrastra `TASK-104` de "Por hacer" a "En progreso"
- **THEN** la tarea desaparece de `todo` y aparece en `in-progress` en la posición soltada

### Requirement: Sincronización con el documento
Los cambios de la vista SHALL aplicarse al `TextDocument` (con soporte de deshacer/rehacer), y los cambios externos del documento SHALL reflejarse en la vista.

#### Scenario: Deshacer
- **WHEN** el usuario mueve una tarea y pulsa deshacer
- **THEN** la tarea vuelve a su columna original

#### Scenario: JSON inválido
- **WHEN** el documento contiene JSON inválido o un tablero inválido
- **THEN** la vista Kanban muestra el error y un acceso directo «Abrir como texto», sin modificar el fichero

### Requirement: Documento vacío
Cuando el documento esté vacío o solo contenga espacios en blanco, la vista Kanban SHALL ofrecer inicializar el tablero con las columnas básicas (Backlog, En curso, Hecho) en lugar de mostrar un error.

#### Scenario: Inicializar un kanban.json vacío
- **WHEN** el usuario abre un `kanban.json` en blanco y pulsa "Inicializar tablero"
- **THEN** el fichero pasa a contener un tablero válido con las columnas `backlog`, `in-progress` y `done`, y la vista las muestra

#### Scenario: Rechazar la inicialización
- **WHEN** el usuario abre un `kanban.json` en blanco y elige "Abrir como texto"
- **THEN** el fichero no se modifica y se abre en el editor de texto nativo
