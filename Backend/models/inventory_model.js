module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define("Inventory", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lastUpdated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    notes: DataTypes.TEXT,
  });

  Inventory.associate = (models) => {
    Inventory.belongsTo(models.Item, {
      foreignKey: "itemId",
      as: "item",
    });
    Inventory.belongsTo(models.User, {
      foreignKey: "updatedById",
      as: "updatedBy",
    });
  };

  return Inventory;
};
