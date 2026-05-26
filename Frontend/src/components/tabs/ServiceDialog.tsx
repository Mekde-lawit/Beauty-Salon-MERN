import { Cancel, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Service } from "../../types";

interface ServiceDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (service: Service) => void;
  service?: Service | null;
}

const ServiceDialog = ({
  open,
  onClose,
  onSave,
  service,
}: ServiceDialogProps) => {
  const [name, setName] = useState(service?.name || "");
  const [image, setImage] = useState<File | null>();
  const [description, setDescription] = useState(service?.description || "");
  const [price, setPrice] = useState(service?.price.toString() || "");
  const [category, setCategory] = useState(service?.category || "hair");
  const [isForChildren, setIsForChildren] = useState(
    service?.isForChildren || false
  );
  const [timeWomen, setTimeWomen] = useState(
    service?.estimatedTimeWomen.toString() || ""
  );
  const [timeChildren, setTimeChildren] = useState(
    service?.estimatedTimeChildren?.toString() || ""
  );
  // const [tags, setTags] = useState(service?.tags?.join(", ") || "");

  useEffect(() => {
    if (service) {
      setName(service.name);
      setDescription(service.description || "");
      setPrice(service.price.toString());
      setCategory(service.category);
      setIsForChildren(service.isForChildren);
      setTimeWomen(service.estimatedTimeWomen.toString());
      setTimeChildren(service.estimatedTimeChildren?.toString() || "");
      // setTags(service.tags?.join(", ") || "");
    } else {
      resetForm();
    }
  }, [service]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("hair");
    setIsForChildren(false);
    setTimeWomen("");
    setTimeChildren("");
    // setTags("");
  };

  const handleSave = () => {
    onSave({
      id: service?.id || 0,
      name,
      description,
      price: parseFloat(price),
      category,
      isForChildren,
      estimatedTimeWomen: parseInt(timeWomen),
      estimatedTimeChildren: isForChildren
        ? parseInt(timeChildren || "0")
        : undefined,
      image: image as unknown as string,
      // tags: tags
      //   .split(",")
      //   .map((tag) => tag.trim())
      //   .filter((tag) => tag.length > 0),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{service ? "Edit Service" : "Add New Service"}</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Service Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Price ($)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="hair">Hair</MenuItem>
              <MenuItem value="skin">Skin</MenuItem>
              <MenuItem value="nails">Nails</MenuItem>
              <MenuItem value="spa">Spa</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Duration for Women (mins)"
            type="number"
            value={timeWomen}
            onChange={(e) => setTimeWomen(e.target.value)}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 15 }}
          />
          {/* <TextField
            label="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            fullWidth
            margin="normal"
          /> */}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isForChildren}
                onChange={(e) => setIsForChildren(e.target.checked)}
              />
            }
            label="Available for children"
          />
          {isForChildren && (
            <TextField
              label="Duration for Children (mins)"
              type="number"
              value={timeChildren}
              onChange={(e) => setTimeChildren(e.target.value)}
              sx={{ ml: 2, flex: 1 }}
              required={isForChildren}
              inputProps={{ min: 15 }}
            />
          )}
        </Box>
        <input
          type="file"
          onChange={(e) => {
            const file =
              e.target.files && e.target.files[0] ? e.target.files[0] : null;
            setImage(file);
          }}
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

export default ServiceDialog;
