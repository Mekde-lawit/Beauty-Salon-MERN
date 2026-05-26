const inventoryService = require("../services/inventoryService");

const getInventory = async (req, res) => {
  try {
    const items = await inventoryService.getAllItemsWithStock();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createItem = async (req, res) => {
  try {
    const item = await inventoryService.createItem(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateStock = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity, notes } = req.body;
    const update = await inventoryService.updateStock(
      itemId,
      quantity,
      req.user.id,
      notes
    );
    res.json(update);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await inventoryService.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const order = await inventoryService.createOrder(req.body, req.user.id);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const approveOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await inventoryService.approveOrder(orderId, req.user.id);
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getInventory,
  createItem,
  updateStock,
  getOrders,
  createOrder,
  approveOrder,
};
