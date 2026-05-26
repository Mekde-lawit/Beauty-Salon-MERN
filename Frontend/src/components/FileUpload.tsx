import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Box, Chip, Typography } from "@mui/material";
import { ChangeEvent, DragEvent, FC, useRef, useState } from "react";

interface FileUploadProps {
  label?: string;
  fileTypes?: string;
  required?: boolean;
  multiple?: boolean;
  info?: string;
  onChange: (file: File | null) => void;
}

const FileUpload: FC<FileUploadProps> = ({
  label = "Attachment",
  fileTypes = "image/*",
  required = false,
  multiple = false,
  info = "",
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0] ?? null;
    setFileToState(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFileToState(file);
  };

  const setFileToState = (file: File | null) => {
    setError(null);
    setSelectedFile(file);
    onChange(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Box display="flex" flexDirection="column" width="100%">
      <Box display="flex" alignItems="center" mb={1} gap={1}>
        <InfoOutlinedIcon color="action" fontSize="small" />
        <Typography variant="subtitle2" color="text.primary">
          {label}
        </Typography>
        {required && (
          <Typography color="error" component="span" fontWeight={700}>
            *
          </Typography>
        )}
      </Box>

      {selectedFile ? (
        <Chip
          label={selectedFile.name}
          onDelete={clearFile}
          color="default"
          sx={{ mb: 1, maxWidth: 300 }}
        />
      ) : (
        <Box
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          sx={{
            border: "2px dashed #e0e0e0",
            borderRadius: 2,
            bgcolor: "#fafafa",
            py: 4,
            px: 2,
            textAlign: "center",
            cursor: "pointer",
            transition: "background 0.2s",
            "&:hover": { bgcolor: "#f5f5f5" },
            mb: 1,
          }}
        >
          <UploadFileIcon color="action" sx={{ fontSize: 40, mb: 1 }} />
          <Typography color="text.secondary">
            Click or drag file to upload
          </Typography>
        </Box>
      )}

      <input
        id="file-upload"
        type="file"
        accept={fileTypes}
        ref={inputRef}
        multiple={multiple}
        style={{ display: "none" }}
        onChange={handleChange}
      />

      {info && (
        <Typography variant="caption" color="text.secondary" mt={0.5}>
          {info}
        </Typography>
      )}
      {error && (
        <Typography variant="caption" color="error" mt={0.5}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default FileUpload;
