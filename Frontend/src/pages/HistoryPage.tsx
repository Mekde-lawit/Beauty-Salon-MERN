import { Close, ExpandLess, ExpandMore, MoreVert } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { format } from "date-fns/format";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import apiClient from "../lib/apiClients";
import { Appointment } from "../types";

const statusOptions = [
  {
    value: "cancelled",
    label: "Cancelled",
    color: "error",
    icon: <Close color="error" />,
  },
];

const HistoryPage = () => {
  const { loginData } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openCollapse, setOpenCollapse] = useState<number>(-1);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [currentAppointmentId, setCurrentAppointmentId] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);

        const response = await apiClient.get("/appointments/my-appointments", {
          params: { user: loginData?.user },
        });
        setAppointments(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

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
      setError(err.response?.data?.error || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  if (loading && appointments.length === 0) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Bookings
      </Typography>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Service</TableCell>
                <TableCell>Staff</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell align="center">Date & Time</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No bookings found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {appointments.map((app) => (
                <>
                  {" "}
                  <TableRow key={app.id}>
                    <TableCell>{app.service?.name}</TableCell>
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
                    <TableCell>{app.branch?.name}</TableCell>
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

                    <TableCell align="center">
                      <Stack direction={"row"} gap={1}>
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, app.id, app.status)}
                          aria-controls={`status-menu-${app.id}`}
                          aria-haspopup="true"
                        >
                          <MoreVert />
                        </IconButton>
                        <div>
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
                        </div>
                      </Stack>
                    </TableCell>
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

export default HistoryPage;
