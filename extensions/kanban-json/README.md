# Kanban JSON

Manage a Kanban board inside VS Code from a single `kanban.json` file that you can version in git.

## Features

- **Kanban view**: columns and cards. Create, rename and delete columns; create, edit and delete tasks; drag cards between columns or within a column.
- **Always in sync**: the file is the source of truth. Undo/redo, saving and external changes (git, another editor) are reflected in the board.
- **No data loss**: fields the extension does not know about (`startedAt`, `completedAt`, `reviewer`, ...) are preserved on save.
- **Empty file friendly**: opening a blank `kanban.json` offers to initialize it with the Backlog, In Progress and Done columns.

## Usage

1. Open any file named `kanban.json`: it is displayed as a board.
2. Or run **Kanban: Create sample kanban.json** from the command palette to start a new board in your folder.
3. Click **Open as text** to edit the JSON in the native text editor.

Commands: `Kanban: Create sample kanban.json`, `Kanban: Open as Text`, `Kanban: Open as Board`.

## Format

```json
{
  "board": "My board",
  "priorities": [
    { "id": "high", "name": "High" },
    { "id": "medium", "name": "Medium" },
    { "id": "low", "name": "Low" }
  ],
  "columns": [
    {
      "id": "todo",
      "name": "To do",
      "tasks": [
        {
          "id": "TASK-1",
          "title": "My first task",
          "description": "Optional",
          "assignee": "Alex",
          "priority": "high",
          "labels": ["example"],
          "createdAt": "2026-10-20",
          "dueDate": null
        }
      ]
    }
  ]
}
```

Column ids and task ids must be unique.

### Priorities

`priorities` is optional and lists the levels offered in the priority dropdown, in order of severity. Each entry has an `id` (stored in tasks), a `name` (shown in the UI) and an optional `color` (any CSS color, e.g. `"#d73a49"`). New boards are created with `high`, `medium` and `low`.

If `priorities` is missing, those three defaults are used, and the old ids `alta`, `media` and `baja` are read as `high`, `medium` and `low` (files are not rewritten). A task whose priority is not defined still loads: it shows the raw id in a neutral style and a warning is displayed.

## License

Public domain ([Unlicense](LICENSE)).
