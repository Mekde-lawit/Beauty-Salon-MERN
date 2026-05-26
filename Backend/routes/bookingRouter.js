const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

module.exports = (bookingController) => {
  router.get("/slots", authMiddleware, bookingController.getAvailableSlots);
  router.post("/", authMiddleware, bookingController.createBooking);
  router.get("/my-bookings", authMiddleware, bookingController.getUserBookings);
  return router;
};
