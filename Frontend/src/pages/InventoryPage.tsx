import {
  Add,
  Check,
  Delete,
  Inventory,
  ListAlt,
  ShoppingCart,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import apiClient from "../lib/apiClients";

interface Item {
  id: number;
  name: string;
  description: string;
  category: string;
  inventoryRecords: Array<{ quantity: number }>;
}

interface Order {
  id: number;
  status: string;
  items: Array<{
    quantity: number;
    item: Item;
  }>;
}

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [openStockDialog, setOpenStockDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Form states
  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    category: "product",
  });
  const [stockForm, setStockForm] = useState({
    quantity: 0,
    notes: "",
  });
  const [orderForm, setOrderForm] = useState({
    items: [{ itemId: "", quantity: 1 }],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsRes, ordersRes] = await Promise.all([
        apiClient.get("/inventory/items"),
        apiClient.get("/inventory/orders"),
      ]);
      setItems(itemsRes.data);
      setOrders(ordersRes.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async () => {
    try {
      setLoading(true);
      const response = await apiClient.post("/inventory/items", itemForm);
      setItems([...items, response.data]);
      setOpenItemDialog(false);
      setItemForm({ name: "", description: "", category: "product" });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create item");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async () => {
    if (!selectedItem) return;
    try {
      setLoading(true);
      await apiClient.post(
        `/inventory/items/${selectedItem.id}/stock`,
        stockForm
      );
      fetchData(); // Refresh data
      setOpenStockDialog(false);
      setStockForm({ quantity: 0, notes: "" });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update stock");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      const response = await apiClient.post("/inventory/orders", orderForm);
      setOrders([...orders, response.data]);
      setOpenOrderDialog(false);
      setOrderForm({ items: [{ itemId: "", quantity: 1 }] });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOrder = async (orderId: number) => {
    try {
      setLoading(true);
      await apiClient.put(`/inventory/orders/${orderId}/approve`);
      fetchData(); // Refresh data
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to approve order");
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Stock
        return (
          <>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenItemDialog(true)}
              >
                Add Item
              </Button>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Current Stock</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Typography fontWeight="bold">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.category}
                          size="small"
                          color="primary"
                          sx={{
                            textTransform: "capitalize",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {item?.inventoryRecords
                          ? item?.inventoryRecords[0]?.quantity || 0
                          : ""}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => {
                            setSelectedItem(item);
                            setOpenStockDialog(true);
                          }}
                        >
                          Update Stock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        );
      case 1: // Orders
        return (
          <>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenOrderDialog(true)}
              >
                New Order
              </Button>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                  {orders &&
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>#{order.id}</TableCell>
                        <TableCell>
                          {order?.items &&
                            order?.items.map((item, idx) => (
                              <div key={idx}>
                                {item?.quantity} x {item?.item?.name}
                              </div>
                            ))}
                        </TableCell>
                        <TableCell>
                          <Chip
                            sx={{ textTransform: "capitalize" }}
                            label={order.status}
                            color={
                              order.status === "pending"
                                ? "default"
                                : order.status === "paid"
                                ? "success"
                                : "error"
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {order.status === "pending" && (
                            <Button
                              startIcon={<Check />}
                              onClick={() => handleApproveOrder(order.id)}
                            >
                              Approve
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        );
      case 2: // Items
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography>

      <Paper elevation={3} sx={{ p: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_: any, newValue) => setActiveTab(newValue)}
        >
          <Tab label="Stock" icon={<Inventory />} />
          <Tab label="Orders" icon={<ShoppingCart />} />
          <Tab label="Items" icon={<ListAlt />} />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          renderTabContent()
        )}
      </Paper>

      {/* Add Item Dialog */}
      <Dialog open={openItemDialog} onClose={() => setOpenItemDialog(false)}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={itemForm.name}
            onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={itemForm.description}
            onChange={(e) =>
              setItemForm({ ...itemForm, description: e.target.value })
            }
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={itemForm.category}
              label="Category"
              onChange={(e) =>
                setItemForm({ ...itemForm, category: e.target.value })
              }
            >
              <MenuItem value="product">Product</MenuItem>
              <MenuItem value="service">Service</MenuItem>
              <MenuItem value="equipment">Equipment</MenuItem>
              <MenuItem value="consumable">Consumable</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenItemDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateItem} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Stock Dialog */}
      <Dialog open={openStockDialog} onClose={() => setOpenStockDialog(false)}>
        <DialogTitle>Update Stock for {selectedItem?.name}</DialogTitle>
        <DialogContent>
          <TextField
            label="Quantity Change"
            type="number"
            fullWidth
            margin="normal"
            value={stockForm.quantity}
            onChange={(e) =>
              setStockForm({ ...stockForm, quantity: parseInt(e.target.value) })
            }
          />
          <TextField
            label="Notes"
            fullWidth
            margin="normal"
            multiline
            rows={2}
            value={stockForm.notes}
            onChange={(e) =>
              setStockForm({ ...stockForm, notes: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStockDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateStock} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Order Dialog */}
      <Dialog
        open={openOrderDialog}
        onClose={() => setOpenOrderDialog(false)}
        fullWidth
      >
        <DialogTitle>Create New Order</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {orderForm.items.map((item, index) => (
              <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Item</InputLabel>
                  <Select
                    value={item.itemId}
                    label="Item"
                    onChange={(e) => {
                      const newItems = [...orderForm.items];
                      newItems[index].itemId = e.target.value;
                      setOrderForm({ ...orderForm, items: newItems });
                    }}
                  >
                    {items &&
                      items?.map((item) => (
                        <MenuItem key={item?.id} value={item?.id}>
                          {item?.name} (Stock:{" "}
                          {(item?.inventoryRecords &&
                            item?.inventoryRecords[0]?.quantity) ||
                            0}
                          )
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Quantity"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const newItems = [...orderForm.items];
                    newItems[index].quantity = parseInt(e.target.value);
                    setOrderForm({ ...orderForm, items: newItems });
                  }}
                  sx={{ width: 120 }}
                />
                {index > 0 && (
                  <IconButton
                    onClick={() => {
                      const newItems = [...orderForm.items];
                      newItems.splice(index, 1);
                      setOrderForm({ ...orderForm, items: newItems });
                    }}
                  >
                    <Delete />
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>
          <Button
            startIcon={<Add />}
            onClick={() =>
              setOrderForm({
                ...orderForm,
                items: [...orderForm.items, { itemId: "", quantity: 1 }],
              })
            }
          >
            Add Another Item
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOrderDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateOrder}
            variant="contained"
            disabled={
              !orderForm.items.every((item) => item.itemId && item.quantity > 0)
            }
          >
            Create Order
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InventoryPage;
