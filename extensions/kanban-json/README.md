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
          "priority": "alta",
          "labels": ["example"],
          "createdAt": "2026-10-20",
          "dueDate": null
        }
      ]
    }
  ]
}
```

`priority` accepts `alta` (high), `media` (medium) or `baja` (low). Column ids and task ids must be unique.

## License

Public domain ([Unlicense](LICENSE)).
