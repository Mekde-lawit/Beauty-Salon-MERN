const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { authenticate, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Public endpoints
router.get("/", serviceController.getServices);
router.get("/:id", serviceController.getService);

// Protected admin endpoints
router.post(
  "/",
  authenticate,
  authorize(["Manager"]),
  upload.single("image"),
  serviceController.createService
);
router.put(
  "/:id",
  authenticate,
  authorize(["manager"]),
  upload.single("image"),
  serviceController.updateService
);
router.delete(
  "/:id",
  authenticate,
  authorize(["manager"]),
  serviceController.deleteService
);

// Branch assignment
router.post(
  "/:serviceId/assign-to/:branchId",
  authenticate,
  authorize(["manager"]),
  serviceController.assignToBranch
);

module.exports = router;
