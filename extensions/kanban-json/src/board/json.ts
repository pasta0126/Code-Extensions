import { Board, BoardError, Column, PRIORITIES, Priority, Task } from './model';

const KNOWN_TASK_KEYS = [
  'id',
  'title',
  'description',
  'assignee',
  'priority',
  'labels',
  'createdAt',
  'dueDate',
] as const;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function requireString(v: unknown, where: string): string {
  if (typeof v !== 'string' || v.trim() === '') {
    throw new BoardError(`${where} debe ser un texto no vacío`);
  }
  return v;
}

function optionalString(v: unknown, where: string): string | undefined {
  if (v === undefined) return undefined;
  if (typeof v !== 'string') throw new BoardError(`${where} debe ser un texto`);
  return v;
}

function parseTask(raw: unknown, where: string): Task {
  if (!isRecord(raw)) throw new BoardError(`${where} debe ser un objeto`);
  const id = requireString(raw.id, `${where}.id`);
  const at = `La tarea ${id}`;
  const task: Task = { id, title: requireString(raw.title, `${at}: title`), extras: {} };

  const description = optionalString(raw.description, `${at}: description`);
  if (description !== undefined) task.description = description;
  const assignee = optionalString(raw.assignee, `${at}: assignee`);
  if (assignee !== undefined) task.assignee = assignee;
  const createdAt = optionalString(raw.createdAt, `${at}: createdAt`);
  if (createdAt !== undefined) task.createdAt = createdAt;

  if (raw.priority !== undefined) {
    if (!PRIORITIES.includes(raw.priority as Priority)) {
      throw new BoardError(
        `${at} tiene priority "${String(raw.priority)}"; valores válidos: ${PRIORITIES.join(', ')}`,
      );
    }
    task.priority = raw.priority as Priority;
  }
  if (raw.labels !== undefined) {
    if (!Array.isArray(raw.labels) || raw.labels.some((l) => typeof l !== 'string')) {
      throw new BoardError(`${at}: labels debe ser una lista de textos`);
    }
    task.labels = raw.labels as string[];
  }
  if (raw.dueDate !== undefined) {
    if (raw.dueDate !== null && typeof raw.dueDate !== 'string') {
      throw new BoardError(`${at}: dueDate debe ser un texto o null`);
    }
    task.dueDate = raw.dueDate as string | null;
  }

  for (const [key, value] of Object.entries(raw)) {
    if (!(KNOWN_TASK_KEYS as readonly string[]).includes(key)) task.extras[key] = value;
  }
  return task;
}

/** Validates uniqueness invariants. Shared by parsing and by every board operation. */
export function assertValid(board: Board): void {
  const columnIds = new Set<string>();
  const taskIds = new Set<string>();
  for (const column of board.columns) {
    if (columnIds.has(column.id)) throw new BoardError(`Id de columna duplicado: ${column.id}`);
    columnIds.add(column.id);
    for (const task of column.tasks) {
      if (taskIds.has(task.id)) throw new BoardError(`Id de tarea duplicado: ${task.id}`);
      taskIds.add(task.id);
    }
  }
}

export function parseBoard(text: string): Board {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (e) {
    throw new BoardError(`JSON inválido: ${(e as Error).message}`);
  }
  if (!isRecord(raw)) throw new BoardError('La raíz debe ser un objeto');
  if (!Array.isArray(raw.columns)) throw new BoardError('"columns" debe ser una lista');

  const columns: Column[] = raw.columns.map((c, i) => {
    if (!isRecord(c)) throw new BoardError(`columns[${i}] debe ser un objeto`);
    const id = requireString(c.id, `columns[${i}].id`);
    const name = requireString(c.name, `La columna ${id}: name`);
    if (!Array.isArray(c.tasks)) throw new BoardError(`La columna ${id}: "tasks" debe ser una lista`);
    return { id, name, tasks: c.tasks.map((t, j) => parseTask(t, `columns[${i}].tasks[${j}]`)) };
  });

  const board: Board = { board: requireString(raw.board, 'board'), columns };
  assertValid(board);
  return board;
}

function serializeTask(task: Task): Record<string, unknown> {
  const out: Record<string, unknown> = { id: task.id, title: task.title };
  for (const key of KNOWN_TASK_KEYS) {
    if (key === 'id' || key === 'title') continue;
    if (task[key] !== undefined) out[key] = task[key];
  }
  return { ...out, ...task.extras };
}

/** Starter board used to initialize an empty kanban.json. */
export function createInitialBoard(name: string): Board {
  const column = (id: string, title: string) => ({ id, name: title, tasks: [] });
  return {
    board: name.trim() || 'Kanban',
    columns: [column('backlog', 'Backlog'), column('in-progress', 'En curso'), column('done', 'Hecho')],
  };
}

export function serializeBoard(board: Board): string {
  const out = {
    board: board.board,
    columns: board.columns.map((c) => ({ id: c.id, name: c.name, tasks: c.tasks.map(serializeTask) })),
  };
  return JSON.stringify(out, null, 2) + '\n';
}
