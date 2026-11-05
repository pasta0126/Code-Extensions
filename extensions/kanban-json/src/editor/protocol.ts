import { Board, Priority, TaskPatch } from '../board/model';

/** Host -> webview. */
export type StateMessage = {
  type: 'state';
  text: string;
  board: Board | null;
  /** Effective priorities (board block or defaults). */
  priorities: Priority[];
  /** Legacy id -> id aliases; empty when the board defines its own priorities. */
  priorityAliases: Record<string, string>;
  /** Projects with their resolved CSS color (undefined when absent/invalid) and palette name, if any. */
  projects: ProjectView[];
  /** Fixed palette: name -> CSS color. */
  projectPalette: Record<string, string>;
  error: string | null;
};

export interface ProjectView {
  id: string;
  name: string;
  color?: string;
  /** Set only when the stored color is a palette name (selects the swatch in the editor). */
  paletteName?: string;
}

export type Operation =
  | { kind: 'addColumn'; name: string }
  | { kind: 'renameColumn'; columnId: string; name: string }
  | { kind: 'deleteColumn'; columnId: string }
  | { kind: 'addTask'; columnId: string; task: TaskPatch & { title: string } }
  | { kind: 'addProject'; name: string; color?: string }
  | { kind: 'updateProject'; projectId: string; name?: string; color?: string }
  | { kind: 'updateTask'; taskId: string; patch: TaskPatch }
  | { kind: 'deleteTask'; taskId: string }
  | { kind: 'moveTask'; taskId: string; toColumnId: string; toIndex: number };

/** Webview -> host. */
export type WebviewMessage =
  | { type: 'ready' }
  | { type: 'op'; op: Operation }
  | { type: 'initialize' }
  | { type: 'openAsText' };
