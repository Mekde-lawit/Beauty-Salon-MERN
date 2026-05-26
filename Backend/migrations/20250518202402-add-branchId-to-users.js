module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "branchId", {
      type: Sequelize.INTEGER,
      allowNull: true, // Set to false if every user must have a branch
      references: {
        model: "Branches",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "branchId");
  },
};
