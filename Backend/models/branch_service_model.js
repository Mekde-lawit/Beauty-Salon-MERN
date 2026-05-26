module.exports = (sequelize, DataTypes) => {
  const BranchService = sequelize.define("BranchService", {
    branchId: {
      type: DataTypes.INTEGER,
      references: { model: "Branches", key: "id" },
    },
    serviceId: {
      type: DataTypes.INTEGER,
      references: { model: "Services", key: "id" },
    },
    availability: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  return BranchService;
};
