export interface Priority {
  id: string;
  name: string;
  color?: string;
}

/** Used when kanban.json has no `priorities` block. Order = severity. */
export const DEFAULT_PRIORITIES: readonly Priority[] = [
  { id: 'high', name: 'High' },
  { id: 'medium', name: 'Medium' },
  { id: 'low', name: 'Low' },
];

/** Pre-0.3.0 ids, read as aliases of the defaults when the board has no `priorities` block. */
export const LEGACY_PRIORITY_IDS: Readonly<Record<string, string>> = {
  alta: 'high',
  media: 'medium',
  baja: 'low',
};

export class BoardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BoardError';
  }
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  priority?: string;
  labels?: string[];
  createdAt?: string;
  dueDate?: string | null;
  /** Unmodeled keys (startedAt, completedAt, reviewer, ...), preserved on write. */
  extras: Record<string, unknown>;
}

export interface Column {
  id: string;
  name: string;
  tasks: Task[];
}

export interface Board {
  board: string;
  /** Custom priority levels; absent means DEFAULT_PRIORITIES. */
  priorities?: Priority[];
  columns: Column[];
}

/** Editable task fields; `undefined` leaves a field untouched, `null` clears it. */
export type TaskPatch = {
  title?: string;
  description?: string | null;
  assignee?: string | null;
  priority?: string | null;
  labels?: string[] | null;
  dueDate?: string | null;
};

export function effectivePriorities(board: Board): Priority[] {
  return board.priorities ?? DEFAULT_PRIORITIES.map((p) => ({ ...p }));
}

/** Maps a stored task priority id to a defined priority, applying legacy aliases only without a block. */
export function resolvePriority(board: Board, id: string): Priority | undefined {
  const list = effectivePriorities(board);
  const key = board.priorities ? id : (LEGACY_PRIORITY_IDS[id] ?? id);
  return list.find((p) => p.id === key);
}

/** Distinct priority ids used by tasks that are not defined by the board. */
export function unknownPriorities(board: Board): string[] {
  const unknown = new Set<string>();
  for (const column of board.columns) {
    for (const task of column.tasks) {
      if (task.priority !== undefined && !resolvePriority(board, task.priority)) unknown.add(task.priority);
    }
  }
  return [...unknown];
}
