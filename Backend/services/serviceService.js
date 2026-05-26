const { Service, Branch, BranchService } = require("../models");
const fs = require("fs");
const path = require("path");

const getAllServices = async (branchId) => {
  const options = {
    include: [
      {
        model: Branch,
        through: { attributes: [] },
        where: branchId ? { id: branchId } : undefined,
      },
    ],
  };

  return await Service.findAll(options);
};

const getServiceById = async (id) => {
  const service = await Service.findByPk(id, {
    include: [Branch],
  });
  if (!service) throw new Error("Service not found");
  return service;
};

const createService = async (serviceData) => {
  // Validate children time requirement
  if (serviceData.isForChildren && !serviceData.estimatedTimeChildren) {
    throw new Error("Child time estimate required for children services");
  }

  return await Service.create(serviceData);
};

const updateService = async (id, serviceData) => {
  const service = await Service.findByPk(id);
  if (!service) throw new Error("Service not found");

  // Normalize child time logic
  serviceData.estimatedTimeChildren = serviceData.isForChildren
    ? serviceData.estimatedTimeChildren
    : null;

  return await service.update(serviceData);
};

const deleteService = async (id) => {
  const service = await Service.findByPk(id);
  if (!service) throw new Error("Service not found");

  // Delete associated image if it exists
  if (service.imageUrl) {
    const imagePath = path.join(__dirname, "..", service.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  return await service.destroy();
};

const addServiceToBranch = async (serviceId, branchId) => {
  const [service, branch] = await Promise.all([
    Service.findByPk(serviceId),
    Branch.findByPk(branchId),
  ]);

  if (!service || !branch) {
    throw new Error("Service or Branch not found");
  }

  await branch.addService(service);
  return { message: "Service added to branch successfully" };
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  addServiceToBranch,
};
