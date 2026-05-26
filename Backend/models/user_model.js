module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [2, 50],
            msg: "Name must be between 2-50 characters",
          },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sex: {
        type: DataTypes.ENUM("male", "female", "other"),
        allowNull: false,
        defaultValue: "other",
      },
      status: {
        type: DataTypes.ENUM(
          "unauthenticated",
          "authenticated",
          "pending_verification",
          "session_expired",
          "locked",
          "suspended",
          "remembered",
          "authenticating"
        ),
        defaultValue: "unauthenticated",
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        validate: {
          isDate: true,
          isBefore: new Date().toISOString().split("T")[0],
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
          notContains: {
            args: " ",
            msg: "Email cannot contain spaces",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [8, 100],
            msg: "Password must be 8-100 characters",
          },
        },
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      resetToken: DataTypes.STRING,
      resetExpires: DataTypes.DATE,
    }
    // {
    //   paranoid: true, // Enable soft deletes
    //   indexes: [
    //     {
    //       unique: true,
    //       fields: ["email"],
    //     },
    //     {
    //       fields: ["phone"],
    //     },
    //     {
    //       fields: ["status"],
    //     },
    //   ],
    // }
  );

  User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: "roleId",
      as: "role",
    });

    // Corrected appointment associations
    User.hasMany(models.Appointment, {
      foreignKey: "customerId",
      as: "clientAppointments",
    });

    User.hasMany(models.Appointment, {
      foreignKey: "employeeId",
      as: "staffAppointments",
    });

    User.belongsTo(models.Branch, {
      foreignKey: "branchId",
      as: "branch",
    });
  };

  return User;
};
