const branchService = require("../services/branchServiceService");

const getAllBranchServices = async (req, res) => {
  try {
    const branchServices = await branchService.getAllBranchServices();
    // Format the response to be more readable
    const response = branchServices.map((bs) => ({
      branchId: bs.branch.id,
      branchName: bs.branch.name,
      serviceId: bs.service.id,
      serviceName: bs.service.name,
      availability: bs.availability,
    }));
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getBranchServices = async (req, res) => {
  try {
    const services = await branchService.getBranchServices(req.params.branchId);
    const response = services.map((service) => ({
      ...service.toJSON(),
      availability: service.BranchService.availability,
    }));
    res.json(response);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const addBranchService = async (req, res) => {
  try {
    const result = await branchService.addServiceToBranch(
      req.params.branchId,
      req.body.serviceId,
      req.body.availability ?? true // Default to true if not provided
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateBranchServiceStatus = async (req, res) => {
  try {
    const result = await branchService.updateBranchService(
      req.params.branchId,
      req.params.serviceId,
      req.body.availability
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removeBranchService = async (req, res) => {
  try {
    const result = await branchService.removeServiceFromBranch(
      req.params.branchId,
      req.params.serviceId
    );
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getServiceBranches = async (req, res) => {
  try {
    const branches = await branchService.getBranchesByService(
      req.params.serviceId
    );
    res.json(branches);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  getAllBranchServices,
  getBranchServices,
  addBranchService,
  updateBranchServiceStatus,
  removeBranchService,
  getServiceBranches,
};
