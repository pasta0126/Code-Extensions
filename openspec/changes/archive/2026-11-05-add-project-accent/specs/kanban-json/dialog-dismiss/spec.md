## Purpose
Permitir descartar el diálogo de detalle de la tarjeta haciendo clic fuera de él, como en cualquier modal habitual.

## ADDED Requirements

### Requirement: Cierre al hacer clic fuera
El sistema SHALL cerrar el diálogo de detalle de tarea (edición y creación) cuando el usuario hace clic en el área exterior al diálogo. El cierre SHALL equivaler a «Cancel»: no se guarda ningún cambio ni se modifica el documento.

#### Scenario: Clic en el fondo
- **WHEN** el diálogo de detalle está abierto y el usuario hace clic en el fondo exterior
- **THEN** el diálogo se cierra
- **AND** el documento `kanban.json` no cambia

#### Scenario: Clic dentro del diálogo
- **WHEN** el usuario hace clic sobre el contenido del diálogo (campos, etiquetas, espacios entre campos)
- **THEN** el diálogo permanece abierto

### Requirement: Selección de texto no cierra el diálogo
El sistema SHALL NOT cerrar el diálogo si el usuario inicia el gesto dentro del diálogo y lo termina fuera (p. ej. al seleccionar texto arrastrando el ratón). Solo SHALL cerrarse cuando pulsar y soltar ocurren ambos en el exterior.

#### Scenario: Arrastre que termina fuera
- **WHEN** el usuario pulsa dentro de un campo, arrastra y suelta fuera del diálogo
- **THEN** el diálogo permanece abierto
