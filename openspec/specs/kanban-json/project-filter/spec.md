# kanban-json/project-filter Specification

## Purpose
Filtrar la vista Kanban por proyecto sin modificar el `kanban.json`, manteniendo coherentes el arrastre y el alta de tareas.

## Requirements

### Requirement: Filtro por proyecto
La vista Kanban SHALL ofrecer un selector de filtro por proyecto con las opciones «All projects» (por defecto), «No project» y un elemento por cada proyecto definido, estos últimos en orden alfabético. Con un filtro activo, cada columna SHALL mostrar solo las tareas que cumplen el filtro; todas las columnas SHALL seguir visibles aunque queden vacías. El filtro SHALL NOT modificar el documento.

#### Scenario: Filtrar por un proyecto
- **WHEN** el usuario elige el proyecto «Darwin» en el filtro
- **THEN** solo se muestran las tareas con `project` = `darwin`, en cada columna y con su orden relativo
- **AND** el fichero `kanban.json` no cambia

#### Scenario: Sin proyecto
- **WHEN** el usuario elige «No project»
- **THEN** solo se muestran las tareas sin `project`

#### Scenario: Quitar el filtro
- **WHEN** el usuario elige «All projects»
- **THEN** se muestran todas las tareas

### Requirement: Filtro y operaciones
Con un filtro activo, mover una tarea por arrastre SHALL situarla en la posición correspondiente respecto a las tareas visibles, sin alterar el orden relativo de las ocultas. Una tarea nueva creada con un proyecto concreto filtrado SHALL partir con ese proyecto preseleccionado.

#### Scenario: Mover con filtro activo
- **WHEN** hay filtro activo y el usuario suelta una tarea entre dos tarjetas visibles de otra columna
- **THEN** la tarea queda entre esas dos tareas en el fichero

#### Scenario: Alta con filtro
- **WHEN** el filtro es «Darwin» y el usuario crea una tarea
- **THEN** el formulario aparece con el proyecto Darwin seleccionado

### Requirement: Filtro ante cambios en el tablero
Si el proyecto filtrado deja de existir (p. ej. el JSON se edita fuera de la vista), el filtro SHALL volver a «All projects». El filtro SHALL conservarse mientras la vista siga abierta y el tablero cambie por otras ediciones.

#### Scenario: Proyecto eliminado
- **WHEN** el filtro es `darwin` y el fichero se modifica de forma que `darwin` ya no está en `projects` ni en ninguna tarea
- **THEN** el filtro vuelve a «All projects»
