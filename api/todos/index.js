import promisify from 'es6-promisify';

import User from '../../lib/models/user';
import Todo from '../../lib/models/todo';

/**
 * This file illustrates how you may map
 * single routes using an exported object
 */

function *all () {
  const { user } = this.session;

  const getUserById = promisify(User.getById, User);
  const sessionUser = yield getUserById(user.id);

  const findAll = promisify(Todo.find, Todo);
  const todos = yield findAll({ user: sessionUser }, { load: ['user'] });

  let parsedTodos = todos.map(Todo.parse);
  this.body = parsedTodos;
}

function *create () {
  const { user } = this.session;
  const { text } = this.request.body;

  const getUserById = promisify(User.getById, User);
  const sessionUser = yield getUserById(user.id);

  let todoItem = new Todo({ text, user: sessionUser });
  const save = promisify(todoItem.save, todoItem);
  yield save();

  this.body = Todo.parse(todoItem);
}

function *findTodo () {
  const getById = promisify(Todo.getById, Todo);
  let todo = yield getById(this.params.id, { load: ['user'] });

  this.body = Todo.parse(todo);
}

function *updateTodo () {
  const { user } = this.session;
  let keys = ['text', 'completed'];

  const getUserById = promisify(User.getById, User);
  const sessionUser = yield getUserById(user.id);

  const findAll = promisify(Todo.find, Todo);
  const todo = (yield findAll({ _id: this.params.id, user: sessionUser }, { load: ['user'] }))[0];

  if (!todo) {
    throw new Error('Todo not found');
  }

  for (let i = 0; i < keys.length; i++) {
    if (this.request.body[keys[i]]) {
      todo[keys[i]] = this.request.body[keys[i]];
    }
  }

  const save = promisify(todo.save, todo);
  yield save();

  this.body = Todo.parse(todo);
}

function *deleteTodo () {
  const getById = promisify(Todo.getById, Todo);
  let todo = yield getById(this.params.id);

  const remove = promisify(todo.remove, todo);
  yield remove();

  this.body = { msg: 'ok' };
}

const API = {
  'GET /todos': all,
  'POST /todos': create,
  'GET /todos/:id': findTodo,
  'PUT /todos/:id': updateTodo,
  'POST /todos/:id': deleteTodo,
};

export default API;
