const userService = require("../services/userService");

const registerUser = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  res.json(req.user);
};

const getAllUsers = async (req, res) => {
  let { roleIds } = req.query;
  if (roleIds) {
    // If roleIds is a single value, make it an array
    if (!Array.isArray(roleIds)) {
      roleIds = [roleIds];
    }
    // Convert all to numbers
    roleIds = roleIds.map(Number);
  } else {
    roleIds = [];
  }

  try {
    const users = await userService.getAllUsers(roleIds);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    console.log(error);

    res.status(404).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  getCurrentUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
