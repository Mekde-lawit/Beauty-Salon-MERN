const serviceService = require("../services/serviceService");

const getServices = async (req, res) => {
  try {
    const services = await serviceService.getAllServices(req.query.branchId);
    res.json(services);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getService = async (req, res) => {
  try {
    const service = await serviceService.getServiceById(req.params.id);
    res.json(service);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const serviceData = req.body;
    if (req.file) {
      serviceData.image = `uploads/services/${req.file.filename}`;
    }

    const service = await serviceService.createService(serviceData);
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedData = {
      ...req.body, // form fields (name, price, etc.)
    };

    // Convert numeric fields manually (if needed)
    if (updatedData.price) updatedData.price = parseFloat(updatedData.price);
    if (updatedData.estimatedTimeWomen)
      updatedData.estimatedTimeWomen = parseInt(updatedData.estimatedTimeWomen);
    if (updatedData.estimatedTimeChildren)
      updatedData.estimatedTimeChildren = parseInt(
        updatedData.estimatedTimeChildren
      );
    if (updatedData.isForChildren !== undefined) {
      updatedData.isForChildren =
        updatedData.isForChildren === "true" ||
        updatedData.isForChildren === true;
    }

    // Handle uploaded image
    if (req.file) {
      updatedData.image = `uploads/services/${req.file.filename}`;
    }

    const service = await serviceService.updateService(id, updatedData);
    res.json(service);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    await serviceService.deleteService(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const assignToBranch = async (req, res) => {
  try {
    const result = await serviceService.addServiceToBranch(
      req.params.serviceId,
      req.params.branchId
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  assignToBranch,
};
