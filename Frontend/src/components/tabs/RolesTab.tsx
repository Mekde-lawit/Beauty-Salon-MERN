import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import apiClient from "../../lib/apiClients";
import { Role } from "../../types";
import RoleDialog from "./RoleDialog";

const RolesTab = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await apiClient.get("/roles");
        setRoles(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch roles");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditRole(null);
  };

  const handleSaveRole = async (
    roleData: Omit<Role, "id"> & { id?: number }
  ) => {
    try {
      if (editRole) {
        const response = await apiClient.put(`/roles/${editRole.id}`, roleData);
        setRoles(roles.map((r) => (r.id === editRole.id ? response.data : r)));
      } else {
        const response = await apiClient.post("/roles", roleData);
        setRoles([...roles, response.data]);
      }
      handleCloseDialog();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save role");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        {/* <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ backgroundColor: theme.palette.primary.main }}
        >
          Add Role
        </Button> */}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role Name</TableCell>
              {/* <TableCell align="center">Actions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                {/* <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(role)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(role.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <RoleDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveRole}
        role={editRole}
      />
    </>
  );
};

export default RolesTab;
