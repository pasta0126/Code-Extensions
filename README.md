# Code-Extensions

Colección de extensiones de VS Code. Cada una vive en su carpeta dentro de `extensions/` y se desarrolla con SDD ([OpenSpec](https://github.com/Fission-AI/OpenSpec)).

| Extensión | Descripción |
|---|---|
| [`kanban-json`](extensions/kanban-json/) | Tablero Kanban alimentado por un `kanban.json`. |

## Desarrollo

Cada extensión es autocontenida: entra en su carpeta e instala/ejecuta ahí (`cd extensions/kanban-json && npm install && npm test`).
Para probar una extensión, abre la raíz en VS Code y pulsa **F5** (elige su configuración de lanzamiento).

Los specs y cambios están en [`openspec/`](openspec/), agrupados por extensión.
Las instrucciones para agentes están en [`AGENTS.md`](AGENTS.md).

## Licencia

[Unlicense](LICENSE)
