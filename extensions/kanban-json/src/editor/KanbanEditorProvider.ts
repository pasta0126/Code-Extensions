import { randomBytes } from 'node:crypto';
import * as vscode from 'vscode';
import { parseBoard, serializeBoard } from '../board/json';
import { Board, BoardError } from '../board/model';
import * as ops from '../board/operations';
import { Operation, StateMessage, ValidationMessage, WebviewMessage } from './protocol';

export const VIEW_TYPE = 'kanbanJson.board';

export class KanbanEditorProvider implements vscode.CustomTextEditorProvider {
  constructor(private readonly extensionUri: vscode.Uri) {}

  async resolveCustomTextEditor(document: vscode.TextDocument, panel: vscode.WebviewPanel): Promise<void> {
    const media = vscode.Uri.joinPath(this.extensionUri, 'media');
    panel.webview.options = { enableScripts: true, localResourceRoots: [media] };
    panel.webview.html = this.html(panel.webview, media);

    const sendState = () => {
      const text = document.getText();
      let msg: StateMessage;
      try {
        msg = { type: 'state', text, board: parseBoard(text), error: null };
      } catch (e) {
        msg = { type: 'state', text, board: null, error: (e as Error).message };
      }
      void panel.webview.postMessage(msg);
    };

    const subscriptions = [
      vscode.workspace.onDidChangeTextDocument((e) => {
        if (e.document.uri.toString() === document.uri.toString()) sendState();
      }),
      panel.webview.onDidReceiveMessage(async (msg: WebviewMessage) => {
        try {
          switch (msg.type) {
            case 'ready':
              sendState();
              break;
            case 'op':
              await this.runOperation(document, msg.op);
              break;
            case 'validateRaw': {
              let error: string | null = null;
              try {
                parseBoard(msg.text);
              } catch (e) {
                error = (e as Error).message;
              }
              const reply: ValidationMessage = { type: 'validation', text: msg.text, error };
              void panel.webview.postMessage(reply);
              break;
            }
            case 'applyRaw':
              parseBoard(msg.text); // refuse to write an invalid board
              await replaceAll(document, msg.text);
              break;
            case 'openAsText':
              await vscode.commands.executeCommand('vscode.openWith', document.uri, 'default');
              break;
          }
        } catch (e) {
          void vscode.window.showErrorMessage(`Kanban: ${(e as Error).message}`);
          sendState(); // resync the webview with the document
        }
      }),
    ];
    panel.onDidDispose(() => subscriptions.forEach((s) => s.dispose()));
  }

  private async runOperation(document: vscode.TextDocument, op: Operation): Promise<void> {
    const board = parseBoard(document.getText());
    if (op.kind === 'deleteColumn') {
      const column = board.columns.find((c) => c.id === op.columnId);
      if (column && column.tasks.length > 0) {
        const ok = await vscode.window.showWarningMessage(
          `La columna "${column.name}" tiene ${column.tasks.length} tarea(s). ¿Eliminarla?`,
          { modal: true },
          'Eliminar',
        );
        if (ok !== 'Eliminar') {
          void vscode.window.showInformationMessage('Eliminación cancelada.');
          return;
        }
      }
    }
    await replaceAll(document, serializeBoard(apply(board, op)));
  }

  private html(webview: vscode.Webview, media: vscode.Uri): string {
    const nonce = randomBytes(16).toString('base64');
    const uri = (file: string) => webview.asWebviewUri(vscode.Uri.joinPath(media, file));
    const csp = [
      "default-src 'none'",
      `style-src ${webview.cspSource}`,
      `script-src 'nonce-${nonce}'`,
    ].join('; ');
    return /* html */ `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Security-Policy" content="${csp}">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="${uri('board.css')}">
  <title>Kanban</title>
</head>
<body>
  <div id="app"></div>
  <script nonce="${nonce}" src="${uri('board.js')}"></script>
</body>
</html>`;
  }
}

function apply(board: Board, op: Operation): Board {
  switch (op.kind) {
    case 'addColumn':
      return ops.addColumn(board, op.name);
    case 'renameColumn':
      return ops.renameColumn(board, op.columnId, op.name);
    case 'deleteColumn':
      return ops.deleteColumn(board, op.columnId);
    case 'addTask':
      return ops.addTask(board, op.columnId, op.task, new Date().toISOString().slice(0, 10));
    case 'updateTask':
      return ops.updateTask(board, op.taskId, op.patch);
    case 'deleteTask':
      return ops.deleteTask(board, op.taskId);
    case 'moveTask':
      return ops.moveTask(board, op.taskId, op.toColumnId, op.toIndex);
    default:
      throw new BoardError('Operación desconocida');
  }
}

async function replaceAll(document: vscode.TextDocument, text: string): Promise<void> {
  if (document.getText() === text) return;
  const edit = new vscode.WorkspaceEdit();
  edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), text);
  if (!(await vscode.workspace.applyEdit(edit))) throw new Error('No se pudo modificar el documento');
}
