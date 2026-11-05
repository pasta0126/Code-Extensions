## ADDED Requirements

### Requirement: Orden alfabético de proyectos en la UI
El sistema SHALL mostrar los proyectos en orden alfabético por nombre (sin distinguir mayúsculas ni acentos) en todo desplegable de la interfaz que los liste. Esto SHALL NOT alterar el orden del array `projects` ni su serialización.

#### Scenario: Desplegable de la tarea
- **WHEN** `projects` está definido en el orden «Portal», «Darwin», «Atlas» y el usuario abre el desplegable de proyecto de una tarea
- **THEN** las opciones aparecen como Atlas, Darwin, Portal (tras «—» y antes de «New project…»)

#### Scenario: El fichero conserva su orden
- **WHEN** se crea o edita un proyecto desde la UI
- **THEN** `projects` en el fichero mantiene el orden original, y el proyecto nuevo se añade al final

### Requirement: Quitar el proyecto de una tarea
El editor de tarea SHALL permitir dejar una tarea sin proyecto seleccionando «—». Al guardar, la tarea SHALL quedar sin el campo `project` en el fichero y conservar el resto de campos.

#### Scenario: Quitar el proyecto
- **WHEN** la tarea `TASK-101` tiene `project: "darwin"`, el usuario elige «—» y guarda
- **THEN** `TASK-101` ya no tiene `project` en el fichero y la tarjeta pierde la franja y el nombre del proyecto

#### Scenario: Quitar un proyecto desconocido
- **WHEN** una tarea tiene `project: "legacy"` (no definido), el usuario elige «—» y guarda
- **THEN** la tarea queda sin `project` y el aviso de proyecto desconocido desaparece si ninguna otra tarea lo usa
