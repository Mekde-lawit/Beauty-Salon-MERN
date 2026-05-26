const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { authenticate, authorize } = require("../middleware/auth");

// Customer endpoints
router.get(
  "/slots",
  authenticate,
  authorize(["customer", "stylist", "manager"]),
  appointmentController.getAvailableSlots
);
router.post("/", authenticate, appointmentController.createAppointment);
router.get(
  "/my-appointments",
  authenticate,
  appointmentController.getMyAppointments
);
router.put(
  "/:id/cancel",
  authenticate,
  appointmentController.cancelAppointment
);
router.put("/:id", authenticate, appointmentController.updateAppointment);

// stylist endpoints
router.get(
  "/stylist/my-schedule",
  authenticate,
  authorize(["staff", "manager"]),
  appointmentController.getStaffAppointments
);

router.get(
  "/branch",
  authenticate,
  appointmentController.getBranchAppointments
);

module.exports = router;
