import { User } from '../../lib/models';

function *getUserDetails () {
  const { id } = this.params;
  const userSession = yield User.findById(id);
  this.body = userSession.parse();
}

function *all () {
  const users = yield User.findAll({});
  this.body = JSON.parse(JSON.stringify(users));
}

function *updateUser () {
  const { user } = this.session;
  const keys = ['twitter', 'github'];

  let userSession = yield User.findById(user.id);
  userSession.mail = this.request.body.mail;

  const accounts = keys.reduce((userAccounts, key) => {
    if (this.request.body[key]) {
      let index = userAccounts.findIndex(account => {
        for (let k in account) {
          return k === key;
        }
      });

      userAccounts.splice(index, 1);
      userAccounts.push({ [key]: this.request.body[key] });
    }
    return userAccounts;
  }, userSession.accounts);

  userSession.accounts = accounts;
  yield userSession.save();
  this.body = userSession.parse();
}


const API = {
  'GET /users/:id': getUserDetails,
  'GET /users': all,
  'POST /users': updateUser,
};

export default API;
