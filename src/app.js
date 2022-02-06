// @ts-check

const state = {
  lists: [
    {
      id: 1,
      name: 'General',
    },
    {
      id: 2,
      name: 'General2',
    },
  ],
  tasks: [
    {
      listId: 1,
      name: 'Task1',
    },
    {
      listId: 1,
      name: 'Task2',
    },
    {
      listId: 2,
      name: 'Task12',
    },
    {
      listId: 2,
      name: 'Task22',
    },
  ],
  uiState: {
    activeListId: 1,
  },
};

const ucFirst = (str) => {
  if (!str) return str;

  return str[0].toUpperCase() + str.slice(1);
};

const listHandler = (e, render) => {
  const el = e.target;
  const tag = el.tagName;

  if (tag !== 'A') {
    return false;
  }

  const name = el.hash
    .replace('#', '')
    .split('_')
    .map((item) => ucFirst(item))
    .join(' ');

  const listItem = state.lists.filter((item) => item.name === name);
  const idListItem = listItem[0].id;

  state.uiState.activeListId = idListItem;
  render();

  return true;
};

const templateListItem = (name, link = false) => {
  const hash = name.replace(' ', '_')
    .toLowerCase();
  const content = link ? `<a href='#${hash}'>${name}</a>` : name;
  return `<li>${content}</li>`;
};

const templateList = (type, items, activeId = null) => {
  const isLists = type === 'lists';
  const ul = document.createElement('ul');
  const itemsHtml = items.map((name) => templateListItem(name, isLists))
    .join('');

  ul.innerHTML = itemsHtml;

  if (activeId) {
    const id = activeId - 1;
    const list = ul.querySelectorAll('li');
    const contentLi = [...list][id].textContent;
    list[id].innerHTML = `<b>${contentLi}</b>`;
  }

  return ul;
};

const render = () => {
  const { activeListId } = state.uiState;

  // LISTS
  const wrapLists = document.querySelector('[data-container="lists"]');
  const listsList = state.lists.map((item) => item.name);
  const listsListHtml = templateList('lists', listsList, activeListId);

  wrapLists.innerHTML = '';
  wrapLists.append(listsListHtml);
  listsListHtml.addEventListener('click', (e) => listHandler(e, render));

  // TASKS
  const wrapTasks = document.querySelector('[data-container="tasks"]');
  const tasksList = state.tasks
    .filter((task) => task.listId === activeListId)
    .map((task) => task.name);
  const tasksListHtml = templateList('tasks', tasksList);

  wrapTasks.innerHTML = '';
  wrapTasks.append(tasksListHtml);
};

const formHandler = (e, form) => {
  e.preventDefault();

  const { container } = form.dataset;
  const isList = container.includes('list');
  const type = isList ? 'lists' : 'tasks';

  const formData = new FormData(form);
  const name = formData.get('name');

  if (isList) {
    const id = state.lists.length + 1;
    state[type] = [...state[type], {
      id,
      name,
    }];
  }

  if (!isList) {
    const listId = state.uiState.activeListId;
    state.tasks = [...state.tasks, {
      listId,
      name,
    }];
  }

  form.reset();
  render();
};

const app = () => {
  const forms = document.querySelectorAll('form');

  forms.forEach((form) => form.addEventListener('submit',
    (e) => formHandler(e, form, state)));

  render();
};

export default app;
