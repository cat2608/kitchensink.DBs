import { User } from '../../lib/models';

function *getDetails () {
  const { user } = this.session;
  let userDetails = yield User.findById(user.id);

  this.body = userDetails.parse();
}

function *updateUser () {
  const { user } = this.session;
  const keys = ['twitter', 'github'];

  let userDetails = yield User.findById(user.id);
  userDetails.mail = this.request.body.mail;

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
  }, userDetails.accounts);

  userDetails.accounts = accounts;
  yield userDetails.save();
  this.body = userDetails.parse();
}


const API = {
  'GET /user': getDetails,
  'POST /user': updateUser,
};

export default API;

