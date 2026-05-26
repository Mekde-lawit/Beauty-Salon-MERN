// models/company_setting_model.js
module.exports = (sequelize, DataTypes) => {
  const CompanySetting = sequelize.define("CompanySetting", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    companyName: { type: DataTypes.STRING, allowNull: false },
    logo: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    contactEmail: {
      type: DataTypes.STRING,
      validate: { isEmail: true },
    },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT },
    socialMedia: { type: DataTypes.JSON },
    businessHours: { type: DataTypes.JSON },
    currency: {
      type: DataTypes.STRING,
      defaultValue: "ETB",
    },
  });

  // Singleton enforcement
  CompanySetting.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
      settings = await this.create({
        companyName: "Beauty Salon",
        currency: "ETB",
      });
    }
    return settings;
  };

  return CompanySetting;
};
