import * as vscode from 'vscode';
import { KanbanEditorProvider, VIEW_TYPE } from './editor/KanbanEditorProvider';

const SAMPLE = {
  board: 'My board',
  columns: [
    { id: 'todo', name: 'To do', tasks: [] },
    { id: 'in-progress', name: 'In progress', tasks: [] },
    { id: 'done', name: 'Done', tasks: [] },
  ],
};

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.window.registerCustomEditorProvider(VIEW_TYPE, new KanbanEditorProvider(context.extensionUri), {
      webviewOptions: { retainContextWhenHidden: true },
    }),

    vscode.commands.registerCommand('kanbanJson.createBoard', async () => {
      const folder = vscode.workspace.workspaceFolders?.[0];
      if (!folder) {
        void vscode.window.showErrorMessage('Open a folder to create kanban.json.');
        return;
      }
      const uri = vscode.Uri.joinPath(folder.uri, 'kanban.json');
      try {
        await vscode.workspace.fs.stat(uri);
      } catch {
        await vscode.workspace.fs.writeFile(uri, Buffer.from(JSON.stringify(SAMPLE, null, 2) + '\n'));
      }
      await vscode.commands.executeCommand('vscode.openWith', uri, VIEW_TYPE);
    }),

    vscode.commands.registerCommand('kanbanJson.openAsText', (uri?: vscode.Uri) =>
      openWith(uri, 'default'),
    ),
    vscode.commands.registerCommand('kanbanJson.openAsBoard', (uri?: vscode.Uri) =>
      openWith(uri, VIEW_TYPE),
    ),
  );
}

function openWith(uri: vscode.Uri | undefined, viewType: string): Thenable<unknown> | void {
  const target = uri ?? vscode.window.activeTextEditor?.document.uri;
  if (!target) return;
  return vscode.commands.executeCommand('vscode.openWith', target, viewType);
}

export function deactivate(): void {}
