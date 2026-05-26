import {
  Facebook,
  Instagram,
  LinkedIn,
  Telegram,
  Twitter,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Paper,
  Stack,
  styled,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import apiClient from "../lib/apiClients";

const PinkButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "scale(1.02)",
  },
  transition: theme.transitions.create(["background-color", "transform"], {
    duration: theme.transitions.duration.standard,
  }),
  boxShadow: theme.shadows[2],
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
}));

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      await apiClient.post("contact-us", formState);
      toast.success("Thank you for contacting us! We'll get back to you soon.");
      setFormState({ name: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error ||
          "Something went wrong. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box
      id="contact"
      sx={{
        py: 8,
        px: { xs: 2, sm: 3, md: 4 },
        backgroundColor: theme.palette.grey[50],
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            textAlign: "center",
            mb: 6,
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: theme.palette.text.primary,
            }}
          >
            Get in Touch
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Have questions? We'd love to hear from you.
          </Typography>
        </Box>

        {/* Content */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box
              sx={{
                p: 4,
                width: { md: "66.666%" },
                backgroundColor: "background.paper",
              }}
            >
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <TextField
                  label="Name"
                  variant="outlined"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                <Stack flexDirection={{ xs: "column", sm: "row" }} gap={2}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                  <TextField
                    label="Phone"
                    variant="outlined"
                    type="phone"
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    required
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Stack>

                <TextField
                  label="Message"
                  variant="outlined"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  fullWidth
                  multiline
                  rows={5}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                <PinkButton
                  loading={isLoading}
                  type="submit"
                  variant="contained"
                  size="large"
                >
                  Send Message
                </PinkButton>
              </Box>
            </Box>

            {/* Social Links Section */}
            <Box
              sx={{
                p: 4,
                width: { md: "33.333%" },
                backgroundColor: theme.palette.grey[100],
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                Follow Us
              </Typography>

              <Stack spacing={2}>
                <Button
                  href="http://facebook/sara dendir/"
                  startIcon={
                    <Box
                      sx={{
                        p: 1,
                        backgroundColor: "white",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Facebook color="primary" />
                    </Box>
                  }
                  sx={{
                    justifyContent: "flex-start",
                    color: theme.palette.text.secondary,
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                    textTransform: "none",
                    px: 0,
                  }}
                >
                  Facebook
                </Button>

                <Button
                  href="#"
                  startIcon={
                    <Box
                      sx={{
                        p: 1,
                        backgroundColor: "white",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Twitter color="primary" />
                    </Box>
                  }
                  sx={{
                    justifyContent: "flex-start",
                    color: theme.palette.text.secondary,
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                    textTransform: "none",
                    px: 0,
                  }}
                >
                  Twitter
                </Button>

                <Button
                  href="#"
                  startIcon={
                    <Box
                      sx={{
                        p: 1,
                        backgroundColor: "white",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Instagram color="primary" />
                    </Box>
                  }
                  sx={{
                    justifyContent: "flex-start",
                    color: theme.palette.text.secondary,
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                    textTransform: "none",
                    px: 0,
                  }}
                >
                  Instagram
                </Button>

                <Button
                  href="#"
                  startIcon={
                    <Box
                      sx={{
                        p: 1,
                        backgroundColor: "white",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Telegram color="primary" />
                    </Box>
                  }
                  sx={{
                    justifyContent: "flex-start",
                    color: theme.palette.text.secondary,
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                    textTransform: "none",
                    px: 0,
                  }}
                >
                  Telegram
                </Button>
              </Stack>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Contact;
