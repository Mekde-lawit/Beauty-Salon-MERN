module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define("Item", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: DataTypes.TEXT,
    basePrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: { min: 0 },
    },
    category: {
      type: DataTypes.ENUM("product", "service", "equipment", "consumable"),
      defaultValue: "product",
    },
    isTaxable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    sku: {
      type: DataTypes.STRING,
      unique: true,
    },
    unitOfMeasure: DataTypes.STRING,
  });

  Item.associate = (models) => {
    Item.hasMany(models.Inventory, {
      foreignKey: "itemId",
      as: "inventoryRecords",
    });

    Item.hasMany(models.OrderItem, {
      foreignKey: "itemId",
      as: "orderItems",
    });

    Item.hasOne(models.Service, {
      foreignKey: "itemId",
      as: "serviceDetails",
    });
  };

  return Item;
};
