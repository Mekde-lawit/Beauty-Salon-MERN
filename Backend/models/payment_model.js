module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define("Payment", {
    amount: DataTypes.FLOAT,
    method: DataTypes.ENUM("cash", "card", "online"),
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Appointment);
  };
  return Payment;
};
