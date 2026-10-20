import { assertValid } from './json';
import { Board, BoardError, Column, Task, TaskPatch } from './model';

function slugify(name: string): string {
  const slug = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'columna';
}

export function nextColumnId(board: Board, name: string): string {
  const base = slugify(name);
  const taken = new Set(board.columns.map((c) => c.id));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

export function nextTaskId(board: Board): string {
  let max = 0;
  for (const column of board.columns) {
    for (const task of column.tasks) {
      const m = /^TASK-(\d+)$/.exec(task.id);
      if (m) max = Math.max(max, Number(m[1]));
    }
  }
  return `TASK-${max + 1}`;
}

function findTask(board: Board, taskId: string): { column: Column; index: number } {
  for (const column of board.columns) {
    const index = column.tasks.findIndex((t) => t.id === taskId);
    if (index >= 0) return { column, index };
  }
  throw new BoardError(`No existe la tarea ${taskId}`);
}

function requireColumn(board: Board, columnId: string): Column {
  const column = board.columns.find((c) => c.id === columnId);
  if (!column) throw new BoardError(`No existe la columna ${columnId}`);
  return column;
}

function requireText(value: string, what: string): string {
  const v = value.trim();
  if (!v) throw new BoardError(`${what} no puede estar vacío`);
  return v;
}

/** Deep copy so operations never mutate their input. */
function clone(board: Board): Board {
  return structuredClone(board);
}

export function addColumn(board: Board, name: string): Board {
  const next = clone(board);
  const clean = requireText(name, 'El nombre de la columna');
  next.columns.push({ id: nextColumnId(board, clean), name: clean, tasks: [] });
  return next;
}

export function renameColumn(board: Board, columnId: string, name: string): Board {
  const next = clone(board);
  requireColumn(next, columnId).name = requireText(name, 'El nombre de la columna');
  return next;
}

export function deleteColumn(board: Board, columnId: string): Board {
  requireColumn(board, columnId);
  const next = clone(board);
  next.columns = next.columns.filter((c) => c.id !== columnId);
  return next;
}

export function addTask(
  board: Board,
  columnId: string,
  input: TaskPatch & { title: string },
  today: string,
): Board {
  const next = clone(board);
  const column = requireColumn(next, columnId);
  const task: Task = { id: nextTaskId(board), title: requireText(input.title, 'El título'), extras: {} };
  column.tasks.push(applyPatch(task, { ...input, title: undefined }));
  task.createdAt = today;
  return next;
}

function applyPatch(task: Task, patch: TaskPatch): Task {
  if (patch.title !== undefined) task.title = requireText(patch.title, 'El título');
  const fields = ['description', 'assignee', 'priority', 'labels', 'dueDate'] as const;
  for (const key of fields) {
    const value = patch[key];
    if (value === undefined) continue;
    if (value === null && key !== 'dueDate') delete task[key];
    else (task as unknown as Record<string, unknown>)[key] = value;
  }
  return task;
}

export function updateTask(board: Board, taskId: string, patch: TaskPatch): Board {
  const next = clone(board);
  const { column, index } = findTask(next, taskId);
  const updated = applyPatch(column.tasks[index]!, patch);
  assertValid(next);
  column.tasks[index] = updated;
  return next;
}

export function deleteTask(board: Board, taskId: string): Board {
  const next = clone(board);
  const { column, index } = findTask(next, taskId);
  column.tasks.splice(index, 1);
  return next;
}

/** Moves a task to `toColumnId` at `toIndex` (index in the destination after removal; clamped). */
export function moveTask(board: Board, taskId: string, toColumnId: string, toIndex: number): Board {
  const next = clone(board);
  const { column, index } = findTask(next, taskId);
  const target = requireColumn(next, toColumnId);
  const [task] = column.tasks.splice(index, 1);
  const at = Math.max(0, Math.min(toIndex, target.tasks.length));
  target.tasks.splice(at, 0, task!);
  return next;
}
