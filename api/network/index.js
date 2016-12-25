import { User } from '../../lib/models';
import { Utils } from 'sequelize';


function *follow () {
  const { user } = this.session;
  const { id } = this.request.body;

  let userSession = yield User.findById(user.id);

  userSession.followers.push(id);
  userSession.followers = Utils._.uniq(userSession.followers);

  // https://github.com/sequelize/sequelize/issues/6197#issuecomment-230154948
  userSession.changed('followers', true);
  yield userSession.save();

  this.body = userSession.get({ plain: true });
}


const API = {
  'POST /follow': follow,
};

export default API;
