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

export interface Project {
  id: string;
  name: string;
  /** Palette name or `#RGB`/`#RRGGBB`; kept verbatim even when invalid. */
  color?: string;
}

/** Fixed palette (mid tones that read on light and dark themes). */
export const PROJECT_COLORS: Readonly<Record<string, string>> = {
  red: '#e5484d',
  orange: '#f76b15',
  amber: '#f5a524',
  yellow: '#e5c100',
  lime: '#84cc16',
  green: '#30a46c',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  sky: '#38a9f0',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  pink: '#ec4899',
  gray: '#8b8d98',
};

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Effective CSS color for a project color value, or undefined when absent/invalid. */
export function resolveProjectColor(color: string | undefined): string | undefined {
  if (color === undefined) return undefined;
  if (Object.prototype.hasOwnProperty.call(PROJECT_COLORS, color)) return PROJECT_COLORS[color];
  return HEX_COLOR.test(color) ? color : undefined;
}

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
  project?: string;
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
  /** Optional projects; tasks reference them by id. */
  projects?: Project[];
  columns: Column[];
}

/** Editable task fields; `undefined` leaves a field untouched, `null` clears it. */
export type TaskPatch = {
  title?: string;
  description?: string | null;
  assignee?: string | null;
  priority?: string | null;
  project?: string | null;
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

/** Distinct project ids used by tasks that the board does not define. */
export function unknownProjects(board: Board): string[] {
  const known = new Set((board.projects ?? []).map((p) => p.id));
  const unknown = new Set<string>();
  for (const column of board.columns) {
    for (const task of column.tasks) {
      if (task.project !== undefined && !known.has(task.project)) unknown.add(task.project);
    }
  }
  return [...unknown];
}

/** Projects whose `color` is neither a palette name nor a valid hex. */
export function invalidProjectColors(board: Board): Project[] {
  return (board.projects ?? []).filter((p) => p.color !== undefined && resolveProjectColor(p.color) === undefined);
}
