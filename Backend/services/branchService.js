const { Branch, User, Service } = require("../models");

const createBranch = async (branchData) => {
  const contactPerson = await User.findByPk(branchData.contactPersonId);
  if (!contactPerson) throw new Error("Contact person not found");

  return await Branch.create(branchData);
};

const getAllBranches = async (options = {}) => {
  const defaultInclude = [
    {
      model: User,
      as: "contactPerson",
      attributes: ["id", "name", "email", "phone"],
    },
    {
      model: Service,
      through: { attributes: ["availability"] },
    },
  ];

  return await Branch.findAll({
    include: options.include || defaultInclude,
    where: options.where,
  });
};

const getAllUsersByBranch = async (branchId) => {
  return await User.findAll({
    where: { branchId },
  });
};

const getBranchById = async (id) => {
  const branch = await Branch.findByPk(id, {
    include: [
      { model: User, as: "contactPerson" },
      { model: Service, through: { attributes: ["availability"] } },
    ],
  });
  if (!branch) throw new Error("Branch not found");
  return branch;
};

const updateBranch = async (id, branchData) => {
  const branch = await Branch.findByPk(id);
  if (!branch) throw new Error("Branch not found");

  if (branchData.contactPersonId) {
    const contactPerson = await User.findByPk(branchData.contactPersonId);
    if (!contactPerson) throw new Error("New contact person not found");
  }

  return await branch.update(branchData);
};

const deleteBranch = async (id) => {
  const branch = await Branch.findByPk(id);
  if (!branch) throw new Error("Branch not found");

  await branch.destroy();
  return { message: "Branch deleted successfully" };
};

module.exports = {
  createBranch,
  getAllBranches,
  getAllUsersByBranch,
  getBranchById,
  updateBranch,
  deleteBranch,
};
