// models/order_model.js
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    total: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "paid",
        "shipped",
        "delivered",
        "cancelled"
      ),
      defaultValue: "pending",
    },
  });

  Order.associate = (models) => {
    Order.hasMany(models.OrderItem, {
      foreignKey: "orderId",
      as: "items",
    });

    Order.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };

  return Order;
};
