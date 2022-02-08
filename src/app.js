import _ from 'lodash';

const listHandler = (e, state, renderLists, renderTasks) => {
  const el = e.target;
  const tag = el.tagName;

  if (tag !== 'A') {
    return false;
  }

  const name = el.hash
    .replace('#', '')
    .split('_')
    .map((item) => item.toLowerCase())
    .join(' ');

  const listItem = state.lists.filter(
    (item) => decodeURI(item.name.toLowerCase()) === decodeURI(name),
  );
  const idListItem = listItem[0].id;

  // eslint-disable-next-line no-param-reassign
  state.uiState.activeListId = idListItem;
  renderLists(state);
  renderTasks(state);

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

const renderTasks = (state) => {
  const { activeListId } = state.uiState;

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

const renderLists = (state) => {
  const { activeListId } = state.uiState;

  const wrapLists = document.querySelector('[data-container="lists"]');
  const listsList = state.lists.map((item) => item.name);
  const listsListHtml = templateList('lists', listsList, activeListId);

  wrapLists.innerHTML = '';
  wrapLists.append(listsListHtml);
  listsListHtml.addEventListener(
    'click',
    (e) => listHandler(e, state, renderLists, renderTasks),
  );
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
    const isExist = state.lists.find((item) => item.name === name);

    if (isExist) return;

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
  renderLists(state);
  renderTasks(state);
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

  renderLists(state);
  renderTasks(state);
};

export default app;
