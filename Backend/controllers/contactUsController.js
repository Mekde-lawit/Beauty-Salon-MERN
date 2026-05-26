const contactUsService = require("../services/contactUsService");

const getAllContactUs = async (req, res) => {
  try {
    const contacts = await contactUsService.getAllContactUs();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createContactUs = async (req, res) => {
  try {
    const contact = await contactUsService.createContactUs(req.body);
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteContactUs = async (req, res) => {
  try {
    await contactUsService.deleteContactUs(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  getAllContactUs,
  createContactUs,
  deleteContactUs,
};
