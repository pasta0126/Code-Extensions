## ADDED Requirements

### Requirement: Formato de fecha configurable
El sistema SHALL leer la clave opcional `dateFormat` de la raíz de `kanban.json`: un patrón que contiene `yyyy`, `mm` y `dd` exactamente una vez cada uno, con separadores literales libres. Si falta, el formato SHALL ser `yyyy-mm-dd`. Si no es una cadena o el patrón es inválido, el sistema SHALL usar `yyyy-mm-dd`, avisar al usuario y conservar el valor original en el fichero. Las fechas de las tareas (`dueDate`, `createdAt`) SHALL seguir almacenándose en ISO `yyyy-mm-dd`.

#### Scenario: Sin configuración
- **WHEN** el tablero no tiene `dateFormat` y una tarea tiene `dueDate` `2026-11-05`
- **THEN** la tarjeta muestra `2026-11-05`

#### Scenario: Formato personalizado
- **WHEN** `dateFormat` es `dd/mm/yyyy` y una tarea tiene `dueDate` `2026-11-05`
- **THEN** la tarjeta muestra `05/11/2026`
- **AND** el fichero sigue guardando `2026-11-05`

#### Scenario: Patrón inválido
- **WHEN** `dateFormat` es `dd/yyyy`
- **THEN** las fechas se muestran como `yyyy-mm-dd` y se muestra un aviso
- **AND** el valor `dd/yyyy` se conserva al reescribir el fichero

### Requirement: Primer día de la semana configurable
El sistema SHALL leer la clave opcional `firstDayOfWeek` de la raíz de `kanban.json`, con valores `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday` o `sunday` (sin distinguir mayúsculas). Si falta, SHALL ser `monday`. Si el valor es inválido, el sistema SHALL usar `monday`, avisar y conservar el valor original.

#### Scenario: Por defecto
- **WHEN** el tablero no tiene `firstDayOfWeek` y se abre el calendario
- **THEN** la primera columna del calendario es lunes

#### Scenario: Domingo
- **WHEN** `firstDayOfWeek` es `sunday` y se abre el calendario
- **THEN** la primera columna del calendario es domingo

### Requirement: Campo de fecha con calendario propio
El editor de tarea SHALL ofrecer la fecha límite como un campo de texto escrito con `dateFormat` y un calendario desplegable cuya semana empieza en `firstDayOfWeek`. Elegir un día en el calendario SHALL rellenar el campo; un texto que no sea una fecha válida en ese formato SHALL impedir guardar; un campo vacío SHALL guardar la tarea sin fecha límite. La fecha SHALL guardarse en ISO.

#### Scenario: Elegir en el calendario
- **WHEN** `dateFormat` es `dd/mm/yyyy` y el usuario elige el 5 de noviembre de 2026 en el calendario
- **THEN** el campo muestra `05/11/2026`
- **AND** al guardar, `dueDate` es `2026-11-05`

#### Scenario: Texto inválido
- **WHEN** el usuario escribe `31/02/2026`
- **THEN** el formulario no se envía y el campo se marca como inválido

#### Scenario: Editar una fecha existente
- **WHEN** se abre una tarea con `dueDate` `2026-11-05` y `dateFormat` `mm/dd/yyyy`
- **THEN** el campo muestra `11/05/2026` y el calendario se abre en noviembre de 2026

### Requirement: Conservación de la configuración
El sistema SHALL conservar `dateFormat` y `firstDayOfWeek` al reescribir el fichero, y SHALL NOT añadirlos si no existían.

#### Scenario: Round-trip
- **WHEN** se carga y se serializa un tablero con `dateFormat` y `firstDayOfWeek`
- **THEN** ambas claves aparecen con su valor original
