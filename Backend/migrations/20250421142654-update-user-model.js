// migrations/XXXXXXXXXXXXXX-update-user-model.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "resetToken", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "resetExpires", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.changeColumn("Users", "sex", {
      type: Sequelize.ENUM("male", "female", "other"),
      allowNull: false,
      defaultValue: "other",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("Users", "resetToken");
    await queryInterface.removeColumn("Users", "resetExpires");
    await queryInterface.changeColumn("Users", "sex", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
