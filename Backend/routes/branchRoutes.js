const express = require("express");
const router = express.Router();
const branchController = require("../controllers/branchController");
const { authenticate, authorize } = require("../middleware/auth");

// Public routes
router.get("/", branchController.getBranches);
router.get("/:id", branchController.getBranch);
router.get("/:branchId/staff", branchController.getAllUsersByBranch);

// Protected routes
router.post(
  "/",
  authenticate,
  authorize(["admin", "manager"]),
  branchController.createBranch
);

router.put(
  "/:id",
  authenticate,
  authorize(["admin", "manager"]),
  branchController.updateBranch
);

router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  branchController.deleteBranch
);

module.exports = router;
