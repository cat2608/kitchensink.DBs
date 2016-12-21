
import User from './user';
import Todo from './todo';


export function associateAndSync (db) {
  let models = { User, Todo };

  for (let m in models) {
    if (models[m].associate) {
      models[m].associate(models);
    }
  }

  db.sync();

}

export { User, Todo };
