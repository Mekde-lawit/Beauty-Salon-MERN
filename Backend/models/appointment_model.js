module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define("Appointment", {
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
  });

  Appointment.associate = (models) => {
    Appointment.belongsTo(models.User, {
      foreignKey: "customerId",
      as: "customer",
    });
    Appointment.belongsTo(models.Service, {
      foreignKey: "serviceId",
      as: "service",
    });
    Appointment.belongsTo(models.Branch, {
      foreignKey: "branchId",
      as: "branch",
    });
    Appointment.belongsTo(models.User, {
      foreignKey: "staffId",
      as: "staff",
    });
  };

  return Appointment;
};
