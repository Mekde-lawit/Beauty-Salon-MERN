module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define("Booking", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    customerId: { type: DataTypes.INTEGER, allowNull: false },
    serviceId: { type: DataTypes.INTEGER, allowNull: false },
    branchId: { type: DataTypes.INTEGER, allowNull: false },
    staffId: { type: DataTypes.INTEGER, allowNull: true },
    startTime: { type: DataTypes.DATE, allowNull: false },
    endTime: { type: DataTypes.DATE, allowNull: false },
    isForChild: { type: DataTypes.BOOLEAN, defaultValue: false },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "completed",
        "cancelled",
        "no_show"
      ),
      defaultValue: "pending",
    },
    notes: { type: DataTypes.TEXT },
    feedback: { type: DataTypes.TEXT },
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: "customerId",
      as: "customer",
    });
    Booking.belongsTo(models.Service, {
      foreignKey: "serviceId",
      as: "service",
    });
    Booking.belongsTo(models.Branch, {
      foreignKey: "branchId",
      as: "branch",
    });
    Booking.belongsTo(models.User, {
      foreignKey: "staffId",
      as: "staff",
    });
  };

  return Booking;
};
