const { ContactUs } = require("../models");

const getAllContactUs = async () => {
  return await ContactUs.findAll();
};

const createContactUs = async (contactData) => {
  return await ContactUs.create(contactData);
};

const deleteContactUs = async (id) => {
  const contact = await ContactUs.findByPk(id);
  if (!contact) throw new Error("Contact message not found");
  return await contact.destroy();
};

module.exports = {
  getAllContactUs,
  createContactUs,
  deleteContactUs,
};
