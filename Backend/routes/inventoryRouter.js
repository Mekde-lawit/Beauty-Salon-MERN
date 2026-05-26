const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const { authenticate, authorize } = require("../middleware/auth");

// Item routes
router.get("/items", authenticate, inventoryController.getInventory);
router.post(
  "/items",
  authenticate,
  authorize(["manager"]),
  inventoryController.createItem
);
router.post(
  "/items/:itemId/stock",
  authenticate,
  authorize(["manager"]),
  inventoryController.updateStock
);

// Order routes
router.get("/orders", authenticate, inventoryController.getOrders);
router.post("/orders", authenticate, inventoryController.createOrder);
router.put(
  "/orders/:orderId/approve",
  authenticate,
  authorize(["manager"]),
  inventoryController.approveOrder
);

module.exports = router;
