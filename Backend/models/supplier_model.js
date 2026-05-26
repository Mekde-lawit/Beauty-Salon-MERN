// models/supplier_model.js
module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define(
    "Supplier",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 100],
        },
      },
      contactName: {
        type: DataTypes.STRING,
        validate: {
          len: [2, 50],
        },
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        validate: {
          is: /^\+?[1-9]\d{1,14}$/, // E.164 phone format
        },
      },
      address: DataTypes.TEXT,
      website: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true,
        },
      },
      paymentTerms: {
        type: DataTypes.TEXT,
        comment: 'e.g., "Net 30 days"',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      paranoid: true, // Enable soft deletes
      indexes: [
        {
          fields: ["name"],
        },
        {
          fields: ["email"],
        },
        {
          fields: ["isActive"],
        },
      ],
    }
  );

  Supplier.associate = (models) => {
    Supplier.hasMany(models.Inventory, {
      foreignKey: "supplierId",
      as: "inventoryItems",
    });
  };

  return Supplier;
};
