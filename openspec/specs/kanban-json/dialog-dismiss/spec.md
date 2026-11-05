# kanban-json/dialog-dismiss Specification

## Purpose
Permitir descartar el diálogo de detalle de la tarjeta haciendo clic fuera de él, como en cualquier modal habitual.

## Requirements

### Requirement: Cierre al hacer clic fuera
El sistema SHALL cerrar cualquier diálogo de la webview (detalle de tarea en edición y creación, nueva columna, renombrar columna, nuevo y editar proyecto) cuando el usuario hace clic en el área exterior al diálogo. El cierre SHALL equivaler a «Cancel»: no se guarda ningún cambio ni se modifica el documento. Las confirmaciones (p. ej. eliminar una columna con tareas) son modales nativos de VS Code, no diálogos de la webview, y quedan fuera de este requisito.

#### Scenario: Clic en el fondo
- **WHEN** un diálogo está abierto y el usuario hace clic en el fondo exterior
- **THEN** el diálogo se cierra
- **AND** el documento `kanban.json` no cambia

#### Scenario: Clic dentro del diálogo
- **WHEN** el usuario hace clic sobre el contenido del diálogo (campos, etiquetas, espacios entre campos)
- **THEN** el diálogo permanece abierto

#### Scenario: Diálogo de proyecto
- **WHEN** el diálogo de nuevo o editar proyecto está abierto sobre el de detalle y el usuario hace clic fuera
- **THEN** se cierra solo el diálogo de proyecto y el de detalle sigue abierto con sus datos

### Requirement: Selección de texto no cierra el diálogo
El sistema SHALL NOT cerrar el diálogo si el usuario inicia el gesto dentro del diálogo y lo termina fuera (p. ej. al seleccionar texto arrastrando el ratón). Solo SHALL cerrarse cuando pulsar y soltar ocurren ambos en el exterior.

#### Scenario: Arrastre que termina fuera
- **WHEN** el usuario pulsa dentro de un campo, arrastra y suelta fuera del diálogo
- **THEN** el diálogo permanece abierto
