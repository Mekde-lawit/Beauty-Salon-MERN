import {
  Check,
  Close,
  Delete,
  Edit,
  ExpandLess,
  ExpandMore,
  Info,
  MoreVert,
  Pending,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns/format";
import { useEffect, useState } from "react";
import apiClient from "../lib/apiClients";
import { Appointment } from "../types";
import { FILE_URL } from "../utils/constant";
import { toast } from "react-toastify";
import SimpleLogDialog from "../components/SimpleLogDialog";

interface Branch {
  id: number;
  name: string;
}

const statusOptions = [
  {
    value: "pending",
    label: "Pending",
    color: "warning",
    icon: <Pending color="warning" />,
  },
  {
    value: "confirmed",
    label: "Confirmed",
    color: "info",
    icon: <Info color="info" />,
  },
  {
    value: "completed",
    label: "Completed",
    color: "success",
    icon: <Check color="success" />,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "error",
    icon: <Close color="error" />,
  },
  // { value: "no_show", label: "No Show", color: "error" },
];

const BookingsPage = () => {
  const [selectedBranchId, setSelectedBranchId] = useState<number>(0);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentAppointment, setCurrentAppointment] =
    useState<Appointment | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [openCollapse, setOpenCollapse] = useState<number>(-1);
  const [currentAppointmentId, setCurrentAppointmentId] = useState<
    number | null
  >(null);

  // Form state for editing
  const [editForm, setEditForm] = useState({
    startTime: new Date(),
    endTime: new Date(),
    notes: "",
    status: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [branchesRes] = await Promise.all([apiClient.get("/branches")]);
        setBranches(branchesRes.data);
      } catch (err: any) {
        toast.error(err.response?.data?.error || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (selectedBranchId === 0) {
          setAppointments([]);
          return;
        }
        setLoading(true);

        const response = await apiClient.get("/appointments/branch", {
          params: {
            branchId: selectedBranchId,
          },
        });
        setAppointments(response.data);
      } catch (err: any) {
        toast.error(
          err.response?.data?.error || "Failed to fetch appointments"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedBranchId]);

  const handleDelete = async (appointmentId: number) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;

    try {
      setLoading(true);
      await apiClient.delete(`/appointments/${appointmentId}`);
      setAppointments(appointments.filter((app) => app.id !== appointmentId));
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to cancel appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditDialog = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setEditForm({
      startTime: new Date(appointment.startTime),
      endTime: new Date(appointment.endTime),
      notes: appointment.notes || "",
      status: appointment.status,
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setCurrentAppointment(null);
  };

  const handleUpdateAppointment = async () => {
    if (!currentAppointment) return;

    try {
      setLoading(true);
      const response = await apiClient.put(
        `/appointments/${currentAppointment.id}`,
        {
          startTime: editForm.startTime.toISOString(),
          endTime: editForm.endTime.toISOString(),
          notes: editForm.notes,
          status: editForm.status,
        }
      );

      setAppointments(
        appointments.map((app) =>
          app.id === currentAppointment.id ? response.data : app
        )
      );
      handleCloseEditDialog();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    appointmentId: number,
    status: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedStatus(status);
    setCurrentAppointmentId(appointmentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStatus("");
    setCurrentAppointmentId(null);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!currentAppointmentId) return;

    try {
      setLoading(true);
      const response = await apiClient.put(
        `/appointments/${currentAppointmentId}`,
        {
          status: newStatus,
        }
      );

      setAppointments(
        appointments.map((app) =>
          app.id === currentAppointmentId ? response.data : app
        )
      );
      handleMenuClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (
    date: Date | null,
    field: "startTime" | "endTime"
  ) => {
    if (date) {
      setEditForm((prev) => ({
        ...prev,
        [field]: date,
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading && appointments.length === 0) return <CircularProgress />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Appointments Management
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 2,
          gap: 2,
          alignItems: "center",
        }}
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Branch</InputLabel>
          <Select
            size="small"
            value={selectedBranchId}
            label="Branch"
            onChange={(e) => setSelectedBranchId(e.target.value as number)}
          >
            <MenuItem value={0}>Select Branch</MenuItem>
            {branches.map((branch) => (
              <MenuItem key={branch.id} value={branch.id}>
                {branch.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", gap: 1 }}>
          {/* <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              size="small"
              value=""
              label="Status"
              onChange={(e) => {
                // Implement status filtering here
              }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
        </Box>
      </Box>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Staff</TableCell>
                <TableCell align="center">Date & Time</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(selectedBranchId === 0 || appointments?.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {selectedBranchId === 0
                      ? "Please select a branch"
                      : "No data available"}
                  </TableCell>
                </TableRow>
              )}

              {appointments.map((app) => (
                <>
                  <TableRow key={app.id + "main"}>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {app.customer?.name.charAt(0)}
                        </Avatar>
                        {app.customer?.name}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" gap={1}>
                        {app?.service.image && (
                          <img
                            src={FILE_URL + app?.service.image}
                            alt={app?.service.name}
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
                        {app.service?.name}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {app.staff ? (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {app.staff.name.charAt(0)}
                          </Avatar>
                          {app.staff.name}
                        </Box>
                      ) : (
                        "Not assigned"
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <div>
                        {format(new Date(app.startTime), "MMM dd, yyyy")}
                      </div>
                      <div>
                        {format(new Date(app.startTime), "h:mm a")} -{" "}
                        {format(new Date(app.endTime), "h:mm a")}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={app.status}
                        color={
                          statusOptions.find((s) => s.value === app.status)
                            ?.color as any
                        }
                        size="small"
                        sx={{ textTransform: "capitalize", minWidth: 100 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Stack direction={"row"} gap={1}>
                        <IconButton
                          onClick={() =>
                            setOpenCollapse(
                              openCollapse === app.id ? -1 : app.id
                            )
                          }
                          size="small"
                        >
                          {openCollapse === app.id ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </IconButton>
                      </Stack>
                      {/* <SimpleLogDialog actionLog={[]} /> */}
                    </TableCell>
                    {/* <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenEditDialog(app)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(app.id)}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, app.id, app.status)}
                      aria-controls={`status-menu-${app.id}`}
                      aria-haspopup="true"
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell> */}
                  </TableRow>

                  <TableRow
                    sx={{
                      display: openCollapse === app.id ? "" : "none",
                      justifyItems: "flex-start",
                    }}
                  >
                    <TableCell colSpan={3} sx={{ maxWidth: 400 }}>
                      <Stack direction={"row"}>
                        <Card sx={{ width: "100%" }}>
                          <CardContent>Special Request</CardContent>
                          <Divider />
                          <CardContent>{app?.notes}</CardContent>
                          <CardContent></CardContent>
                        </Card>
                      </Stack>
                    </TableCell>
                    <TableCell colSpan={3} sx={{ maxWidth: 400 }}>
                      {app?.feedback && (
                        <Stack direction={"row"}>
                          <Card sx={{ width: "100%" }}>
                            <CardContent>Feedback</CardContent>
                            <Divider />
                            <CardContent>{app?.feedback}</CardContent>
                          </Card>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <br />
      {/* Edit Appointment Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Appointment</DialogTitle>
        <DialogContent dividers>
          {currentAppointment && (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
            >
              <Typography variant="subtitle1">
                <strong>Customer:</strong> {currentAppointment.customer?.name}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Service:</strong> {currentAppointment.service?.name}
              </Typography>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <DatePicker
                    label="Date"
                    value={editForm.startTime}
                    onChange={(date: any) =>
                      handleDateChange(date, "startTime")
                    }
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                    // renderInput={(params: any) => (
                    //   <TextField {...params} fullWidth />
                    // )}
                  />
                  <TextField
                    label="Start Time"
                    type="time"
                    value={format(editForm.startTime, "HH:mm")}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(":");
                      const newDate = new Date(editForm.startTime);
                      newDate.setHours(parseInt(hours), parseInt(minutes));
                      handleDateChange(newDate, "startTime");
                    }}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Box>
                <TextField
                  label="End Time"
                  type="time"
                  value={format(editForm.endTime, "HH:mm")}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":");
                    const newDate = new Date(editForm.endTime);
                    newDate.setHours(parseInt(hours), parseInt(minutes));
                    handleDateChange(newDate, "endTime");
                  }}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </LocalizationProvider>

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editForm.status}
                  label="Status"
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      status: e.target.value as string,
                    })
                  }
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Notes"
                name="notes"
                value={editForm.notes}
                onChange={handleInputChange}
                multiline
                rows={4}
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="error">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateAppointment}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Change Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": `status-menu-${currentAppointmentId}`,
        }}
      >
        {statusOptions
          .filter((option) => option.value !== selectedStatus)
          .map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
            >
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText>Mark as {option.label}</ListItemText>
            </MenuItem>
          ))}
      </Menu>
    </Container>
  );
};

export default BookingsPage;
