import { Todo, User } from '../../lib/models';

// /**
//  * This file illustrates how you may map
//  * single routes using an exported object
//  */

const validUUID = function (uuid) {
  return uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
};

function *findTodo () {
  if (!validUUID(this.params.id)) {
    throw new Error('Todo id not valid.');
  }

  const todo = yield Todo.findById(this.params.id, {
    include: [{ model: User, attributes: [ 'id', 'username' ] }],
  });

  if (!todo) {
    return this.body = {};
  }

  const { userId, ...todoParsed } = todo.get({ plain: true }); // eslint-disable-line no-unused-vars
  this.body = todoParsed;
}

function *all () {
  const { user } = this.session;
  const todos = yield Todo.findAll({
    order: [['createdAt', 'DESC']],
    where: { userId: user.id },
    include: [User],
  });

  this.body = todos.map(todo => {
    return {
      ...JSON.parse(JSON.stringify(todo, ['id', 'text', 'completed', 'createdAt'])),
      user: todo.user.parse(),
    };
  });
}

function *create () {
  const { user } = this.session;
  const { text } = this.request.body;

  const todoItem = yield Todo.create({ text, userId: user.id });
  this.body = todoItem.get({ plain: true });
}

function *updateTodo () {
  const { user } = this.session;
  const keys = ['text', 'completed'];

  if (!validUUID(this.params.id)) {
    throw new Error('Todo id not valid.');
  }

  let todo = yield Todo.findOne({ where: { id: this.params.id, userId: user.id } });

  if (!todo) {
    throw new Error('Todo not found');
  }

  for (let i = 0; i < keys.length; i++) {
    if (this.request.body[keys[i]]) {
      todo[keys[i]] = this.request.body[keys[i]];
    }
  }

  yield todo.save();
  this.body = { msg: 'ok' };
}

function *deleteTodo () {
  const { user } = this.session;

  if (!validUUID(this.params.id)) {
    throw new Error('Todo id not valid.');
  }

  const todo = yield Todo.findOne({ where: { id: this.params.id, userId: user.id } });

  if (!todo) {
    throw new Error('Todo not found.');
  }

  yield todo.destroy();
  this.body = { msg: 'ok' };
}

const API = {
  'GET /todos/:id': findTodo,
  'GET /todos': all,
  'POST /todos': create,
  'PUT /todos/:id': updateTodo,
  'POST /todos/:id': deleteTodo,
};

export default API;
