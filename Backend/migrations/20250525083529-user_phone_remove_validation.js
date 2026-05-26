// migrations/XXXXXXXXXXXXXX-update-phone-column.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Users", "phone", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Users", "phone", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
  },
};
