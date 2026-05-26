const express = require("express");
const router = express.Router();
const controller = require("../controllers/branchServiceController");
const { authenticate, authorize } = require("../middleware/auth");

// Branch-Service relationships
router.get(
  "/branch-services",
  authenticate,
  authorize(["admin", "manager"]),
  controller.getAllBranchServices
);
router.get("/branches/:branchId/services", controller.getBranchServices);
router.get("/services/:serviceId/branches", controller.getServiceBranches);

router.post(
  "/branches/:branchId/services",
  authenticate,
  authorize(["admin", "manager"]),
  controller.addBranchService
);

router.put(
  "/branches/:branchId/services/:serviceId",
  authenticate,
  authorize(["admin", "manager"]),
  (req, res) => {
    if (typeof req.body.availability !== "boolean") {
      return res.status(400).json({ error: "Availability must be boolean" });
    }
    controller.updateBranchServiceStatus(req, res);
  }
);

router.delete(
  "/branches/:branchId/services/:serviceId",
  authenticate,
  authorize(["manager"]),
  controller.removeBranchService
);

module.exports = router;
