const { User, Role } = require("../models");
const jwt = require("jsonwebtoken");

const registerUser = async (userData) => {
  const { email, password, roleId } = userData;

  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error("Email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ ...userData, password: hashedPassword });

  return user;
};

const getAllUsers = async (roleIds) => {
  const where =
    Array.isArray(roleIds) && roleIds.length > 0
      ? { roleId: roleIds }
      : undefined;

  return await User.findAll({
    where,
    include: ["role", "branch"],
  });
};

const updateUser = async (id, updates) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");
  return await user.update(updates);
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");
  return await user.destroy();
};

module.exports = {
  registerUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
