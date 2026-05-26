module.exports = (sequelize, DataTypes) => {
  const Branch = sequelize.define("Branch", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.TEXT },
    phone: { type: DataTypes.STRING },
    contactPersonId: { type: DataTypes.INTEGER },
  });

  Branch.associate = (models) => {
    Branch.belongsTo(models.User, {
      foreignKey: "contactPersonId",
      as: "contactPerson",
    });
    Branch.belongsToMany(models.Service, {
      through: "BranchService",
      foreignKey: "branchId",
      otherKey: "serviceId", // Explicitly set the other key
    });
  };

  return Branch;
};
