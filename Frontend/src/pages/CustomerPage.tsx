import { Add, Cancel, Delete, Edit, Save } from "@mui/icons-material";
import {
  Alert,
  Avatar,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import apiClient from "../lib/apiClients";
import { Branch, Role, User } from "../types";
import { toast } from "react-toastify";

const CustomerPage = () => {
  const theme = useTheme();
  const [staff, setStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editStaff, setEditStaff] = useState<User | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    roleId: "",
    branchId: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [staffRes, branchesRes, rolesRes] = await Promise.all([
          apiClient.get("/users", { params: { roleIds: [1] } }),
          apiClient.get("/branches"),
          apiClient.get("/roles"),
        ]);

        setStaff(staffRes?.data);
        setBranches(branchesRes?.data);
        setRoles(rolesRes?.data);
      } catch (err: any) {
        toast.error(err.response?.data?.error || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validatePhone = (phone: string) => {
    // E.164 phone format validation (simple version)
    return /^\+?[1-9]\d{1,14}$/.test(phone);
  };

  const handleSaveStaff = async () => {
    // Validate all required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.branchId
    ) {
      toast.info("All fields are required");
      return;
    }

    // Validate phone format
    if (!validatePhone(formData.phone)) {
      toast.info(
        "Phone number must be in international format (e.g. +1234567890)"
      );
      return;
    }

    // Password validation
    if (!editStaff && !formData.password) {
      toast.info("Password is required for new staff");
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.info("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const staffData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        roleId: 1,
        branchId: parseInt(formData.branchId),
        password: formData.password || undefined,
      };

      if (editStaff) {
        const response = await apiClient.put(
          `/user/${editStaff.id}`,
          staffData
        );
        setStaff(staff.map((s) => (s.id === editStaff.id ? response.data : s)));
      } else {
        const response = await apiClient.post("/auth/register", staffData);
        setStaff([
          ...staff,
          {
            ...response.data,
            role: roles?.find(
              (r) => r?.id?.toString() === formData?.roleId?.toString()
            ),
          },
        ]);
      }
      handleCloseDialog();
    } catch (err: any) {
      toast.info(err.response?.data?.error || "Failed to save staff");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (staffMember: User | null = null) => {
    setEditStaff(staffMember);
    setFormData({
      name: staffMember?.name || "",
      email: staffMember?.email || "",
      phone: staffMember?.phone || "",
      roleId: "1",
      branchId: staffMember?.branch?.id?.toString() || "",
      password: "",
      confirmPassword: "",
      address: staffMember?.address || "",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditStaff(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id: number) => {
    if (
      !window.confirm("Are you sure you want to delete this customer member?")
    )
      return;

    try {
      setLoading(true);
      await apiClient.delete(`/users/${id}`);
      setStaff(staff.filter((s) => s.id !== id));
    } catch (err: any) {
      toast.info("Customer is referenced and cannot be delete.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !openDialog) return <CircularProgress />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Customer Management
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ backgroundColor: theme.palette.primary.main }}
        >
          Add Customer
        </Button>
      </Box>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Gender</TableCell>
                {/* <TableCell>Status</TableCell> */}
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staff.map((staffMember) => (
                <TableRow key={staffMember.id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={staffMember.name}
                        sx={{ width: 36, height: 36, mr: 2 }}
                      >
                        {staffMember.name.charAt(0)}
                      </Avatar>
                      {staffMember.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <div>{staffMember.email}</div>
                    <div>{staffMember.phone}</div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={staffMember?.role?.name}
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{staffMember?.address}</TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>
                    {staffMember?.sex}
                  </TableCell>
                  {/* <TableCell sx={{ textTransform: "capitalize" }}>
                    {staffMember?.status}
                  </TableCell> */}
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(staffMember)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(staffMember.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Staff Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editStaff ? "Edit Customer" : "Add New Customer"}
        </DialogTitle>
        <DialogContent dividers>
          <>
            <TextField
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              name="phone"
              label="Phone Number (e.g. +1234567890)"
              value={formData.phone}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              helperText="Must include country code"
            />

            <TextField
              name="address"
              label="Full Address"
              value={formData.address}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              multiline
              rows={3}
            />

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Branch</InputLabel>
                <Select
                  name="branchId"
                  value={formData.branchId}
                  label="Branch"
                  onChange={(e) =>
                    setFormData({ ...formData, branchId: e.target.value })
                  }
                >
                  {branches.map((branch) => (
                    <MenuItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {!editStaff && (
              <TextField
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
            )}

            <TextField
              name="confirmPassword"
              label={
                editStaff
                  ? "New Password (leave blank to keep current)"
                  : "Confirm Password"
              }
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required={!editStaff}
            />
          </>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            startIcon={<Cancel />}
            color="error"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveStaff}
            startIcon={<Save />}
            variant="contained"
            disabled={
              loading ||
              !formData.name ||
              !formData.email ||
              !formData.phone ||
              !formData.roleId ||
              !formData.branchId ||
              (!editStaff && !formData.password)
            }
            sx={{ backgroundColor: theme.palette.primary.main }}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CustomerPage;
