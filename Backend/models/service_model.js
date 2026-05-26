module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define("Service", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.FLOAT, allowNull: false },
    image: { type: DataTypes.STRING }, // URL to image storage
    tags: { type: DataTypes.JSON }, // e.g., ["popular", "new"]
    category: {
      type: DataTypes.ENUM("hair", "skin", "nails", "spa"),
      defaultValue: "hair",
    },
    isForChildren: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    estimatedTimeWomen: {
      type: DataTypes.INTEGER, // Minutes
      allowNull: false,
      validate: {
        min: 1, // Minimum 15 minutes duration
      },
    },
    estimatedTimeChildren: {
      type: DataTypes.INTEGER, // Minutes
      allowNull: true,
      validate: {
        isRequiredIfForChildren(value) {
          if (this.isForChildren && !value) {
            throw new Error(
              "Estimated time for children is required when service is for children"
            );
          }
        },
        min: 15,
      },
    },
  });

  // Relationships
  Service.associate = (models) => {
    Service.belongsToMany(models.Branch, {
      through: "BranchService", // Many-to-Many with Branch
      foreignKey: "serviceId",
    });
  };

  return Service;
};
