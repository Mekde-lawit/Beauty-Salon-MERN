const appointmentService = require("../services/appointmentService");

const getAvailableSlots = async (req, res) => {
  try {
    const { branchId, serviceId, isForChild, date } = req.query;
    const slots = await appointmentService.getAvailableSlots(
      parseInt(branchId),
      parseInt(serviceId),
      isForChild === "true",
      new Date(date)
    );
    res.json(slots);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.createAppointment({
      ...req.body,
      customerId: req.user.id,
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.updateAppointment(
      parseInt(req.params.id),
      req.body
    );
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.cancelAppointment(
      parseInt(req.params.id)
    );
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getCustomerAppointments(
      req.user.id
    );
    res.json(appointments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getStaffAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getStaffAppointments(
      req.user.id
    );
    res.json(appointments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBranchAppointments = async (req, res) => {
  try {
    console.log("first");

    const { branchId, startDate, endDate } = req.query;
    const appointments = await appointmentService.getBranchAppointments(
      parseInt(branchId)
      // new Date(startDate),
      // new Date(endDate)
    );
    res.json(appointments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAvailableSlots,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getMyAppointments,
  getStaffAppointments,
  getBranchAppointments,
};
