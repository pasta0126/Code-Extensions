import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseBoard, serializeBoard } from '../src/board/json';
import { BoardError } from '../src/board/model';
import {
  addColumn,
  addTask,
  deleteColumn,
  deleteTask,
  moveTask,
  renameColumn,
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

  it('rechaza prioridad desconocida indicando tarea y valor', () => {
    const bad = sample.replace('"priority": "alta"', '"priority": "urgente"');
    expect(() => parseBoard(bad)).toThrow(/urgente/);
  });

  it('rechaza ids de tarea duplicados entre columnas', () => {
    const bad = sample.replace('"TASK-105"', '"TASK-101"');
    expect(() => parseBoard(bad)).toThrow(/duplicado: TASK-101/);
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
