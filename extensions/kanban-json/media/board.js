// Webview for kanban.json: Kanban board. Talks to the extension host via postMessage.
(function () {
  const vscode = acquireVsCodeApi();
  const app = document.getElementById('app');

  const s = {
    board: null,
    priorities: [],
    priorityAliases: {},
    projects: [],
    projectPalette: {},
    projectFilter: '', // view-only: '' = all, NO_PROJECT = tasks without project, or a project id
    onProjects: null,
    error: null,
    hostText: '',
  };

  const post = (msg) => vscode.postMessage(msg);
  const op = (o) => post({ type: 'op', op: o });

  /** Tiny DOM helper; text always goes through textContent (never innerHTML). */
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === 'class') el.className = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (v === true) el.setAttribute(k, '');
      else if (v !== false && v != null) el.setAttribute(k, v);
    }
    for (const c of children.flat()) {
      if (c == null || c === false) continue;
      el.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return el;
  }

  // ---------- messages from the host ----------
  window.addEventListener('message', (event) => {
    const msg = event.data;
    if (msg.type === 'state') {
      s.hostText = msg.text;
      s.board = msg.board;
      s.priorities = msg.priorities || [];
      s.priorityAliases = msg.priorityAliases || {};
      s.projects = msg.projects || [];
      s.projectPalette = msg.projectPalette || {};
      s.error = msg.error;
      if (!filterStillValid()) s.projectFilter = '';
      render();
      if (s.onProjects) s.onProjects();
    }
  });

  // ---------- priorities ----------
  /** Defined priority for a stored id (legacy aliases apply only without a priorities block), or undefined. */
  function resolvePriority(id) {
    const key = s.priorityAliases[id] || id;
    return s.priorities.find((p) => p.id === key);
  }

  function priorityBadge(id) {
    const p = resolvePriority(id);
    const badge = h('span', { class: 'prio ' + (p ? 'prio-' + p.id : 'prio-unknown') }, p ? p.name : id);
    if (p && p.color) {
      badge.classList.add('prio-colored');
      badge.style.setProperty('--prio-color', p.color);
    }
    return badge;
  }

  function priorityOptions(task) {
    const current = task && task.priority ? task.priority : '';
    const known = current ? resolvePriority(current) : undefined;
    const selectedId = known ? known.id : current;
    const options = s.priorities.map((p) => h('option', { value: p.id, selected: selectedId === p.id }, p.name));
    if (current && !known) options.push(h('option', { value: current, selected: true }, current));
    return options;
  }

  // ---------- projects ----------
  const SAFE_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
  const findProject = (id) => s.projects.find((p) => p.id === id);
  const NO_PROJECT = '__none__';
  /** Projects in alphabetical order (case/accent-insensitive); never mutates the board's own order. */
  const sortedProjects = () => [...s.projects].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  const matchesFilter = (task) => (s.projectFilter === '' ? true : s.projectFilter === NO_PROJECT ? !task.project : task.project === s.projectFilter);
  function filterStillValid() {
    const f = s.projectFilter;
    if (f === '' || f === NO_PROJECT) return true;
    if (s.projects.some((p) => p.id === f)) return true;
    return !!s.board && s.board.columns.some((c) => c.tasks.some((t) => t.project === f));
  }
  /**
   * Maps a drop position among the visible cards (dragged one excluded) to an index in the
   * column's full task list (dragged one excluded), so hidden tasks keep their relative order.
   */
  function visibleToRealIndex(column, draggedId, visibleIndex) {
    const real = column.tasks.filter((t) => t.id !== draggedId);
    const visible = real.filter(matchesFilter);
    if (visibleIndex < visible.length) return real.indexOf(visible[visibleIndex]);
    if (visible.length === 0) return real.length;
    return real.indexOf(visible[visible.length - 1]) + 1;
  }

  // ---------- rendering ----------
  function render() {
    app.replaceChildren(toolbar(), banners(), isEmptyDoc() ? emptyView() : kanbanView());
  }

  function toolbar() {
    return h(
      'div',
      { class: 'toolbar' },
      h('span', { class: 'title' }, s.board ? s.board.board : ''),
      s.board && filterSelect(),
      h('button', { class: 'link', onclick: openAsText }, 'Open as text'),
    );
  }

  function filterSelect() {
    const sel = h(
      'select',
      { class: 'project-filter', title: 'Filter by project', 'aria-label': 'Filter by project' },
      h('option', { value: '' }, 'All projects'),
      h('option', { value: NO_PROJECT }, 'No project'),
      sortedProjects().map((p) => h('option', { value: p.id }, p.name)),
    );
    // a project used by tasks but not defined stays selectable while it is the active filter
    if (s.projectFilter && s.projectFilter !== NO_PROJECT && !findProject(s.projectFilter)) sel.append(h('option', { value: s.projectFilter }, s.projectFilter));
    sel.value = s.projectFilter;
    sel.addEventListener('change', () => {
      s.projectFilter = sel.value;
      render();
    });
    return sel;
  }

  const openAsText = () => post({ type: 'openAsText' });
  const isEmptyDoc = () => s.hostText.trim() === '';

  function emptyView() {
    return h(
      'div',
      { class: 'empty-doc' },
      h('p', {}, 'This kanban.json is empty.'),
      h('p', {}, 'Do you want to initialize it with the basic columns (Backlog, In Progress, Done)?'),
      h('button', { onclick: () => post({ type: 'initialize' }) }, 'Initialize board'),
      ' ',
      h('button', { class: 'link', onclick: openAsText }, 'Open as text'),
    );
  }

  function banners() {
    const box = h('div', { class: 'banners' });
    if (s.error && !isEmptyDoc()) {
      box.append(
        h(
          'div',
          { class: 'banner error' },
          h('strong', {}, 'Cannot display the board: '),
          s.error,
          ' ',
          h('button', { onclick: openAsText }, 'Open as text'),
        ),
      );
    }
    return box;
  }

  // ---------- Kanban ----------
  function kanbanView() {
    if (!s.board) return h('div', { class: 'empty' }, 'No valid board.');
    return h(
      'div',
      { class: 'columns' },
      s.board.columns.map(columnView),
      h(
        'div',
        { class: 'column add-column' },
        h('button', { class: 'primary', onclick: () => askText('New column', '', (name) => op({ kind: 'addColumn', name })) }, '+ Add column'),
      ),
    );
  }

  function columnView(column) {
    const list = h('div', { class: 'tasks', 'data-column': column.id }, column.tasks.filter(matchesFilter).map(cardView));
    list.addEventListener('dragover', (e) => {
      e.preventDefault();
      list.classList.add('over');
      showDropMarker(list, e.clientY);
    });
    list.addEventListener('dragleave', (e) => {
      if (!list.contains(e.relatedTarget)) clearDropMarker();
    });
    list.addEventListener('drop', (e) => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData('text/plain');
      const index = visibleToRealIndex(column, taskId, dropIndex(list, e.clientY));
      clearDropMarker();
      if (taskId) op({ kind: 'moveTask', taskId, toColumnId: column.id, toIndex: index });
    });

    return h(
      'section',
      { class: 'column' },
      h(
        'header',
        {},
        h(
          'h2',
          { title: 'Double-click to rename', ondblclick: () => askText('Rename column', column.name, (name) => op({ kind: 'renameColumn', columnId: column.id, name })) },
          column.name,
        ),
        h('span', { class: 'count' }, s.projectFilter === '' ? column.tasks.length : column.tasks.filter(matchesFilter).length + '/' + column.tasks.length),
        h('button', { class: 'icon', title: 'Delete column', onclick: () => op({ kind: 'deleteColumn', columnId: column.id }) }, '×'),
      ),
      list,
      h('button', { class: 'add-task', onclick: () => taskDialog(null, column.id, s.projectFilter && s.projectFilter !== NO_PROJECT ? s.projectFilter : '') }, '+ Add task'),
    );
  }

  function cardView(task) {
    const project = task.project ? findProject(task.project) : undefined;
    const card = h(
      'article',
      { class: 'card' + (project && project.color ? ' has-project' : ''), draggable: 'true', title: 'Click to edit', 'data-task': task.id, onclick: () => taskDialog(task) },
      h(
        'div',
        { class: 'card-head' },
        h('span', { class: 'id' }, task.id),
        task.priority && priorityBadge(task.priority),
      ),
      task.project && h('div', { class: 'project-name', title: 'Project' }, project ? project.name : task.project),
      h('div', { class: 'card-title' }, task.title),
      task.description && h('div', { class: 'card-desc' }, task.description),
      task.labels && task.labels.length > 0 && h('div', { class: 'labels' }, task.labels.map((l) => h('span', { class: 'label' }, l))),
      h(
        'div',
        { class: 'card-foot' },
        h('span', {}, task.assignee || ''),
        task.dueDate && h('span', { class: 'due' + (isOverdue(task, s.board) ? ' overdue' : '') }, '📅 ' + task.dueDate),
      ),
    );
    if (project && project.color && SAFE_COLOR.test(project.color)) card.style.setProperty('--project-color', project.color);
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', task.id);
      e.dataTransfer.effectAllowed = 'move';
      requestAnimationFrame(() => card.classList.add('dragging'));
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      clearDropMarker();
    });
    return card;
  }

  function isOverdue(task, board) {
    const done = board.columns.find((c) => c.id === 'done');
    if (done && done.tasks.some((t) => t.id === task.id)) return false;
    return task.dueDate < new Date().toISOString().slice(0, 10);
  }

  // Drag & drop helpers: index is computed among cards other than the dragged one.
  function otherCards(list) {
    return [...list.querySelectorAll('.card:not(.dragging)')];
  }
  function dropIndex(list, y) {
    return otherCards(list).filter((c) => {
      const r = c.getBoundingClientRect();
      return y > r.top + r.height / 2;
    }).length;
  }
  function showDropMarker(list, y) {
    clearDropMarker(list);
    const cards = otherCards(list);
    const index = dropIndex(list, y);
    const marker = h('div', { class: 'drop-marker' });
    if (index >= cards.length) list.append(marker);
    else list.insertBefore(marker, cards[index]);
  }
  function clearDropMarker(keepOver) {
    document.querySelectorAll('.drop-marker').forEach((m) => m.remove());
    if (!keepOver) document.querySelectorAll('.tasks.over').forEach((l) => l.classList.remove('over'));
  }

  // ---------- dialogs (window.prompt/confirm are unavailable in webviews) ----------
  /** Click on the backdrop closes like Cancel; a drag that starts inside and ends outside does not. */
  function dismissOnOutsideClick(dlg) {
    const outside = (e) => {
      if (e.target !== dlg) return false;
      const r = dlg.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    let pressedOutside = false;
    dlg.addEventListener('mousedown', (e) => {
      pressedOutside = outside(e);
    });
    dlg.addEventListener('click', (e) => {
      if (pressedOutside && outside(e)) dlg.close('cancel');
      pressedOutside = false;
    });
  }

  /** Single entry point for every webview dialog, so all of them close on an outside click. */
  function openDialog(dlg) {
    dismissOnOutsideClick(dlg);
    document.body.append(dlg);
    dlg.showModal();
  }

  function askText(title, value, onOk) {
    const input = h('input', { type: 'text', value, required: true });
    const dlg = h(
      'dialog',
      {},
      h(
        'form',
        { method: 'dialog' },
        h('h3', {}, title),
        input,
        h('div', { class: 'dialog-bar' }, h('button', { value: 'cancel', formnovalidate: true }, 'Cancel'), h('button', { class: 'primary', value: 'ok' }, 'OK')),
      ),
    );
    dlg.addEventListener('close', () => {
      if (dlg.returnValue === 'ok' && input.value.trim()) onOk(input.value.trim());
      dlg.remove();
    });
    openDialog(dlg);
    input.select();
  }

  function taskDialog(task, columnId, defaultProject) {
    const f = (label, control) => h('label', {}, h('span', {}, label), control);
    const title = h('input', { type: 'text', required: true, value: task ? task.title : '' });
    const description = h('textarea', { rows: '3' });
    description.value = task && task.description ? task.description : '';
    const assignee = h('input', { type: 'text', value: task && task.assignee ? task.assignee : '' });
    const priority = h(
      'select',
      {},
      h('option', { value: '' }, '—'),
      priorityOptions(task),
    );
    const NEW_PROJECT = '__new__';
    let currentProject = task ? task.project || '' : defaultProject || '';
    let pendingNew = null;
    const project = h('select', {});
    const editProject = h('button', { type: 'button', class: 'icon', title: 'Edit project' }, '✎');
    const fillProjects = () => {
      project.replaceChildren(h('option', { value: '' }, '—'));
      for (const p of sortedProjects()) project.append(h('option', { value: p.id }, p.name));
      // keep an unknown stored id selectable so saving does not drop it
      if (currentProject && !findProject(currentProject)) project.append(h('option', { value: currentProject }, currentProject));
      project.append(h('option', { value: NEW_PROJECT }, 'New project…'));
      project.value = currentProject;
      editProject.disabled = !findProject(currentProject);
    };
    s.onProjects = () => {
      if (pendingNew) {
        const created = s.projects.find((p) => !pendingNew.has(p.id));
        if (created) {
          currentProject = created.id;
          pendingNew = null;
        }
      }
      fillProjects();
    };
    fillProjects();
    project.addEventListener('change', () => {
      if (project.value !== NEW_PROJECT) {
        currentProject = project.value;
        editProject.disabled = !findProject(currentProject);
        return;
      }
      project.value = currentProject;
      projectDialog(null, () => {
        pendingNew = new Set(s.projects.map((p) => p.id));
      });
    });
    editProject.addEventListener('click', () => {
      const p = findProject(currentProject);
      if (p) projectDialog(p);
    });
    const labels = h('input', { type: 'text', placeholder: 'comma-separated', value: task && task.labels ? task.labels.join(', ') : '' });
    const due = h('input', { type: 'date', value: task && task.dueDate ? task.dueDate : '' });

    const dlg = h(
      'dialog',
      {},
      h(
        'form',
        { method: 'dialog' },
        h('h3', {}, task ? 'Edit ' + task.id : 'New task'),
        f('Title', title),
        f('Description', description),
        f('Assignee', assignee),
        f('Priority', priority),
        f('Project', h('div', { class: 'project-row' }, project, editProject)),
        f('Labels', labels),
        f('Due date', due),
        h(
          'div',
          { class: 'dialog-bar' },
          task && h('button', { type: 'button', class: 'danger', onclick: () => dlg.close('delete') }, 'Delete'),
          h('span', { class: 'spacer' }),
          h('button', { value: 'cancel', formnovalidate: true }, 'Cancel'),
          h('button', { class: 'primary', value: 'ok' }, 'Save'),
        ),
      ),
    );
    dlg.addEventListener('close', () => {
      if (dlg.returnValue === 'ok') {
        const fields = {
          title: title.value.trim(),
          description: description.value.trim() || null,
          assignee: assignee.value.trim() || null,
          priority: priority.value || null,
          project: currentProject || null,
          labels: labels.value.split(',').map((l) => l.trim()).filter(Boolean),
          dueDate: due.value || null,
        };
        if (task) op({ kind: 'updateTask', taskId: task.id, patch: fields });
        else op({ kind: 'addTask', columnId, task: dropNulls(fields) });
      } else if (dlg.returnValue === 'delete') {
        op({ kind: 'deleteTask', taskId: task.id });
      }
      s.onProjects = null;
      dlg.remove();
    });
    openDialog(dlg);
    title.focus();
  }

  /** Create (project == null) or edit a project: name + 16-swatch grid, no free color picker. */
  function projectDialog(project, onCreate) {
    const name = h('input', { type: 'text', required: true, value: project ? project.name : '' });
    let chosen; // undefined = untouched (keeps a hand-written hex)
    let selected = project && project.paletteName ? project.paletteName : undefined;
    const grid = h('div', { class: 'swatches', role: 'radiogroup', 'aria-label': 'Color' });
    const paint = () => {
      for (const b of grid.children) b.setAttribute('aria-checked', String(b.dataset.color === selected));
    };
    for (const [colorName, hex] of Object.entries(s.projectPalette)) {
      const b = h('button', { type: 'button', class: 'swatch', role: 'radio', title: colorName, 'data-color': colorName });
      b.style.setProperty('--swatch', hex);
      b.addEventListener('click', () => {
        selected = chosen = colorName;
        paint();
      });
      grid.append(b);
    }
    paint();
    const dlg = h(
      'dialog',
      {},
      h(
        'form',
        { method: 'dialog' },
        h('h3', {}, project ? 'Edit project' : 'New project'),
        h('label', {}, h('span', {}, 'Name'), name),
        h('div', { class: 'field' }, h('span', {}, 'Color'), grid),
        h('div', { class: 'dialog-bar' }, h('button', { value: 'cancel', formnovalidate: true }, 'Cancel'), h('button', { class: 'primary', value: 'ok' }, 'Save')),
      ),
    );
    dlg.addEventListener('close', () => {
      if (dlg.returnValue === 'ok' && name.value.trim()) {
        if (project) op({ kind: 'updateProject', projectId: project.id, name: name.value.trim(), color: chosen });
        else {
          if (onCreate) onCreate();
          op({ kind: 'addProject', name: name.value.trim(), color: chosen });
        }
      }
      dlg.remove();
    });
    openDialog(dlg);
    name.select();
  }

  function dropNulls(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null));
  }

  render();
  post({ type: 'ready' });
})();
