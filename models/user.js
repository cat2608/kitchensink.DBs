import ottoman from 'ottoman';
import promisify from 'es6-promisify';
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

let User = ottoman.model('User', {
  username: 'string',
  password: 'string',
  createdAt: { type: 'Date', default: new Date() },
});

User.register = function *register ({ username, password }) {
  const find = promisify(User.find, User);
  const users = yield find({ username });

  if (!users.length) {
    let user = new User({ username, password: bcrypt.hashSync(password, salt) });
    const save = promisify(user.save, user);
    yield save();
    return user;
  } else {
    if (bcrypt.compareSync(password, users[0].password)) {
      return users[0];
    } else {
      throw new Error('Username already registered.');
    }
  }
};

User.login = function *login ({ username, password }) {
  const find = promisify(User.find, User);
  const users = yield find({ username });

  if (!users.length || !bcrypt.compareSync(password, users[0].password)) {
    throw new Error('Error credentials.');
  }
  return users[0];
};

User.parse = function parse (model) {
  let { _id: id, username, createdAt } = model;
  return { id, username, createdAt };
};

export default User;
