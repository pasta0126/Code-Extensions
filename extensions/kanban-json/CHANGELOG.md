# Changelog

## 0.3.0

- **BREAKING:** the default priority ids are now `high`, `medium` and `low` (previously `alta`, `media`, `baja`). Boards created with this version include a `priorities` block and are not valid in earlier versions.
- New optional `priorities` block in `kanban.json` to define your own priority levels (`id`, `name`, optional `color`); the order is the order of severity.
- Existing boards keep working: without a `priorities` block, `alta`/`media`/`baja` are read as `high`/`medium`/`low`.
- Tasks with an undefined priority no longer fail to load; they show the raw id and a warning.
- New boards are created with the default `priorities` block.

## 0.2.2

- Click a card to edit it (previously required a double-click).
- Pressing Enter in the task dialog no longer triggers Delete.

## 0.2.1

- Icon now has a transparent background.

## 0.2.0

- Removed the in-editor Raw tab; use **Open as text** to edit the JSON.
- Priority labels are shown in English (High, Medium, Low).

## 0.1.1

- Updated development dependencies (vitest 4.1.12) to fix security advisories in `tinypool` and `@vitest/mocker`. No runtime changes.

## 0.1.0

- All user-facing text (UI, messages, command titles, description, README) is now in English.

## 0.0.2

- An empty `kanban.json` no longer shows an error: the Kanban view offers to initialize the board with the Backlog, In Progress and Done columns.

## 0.0.1

- First release: Kanban editor for `kanban.json` with a switchable Raw view.
