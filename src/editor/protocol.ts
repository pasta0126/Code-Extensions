import { Board, TaskPatch } from '../board/model';

/** Host -> webview. */
export type StateMessage = {
  type: 'state';
  text: string;
  board: Board | null;
  error: string | null;
};

export type ValidationMessage = { type: 'validation'; text: string; error: string | null };

export type Operation =
  | { kind: 'addColumn'; name: string }
  | { kind: 'renameColumn'; columnId: string; name: string }
  | { kind: 'deleteColumn'; columnId: string }
  | { kind: 'addTask'; columnId: string; task: TaskPatch & { title: string } }
  | { kind: 'updateTask'; taskId: string; patch: TaskPatch }
  | { kind: 'deleteTask'; taskId: string }
  | { kind: 'moveTask'; taskId: string; toColumnId: string; toIndex: number };

/** Webview -> host. */
export type WebviewMessage =
  | { type: 'ready' }
  | { type: 'op'; op: Operation }
  | { type: 'validateRaw'; text: string }
  | { type: 'applyRaw'; text: string }
  | { type: 'openAsText' };
