const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/auth");

// Public access
router.post("/register", userController.registerUser);

// Authenticated user access
router.get("/me", authenticate, userController.getCurrentUser);

// Admin access to manage users
router.get(
  "/",
  authenticate,
  authorize(["Manager", "receptionist"]),
  userController.getAllUsers
);
router.put("/:id", authenticate, userController.updateUser);
router.delete(
  "/:id",
  authenticate,
  authorize(["Manager"]),
  userController.deleteUser
);

module.exports = router;
