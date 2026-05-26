const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Role } = require("../models");
const crypto = require("crypto");

const registerUser = async (userData) => {
  try {
    const existingUser = await User.findOne({
      where: { email: userData.email },
    });
    if (existingUser) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    console.log(userData);

    return await User.create({
      ...userData,
      password: hashedPassword,
      status: "unauthenticated", // Set initial status
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const loginUser = async (email, password) => {
  const user = await User.findOne({
    where: { email },
    include: [{ model: Role, as: "role" }],
  });

  if (!user) throw new Error("Invalid credentials");

  // Check account status
  if (["locked", "suspended"].includes(user.status)) {
    throw new Error("Account is temporarily unavailable");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Invalid credentials");

  // Update user status on successful login
  await user.update({ status: "authenticated" });

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      status: user.status,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      role: user.role,
    },
  };
};

const getCurrentUser = async (userId) => {
  return await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
    include: [{ model: Role, as: "role" }],
  });
};

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const token = crypto.randomBytes(20).toString("hex");
  const expires = Date.now() + 3600000; // 1 hour

  await user.update({
    resetToken: token,
    resetExpires: new Date(expires),
  });

  return token;
};

const resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    where: {
      resetToken: token,
      resetExpires: { [Op.gt]: Date.now() },
    },
  });

  if (!user) throw new Error("Invalid or expired token");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await user.update({
    password: hashedPassword,
    resetToken: null,
    resetExpires: null,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  requestPasswordReset,
  resetPassword,
};
