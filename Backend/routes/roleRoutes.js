const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const { authenticate, authorize } = require("../middleware/auth");

// Public routes
router.get("/", roleController.getAllRoles);

// Admin-only routes
router.post(
  "/",
  authenticate,
  authorize(["Manager"]),
  roleController.createRole
);
router.put(
  "/:id",
  authenticate,
  authorize(["Manager"]),
  roleController.updateRole
);
router.delete(
  "/:id",
  authenticate,
  authorize(["Manager"]),
  roleController.deleteRole
);

module.exports = router;
