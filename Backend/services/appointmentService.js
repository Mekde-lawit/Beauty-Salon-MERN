const { Op } = require("sequelize");
const { Branch, User, Service, Appointment } = require("../models");

const getAvailableSlots = async (branchId, serviceId, isForChild, date) => {
  const service = await Service.findByPk(serviceId);
  if (!service) throw new Error("Service not found");

  const duration =
    isForChild && service.isForChildren
      ? service.estimatedTimeChildren
      : service.estimatedTimeWomen;

  // Get branch working hours (assuming branches have opening/closing times)
  const branch = await Branch.findByPk(branchId);
  if (!branch) throw new Error("Branch not found");

  // Get existing appointments for the day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const appointments = await Appointment.findAll({
    where: {
      branchId,
      startTime: { [Op.between]: [startOfDay, endOfDay] },
      status: { [Op.notIn]: ["cancelled", "no_show"] },
    },
    order: [["startTime", "ASC"]],
  });

  // Generate available slots
  const openingTime = new Date(date);
  openingTime.setHours(branch.openingHour || 9, 0, 0); // Default to 9 AM
  const closingTime = new Date(date);
  closingTime.setHours(branch.closingHour || 18, 0, 0); // Default to 6 PM

  const slots = [];
  let currentTime = new Date(openingTime);

  while (currentTime < closingTime) {
    const slotEnd = new Date(currentTime);
    slotEnd.setMinutes(slotEnd.getMinutes() + duration);

    // Check if slot is available
    const isBooked = appointments.some((appointment) => {
      return (
        (currentTime >= appointment.startTime &&
          currentTime < appointment.endTime) ||
        (slotEnd > appointment.startTime && slotEnd <= appointment.endTime) ||
        (currentTime <= appointment.startTime && slotEnd >= appointment.endTime)
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
};

const createAppointment = async (appointmentData) => {
  return await Appointment.create(appointmentData);
};

const updateAppointment = async (id, updateData) => {
  const appointment = await Appointment.findByPk(id);
  if (!appointment) throw new Error("Appointment not found");

  // Prevent changing certain fields after confirmation
  if (
    appointment.status === "confirmed" ||
    appointment.status === "completed"
  ) {
    const allowedUpdates = ["status", "notes"];
    Object.keys(updateData).forEach((key) => {
      if (!allowedUpdates.includes(key)) {
        delete updateData[key];
      }
    });
  }

  return await appointment.update(updateData);
};

const cancelAppointment = async (id) => {
  const appointment = await Appointment.findByPk(id);
  if (!appointment) throw new Error("Appointment not found");

  // Only allow cancelling pending or confirmed appointments
  if (appointment.status === "completed" || appointment.status === "no_show") {
    throw new Error("Cannot cancel completed or no-show appointments");
  }

  return await appointment.update({ status: "cancelled" });
};

const getCustomerAppointments = async (customerId) => {
  return await Appointment.findAll({
    where: { customerId },
    include: [
      { model: Service, as: "service" },
      { model: Branch, as: "branch" },
      { model: User, as: "staff" },
    ],
    order: [["startTime", "DESC"]],
  });
};

const getStaffAppointments = async (staffId, startDate, endDate) => {
  return await Appointment.findAll({
    where: {
      staffId,
      // startTime: { [Op.between]: [startDate, endDate] },
    },
    include: [
      { model: Service, as: "service" },
      { model: User, as: "customer" },
    ],
    order: [["startTime", "ASC"]],
  });
};

const getBranchAppointments = async (branchId, startDate, endDate) => {
  return await Appointment.findAll({
    where: {
      branchId,
      // startTime: { [Op.between]: [startDate, endDate] },
    },
    include: [
      { model: Service, as: "service" },
      { model: User, as: "customer" },
      { model: User, as: "staff" },
    ],
    order: [["startTime", "ASC"]],
  });
};

module.exports = {
  getAvailableSlots,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getCustomerAppointments,
  getStaffAppointments,
  getBranchAppointments,
};
