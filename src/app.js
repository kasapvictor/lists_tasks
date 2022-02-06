const ucFirst = (str) => {
  if (!str) return str;

  return str[0].toUpperCase() + str.slice(1);
};

const listHandler = (e, state, render) => {
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

  // eslint-disable-next-line no-param-reassign
  state.uiState.activeListId = idListItem;
  render(state);

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

  if (!itemsHtml) return false;

  ul.innerHTML = itemsHtml;

  if (activeId) {
    const id = activeId - 1;
    const list = ul.querySelectorAll('li');
    const contentLi = [...list][id].textContent;
    list[id].innerHTML = `<b>${contentLi}</b>`;
  }

  return ul;
};

const render = (state) => {
  const { activeListId } = state.uiState;

  // LISTS
  const wrapLists = document.querySelector('[data-container="lists"]');
  const listsList = state.lists.map((item) => item.name);
  const listsListHtml = templateList('lists', listsList, activeListId);

  wrapLists.innerHTML = '';
  wrapLists.append(listsListHtml);
  listsListHtml.addEventListener('click', (e) => listHandler(e, state, render));

  // TASKS
  const wrapTasks = document.querySelector('[data-container="tasks"]');
  const tasksList = state.tasks
    .filter((task) => task.listId === activeListId)
    .map((task) => task.name);
  const tasksListHtml = templateList('tasks', tasksList);

  wrapTasks.innerHTML = '';
  if (tasksListHtml) {
    wrapTasks.append(tasksListHtml);
  }
};

const formHandler = (e, form, state) => {
  e.preventDefault();

  const { container } = form.dataset;
  const isList = container.includes('list');
  const type = isList ? 'lists' : 'tasks';

  const formData = new FormData(form);
  const name = formData.get('name');

  if (isList) {
    const id = state.lists.length + 1;
    // eslint-disable-next-line no-param-reassign
    state[type] = [...state[type], {
      id,
      name,
    }];
  }

  if (!isList) {
    const listId = state.uiState.activeListId;
    // eslint-disable-next-line no-param-reassign
    state[type] = [...state.tasks, {
      listId,
      name,
    }];
  }

  form.reset();
  render(state);
};

const app = () => {
  const state = {
    lists: [
      {
        id: 1,
        name: 'General',
      },
    ],
    tasks: [],
    uiState: {
      activeListId: 1,
    },
  };

  const forms = document.querySelectorAll('form');

  forms.forEach((form) => form.addEventListener('submit',
    (e) => formHandler(e, form, state)));

  render(state);
};

export default app;
