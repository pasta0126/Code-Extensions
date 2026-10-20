// Webview for kanban.json: Kanban and Raw modes. Talks to the extension host via postMessage.
(function () {
  const vscode = acquireVsCodeApi();
  const app = document.getElementById('app');

  const saved = vscode.getState() || {};
  const s = {
    mode: saved.mode === 'raw' ? 'raw' : 'kanban',
    board: null,
    error: null,
    hostText: '',
    rawDraft: '',
    rawDirty: false,
    conflict: false,
    rawError: null, // validation result for the current draft
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

  function setMode(mode) {
    s.mode = mode;
    vscode.setState({ mode });
    if (mode === 'raw' && !s.rawDirty) {
      s.rawDraft = s.hostText;
      s.rawError = s.error;
    }
    render();
  }

  // ---------- messages from the host ----------
  window.addEventListener('message', (event) => {
    const msg = event.data;
    if (msg.type === 'state') {
      const changed = msg.text !== s.hostText;
      s.hostText = msg.text;
      s.board = msg.board;
      s.error = msg.error;
      if (msg.text === s.rawDraft) {
        s.rawDirty = false;
        s.conflict = false;
        s.rawError = msg.error;
      } else if (!s.rawDirty) {
        s.rawDraft = msg.text;
        s.rawError = msg.error;
      } else if (changed) {
        s.conflict = true;
      }
      render();
    } else if (msg.type === 'validation' && msg.text === s.rawDraft) {
      s.rawError = msg.error;
      updateRawStatus();
    }
  });

  // ---------- rendering ----------
  function render() {
    const active = document.activeElement;
    const keepRaw = active && active.id === 'raw' && s.mode === 'raw' && document.getElementById('raw');
    if (keepRaw) {
      // Don't rebuild the textarea while the user types in it.
      renderToolbarAndBanners();
      updateRawStatus();
      return;
    }
    app.replaceChildren(toolbar(), banners(), s.mode === 'raw' ? rawView() : isEmptyDoc() ? emptyView() : kanbanView());
  }

  function renderToolbarAndBanners() {
    const old = app.querySelectorAll('.toolbar, .banners');
    const [t, b] = [toolbar(), banners()];
    old[0].replaceWith(t);
    old[1].replaceWith(b);
  }

  function toolbar() {
    const tab = (mode, label) =>
      h('button', { class: 'tab' + (s.mode === mode ? ' active' : ''), onclick: () => setMode(mode) }, label);
    return h(
      'div',
      { class: 'toolbar' },
      h('div', { class: 'tabs' }, tab('kanban', 'Kanban'), tab('raw', 'Raw')),
      h('span', { class: 'title' }, s.board ? s.board.board : ''),
      h('button', { class: 'link', onclick: () => post({ type: 'openAsText' }) }, 'Open as text'),
    );
  }

  const isEmptyDoc = () => s.hostText.trim() === '';

  function emptyView() {
    return h(
      'div',
      { class: 'empty-doc' },
      h('p', {}, 'This kanban.json is empty.'),
      h('p', {}, 'Do you want to initialize it with the basic columns (Backlog, In Progress, Done)?'),
      h('button', { onclick: () => post({ type: 'initialize' }) }, 'Initialize board'),
      ' ',
      h('button', { class: 'link', onclick: () => setMode('raw') }, 'Edit in Raw'),
    );
  }

  function banners() {
    const box = h('div', { class: 'banners' });
    if (s.mode === 'kanban' && s.error && !isEmptyDoc()) {
      box.append(
        h(
          'div',
          { class: 'banner error' },
          h('strong', {}, 'Cannot display the board: '),
          s.error,
          ' ',
          h('button', { onclick: () => setMode('raw') }, 'Fix in Raw'),
        ),
      );
    }
    if (s.mode === 'raw' && s.conflict) {
      box.append(
        h(
          'div',
          { class: 'banner warn' },
          'The document changed while you were editing. ',
          h(
            'button',
            {
              onclick: () => {
                s.rawDraft = s.hostText;
                s.rawDirty = false;
                s.conflict = false;
                s.rawError = s.error;
                render();
              },
            },
            'Reload from document',
          ),
        ),
      );
    }
    return box;
  }

  // ---------- Raw ----------
  let validateTimer;
  function rawView() {
    const area = h('textarea', { id: 'raw', spellcheck: 'false', wrap: 'off' });
    area.value = s.rawDraft;
    area.addEventListener('input', () => {
      s.rawDraft = area.value;
      s.rawDirty = s.rawDraft !== s.hostText;
      s.rawError = null;
      clearTimeout(validateTimer);
      validateTimer = setTimeout(() => post({ type: 'validateRaw', text: s.rawDraft }), 200);
      updateRawStatus();
    });
    area.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        document.execCommand('insertText', false, '  ');
      } else if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        applyRaw();
      }
    });
    return h(
      'div',
      { class: 'raw' },
      area,
      h(
        'div',
        { class: 'raw-bar' },
        h('span', { id: 'raw-status' }),
        h('button', { id: 'raw-revert', onclick: revertRaw }, 'Discard'),
        h('button', { id: 'raw-apply', class: 'primary', onclick: applyRaw }, 'Apply'),
      ),
    );
  }

  function updateRawStatus() {
    const status = document.getElementById('raw-status');
    if (!status) return;
    const valid = !s.rawError;
    status.textContent = s.rawError
      ? s.rawError
      : s.rawDirty
        ? 'Valid JSON · unapplied changes'
        : 'No changes';
    status.className = valid ? 'ok' : 'bad';
    document.getElementById('raw-apply').disabled = !s.rawDirty || !valid;
    document.getElementById('raw-revert').disabled = !s.rawDirty;
  }

  function applyRaw() {
    if (s.rawDirty && !s.rawError) post({ type: 'applyRaw', text: s.rawDraft });
  }

  function revertRaw() {
    s.rawDraft = s.hostText;
    s.rawDirty = false;
    s.conflict = false;
    s.rawError = s.error;
    render();
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
    const list = h('div', { class: 'tasks', 'data-column': column.id }, column.tasks.map(cardView));
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
      const index = dropIndex(list, e.clientY);
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
        h('span', { class: 'count' }, column.tasks.length),
        h('button', { class: 'icon', title: 'Delete column', onclick: () => op({ kind: 'deleteColumn', columnId: column.id }) }, '×'),
      ),
      list,
      h('button', { class: 'add-task', onclick: () => taskDialog(null, column.id) }, '+ Add task'),
    );
  }

  function cardView(task) {
    const card = h(
      'article',
      { class: 'card', draggable: 'true', 'data-task': task.id, ondblclick: () => taskDialog(task) },
      h(
        'div',
        { class: 'card-head' },
        h('span', { class: 'id' }, task.id),
        task.priority && h('span', { class: 'prio prio-' + task.priority }, task.priority),
      ),
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
    document.body.append(dlg);
    dlg.showModal();
    input.select();
  }

  function taskDialog(task, columnId) {
    const f = (label, control) => h('label', {}, h('span', {}, label), control);
    const title = h('input', { type: 'text', required: true, value: task ? task.title : '' });
    const description = h('textarea', { rows: '3' });
    description.value = task && task.description ? task.description : '';
    const assignee = h('input', { type: 'text', value: task && task.assignee ? task.assignee : '' });
    const priority = h(
      'select',
      {},
      h('option', { value: '' }, '—'),
      ['alta', 'media', 'baja'].map((p) => h('option', { value: p, selected: task && task.priority === p }, p)),
    );
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
        f('Labels', labels),
        f('Due date', due),
        h(
          'div',
          { class: 'dialog-bar' },
          task && h('button', { class: 'danger', value: 'delete', formnovalidate: true }, 'Delete'),
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
          labels: labels.value.split(',').map((l) => l.trim()).filter(Boolean),
          dueDate: due.value || null,
        };
        if (task) op({ kind: 'updateTask', taskId: task.id, patch: fields });
        else op({ kind: 'addTask', columnId, task: dropNulls(fields) });
      } else if (dlg.returnValue === 'delete') {
        op({ kind: 'deleteTask', taskId: task.id });
      }
      dlg.remove();
    });
    document.body.append(dlg);
    dlg.showModal();
    title.focus();
  }

  function dropNulls(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null));
  }

  render();
  post({ type: 'ready' });
})();
