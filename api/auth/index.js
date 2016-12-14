import User from '../../models/user';

function *signup () {
  let { username, password } = this.request.body;
  let user = yield User.register({ username, password });
  let parsedUser = User.parse(user);

  this.session.user = parsedUser;
  this.body = parsedUser;
}

function *login () {
  let { username, password } = this.request.body;
  let user = yield User.login({ username, password });
  let parsedUser = User.parse(user);

  this.session.user = parsedUser;
  this.body = parsedUser;
}

const API = {
  'POST /signup': signup,
  'POST /login': login,
};

export default API;

