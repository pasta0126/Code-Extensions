## Why

`kanban-json` ya es una extensión estable (0.6.0), pero su ficha del Marketplace es pobre para descubrirla y convertir visitas en instalaciones: el README no tiene capturas ni GIFs, el `package.json` no define `keywords` ni `galleryBanner`, la `description` no expone el beneficio diferencial y solo se distribuye en un registro. Sin una ficha cuidada y una difusión planificada, la extensión es prácticamente invisible. Este cambio deja preparado, para atenderlo más adelante, todo lo necesario para promocionarla.

## What Changes

- Mejorar los metadatos del `package.json`: `keywords`, `categories`, `galleryBanner` y una `description` que comunique el beneficio clave (tablero Kanban guardado en un JSON versionable en git, sin cuentas ni servicios).
- Reescribir el README de la extensión (en inglés) con el ángulo diferencial arriba, un ejemplo de `kanban.json` y capturas/GIFs de: tablero, arrastrar y soltar, filtro y agrupación por proyecto, tema claro y oscuro.
- Grabar y añadir los GIFs/capturas (tarea manual o asistida con navegador).
- Publicar también en Open VSX (`ovsx publish`) además del Marketplace de Microsoft, para llegar a VSCodium, Cursor, Windsurf y otros forks.
- Definir un plan de difusión: post de lanzamiento en dev.to, Reddit (r/vscode), Show HN / Product Hunt (opcional), redes y PR a listas «awesome».
- Definir tareas de mantenimiento: README del repo cuidado, responder issues y reseñas, pedir reseñas.
- No cambia el comportamiento funcional de la extensión ni el formato de `kanban.json`.

## Capabilities

### New Capabilities
- `marketplace-listing`: requisitos de la ficha pública de la extensión (metadatos del `package.json`, contenido y recursos visuales del README) y de su distribución en los registros (Marketplace de Microsoft y Open VSX).

### Modified Capabilities

(Ninguna: no cambia el comportamiento de las capabilities existentes.)

## Impact

- `extensions/kanban-json/package.json`: nuevos campos de metadatos y `description`.
- `extensions/kanban-json/README.md`: reescritura; nueva carpeta de recursos (p. ej. `extensions/kanban-json/images/`) para capturas y GIFs.
- `extensions/kanban-json/CHANGELOG.md` y versión: entrada de publicación (previsiblemente 0.6.1 o 0.7.0, a decidir al aplicar).
- Proceso de publicación: token de Open VSX y herramienta `ovsx`; revisión del `.vscodeignore` para excluir fuentes y no inflar el `.vsix` con los GIFs innecesarios.
- Externo (no código): textos y publicaciones de difusión, y PRs a repositorios de terceros.
