# Kanban JSON

Gestiona un tablero Kanban dentro de VS Code a partir de un único fichero `kanban.json`, versionable en git.

## Características

- **Vista Kanban**: columnas y tarjetas. Crea, renombra y elimina columnas; crea, edita y elimina tareas; arrastra tarjetas entre columnas o dentro de una columna.
- **Vista Raw**: pestaña "Raw" en el mismo editor para ver y editar el JSON, con validación en vivo. Solo se puede aplicar si es válido.
- **Siempre sincronizado**: el fichero es la fuente de verdad. Deshacer/rehacer, guardado y cambios externos (git, otro editor) se reflejan en ambas vistas.
- **No pierde datos**: los campos que la extensión no conoce (`startedAt`, `completedAt`, `reviewer`, ...) se conservan al guardar.

## Uso

1. Abre cualquier fichero llamado `kanban.json`: se muestra como tablero.
2. O ejecuta **Kanban: Crear kanban.json de ejemplo** desde la paleta de comandos para empezar un tablero nuevo en tu carpeta.
3. Pulsa **Raw** para editar el JSON o **Abrir como texto** para usar el editor de texto nativo.

Comandos: `Kanban: Crear kanban.json de ejemplo`, `Kanban: Abrir como texto`, `Kanban: Abrir como tablero`.

## Formato

```json
{
  "board": "Mi tablero",
  "columns": [
    {
      "id": "todo",
      "name": "Por hacer",
      "tasks": [
        {
          "id": "TASK-1",
          "title": "Mi primera tarea",
          "description": "Opcional",
          "assignee": "Ana",
          "priority": "alta",
          "labels": ["ejemplo"],
          "createdAt": "2026-10-20",
          "dueDate": null
        }
      ]
    }
  ]
}
```

`priority` admite `alta`, `media` o `baja`. Los ids de columna y de tarea deben ser únicos.

## Licencia

Dominio público ([Unlicense](LICENSE)).
