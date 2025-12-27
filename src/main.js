import './style.css'

// --- State Management ---
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// --- DOM Elements ---
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const dateDisplay = document.getElementById('date-display');
const taskCount = document.getElementById('task-count');
const clearCompletedBtn = document.getElementById('clear-completed');

// --- Initialization ---
function init() {
  renderDate();
  renderTodos();
  setupEventListeners();
}

// --- Functions ---
function renderDate() {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date();
  dateDisplay.textContent = today.toLocaleDateString('ja-JP', options);
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function updateStats() {
  const count = todos.filter(t => !t.completed).length;
  taskCount.textContent = `${count} ${count === 1 ? 'task' : 'tasks'} left`;
}

function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
  li.dataset.id = todo.id;

  li.innerHTML = `
    <div class="checkbox ${todo.completed ? 'checked' : ''}"></div>
    <span class="todo-text">${escapeHtml(todo.text)}</span>
    <button class="delete-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
    </button>
  `;

  // Event Listeners for the item
  li.querySelector('.checkbox').addEventListener('click', () => toggleTodo(todo.id));
  li.querySelector('.todo-text').addEventListener('click', () => toggleTodo(todo.id));
  li.querySelector('.delete-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    removeTodo(todo.id, li);
  });

  return li;
}

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach(todo => {
    todoList.appendChild(createTodoElement(todo));
  });
  updateStats();
}

function addTodo(text) {
  const newTodo = {
    id: Date.now().toString(),
    text: text,
    completed: false
  };
  todos.unshift(newTodo);
  saveTodos();
  
  const element = createTodoElement(newTodo);
  todoList.prepend(element);
  updateStats();
}

function toggleTodo(id) {
  todos = todos.map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  renderTodos();
}

function removeTodo(id, element) {
  element.classList.add('removing');
  element.addEventListener('animationend', () => {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    element.remove();
    updateStats();
  }, { once: true });
}

function clearCompleted() {
  todos = todos.filter(todo => !todo.completed);
  saveTodos();
  renderTodos();
}

function setupEventListeners() {
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
      addTodo(text);
      todoInput.value = '';
    }
  });

  clearCompletedBtn.addEventListener('click', clearCompleted);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Start the app
init();
