import { Add, Cancel, Delete, Edit, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiClient from "../../lib/apiClients";
import { Service } from "../../types";
import { FILE_URL } from "../../utils/constant";

interface Branch {
  id: number;
  name: string;
}

interface BranchService {
  BranchService: {
    availability: boolean;
    branchId: number;
    createdAt: Date;
    serviceId: number;
    updatedAt: Date;
  };
  availability: boolean;
  category: string;
  createdAt: Date;
  description: string;
  estimatedTimeChildren: number;
  estimatedTimeWomen: number;
  id: number;
  image?: string;
  isForChildren: boolean;
  itemId: number;
  name: string;
  price: number;
}

const BranchServicesTab = () => {
  const theme = useTheme();
  const [selectedBranchId, setSelectedBranchId] = useState<number>(0);
  const [branchServices, setBranchServices] = useState<any[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState<BranchService | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    branchId: "",
    serviceId: "",
    availability: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [branchesRes, servicesRes] = await Promise.all([
          apiClient.get("/branches"),
          apiClient.get("/services"),
        ]);
        setBranches(branchesRes.data);
        setServices(servicesRes.data);
      } catch (err: any) {
        toast.error(err.response?.data?.error || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchBranchService = async () => {
    try {
      if (selectedBranchId === 0) return;
      setLoading(true);

      const branchServicesRes = await apiClient.get(
        "/branches/" + selectedBranchId + "/services"
      );
      setBranchServices(branchServicesRes.data);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBranchService();
  }, [selectedBranchId]);

  const handleOpenDialog = (item: BranchService | null = null) => {
    if (item) {
      setCurrentItem(item);
      setFormData({
        branchId: item?.BranchService?.branchId.toString(),
        serviceId: item?.BranchService?.serviceId.toString(),
        availability: item.availability,
      });

      setEditMode(true);
    } else {
      setFormData({
        branchId: branches.length > 0 ? branches[0].id.toString() : "",
        serviceId: services.length > 0 ? services[0].id.toString() : "",
        availability: true,
      });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentItem(null);
  };

  const handleToggleAvailability = async (
    branchId: number,
    serviceId: number
  ) => {
    try {
      setLoading(true);
      const item = branchServices.find(
        (bs) =>
          bs?.BranchService?.branchId === branchId &&
          bs?.BranchService?.serviceId === serviceId
      );

      if (!item) return;

      const response = await apiClient.put(
        `/branches/${branchId}/services/${serviceId}`,
        { availability: !item.availability }
      );

      setBranchServices(
        branchServices.map((bs) =>
          bs?.BranchService?.branchId === branchId &&
          bs?.BranchService?.serviceId === serviceId
            ? { ...bs, availability: response.data.availability }
            : bs
        )
      );
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update availability");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const branchId = parseInt(formData.branchId);
      const serviceId = parseInt(formData.serviceId);

      if (editMode) {
        // Update existing relationship
        const response = await apiClient.put(
          `/branches/${currentItem?.BranchService?.branchId}/services/${currentItem?.BranchService?.serviceId}`,
          { availability: formData.availability }
        );

        // setBranchServices(
        //   branchServices.map((bs) =>
        //     bs?.BranchService?.branchId ===
        //       currentItem?.BranchService?.branchId &&
        //     bs?.BranchService?.serviceId ===
        //       currentItem?.BranchService?.serviceId
        //       ? { ...bs, availability: response.data.availability }
        //       : bs
        //   )
        // );
        fetchBranchService();
      } else {
        // Create new relationship
        await apiClient.post(`/branches/${branchId}/services`, {
          serviceId,
          availability: formData.availability,
        });

        // // Find branch and service details for the new relationship
        // const branch = branches.find((b) => b.id === branchId);
        // const service = services.find((s) => s.id === serviceId);
        // setBranchServices([
        //   ...branchServices,
        //   {
        //     branchId,
        //     serviceId,
        //     availability: formData.availability,
        //     Branch: branch,
        //     Service: service,
        //   },
        // ]);
        fetchBranchService();
      }
      handleCloseDialog();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save relationship");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (branchId: number, serviceId: number) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this service from the branch?"
      )
    )
      return;

    try {
      setLoading(true);
      await apiClient.delete(`/branches/${branchId}/services/${serviceId}`);
      setBranchServices(
        branchServices.filter(
          (bs) =>
            !(
              bs.BranchService?.branchId === branchId &&
              bs.BranchService?.serviceId === serviceId
            )
        )
      );
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete relationship");
    } finally {
      setLoading(false);
    }
  };

  if (loading && branchServices.length === 0) return <CircularProgress />;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          gap: 2,
          alignItems: "center",
        }}
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Branch</InputLabel>
          <Select
            size="small"
            name="filterBranchId"
            value={selectedBranchId}
            label="Branch"
            onChange={(e) =>
              setSelectedBranchId(e.target.value as unknown as number)
            }
          >
            <MenuItem value={0}>Select Branch</MenuItem>
            {branches.map((branch) => (
              <MenuItem key={branch.id} value={branch.id}>
                {branch.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: theme.palette.primary.main,
              width: "190px",
            }}
          >
            Add Branch Service
          </Button>
        </div>
      </Box>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Service</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="center">Available</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {branchServices.map((bs) => {
                return (
                  <TableRow
                    key={`${bs.BranchService?.branchId}-${bs.BranchService?.serviceId}`}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" gap={1}>
                        {bs.image && (
                          <img
                            src={FILE_URL + bs.image}
                            alt={bs.name}
                            style={{
                              objectFit: "cover",
                              borderTopLeftRadius: "8px",
                              borderTopRightRadius: "8px",
                              borderBottom: "1px solid #e0e0e0",
                              borderTop: "1px solid #e0e0e0",
                              borderRadius: "8px",
                              marginBottom: "8px",
                              width: "45px",
                              height: "45px",
                              objectPosition: "center",
                            }}
                            className="rounded-t-lg object-cover"
                          />
                        )}

                        {bs.name}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {bs?.category ? (
                        <Chip
                          label={bs.category}
                          size="small"
                          color="primary"
                        />
                      ) : null}
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={bs.availability}
                        onChange={() =>
                          handleToggleAvailability(
                            bs?.BranchService?.branchId,
                            bs?.BranchService?.serviceId
                          )
                        }
                        color="primary"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(bs)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() =>
                          handleDelete(
                            bs?.BranchService?.branchId,
                            bs?.BranchService?.serviceId
                          )
                        }
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editMode ? "Edit Branch Service" : "Add New Branch Service"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack gap={2} sx={{ mt: 1 }}>
            <Stack
              sx={{
                xs: 12,
                md: 6,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Branch</InputLabel>
                <Select
                  name="branchId"
                  value={formData.branchId}
                  label="Branch"
                  onChange={(e) =>
                    setFormData({ ...formData, branchId: e.target.value })
                  }
                  readOnly={editMode}
                >
                  {branches.map((branch) => (
                    <MenuItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Grid
              sx={{
                xs: 12,
                md: 6,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Service</InputLabel>
                <Select
                  name="serviceId"
                  value={formData.serviceId}
                  label="Service"
                  onChange={(e) =>
                    setFormData({ ...formData, serviceId: e.target.value })
                  }
                  readOnly={editMode}
                >
                  {services.map((service) => (
                    <MenuItem key={service.id} value={service.id}>
                      <Stack direction="row" alignItems="center" gap={1}>
                        {service?.image && (
                          <img
                            src={FILE_URL + service?.image}
                            alt={service.name}
                            style={{
                              objectFit: "cover",
                              borderTopLeftRadius: "8px",
                              borderTopRightRadius: "8px",
                              borderBottom: "1px solid #e0e0e0",
                              borderTop: "1px solid #e0e0e0",
                              borderRadius: "8px",
                              marginBottom: "8px",
                              width: "45px",
                              height: "45px",
                              objectPosition: "center",
                            }}
                            className="rounded-t-lg object-cover"
                          />
                        )}
                        {service.name} ({service.category})
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.availability}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availability: e.target.checked,
                      })
                    }
                    color="primary"
                  />
                }
                label="Available at this branch"
                sx={{ mt: 1 }}
              />
            </Grid>
          </Stack>
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
            onClick={handleSubmit}
            startIcon={editMode ? <Save /> : <Add />}
            variant="contained"
            disabled={loading || !formData.branchId || !formData.serviceId}
            sx={{ backgroundColor: theme.palette.primary.main }}
          >
            {loading ? "Saving..." : editMode ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BranchServicesTab;
