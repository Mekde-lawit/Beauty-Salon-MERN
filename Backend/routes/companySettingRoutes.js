// routes/companySettingRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/companySettingController");
const { authenticate, authorize } = require("../middleware/auth");

router.get("/", controller.getCompanySettings);
router.put(
  "/",
  authenticate,
  authorize(["admin"]),
  controller.updateCompanySettings
);

module.exports = router;
