export const PRIORITIES = ['alta', 'media', 'baja'] as const;
export type Priority = (typeof PRIORITIES)[number];

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
  priority?: Priority;
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
  columns: Column[];
}

/** Editable task fields; `undefined` leaves a field untouched, `null` clears it. */
export type TaskPatch = {
  title?: string;
  description?: string | null;
  assignee?: string | null;
  priority?: Priority | null;
  labels?: string[] | null;
  dueDate?: string | null;
};
