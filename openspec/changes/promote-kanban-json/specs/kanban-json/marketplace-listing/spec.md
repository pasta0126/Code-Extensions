## Purpose

Define la ficha pública de la extensión (metadatos del paquete y README) y su distribución en los registros de extensiones, para que sea fácil de encontrar, de entender y de instalar.

## ADDED Requirements

### Requirement: Metadatos de descubrimiento
El `package.json` de la extensión SHALL declarar `keywords` relevantes para la búsqueda (como mínimo `kanban`, `board`, `task`, `todo`, `json` y `project management`), `categories` adecuadas y un `galleryBanner` con color y tema. La `description` SHALL comunicar en una frase el beneficio diferencial: un tablero Kanban guardado en un fichero JSON versionable en git, sin cuentas ni servicios externos. Los textos de la ficha SHALL estar en inglés.

#### Scenario: Búsqueda por palabra clave
- **WHEN** un usuario busca «kanban», «todo json» o «task board» en el Marketplace
- **THEN** la ficha dispone de `keywords` y `description` que coinciden con esos términos

#### Scenario: Descripción con el beneficio clave
- **WHEN** se lee la `description` en la ficha o en el listado de resultados
- **THEN** menciona el tablero Kanban, el fichero JSON versionable en git y la ausencia de cuentas o servicios

### Requirement: README orientado a la conversión
El README SHALL abrir con el ángulo diferencial (datos en un fichero versionable, sin cuentas ni servicios), incluir un ejemplo mínimo y válido de `kanban.json`, describir la instalación y el uso, y mostrar recursos visuales de: el tablero completo, el arrastre de tarjetas, el filtro y la agrupación por proyecto, y el aspecto en tema claro y oscuro. Todo el texto SHALL estar en inglés.

#### Scenario: Recursos visuales presentes
- **WHEN** se abre la ficha de la extensión en el Marketplace
- **THEN** el README muestra al menos un GIF de arrastrar y soltar, un recurso del filtro y la agrupación por proyecto, y una captura en tema claro y otra en oscuro

#### Scenario: Ejemplo de formato válido
- **WHEN** un usuario copia el ejemplo de `kanban.json` del README a un fichero con ese nombre
- **THEN** la extensión lo abre como tablero sin errores ni avisos

#### Scenario: Recursos accesibles desde el registro
- **WHEN** el README se renderiza en el Marketplace o en Open VSX
- **THEN** todas las imágenes se cargan, porque se referencian con rutas que resuelven fuera del repositorio local

### Requirement: Paquete ligero
El paquete `.vsix` SHALL NOT incluir fuentes, tests ni ficheros de desarrollo, y los recursos del README SHALL estar optimizados (GIFs de duración corta y tamaño contenido) para no inflar la instalación.

#### Scenario: Contenido del paquete
- **WHEN** se lista el contenido del `.vsix` generado
- **THEN** no contiene `src/`, `test/` ni `node_modules/`, y el tamaño total se mantiene en un orden razonable para una extensión de este tipo

### Requirement: Distribución en ambos registros
Cada versión publicada SHALL estar disponible tanto en el Marketplace de Microsoft como en Open VSX, con el mismo número de versión y el mismo contenido de ficha.

#### Scenario: Publicación de una versión
- **WHEN** se publica una versión nueva
- **THEN** la misma versión aparece en el Marketplace de Microsoft y en Open VSX

#### Scenario: Instalación en un fork de VS Code
- **WHEN** un usuario de VSCodium, Cursor o Windsurf busca la extensión
- **THEN** la encuentra en Open VSX con su ficha completa

### Requirement: Plan de difusión documentado
El cambio SHALL dejar documentado un plan de difusión con los canales (dev.to, Reddit, Show HN, Product Hunt, redes y listas «awesome»), el orden de ejecución, las normas de autopromoción a respetar y el texto base de cada publicación. Las tareas de mantenimiento (responder issues y reseñas, pedir reseñas) SHALL quedar descritas.

#### Scenario: Plan disponible antes de difundir
- **WHEN** se va a ejecutar la difusión
- **THEN** existe un documento con los canales, el orden y los textos base, y la ficha ya cumple los requisitos anteriores

#### Scenario: Difusión posterior a la ficha
- **WHEN** alguno de los requisitos de metadatos, README o distribución aún no se cumple
- **THEN** no se ejecuta ninguna publicación de difusión hasta completarlos
