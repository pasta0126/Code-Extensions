# kanban-json/project-grouping Specification

## Purpose
Agrupar las tarjetas de cada columna por proyecto como opción de vista, combinable con el filtro y sin modificar el `kanban.json`.

## Requirements

### Requirement: Agrupación por proyecto
La vista Kanban SHALL ofrecer una opción de agrupación con los valores «No grouping» (por defecto) y «Group by project». Con «Group by project», cada columna SHALL mostrar sus tarjetas en bloques con cabecera de proyecto, ordenados alfabéticamente por nombre, seguidos del bloque «No project»; los bloques sin tarjetas SHALL NOT mostrarse. Dentro de cada bloque las tarjetas SHALL conservar su orden relativo del fichero. Un proyecto no definido SHALL formar su propio bloque, identificado por su id, ordenado junto a los demás por ese texto. La agrupación SHALL NOT modificar el documento.

#### Scenario: Agrupar
- **WHEN** una columna tiene tareas de `portal`, `darwin` y sin proyecto, y el usuario elige «Group by project»
- **THEN** la columna muestra los bloques Darwin, Portal y «No project», en ese orden
- **AND** el fichero `kanban.json` no cambia

#### Scenario: Bloque vacío
- **WHEN** una columna no tiene tareas de `darwin`
- **THEN** esa columna no muestra bloque Darwin

#### Scenario: Sin agrupar
- **WHEN** el usuario elige «No grouping»
- **THEN** las tarjetas se muestran en una lista plana en el orden del fichero

### Requirement: Agrupación y filtro combinados
Con filtro y agrupación activos a la vez, la agrupación SHALL aplicarse solo a las tarjetas que cumplen el filtro.

#### Scenario: Filtro más agrupación
- **WHEN** el filtro es «No project» y la agrupación es «Group by project»
- **THEN** cada columna muestra únicamente el bloque «No project»

### Requirement: Arrastrar y soltar con agrupación
Con la agrupación activa, soltar una tarjeta SHALL colocarla en el fichero junto a la tarjeta visible sobre la que se suelta, sin alterar el orden relativo de las demás, y SHALL NOT cambiar su proyecto.

#### Scenario: Soltar en otra columna
- **WHEN** hay agrupación activa y el usuario suelta una tarea de `portal` entre dos tarjetas de un bloque de otra columna
- **THEN** la tarea queda entre esas dos tarjetas en el fichero
- **AND** su `project` no cambia
