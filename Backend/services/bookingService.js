const { Op } = require("sequelize");

class BookingService {
  constructor(models) {
    this.models = models;
  }

  async getAvailableSlots(branchId, serviceId, isForChild, date) {
    const service = await this.models.Service.findByPk(serviceId);
    if (!service) throw new Error("Service not found");

    const duration =
      isForChild && service.isForChildren
        ? service.estimatedTimeChildren
        : service.estimatedTimeWomen;

    // Get branch working hours
    const branch = await this.models.Branch.findByPk(branchId);
    if (!branch) throw new Error("Branch not found");

    // Get existing bookings for the day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await this.models.Booking.findAll({
      where: {
        branchId,
        startTime: { [Op.between]: [startOfDay, endOfDay] },
        status: { [Op.notIn]: ["cancelled", "no_show"] },
      },
      order: [["startTime", "ASC"]],
    });

    // Generate available slots
    const openingTime = new Date(date);
    openingTime.setHours(9, 0, 0); // 9 AM
    const closingTime = new Date(date);
    closingTime.setHours(18, 0, 0); // 6 PM

    const slots = [];
    let currentTime = new Date(openingTime);

    while (currentTime < closingTime) {
      const slotEnd = new Date(currentTime);
      slotEnd.setMinutes(slotEnd.getMinutes() + duration);

      // Check if slot is available
      const isBooked = bookings.some((booking) => {
        return (
          (currentTime >= booking.startTime && currentTime < booking.endTime) ||
          (slotEnd > booking.startTime && slotEnd <= booking.endTime) ||
          (currentTime <= booking.startTime && slotEnd >= booking.endTime) ||
          booking.status === "cancelled" ||
          booking.status === "completed"
        );
      });

      if (!isBooked && slotEnd <= closingTime) {
        slots.push({
          start: new Date(currentTime),
          end: new Date(slotEnd),
        });
      }

      currentTime.setMinutes(currentTime.getMinutes() + 15); // Next slot in 15 min increments
    }

    return slots;
  }

  async createBooking(bookingData) {
    return await this.models.Booking.create(bookingData);
  }

  async getBookingsByUser(userId) {
    return await this.models.Booking.findAll({
      where: { customerId: userId },
      include: [
        { model: this.models.Service, as: "service" },
        { model: this.models.Branch, as: "branch" },
        { model: this.models.User, as: "staff" },
      ],
      order: [["startTime", "DESC"]],
    });
  }
}

module.exports = BookingService;
