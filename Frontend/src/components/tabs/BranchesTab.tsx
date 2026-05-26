import { Add, Delete, Edit } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
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
import { Branch } from "../../types";
import BranchDialog from "./BranchDialog";

const BranchesTab = () => {
  const theme = useTheme();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editBranch, setEditBranch] = useState<Branch | null>(null);

  const fetchBranches = async () => {
    try {
      const response = await apiClient.get("/branches");
      setBranches(response.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleOpenDialog = (branch: Branch | null = null) => {
    setEditBranch(branch);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditBranch(null);
  };

  const handleSaveBranch = async (
    branchData: Omit<Branch, "id"> & { id?: number }
  ) => {
    try {
      if (editBranch) {
        const response = await apiClient.put(
          `/branches/${editBranch.id}`,
          branchData
        );
        setBranches(
          branches.map((b) => (b.id === editBranch.id ? response.data : b))
        );
        fetchBranches();
      } else {
        const response = await apiClient.post("/branches", branchData);
        setBranches([...branches, response.data]);
      }
      handleCloseDialog();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save branch");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to remove this?")) return;

    try {
      await apiClient.delete(`/branches/${id}`);
      setBranches(branches.filter((b) => b.id !== id));
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
          Add Branch
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Branch Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Contact Person</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell>{branch.name}</TableCell>
                <TableCell>{branch.location}</TableCell>
                <TableCell>{branch.phone}</TableCell>
                <TableCell>
                  {branch?.contactPerson && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={branch.contactPerson.name}
                        sx={{ width: 32, height: 32, mr: 1 }}
                      >
                        {branch.contactPerson.name.charAt(0)}
                      </Avatar>
                      {branch.contactPerson.name}
                    </Box>
                  )}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(branch)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(branch.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <BranchDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveBranch}
        branch={editBranch}
      />
    </>
  );
};

export default BranchesTab;
