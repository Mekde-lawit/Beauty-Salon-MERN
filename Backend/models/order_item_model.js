module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define("OrderItem", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    // unitPrice: {
    //   type: DataTypes.FLOAT,
    //   allowNull: false,
    //   validate: { min: 0.01 },
    // },
    // discount: {
    //   type: DataTypes.FLOAT,
    //   defaultValue: 0,
    //   validate: { min: 0, max: 100 },
    // },
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Item, {
      foreignKey: "itemId",
      as: "item",
    });

    OrderItem.belongsTo(models.Order, {
      foreignKey: "orderId",
      onDelete: "CASCADE",
    });
  };

  return OrderItem;
};
