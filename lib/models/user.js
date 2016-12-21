import bcrypt from 'bcryptjs';
import { DataTypes } from 'sequelize';
import db from '../db';


const salt = bcrypt.genSaltSync(10);


let User = db.define('user', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  mail: { type: DataTypes.STRING, validate: { isEmail: true } },
}, {
  classMethods: {
    associate: ({ Todo }) => {
      User.hasMany(Todo);
    },
  },
  instanceMethods: {
    parse: function () { // eslint-disable-line object-shorthand
      let { id, username, createdAt } = this;
      return { id, username, createdAt };
    },
  },
});


User.register = function *register ({ username, password }) {
  let user = yield User.findOne({ where: { username } });

  if (!user) {
    return User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
  } else {
    if (bcrypt.compareSync(password, user.password)) {
      return user;
    } else {
      throw new Error('Username already registered.');
    }
  }
};

User.login = function *login ({ username, password }) {
  let user = yield User.findOne({ where: { username } });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Error('Error credentials.');
  }
  return user;
};

export default User;
