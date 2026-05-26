// migrations/XXXXXXXXXXXXXX-remove-user-indexes.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("Users", ["email"]);
    await queryInterface.removeIndex("Users", ["phone"]);
    await queryInterface.removeIndex("Users", ["status"]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex("Users", ["email"], { unique: true });
    await queryInterface.addIndex("Users", ["phone"]);
    await queryInterface.addIndex("Users", ["status"]);
  },
};
