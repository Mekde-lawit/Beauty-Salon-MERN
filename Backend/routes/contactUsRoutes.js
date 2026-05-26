const express = require("express");
const router = express.Router();
const contactUsController = require("../controllers/contactUsController");

// Public routes
router.get("/", contactUsController.getAllContactUs);
router.post("/", contactUsController.createContactUs);

// Admin-only route (optional: add authentication/authorization if needed)
router.delete("/:id", contactUsController.deleteContactUs);

module.exports = router;
