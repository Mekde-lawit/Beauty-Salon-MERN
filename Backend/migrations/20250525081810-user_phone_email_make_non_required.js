// migrations/XXXXXXXXXXXXXX-make-email-phone-required.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Users", "email", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
    await queryInterface.changeColumn("Users", "phone", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Users", "email", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn("Users", "phone", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },
};
