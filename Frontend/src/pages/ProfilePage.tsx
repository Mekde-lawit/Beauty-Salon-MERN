import {
  Cake as CakeIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import apiClient from "../lib/apiClients";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  sex: "male" | "female" | "other";
  avatar?: string;
}

const ProfilePage = () => {
  const theme = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: null as Date | null,
    sex: "other" as "male" | "female" | "other",
    avatarFile: null as File | null,
  });

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/auth/me");
        setProfile(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.address,
          dateOfBirth: response.data.dateOfBirth
            ? new Date(response.data.dateOfBirth)
            : null,
          sex: response.data.sex || "other",
          avatarFile: null,
        });
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : null,
        sex: profile.sex || "other",
        avatarFile: null,
      });
    }
    setAvatarPreview(null);
    setEditMode(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, avatarFile: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("email", formData.email);
      formPayload.append("phone", formData.phone);
      formPayload.append("address", formData.address);
      formPayload.append("sex", formData.sex);
      if (formData.dateOfBirth) {
        formPayload.append("dateOfBirth", formData.dateOfBirth.toISOString());
      }
      if (formData.avatarFile) {
        formPayload.append("avatar", formData.avatarFile);
      }

      const response = await apiClient.put("/users/" + profile?.id, formData, {
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      });

      setProfile(response.data);
      setEditMode(false);
      setAvatarPreview(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) return <CircularProgress />;
  if (!profile)
    return <Alert severity="error">{error || "Profile not found"}</Alert>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1">
            My Profile
          </Typography>
          {!editMode ? (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEditClick}
              sx={{ backgroundColor: theme.palette.primary.main }}
            >
              Edit Profile
            </Button>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancelEdit}
                color="error"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                disabled={loading}
                sx={{ backgroundColor: theme.palette.primary.main }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          {/* Avatar Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 200,
            }}
          >
            <Avatar
              src={avatarPreview || profile.avatar}
              sx={{
                width: 150,
                height: 150,
                mb: 2,
                fontSize: 60,
              }}
            >
              {profile.name.charAt(0)}
            </Avatar>

            {editMode && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />
                <Button
                  variant="outlined"
                  onClick={() => fileInputRef.current?.click()}
                  fullWidth
                >
                  Change Photo
                </Button>
              </>
            )}
          </Box>

          {/* Profile Details Section */}
          <Box sx={{ flex: 1 }}>
            {editMode ? (
              <>
                <TextField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <PersonIcon
                        sx={{ mr: 1, color: theme.palette.action.active }}
                      />
                    ),
                  }}
                />

                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <EmailIcon
                        sx={{ mr: 1, color: theme.palette.action.active }}
                      />
                    ),
                  }}
                />

                <TextField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <PhoneIcon
                        sx={{ mr: 1, color: theme.palette.action.active }}
                      />
                    ),
                  }}
                />

                <TextField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  InputProps={{
                    startAdornment: (
                      <LocationIcon
                        sx={{ mr: 1, color: theme.palette.action.active }}
                      />
                    ),
                  }}
                />

                <Box sx={{ mt: 2 }}>
                  <FormControl component="fieldset" required>
                    <FormLabel component="legend">Gender</FormLabel>
                    <RadioGroup
                      row
                      name="sex"
                      value={formData.sex}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sex: e.target.value as "male" | "female",
                        })
                      }
                    >
                      <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label="Male"
                      />
                      <FormControlLabel
                        value="female"
                        control={<Radio />}
                        label="Female"
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date of Birth"
                      value={formData.dateOfBirth}
                      onChange={(date) =>
                        setFormData({
                          ...formData,
                          dateOfBirth: date
                            ? date instanceof Date
                              ? date
                              : date.toDate()
                            : null,
                        })
                      }
                      maxDate={new Date()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          InputProps: {
                            startAdornment: (
                              <CakeIcon
                                sx={{
                                  mr: 1,
                                  color: theme.palette.action.active,
                                }}
                              />
                            ),
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PersonIcon
                    sx={{ mr: 2, color: theme.palette.text.secondary }}
                  />
                  <Typography variant="body1">{profile.name}</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <EmailIcon
                    sx={{ mr: 2, color: theme.palette.text.secondary }}
                  />
                  <Typography variant="body1">{profile.email}</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PhoneIcon
                    sx={{ mr: 2, color: theme.palette.text.secondary }}
                  />
                  <Typography variant="body1">
                    {profile.phone || "Not provided"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                  <LocationIcon
                    sx={{ mr: 2, mt: 0.5, color: theme.palette.text.secondary }}
                  />
                  <Typography variant="body1">
                    {profile.address || "No address provided"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CakeIcon
                    sx={{ mr: 2, color: theme.palette.text.secondary }}
                  />
                  <Typography variant="body1">
                    {profile.dateOfBirth
                      ? dayjs(profile.dateOfBirth).format("MMMM D, YYYY")
                      : "Not provided"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ mr: 2, fontWeight: 500 }}>
                    Gender:
                  </Typography>
                  <Typography variant="body1" textTransform="capitalize">
                    {!profile?.sex || profile.sex === "other"
                      ? "Not specified"
                      : profile.sex}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>

        {editMode && (
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: 500,
              }}
            >
              <TextField
                label="Current Password"
                type="password"
                fullWidth
                margin="normal"
              />
              <TextField
                label="New Password"
                type="password"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                sx={{
                  alignSelf: "flex-start",
                  backgroundColor: theme.palette.secondary.main,
                }}
              >
                Update Password
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ProfilePage;
