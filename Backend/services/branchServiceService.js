const { Branch, Service, BranchService } = require("../models");

const getAllBranchServices = async () => {
  return await BranchService.findAll({
    include: [
      { model: Branch, attributes: ["id", "name"] }, // Include branch details
      { model: Service, attributes: ["id", "name"] }, // Include service details
    ],
  });
};

const getBranchServices = async (branchId) => {
  const branch = await Branch.findByPk(branchId, {
    include: [
      {
        model: Service,
        // through: { attributes: ["availability"] },
      },
    ],
  });
  if (!branch) throw new Error("Branch not found");

  return branch.Services;
};

// services/branchService.js
const addServiceToBranch = async (branchId, serviceId, availability = true) => {
  const [branch, service] = await Promise.all([
    Branch.findByPk(branchId),
    Service.findByPk(serviceId),
  ]);

  if (!branch || !service) throw new Error("Branch or Service not found");

  return await BranchService.upsert({
    branchId,
    serviceId,
    availability,
  });
};

const updateServiceAvailability = async (branchId, serviceId, availability) => {
  const result = await BranchService.update(
    { availability },
    { where: { branchId, serviceId } }
  );

  if (result[0] === 0) throw new Error("Service not found in branch");
  return { message: "Availability updated successfully" };
};

const updateBranchService = async (branchId, serviceId, availability) => {
  const association = await BranchService.findOne({
    where: { branchId, serviceId },
  });

  if (!association) throw new Error("Service not found in branch");

  return await association.update({ availability });
};

const removeServiceFromBranch = async (branchId, serviceId) => {
  const association = await BranchService.findOne({
    where: { branchId, serviceId },
  });

  if (!association) throw new Error("Service not found in branch");

  await association.destroy();
  return { message: "Service removed from branch successfully" };
};

const getBranchesByService = async (serviceId) => {
  const service = await Service.findByPk(serviceId, {
    include: [
      {
        model: Branch,
        through: { attributes: ["availability"] },
      },
    ],
  });
  if (!service) throw new Error("Service not found");
  return service.Branches;
};

module.exports = {
  getAllBranchServices,
  getBranchServices,
  addServiceToBranch,
  updateBranchService,
  removeServiceFromBranch,
  getBranchesByService,
};
