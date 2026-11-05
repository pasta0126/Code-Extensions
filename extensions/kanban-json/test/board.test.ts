import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createInitialBoard, parseBoard, serializeBoard } from '../src/board/json';
import {
  BoardError,
  effectivePriorities,
  invalidProjectColors,
  PROJECT_COLORS,
  resolvePriority,
  resolveProjectColor,
  unknownPriorities,
  unknownProjects,
} from '../src/board/model';
import {
  addColumn,
  addProject,
  addTask,
  deleteColumn,
  deleteTask,
  moveTask,
  renameColumn,
  updateProject,
  updateTask,
} from '../src/board/operations';

const sample = readFileSync(resolve(process.cwd(), 'examples/kanban.json'), 'utf8');
const load = () => parseBoard(sample);

describe('board-model: formato', () => {
  it('carga el ejemplo con sus 5 columnas en orden', () => {
    expect(load().columns.map((c) => c.id)).toEqual(['backlog', 'todo', 'in-progress', 'in-review', 'done']);
  });

  it('round-trip equivalente, conservando startedAt/completedAt/reviewer', () => {
    expect(JSON.parse(serializeBoard(load()))).toEqual(JSON.parse(sample));
  });

  it('no añade dueDate a tareas que no lo tenían', () => {
    const done = JSON.parse(serializeBoard(load())).columns[4].tasks[0];
    expect('dueDate' in done).toBe(false);
  });

  it('rechaza ids de tarea duplicados entre columnas', () => {
    const bad = sample.replace('"TASK-105"', '"TASK-101"');
    expect(() => parseBoard(bad)).toThrow(/[Dd]uplicate task id: TASK-101/);
  });

  it('rechaza JSON inválido con BoardError', () => {
    expect(() => parseBoard('{ nope')).toThrow(BoardError);
  });
});

describe('board-model: ids', () => {
  it('nueva tarea recibe TASK-111', () => {
    const next = addTask(load(), 'backlog', { title: 'Nueva' }, '2026-10-20');
    expect(next.columns[0]!.tasks.at(-1)).toMatchObject({ id: 'TASK-111', createdAt: '2026-10-20' });
  });

  it('columna con nombre repetido recibe sufijo', () => {
    const next = addColumn(addColumn(load(), 'Bloqueado'), 'Bloqueado');
    expect(next.columns.at(-1)!.id).toBe('bloqueado-2');
  });

  it('slug sin acentos', () => {
    expect(addColumn(load(), 'En revisión final').columns.at(-1)!.id).toBe('en-revision-final');
  });
});

describe('operaciones', () => {
  it('addColumn añade al final sin tareas y no muta la entrada', () => {
    const board = load();
    const next = addColumn(board, 'Bloqueado');
    expect(next.columns.at(-1)).toEqual({ id: 'bloqueado', name: 'Bloqueado', tasks: [] });
    expect(board.columns).toHaveLength(5);
  });

  it('renameColumn y deleteColumn', () => {
    const renamed = renameColumn(load(), 'todo', 'Pendiente');
    expect(renamed.columns[1]!.name).toBe('Pendiente');
    expect(deleteColumn(renamed, 'todo').columns.map((c) => c.id)).not.toContain('todo');
    expect(() => deleteColumn(load(), 'nada')).toThrow(BoardError);
  });

  it('updateTask cambia el título y conserva el resto', () => {
    const next = updateTask(load(), 'TASK-106', { title: 'Otro', description: null });
    const task = next.columns[2]!.tasks[0]!;
    expect(task.title).toBe('Otro');
    expect(task.description).toBeUndefined();
    expect(task.extras.startedAt).toBe('2026-10-18');
  });

  it('moveTask entre columnas en la posición soltada', () => {
    const next = moveTask(load(), 'TASK-104', 'in-progress', 1);
    expect(next.columns[1]!.tasks.map((t) => t.id)).toEqual(['TASK-105']);
    expect(next.columns[2]!.tasks.map((t) => t.id)).toEqual(['TASK-106', 'TASK-104', 'TASK-107']);
  });

  it('moveTask dentro de la misma columna', () => {
    const next = moveTask(load(), 'TASK-101', 'backlog', 2);
    expect(next.columns[0]!.tasks.map((t) => t.id)).toEqual(['TASK-102', 'TASK-103', 'TASK-101']);
  });

  it('deleteTask', () => {
    expect(deleteTask(load(), 'TASK-109').columns[4]!.tasks).toHaveLength(1);
  });
});

describe('board-model: inicialización', () => {
  it('el tablero inicial es válido y hace round-trip', () => {
    const board = createInitialBoard('Demo');
    expect(board.columns.map((c) => c.id)).toEqual(['backlog', 'in-progress', 'done']);
    expect(parseBoard(serializeBoard(board))).toEqual(board);
  });
});

describe('priorities', () => {
  const withBlock = (priorities: unknown) => {
    const raw = JSON.parse(sample);
    raw.priorities = priorities;
    return JSON.stringify(raw);
  };

  it('usa high/medium/low por defecto sin bloque', () => {
    expect(effectivePriorities(load()).map((p) => p.id)).toEqual(['high', 'medium', 'low']);
  });

  it('acepta un bloque válido y conserva el orden', () => {
    const board = parseBoard(
      withBlock([
        { id: 'critical', name: 'Critical', color: '#d73a49' },
        { id: 'high', name: 'High' },
      ]),
    );
    expect(effectivePriorities(board).map((p) => p.id)).toEqual(['critical', 'high']);
  });

  it('rechaza ids duplicados y elementos sin nombre', () => {
    expect(() => parseBoard(withBlock([{ id: 'a', name: 'A' }, { id: 'a', name: 'B' }]))).toThrow(/Duplicate priority id: a/);
    expect(() => parseBoard(withBlock([{ id: 'a' }]))).toThrow(/priorities\[0\]\.name/);
  });

  it('interpreta alta/media/baja como alias sin bloque, sin reescribirlas', () => {
    const board = load();
    expect(resolvePriority(board, 'alta')?.id).toBe('high');
    expect(JSON.stringify(JSON.parse(serializeBoard(board)))).toContain('"alta"');
  });

  it('no aplica alias legacy cuando hay bloque', () => {
    const board = parseBoard(withBlock([{ id: 'high', name: 'High' }]));
    expect(resolvePriority(board, 'alta')).toBeUndefined();
    expect(unknownPriorities(board)).toContain('alta');
  });

  it('carga con prioridad desconocida y la conserva', () => {
    const board = parseBoard(sample.replace('"priority": "alta"', '"priority": "urgent"'));
    expect(unknownPriorities(board)).toEqual(['urgent']);
    expect(serializeBoard(board)).toContain('"urgent"');
  });

  it('round-trip con bloque lo conserva y sin bloque no lo añade', () => {
    const block = [{ id: 'critical', name: 'Critical', color: '#d73a49' }];
    expect(JSON.parse(serializeBoard(parseBoard(withBlock(block)))).priorities).toEqual(block);
    expect('priorities' in JSON.parse(serializeBoard(load()))).toBe(false);
  });

  it('el tablero inicial incluye las prioridades por defecto', () => {
    expect(createInitialBoard('Demo').priorities?.map((p) => p.id)).toEqual(['high', 'medium', 'low']);
  });
});

describe('projects', () => {
  const withProjects = (projects: unknown, taskProject?: string) => {
    const raw = JSON.parse(sample);
    raw.projects = projects;
    if (taskProject !== undefined) raw.columns[0].tasks[0].project = taskProject;
    return JSON.stringify(raw);
  };

  it('acepta un bloque válido y conserva el orden', () => {
    const board = parseBoard(
      withProjects([
        { id: 'portal', name: 'Portal Informes', color: 'blue' },
        { id: 'darwin', name: 'Darwin', color: '#FF8800' },
      ]),
    );
    expect(board.projects?.map((p) => p.id)).toEqual(['portal', 'darwin']);
  });

  it('rechaza ids duplicados y elementos sin nombre', () => {
    expect(() => parseBoard(withProjects([{ id: 'a', name: 'A' }, { id: 'a', name: 'B' }]))).toThrow(/Duplicate project id: a/);
    expect(() => parseBoard(withProjects([{ id: 'a' }]))).toThrow(/projects\[0\]\.name/);
  });

  it('resuelve colores por nombre, hex de 3 y 6 dígitos, e inválidos', () => {
    expect(Object.keys(PROJECT_COLORS)).toHaveLength(16);
    expect(resolveProjectColor('teal')).toBe(PROJECT_COLORS.teal);
    expect(resolveProjectColor('#ff8800')).toBe('#ff8800');
    expect(resolveProjectColor('#F80')).toBe('#F80');
    expect(resolveProjectColor('azulito')).toBeUndefined();
    expect(resolveProjectColor('#ff88')).toBeUndefined();
    expect(resolveProjectColor('toString')).toBeUndefined();
    expect(resolveProjectColor(undefined)).toBeUndefined();
  });

  it('un color inválido no impide la carga y se detecta', () => {
    const board = parseBoard(withProjects([{ id: 'a', name: 'A', color: 'azulito' }]));
    expect(invalidProjectColors(board).map((p) => p.color)).toEqual(['azulito']);
    expect(JSON.parse(serializeBoard(board)).projects[0].color).toBe('azulito');
  });

  it('proyecto desconocido: carga, conserva y avisa', () => {
    const board = parseBoard(withProjects([{ id: 'a', name: 'A' }], 'legacy'));
    expect(unknownProjects(board)).toEqual(['legacy']);
    expect(JSON.parse(serializeBoard(board)).columns[0].tasks[0].project).toBe('legacy');
    expect(unknownProjects(parseBoard(withProjects([{ id: 'a', name: 'A' }], 'a')))).toEqual([]);
  });

  it('round-trip con y sin proyectos', () => {
    const block = [{ id: 'darwin', name: 'Darwin', color: '#FF8800' }];
    const out = JSON.parse(serializeBoard(parseBoard(withProjects(block, 'darwin'))));
    expect(out.projects).toEqual(block);
    expect(out.columns[0].tasks[0].project).toBe('darwin');
    const plain = JSON.parse(serializeBoard(load()));
    expect('projects' in plain).toBe(false);
    expect(JSON.stringify(plain)).not.toContain('"project"');
  });

  it('addProject genera un id único por slug', () => {
    let board = addProject(load(), 'Portal Informes', 'blue');
    board = addProject(board, 'Portal Informes');
    expect(board.projects).toEqual([
      { id: 'portal-informes', name: 'Portal Informes', color: 'blue' },
      { id: 'portal-informes-2', name: 'Portal Informes' },
    ]);
    expect(() => addProject(load(), '  ')).toThrow(BoardError);
  });

  it('updateProject cambia nombre/color y no toca el hex si no se pasa color', () => {
    const board = parseBoard(withProjects([{ id: 'd', name: 'Darwin', color: '#ff8800' }]));
    expect(updateProject(board, 'd', { name: 'Darwin 2' }).projects?.[0]).toEqual({ id: 'd', name: 'Darwin 2', color: '#ff8800' });
    expect(updateProject(board, 'd', { color: 'pink' }).projects?.[0]?.color).toBe('pink');
    expect(updateProject(board, 'd', { color: null }).projects?.[0]).toEqual({ id: 'd', name: 'Darwin' });
    expect(() => updateProject(board, 'x', {})).toThrow(/does not exist/);
  });

  it('updateTask asigna y quita project', () => {
    const id = load().columns[0]!.tasks[0]!.id;
    const withP = updateTask(load(), id, { project: 'portal' });
    expect(withP.columns[0]!.tasks[0]!.project).toBe('portal');
    expect(updateTask(withP, id, { project: null }).columns[0]!.tasks[0]!.project).toBeUndefined();
  });
});
