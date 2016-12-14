import ottoman from 'ottoman';
import User from './user';

ottoman.ensureIndices(function(){});


function textValidator (text) {
  let textRegx = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/;
  if (text && text.match(textRegx)) {
    throw new Error('Text not valid.');
  }
}

let Todo = ottoman.model('Todo', {
  user: { ref: 'User' },
  text: { type: 'string', validator: textValidator },
  completed: { type: 'boolean', default: false },
  createdAt: { type: 'Date', default: new Date() },
}, {
  index: {
    findByState: {
      by: 'completed',
    },

  },
});

Todo.parse = function parse (model) {
  let { _id: id, user, text, completed, createdAt } = model;
  return { id, user: User.parse(user), text, completed, createdAt };
};


export default Todo;

