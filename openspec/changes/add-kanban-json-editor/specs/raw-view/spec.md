## ADDED Requirements

### Requirement: Alternar entre Kanban y Raw
El editor SHALL mostrar una barra con los modos "Kanban" y "Raw" y permitir cambiar entre ambos sin cerrar el editor ni perder cambios pendientes.

#### Scenario: Cambiar a Raw
- **WHEN** el usuario pulsa "Raw" en la vista Kanban
- **THEN** se muestra el JSON actual del documento en un área editable

#### Scenario: Volver a Kanban
- **WHEN** el usuario pulsa "Kanban" estando en Raw con un JSON válido
- **THEN** se muestra el tablero correspondiente al contenido del documento

### Requirement: Edición con validación
La vista Raw SHALL validar el contenido (sintaxis JSON y reglas del modelo) mientras se edita, indicar el error con su posición cuando sea posible y SHALL permitir aplicar los cambios solo si el contenido es válido.

#### Scenario: JSON con error de sintaxis
- **WHEN** el usuario borra una coma y el JSON deja de ser válido
- **THEN** se muestra el error y el botón "Aplicar" queda deshabilitado

#### Scenario: Aplicar cambios válidos
- **WHEN** el usuario edita el JSON de forma válida y pulsa "Aplicar"
- **THEN** el documento se actualiza con ese contenido y la vista Kanban lo refleja

### Requirement: Mantener el modo al refrescar
La vista SHALL conservar el modo activo cuando el documento cambia externamente, y SHALL no sobrescribir ediciones sin aplicar en Raw sin avisar al usuario.

#### Scenario: Cambio externo con edición pendiente
- **WHEN** el documento cambia externamente mientras hay texto sin aplicar en Raw
- **THEN** se avisa del conflicto y se ofrece recargar el contenido del documento
