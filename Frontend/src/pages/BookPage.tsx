import { ChevronLeft, ChevronRight, LocationOn } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../lib/apiClients";

interface Service {
  id: number;
  name: string;
  isForChildren: boolean;
  estimatedTimeWomen: number;
  estimatedTimeChildren?: number;
}

interface Branch {
  id: number;
  name: string;
  location: string;
}

interface Staff {
  id: number;
  name: string;
  avatar?: string;
}

interface TimeSlot {
  start: string;
  end: string;
}

const steps = [
  "Select Service",
  "Choose Branch",
  "Select Staff",
  "Pick Time",
  "Confirm Booking",
];

const BookPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    serviceId: "",
    isForChild: false,
    branchId: "",
    staffId: "",
    date: new Date(),
    timeSlot: "",
    notes: "",
  });

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/services");
        setServices(response.data);
      } catch (err: any) {
        toast.error(err.response?.data?.error || "Failed to fetch services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Fetch branches when service is selected
  useEffect(() => {
    if (formData.serviceId) {
      const fetchBranches = async () => {
        try {
          setLoading(true);
          const response = await apiClient.get(
            `/services/${formData.serviceId}/branches`
          );
          setBranches(response.data);
        } catch (err: any) {
          toast.error(err.response?.data?.error || "Failed to fetch branches");
        } finally {
          setLoading(false);
        }
      };

      fetchBranches();
    }
  }, [formData.serviceId]);

  // Fetch staff when branch is selected
  useEffect(() => {
    if (formData.branchId) {
      const fetchStaff = async () => {
        try {
          setLoading(true);
          const response = await apiClient.get(
            `/branches/${formData.branchId}/staff`
          );
          setStaff(response.data);
        } catch (err: any) {
          toast.error(err.response?.data?.error || "Failed to fetch staff");
        } finally {
          setLoading(false);
        }
      };

      fetchStaff();
    }
  }, [formData.branchId]);

  // Fetch time slots when date or branch changes
  useEffect(() => {
    if (formData.branchId && formData.serviceId && formData.date) {
      const fetchTimeSlots = async () => {
        try {
          setLoading(true);
          const response = await apiClient.get("/appointments/slots", {
            params: {
              branchId: formData.branchId,
              serviceId: formData.serviceId,
              isForChild: formData.isForChild,
              date: formData.date.toISOString(),
            },
          });
          setTimeSlots(response.data);
        } catch (err: any) {
          toast.error(
            err.response?.data?.error || "Failed to fetch time slots"
          );
        } finally {
          setLoading(false);
        }
      };

      fetchTimeSlots();
    }
  }, [
    formData.branchId,
    formData.serviceId,
    formData.date,
    formData.isForChild,
  ]);

  const handleNext = () => {
    toast.error(null);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    toast.error(null);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleServiceChange = (e: any) => {
    const serviceId = e.target.value as string;
    // const selectedService = services.find((s) => s.id.toString() === serviceId);

    setFormData({
      ...formData,
      serviceId,
      isForChild: false,
      branchId: "",
      staffId: "",
      timeSlot: "",
    });
  };

  const handleBranchChange = (e: any) => {
    setFormData({
      ...formData,
      branchId: e.target.value as string,
      staffId: "",
      timeSlot: "",
    });
  };

  const handleDateChange = (date: any) => {
    if (date) {
      setFormData({
        ...formData,
        date,
        timeSlot: "",
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const selectedSlot = timeSlots.find(
        (slot) => slot.start === formData.timeSlot
      );

      if (!selectedSlot) {
        throw new Error("Please select a valid time slot");
      }

      const bookingData = {
        serviceId: parseInt(formData.serviceId),
        branchId: parseInt(formData.branchId),
        staffId: formData.staffId ? parseInt(formData.staffId) : null,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        isForChild: formData.isForChild,
        notes: formData.notes,
      };

      await apiClient.post("/appointments", bookingData);
      setActiveStep(activeStep + 1); // Move to confirmation step
      navigate("/history");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Select Service</InputLabel>
              <Select
                value={formData.serviceId}
                onChange={handleServiceChange}
                label="Select Service"
              >
                {services.map((service) => (
                  <MenuItem key={service.id} value={service.id}>
                    {service.name} (
                    {service.isForChildren
                      ? `${service.estimatedTimeChildren} mins`
                      : `${service.estimatedTimeWomen} mins`}
                    )
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {formData.serviceId && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isForChild}
                    onChange={(e) =>
                      setFormData({ ...formData, isForChild: e.target.checked })
                    }
                    disabled={
                      !services.find(
                        (s) =>
                          s.id.toString() === formData.serviceId?.toString()
                      )?.isForChildren
                    }
                  />
                }
                label="This booking is for a child"
                sx={{ mt: 2 }}
              />
            )}
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Select Branch</InputLabel>
              <Select
                value={formData.branchId}
                onChange={handleBranchChange}
                label="Select Branch"
              >
                {branches.map((branch) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LocationOn sx={{ mr: 1 }} />
                      {branch.name} - {branch.location}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select Staff (Optional)
            </Typography>
            <Grid container spacing={2}>
              <Grid sx={{ xs: 12 }}>
                <Button
                  variant={!formData.staffId ? "contained" : "outlined"}
                  onClick={() => setFormData({ ...formData, staffId: "" })}
                  sx={{ mr: 2 }}
                >
                  Any Available Staff
                </Button>
              </Grid>
              {staff.map((staffMember) => (
                <Grid key={staffMember.id} sx={{ xs: 6, sm: 4, md: 3 }}>
                  <Paper
                    elevation={
                      formData.staffId === staffMember.id.toString() ? 3 : 1
                    }
                    sx={{
                      p: 2,
                      cursor: "pointer",
                      border:
                        formData.staffId === staffMember.id.toString()
                          ? `2px solid ${theme.palette.primary.main}`
                          : "none",
                    }}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        staffId: staffMember.id.toString(),
                      })
                    }
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Avatar
                        src={staffMember.avatar}
                        sx={{ width: 56, height: 56, mb: 1 }}
                      />
                      <Typography>{staffMember.name}</Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={formData.date}
                onChange={handleDateChange}
                minDate={new Date()}
                maxDate={new Date(new Date().setDate(new Date().getDate() + 5))}
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />
            </LocalizationProvider>

            {timeSlots.length > 0 ? (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Available Time Slots
                </Typography>
                <Grid container spacing={2}>
                  {timeSlots.map((slot) => (
                    <Grid
                      key={slot.start}
                      sx={{
                        xs: 6,
                        sm: 4,
                        md: 3,
                      }}
                    >
                      <Button
                        fullWidth
                        variant={
                          formData.timeSlot === slot.start
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() =>
                          setFormData({ ...formData, timeSlot: slot.start })
                        }
                      >
                        {new Date(slot.start).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <Typography sx={{ mt: 3 }} color="text.secondary">
                No available slots for this date. Please try another date.
              </Typography>
            )}

            {formData.timeSlot && (
              <Box sx={{ mt: 3 }}>
                <TextField
                  label="Special Requests (Optional)"
                  multiline
                  rows={4}
                  fullWidth
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </Box>
            )}
          </Box>
        );
      case 4:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Booking Confirmed!
            </Typography>
            <Typography>
              Your appointment for{" "}
              {
                services.find((s) => s.id.toString() === formData.serviceId)
                  ?.name
              }{" "}
              has been scheduled.
            </Typography>
            <Typography sx={{ mt: 2 }}>
              <strong>Date:</strong>{" "}
              {new Date(formData.timeSlot).toLocaleDateString()}
            </Typography>
            <Typography>
              <strong>Time:</strong>{" "}
              {new Date(formData.timeSlot).toLocaleTimeString()}
            </Typography>
            <Typography>
              <strong>Location:</strong>{" "}
              {
                branches.find((b) => b.id.toString() === formData.branchId)
                  ?.name
              }
            </Typography>
            {formData.staffId && (
              <Typography>
                <strong>Staff:</strong>{" "}
                {staff.find((s) => s.id.toString() === formData.staffId)?.name}
              </Typography>
            )}
            {formData.notes && (
              <Typography>
                <strong>Special Request:</strong> {formData?.notes}
              </Typography>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Book Now
      </Typography>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {renderStepContent(activeStep)}

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<ChevronLeft />}
              >
                Back
              </Button>

              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ChevronRight />}
                  disabled={
                    (activeStep === 0 && !formData.serviceId) ||
                    (activeStep === 1 && !formData.branchId) ||
                    (activeStep === 3 && !formData.timeSlot)
                  }
                >
                  Next
                </Button>
              ) : activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!formData.timeSlot}
                >
                  {loading ? <CircularProgress size={24} /> : "Book Now"}
                </Button>
              ) : null}
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default BookPage;
