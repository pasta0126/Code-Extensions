# AGENTS.md

Repositorio con varias extensiones de VS Code. Cada extensión vive en su propia carpeta dentro de `extensions/` y es autocontenida (su `package.json`, build y tests). Las instrucciones específicas de cada una están en `extensions/<extensión>/AGENTS.md`.

## Extensiones

| Carpeta | Descripción |
|---|---|
| [`extensions/kanban-json/`](extensions/kanban-json/) | Tablero Kanban alimentado por un `kanban.json`, con vista Raw para editar el JSON. |

## Metodología: SDD con OpenSpec

Desarrollo dirigido por especificaciones. Antes de escribir código para una funcionalidad nueva o un cambio de comportamiento, define el cambio en `openspec/changes/<nombre>/` (`proposal.md`, `specs/<extensión>/<capability>/spec.md`, `design.md`, `tasks.md`). El código implementa las specs, no al revés.

- OpenSpec (`openspec/`) y las skills de Claude Code (`.claude/`) son **compartidos** por todo el repo.
- Los specs se agrupan por extensión: `specs/kanban-json/board-model/spec.md`, `specs/<otra-extension>/...`.
- Flujo con Claude Code: `/opsx:propose` → `/opsx:apply` → `/opsx:archive`.
- Valida siempre con `npx @fission-ai/openspec validate <cambio>` (ejecútalo en `openspec/` o en la raíz).
- Los requisitos usan `SHALL` y cada uno lleva al menos un `#### Scenario:` con `WHEN`/`THEN`.
- Si la implementación se desvía de la spec o el diseño, actualiza los artefactos del cambio (`/opsx:update`) en lugar de dejarlos desfasados.
- Marca las tareas en `tasks.md` (`- [x]`) a medida que se completan.
- Cambios activos: `openspec/changes/add-kanban-json-editor/` (pendiente: prueba manual 4.3).

## Añadir una extensión nueva

1. Crea la carpeta `extensions/<nombre>/` con su propio `package.json`, `tsconfig.json`, `esbuild.mjs`, `src/`, `test/` y `README.md`.
2. Añade `extensions/<nombre>/AGENTS.md` (y `extensions/<nombre>/CLAUDE.md` con `@AGENTS.md`).
3. Añade su configuración de F5 en `.vscode/launch.json` y `.vscode/tasks.json` (con `--extensionDevelopmentPath=${workspaceFolder}/extensions/<nombre>`).
4. Regístrala en la tabla de arriba y en el `README.md` raíz.
5. Crea su cambio inicial con `/opsx:propose`, con los specs bajo `specs/<nombre>/`.

## Convenciones del repo

- Specs y documentación interna en español; textos de cara al usuario (UI, README y CHANGELOG de cada extensión) en inglés; código, identificadores y nombres de ficheros en inglés.
- Los comandos npm se ejecutan dentro de la carpeta de la extensión (`cd extensions/kanban-json && npm test`); no hay `package.json` en la raíz.
- Ficheros locales (como `sessions.txt`) y artefactos de build están en `.gitignore`.
- No hagas commit salvo que se pida explícitamente.
