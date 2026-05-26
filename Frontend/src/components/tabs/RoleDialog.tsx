import { Cancel, Save } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Role } from "../../types";

interface RoleDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (role: Role) => void;
  role?: Role | null;
}

const RoleDialog = ({ open, onClose, onSave, role }: RoleDialogProps) => {
  const [name, setName] = useState(role?.name || "");

  useEffect(() => {
    if (role) {
      setName(role.name);
    } else {
      resetForm();
    }
  }, [role]);

  const resetForm = () => {
    setName("");
  };

  const handleSave = () => {
    onSave({
      id: role?.id || 0,
      name,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{role ? "Edit Service" : "Add New Service"}</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Role Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<Cancel />} color="error">
          Cancel
        </Button>
        <Button onClick={handleSave} startIcon={<Save />} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleDialog;
