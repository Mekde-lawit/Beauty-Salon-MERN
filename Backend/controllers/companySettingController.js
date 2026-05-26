// controllers/companySettingController.js
const companySettingService = require("../services/companySettingService");

const getCompanySettings = async (req, res) => {
  try {
    console.log("first");

    const settings = await companySettingService.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCompanySettings = async (req, res) => {
  try {
    const updatedSettings = await companySettingService.updateSettings(
      req.body
    );
    res.json(updatedSettings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getCompanySettings,
  updateCompanySettings,
};
