// services/companySettingService.js
const { CompanySetting } = require("../models");

const getSettings = async () => {
  return await CompanySetting.getSettings();
};

const updateSettings = async (settingsData) => {
  const settings = await CompanySetting.getSettings();
  return await settings.update(settingsData);
};

module.exports = {
  getSettings,
  updateSettings,
};
