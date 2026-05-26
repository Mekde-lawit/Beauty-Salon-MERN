const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { authenticate, authorize } = require("../middleware/auth");

router.get(
  "/",
  authenticate,
  authorize(["Manager"]),
  reportController.getReportData
);
router.get("/export", authenticate, reportController.exportReportData);

module.exports = router;
