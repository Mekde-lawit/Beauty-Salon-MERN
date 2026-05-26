import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
  Avatar,
  Typography,
} from "@mui/material";
import { Save, Cancel, Person } from "@mui/icons-material";
import apiClient from "../../lib/apiClients";
import { Branch } from "../../types";

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface BranchDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (branch: Branch) => void;
  branch?: Branch | null;
}

const BranchDialog = ({ open, onClose, onSave, branch }: BranchDialogProps) => {
  const [name, setName] = useState(branch?.name || "");
  const [location, setLocation] = useState(branch?.location || "");
  const [phone, setPhone] = useState(branch?.phone || "");
  const [contactPersonId, setContactPersonId] = useState<number | null>(
    branch?.contactPersonId || null
  );
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get("/users");
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    if (open) {
      fetchUsers();
      if (branch) {
        setName(branch.name);
        setLocation(branch.location);
        setPhone(branch.phone);
        setContactPersonId(branch.contactPersonId || null);
      } else {
        setName("");
        setLocation("");
        setPhone("");
        setContactPersonId(null);
      }
      setError(null);
    }
  }, [open, branch]);

  const handleSave = async () => {
    if (!name.trim() || !location.trim() || !phone.trim()) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      onSave({
        id: branch?.id || 0,
        name,
        location,
        phone,
        contactPersonId: contactPersonId === null ? undefined : contactPersonId,
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.console.error || "Failed to save branch");
    } finally {
      setLoading(false);
    }
  };

  // const selectedContact = users.find((user) => user.id === contactPersonId);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{branch ? "Edit Branch" : "Add New Branch"}</DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Branch Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Contact Person</InputLabel>
          <Select
            value={contactPersonId || ""}
            label="Contact Person"
            onChange={(e) =>
              setContactPersonId((e.target.value as number) || null)
            }
            renderValue={(selected) => {
              if (!selected) return <em>None</em>;
              const user = users.find((u) => u.id === selected);
              return (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={user?.avatar}
                    sx={{ width: 24, height: 24, mr: 1 }}
                  >
                    <Person fontSize="small" />
                  </Avatar>
                  <Typography>{user?.name}</Typography>
                </Box>
              );
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={user.avatar}
                    sx={{ width: 24, height: 24, mr: 1 }}
                  >
                    {user.name.charAt(0)}
                  </Avatar>
                  {user.name} ({user.email})
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          startIcon={<Cancel />}
          color="error"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          startIcon={<Save />}
          variant="contained"
          disabled={
            loading || !name.trim() || !location.trim() || !phone.trim()
          }
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BranchDialog;
