const branchService = require("../services/branchService");

const createBranch = async (req, res) => {
  try {
    const branch = await branchService.createBranch(req.body);
    res.status(201).json(branch);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBranches = async (req, res) => {
  try {
    const branches = await branchService.getAllBranches({
      where: req.query, // Allows filtering like ?phone=123456
    });
    res.json(branches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsersByBranch = async (req, res) => {
  try {
    const branches = await branchService.getAllUsersByBranch(
      req.params.branchId
    );
    console.log(req.params.branchId);

    res.json(branches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBranch = async (req, res) => {
  try {
    const branch = await branchService.getBranchById(req.params.id);
    res.json(branch);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateBranch = async (req, res) => {
  try {
    const branch = await branchService.updateBranch(req.params.id, req.body);
    res.json(branch);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteBranch = async (req, res) => {
  try {
    await branchService.deleteBranch(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  createBranch,
  getBranches,
  getAllUsersByBranch,
  getBranch,
  updateBranch,
  deleteBranch,
};
