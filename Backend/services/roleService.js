const { Role } = require("../models");

const getAllRoles = async () => {
  return await Role.findAll();
};

const createRole = async (roleData) => {
  return await Role.create(roleData);
};

const updateRole = async (id, roleData) => {
  const role = await Role.findByPk(id);
  if (!role) throw new Error("Role not found");
  return await role.update(roleData);
};

const deleteRole = async (id) => {
  const role = await Role.findByPk(id);
  if (!role) throw new Error("Role not found");
  return await role.destroy();
};

module.exports = {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
};
