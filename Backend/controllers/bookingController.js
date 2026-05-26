class BookingController {
  constructor(bookingService) {
    this.bookingService = bookingService;
  }

  async getAvailableSlots(req, res) {
    try {
      const { branchId, serviceId, isForChild, date } = req.query;
      const slots = await this.bookingService.getAvailableSlots(
        parseInt(branchId),
        parseInt(serviceId),
        isForChild === "true",
        new Date(date)
      );
      res.json(slots);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async createBooking(req, res) {
    try {
      const booking = await this.bookingService.createBooking({
        ...req.body,
        customerId: req.user.id,
      });
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUserBookings(req, res) {
    try {
      const bookings = await this.bookingService.getBookingsByUser(req.user.id);
      res.json(bookings);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = BookingController;
