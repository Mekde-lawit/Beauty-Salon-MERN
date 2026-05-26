import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
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
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import apiClient from "../lib/apiClients";
import {
  BarChart,
  DateRange,
  Download,
  FilterAlt,
  Person,
  PieChart,
  Refresh,
  Spa,
  TableChart,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";

interface ReportData {
  id: number;
  date: string;
  branchName: string;
  serviceName: string;
  staffName: string;
  customerName: string;
  amount: number;
  duration: number;
  status: string;
}

interface SummaryData {
  totalRevenue: number;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  averageServiceTime: number;
  topPerformingStaff: string;
  mostPopularService: string;
}

const ReportPage = () => {
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [reportType, setReportType] = useState("appointments");
  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs().subtract(1, "month")
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [branchFilter, setBranchFilter] = useState("all");
  const [staffFilter, setStaffFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
  const [staffMembers, setStaffMembers] = useState<
    { id: string; name: string }[]
  >([]);
  const [services, setServices] = useState<
    { id: string; name: string; price: number }[]
  >([]);
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");
  const [searchQuery, setSearchQuery] = useState("");

  const reportTypes = [
    { value: "appointments", label: "Appointments" },
    { value: "staff-performance", label: "Staff Performance" },
    { value: "service-analysis", label: "Service Analysis" },
    { value: "revenue", label: "Revenue Report" },
  ];

  const fetchFilters = async () => {
    try {
      const [branchesRes, staffRes, servicesRes] = await Promise.all([
        apiClient.get("/branches"),
        apiClient.get("/users"),
        apiClient.get("/services"),
      ]);

      setBranches(branchesRes.data);
      setStaffMembers(staffRes.data);
      setServices(servicesRes.data);
    } catch (err: any) {
      console.error("Error fetching error:", err);
    }
  };

  const handleResetFilters = () => {
    setBranchFilter("all");
    setStaffFilter("all");
    setServiceFilter("all");
    setStartDate(dayjs().subtract(1, "month"));
    setEndDate(dayjs());
    setSearchQuery("");
  };

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        type: reportType,
        // startDate: startDate?.format("YYYY-MM-DD"),
        // endDate: endDate?.format("YYYY-MM-DD"),
        branchId: branchFilter === "all" ? undefined : branchFilter,
        staffId: staffFilter === "all" ? undefined : staffFilter,
        serviceId: serviceFilter === "all" ? undefined : serviceFilter,
        search: searchQuery || undefined,
      };

      const response = await apiClient.get("/reports", { params });
      setReportData(response.data.data || []);
      setSummaryData(response.data.summary || null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch report data");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (p0: string) => {
    try {
      const params = {
        type: reportType,
        startDate: startDate?.format("YYYY-MM-DD"),
        endDate: endDate?.format("YYYY-MM-DD"),
        branchId: branchFilter === "all" ? undefined : branchFilter,
        format: "csv",
      };

      const response = await apiClient.get("/reports/export", {
        params,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${reportType}_report_${dayjs().format("YYYYMMDD")}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to download report");
    }
  };

  useEffect(() => {
    fetchFilters();
    fetchReportData();
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [
    reportType,
    startDate,
    endDate,
    branchFilter,
    staffFilter,
    serviceFilter,
  ]);

  const renderSummaryCards = () => {
    if (!summaryData) return null;

    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid sx={{ sx: 12, md: 6, lg: 3 }}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Total Revenue
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {summaryData.totalRevenue?.toFixed(2) || "0.00"} birr
            </Typography>
          </Paper>
        </Grid>
        <Grid sx={{ sx: 12, md: 6, lg: 3 }}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Appointments
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {summaryData.totalAppointments || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid sx={{ sx: 12, md: 6, lg: 3 }}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Completed
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {summaryData.completedAppointments || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid sx={{ sx: 12, md: 6, lg: 3 }}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Avg. Duration
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {(summaryData.averageServiceTime &&
                Number(summaryData.averageServiceTime)?.toFixed(2)) ||
                0}{" "}
              mins
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  const renderTable = () => {
    const filteredData = reportData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    if (filteredData.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography>No data available for the selected criteria</Typography>
        </Box>
      );
    }

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>
                {reportType === "staff-performance" ? "Staff" : "Branch"}
              </TableCell>
              <TableCell>
                {reportType === "staff-performance"
                  ? "Average Service Time"
                  : "Service"}
              </TableCell>
              <TableCell>
                {reportType === "staff-performance"
                  ? "Appointment Count"
                  : "Staff"}
              </TableCell>
              {reportType !== "staff-performance" &&
                reportType !== "service-analysis" && (
                  <TableCell>Customer</TableCell>
                )}
              {reportType !== "staff-performance" &&
                reportType !== "service-analysis" && (
                  <TableCell>Duration</TableCell>
                )}
              {reportType !== "staff-performance" &&
                reportType !== "service-analysis" && (
                  <TableCell>Status</TableCell>
                )}
              {reportType === "revenue" && (
                <TableCell align="right">Amount</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row: any) => (
              <TableRow key={row?.id}>
                <TableCell>
                  {dayjs(row?.date).format("MMM D, YYYY h:mm A")}
                </TableCell>
                <TableCell>
                  {reportType === "staff-performance" ||
                  reportType === "service-analysis"
                    ? row?.name
                    : row?.branchName}
                </TableCell>
                <TableCell>
                  {reportType === "staff-performance" ||
                  reportType === "service-analysis"
                    ? row?.avgServiceTime + " mins"
                    : row?.serviceName}
                </TableCell>
                <TableCell>
                  {reportType === "staff-performance" ||
                  reportType === "service-analysis"
                    ? row?.appointmentCount
                    : row?.staffName}
                </TableCell>
                {reportType !== "staff-performance" &&
                  reportType !== "service-analysis" && (
                    <TableCell>{row?.customerName}</TableCell>
                  )}
                {reportType !== "staff-performance" &&
                  reportType !== "service-analysis" && (
                    <TableCell>{row?.duration} mins</TableCell>
                  )}
                {reportType !== "staff-performance" &&
                  reportType !== "service-analysis" && (
                    <TableCell>
                      {row.status && (
                        <Chip
                          label={row.status}
                          size="small"
                          sx={{ textTransform: "capitalize" }}
                          color={
                            row.status === "completed"
                              ? "success"
                              : row.status === "cancelled"
                              ? "error"
                              : "default"
                          }
                        />
                      )}
                    </TableCell>
                  )}
                {reportType === "revenue" && (
                  <TableCell align="right">${row.amount?.toFixed(2)}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderChart = () => {
    // Placeholder for chart visualization
    return (
      <Box
        sx={{
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.grey[100],
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Chart visualization will be displayed here
        </Typography>
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Analytics & Reports
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_: any, newValue) => setActiveTab(newValue)}
            sx={{ minHeight: "auto" }}
          >
            <Tab label="Sales" icon={<BarChart fontSize="small" />} />
            {/* <Tab label="Appointments" icon={<DateRange fontSize="small" />} /> */}
            {/* <Tab label="Staff" icon={<Person fontSize="small" />} /> */}
            {/* <Tab label="Services" icon={<Spa fontSize="small" />} /> */}
          </Tabs>

          {/* <Box sx={{ display: "flex", gap: 2 }}>
            <Tooltip title="Table View">
              <IconButton
                onClick={() => setViewMode("table")}
                color={viewMode === "table" ? "primary" : "default"}
              >
                <TableChart />
              </IconButton>
            </Tooltip>
            <Tooltip title="Chart View">
              <IconButton
                onClick={() => setViewMode("chart")}
                color={viewMode === "chart" ? "primary" : "default"}
              >
                <PieChart />
              </IconButton>
            </Tooltip>
          </Box> */}
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Report Type</InputLabel>
            <Select
              value={reportType}
              label="Report Type"
              onChange={(e) => setReportType(e.target.value)}
              size="small"
            >
              {reportTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {/* <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) =>
                setStartDate(
                  newValue instanceof Date
                    ? dayjs(newValue)
                    : (newValue as Dayjs | null)
                )
              }
              maxDate={endDate ?? undefined}
              slots={{
                textField: (params) => (
                  <TextField {...params} size="small" sx={{ width: 180 }} />
                ),
              }}
            /> */}
            <Typography>to</Typography>
            {/* <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) =>
                setEndDate(
                  newValue instanceof Date
                    ? dayjs(newValue)
                    : (newValue as Dayjs | null)
                )
              }
              minDate={startDate ?? undefined}
              slots={{
                textField: (params) => (
                  <TextField {...params} size="small" sx={{ width: 180 }} />
                ),
              }}
            /> */}
          </Box>

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Branch</InputLabel>
            <Select
              value={branchFilter}
              label="Branch"
              onChange={(e) => setBranchFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="all">All Branches</MenuItem>
              {branches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Staff</InputLabel>
            <Select
              value={staffFilter}
              label="Staff"
              onChange={(e) => setStaffFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="all">All Staff</MenuItem>
              {staffMembers
                ?.filter((s: any) => s?.roleId > 1)
                .map((staff) => (
                  <MenuItem key={staff.id} value={staff.id}>
                    {staff.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* <TextField
            label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
          /> */}
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={fetchReportData}
            disabled={loading}
            sx={{ backgroundColor: theme.palette.primary.main }}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<FilterAlt />}
            onClick={handleResetFilters}
            disabled={loading}
          >
            Reset Filters
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => handleDownload("csv")}
            disabled={loading}
          >
            CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => handleDownload("pdf")}
            disabled={loading}
          >
            PDF
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {renderSummaryCards()}

      <Paper elevation={3}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : viewMode === "table" ? (
          renderTable()
        ) : (
          renderChart()
        )}
      </Paper>
    </Container>
  );
};

export default ReportPage;
