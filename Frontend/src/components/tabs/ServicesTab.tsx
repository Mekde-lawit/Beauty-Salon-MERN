import { Add, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
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
import ServiceDialog from "./ServiceDialog";

const ServicesTab = () => {
  const theme = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiClient.get("/services");
        setServices(response.data);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to fetch services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleOpenDialog = (service: Service | null = null) => {
    setEditService(service);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditService(null);
  };

  const handleSaveService = async (
    serviceData: Omit<Service, "id"> & { id?: number }
  ) => {
    try {
      const formData = new FormData();

      // Ensure all required fields are included and valid
      if (!serviceData.name) toast.error("Name is required");
      if (!serviceData.price) toast.error("Price is required");
      if (!serviceData.estimatedTimeWomen)
        toast.error("Estimated time for women is required");

      // Append all fields to FormData
      formData.append("name", serviceData.name);
      formData.append("price", serviceData.price.toString());
      formData.append(
        "estimatedTimeWomen",
        serviceData.estimatedTimeWomen.toString()
      );

      // Append optional fields if they exist
      if (serviceData.description)
        formData.append("description", serviceData.description);
      if (serviceData.isForChildren)
        formData.append("isForChildren", serviceData.isForChildren.toString());
      if (serviceData.estimatedTimeChildren) {
        formData.append(
          "estimatedTimeChildren",
          serviceData.estimatedTimeChildren.toString()
        );
      }

      // Handle image separately
      if (serviceData.image && serviceData?.image) {
        formData.append("image", serviceData.image);
      }

      // Set headers for FormData
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (editService) {
        const response = await apiClient.put(
          `/services/${editService.id}`,
          formData,
          config // Include headers here too
        );
        setServices(
          services.map((s) => (s.id === editService.id ? response.data : s))
        );
      } else {
        const response = await apiClient.post("/services", formData, config);
        setServices([...services, response.data]);
      }

      handleCloseDialog();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to save service"
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to remove this?")) return;

    try {
      await apiClient.delete(`/services/${id}`);
      setServices(services.filter((s) => s.id !== id));
    } catch (err: any) {
      toast.info(
        err.response?.data?.message ||
          "Service is referenced and can not be delete"
      );
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ backgroundColor: theme.palette.primary.main }}
        >
          Add Service
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell>Duration (Women)</TableCell>
              {/* <TableCell>Tags</TableCell> */}
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(services) &&
              services?.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <Stack direction="row" alignItems="center" gap={1}>
                      {service.image && (
                        <img
                          src={FILE_URL + service.image}
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

                      {service.name}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={service.category}
                      size="small"
                      color="primary"
                      sx={{
                        textTransform: "capitalize",
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    ${service?.price && service?.price}
                  </TableCell>
                  <TableCell>{service.estimatedTimeWomen} mins</TableCell>
                  {/* <TableCell>
                  {service.tags?.map((tag) => (
                    <Chip key={tag} label={tag} size="small" sx={{ mr: 1 }} />
                  ))}
                </TableCell> */}
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(service)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ServiceDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveService}
        service={editService}
      />
    </>
  );
};

export default ServicesTab;
