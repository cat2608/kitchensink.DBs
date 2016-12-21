module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('users', 'mail', { type: Sequelize.STRING, validate: { isEmail: true } });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn('users', 'mail');
  }
};
