const jwt = require("jsonwebtoken");
const { User, Role } = require("../models");

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      include: [{ model: Role, as: "role" }],
    });

    if (!user) return res.status(401).json({ error: "Invalid token" });

    // Check account status
    if (["locked", "suspended"].includes(user.status)) {
      return res.status(403).json({ error: "Account restricted" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const authorize = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role?.name?.toLowerCase();

    if (
      !userRole ||
      !allowedRoles.map((role) => role.toLowerCase()).includes(userRole)
    ) {
      return res.status(403).json({ error: "Permission denied" });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
