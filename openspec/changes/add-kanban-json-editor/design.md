## Context

Extensión de VS Code nueva, sin código previo. El fichero `kanban.json` debe seguir siendo editable a mano y amigable con git.

## Goals / Non-Goals

**Goals:** editor Kanban fiable sobre `kanban.json`; modo Raw con validación; dominio testeable sin VS Code.
**Non-goals:** ver `proposal.md`.

## Decisions

### Editor personalizado (`CustomTextEditorProvider`)
Se usa un `CustomTextEditorProvider` con `viewType` `kanbanJson.board` para `kanban.json`. VS Code gestiona el `TextDocument`: deshacer/rehacer, dirty/guardar y cambios externos gratis. Alternativa descartada: webview independiente con lectura/escritura vía `fs`, que obliga a reimplementar todo lo anterior.

### Raw dentro del mismo webview
La alternancia Kanban/Raw es un modo del webview (textarea con validación), no un editor distinto. Se mantiene un comando "Abrir como texto" (`vscode.openWith` → `default`) para quien prefiera el editor nativo. Alternativa descartada: abrir el editor de texto nativo en paralelo; rompe la petición de alternar en el mismo sitio.

### Estructura: núcleo puro + capa de editor
```
src/
  board/       Núcleo puro, sin imports de vscode (testeable con vitest):
               model.ts (tipos), validate.ts (reglas), json.ts (parse/serialize), operations.ts (Board -> Board)
  editor/      Adaptador de VS Code: KanbanEditorProvider, protocolo de mensajes, HTML del webview
  extension.ts Activación y comandos
media/         JS/CSS del webview (vanilla, sin framework)
```
Solo `editor/` y `extension.ts` importan `vscode`.

### Operaciones inmutables
Las operaciones (`addColumn`, `moveTask`, ...) son funciones puras `Board -> Board` que validan los invariantes (ids únicos, prioridades válidas) y lanzan `BoardError` si no se cumplen.

### Preservar campos desconocidos
`Task` guarda `extras: Record<string, unknown>` con las claves no modeladas; la serialización las escribe tras las conocidas. Los campos opcionales ausentes no se serializan (no se añade `dueDate: null` a tareas que no lo tenían).

### Escritura
Cada operación del webview llega como mensaje, se carga el tablero del documento, se aplica el caso de uso y se reemplaza el contenido completo con `WorkspaceEdit` (JSON con indentación de 2 espacios). Si el documento es inválido, las operaciones se rechazan y se muestra el error.

### Seguridad del webview
CSP con nonce, `localResourceRoots` limitado a `media/`, todo el contenido de usuario se inserta con `textContent`.

## Risks / Trade-offs

- Reescribir el documento completo puede reformatear JSON editado a mano (indentación) → se normaliza a 2 espacios; aceptable y estable en git.
- Un edit completo pierde el cursor en editores de texto abiertos en paralelo → riesgo bajo, uso previsto es una vista a la vez.
- Los campos como `startedAt` no se actualizan automáticamente al mover → decisión consciente (ver non-goals).
