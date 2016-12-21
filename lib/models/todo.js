
const textValidator = function (text) {
  if (text && text.match(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/)) {
    throw new Error('Text not valid.');
  }
};

import { DataTypes } from 'sequelize';
import db from '../db';


let Todo = db.define('todo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  text: {
    type: DataTypes.STRING,
    validate: { textValidator },
  },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  classMethods: {
    associate: ({ User }) => {
      Todo.belongsTo(User);
    },
  },
});

export default Todo;
