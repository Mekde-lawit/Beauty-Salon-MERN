const { Item, Inventory, Order, OrderItem } = require("../models");

const getAllItemsWithStock = async () => {
  return Item.findAll({
    include: [
      {
        model: Inventory,
        as: "inventoryRecords",
        order: [["lastUpdated", "DESC"]],
        limit: 1,
      },
    ],
  });
};

const createItem = async (itemData) => {
  const item = await Item.create(itemData);
  await Inventory.create({
    itemId: item.id,
    quantity: 0,
    notes: "Initial stock",
  });
  return item;
};

const updateStock = async (itemId, quantity, userId, notes = "") => {
  return Inventory.create({
    itemId,
    quantity,
    updatedById: userId,
    notes,
  });
};

const getAllOrders = async () => {
  return Order.findAll({
    include: [
      {
        model: OrderItem,
        as: "items",
        include: [
          {
            model: Item,
            as: "item",
          },
        ],
      },
    ],
  });
};

const createOrder = async (orderData, userId) => {
  const order = await Order.create({
    ...orderData,
    userId,
  });

  for (const item of orderData.items) {
    await OrderItem.create({
      ...item,
      orderId: order.id,
    });
  }

  return order;
};

const approveOrder = async (orderId, userId) => {
  const order = await Order.findOne({
    where: { id: orderId },
    include: [
      {
        model: OrderItem,
        as: "items",
      },
    ],
  });

  if (!order) throw new Error("Order not found");
  if (order.status !== "pending")
    throw new Error("Only pending orders can be approved");

  // Update stock for each item
  for (const item of order.items) {
    await updateStock(
      item.itemId,
      -item.quantity, // Negative because it's reducing stock
      userId,
      `Order #${orderId} approved`
    );
  }

  return order.update({ status: "paid" });
};

module.exports = {
  getAllItemsWithStock,
  createItem,
  updateStock,
  getAllOrders,
  createOrder,
  approveOrder,
};
