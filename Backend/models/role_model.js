// models/role_model.js
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define("Role", {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  });

  Role.associate = (models) => {
    // Use the correct model name (User, not Users)
    Role.hasMany(models.User, {
      foreignKey: "roleId",
      as: "users",
    });
  };

  return Role;
};
