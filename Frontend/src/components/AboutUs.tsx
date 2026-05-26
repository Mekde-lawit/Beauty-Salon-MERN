import {
  Typography,
  Divider,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
} from "@mui/material";
import { pink } from "@mui/material/colors";
import {
  Spa as SpaIcon,
  Face as FaceIcon,
  Brush as BrushIcon,
} from "@mui/icons-material";

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Master Stylist",
    bio: "With over 15 years of experience, Sarah specializes in precision haircuts and color transformations.",
    icon: <BrushIcon fontSize="large" />,
  },
  {
    name: "Maria Garcia",
    role: "Skincare Specialist",
    bio: "Maria is a licensed esthetician passionate about creating customized skincare routines for all skin types.",
    icon: <FaceIcon fontSize="large" />,
  },
  {
    name: "David Chen",
    role: "Spa Director",
    bio: "David brings a holistic approach to wellness, combining massage therapy with modern spa techniques.",
    icon: <SpaIcon fontSize="large" />,
  },
];

const AboutUs = () => {
  const theme = useTheme();

  return (
    <Box
      id="about-us"
      sx={{
        py: 8,
        background: "linear-gradient(135deg, #fce4ec 0%, #fff 100%)",
        [theme.breakpoints.up("md")]: {
          py: 10,
        },
      }}
    >
      <Box
        sx={{
          maxWidth: 700,
          mx: "auto",
          textAlign: "center",
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(236, 64, 122, 0.08)",
          p: 4,
          [theme.breakpoints.down("sm")]: {
            mx: 2,
            p: 3,
          },
        }}
      >
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: pink[400],
            [theme.breakpoints.down("sm")]: {
              fontSize: "2rem",
            },
          }}
        >
          About Us
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            fontSize: "1.25rem",
            mb: 4,
          }}
        >
          Welcome to Beauty Salon! We are dedicated to providing top-notch
          beauty and wellness services in a relaxing and friendly environment.
          Our mission is to help you look and feel your best, every day.
        </Typography>

        <Divider sx={{ my: 4, bgcolor: pink[100] }} />

        <Typography
          variant="h5"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: pink[300],
            mt: 2,
          }}
        >
          Our Mission
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            fontSize: "1.1rem",
            mb: 4,
          }}
        >
          To empower our clients by enhancing their natural beauty and
          confidence through exceptional service, innovation, and care.
        </Typography>

        <Divider sx={{ my: 4, bgcolor: pink[100] }} />

        <Typography
          variant="h5"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: pink[300],
            mt: 2,
          }}
        >
          Our Vision
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            fontSize: "1.1rem",
            mb: 4,
          }}
        >
          To be the leading beauty destination, known for our passion,
          professionalism, and commitment to excellence in every client
          experience.
        </Typography>

        <Divider sx={{ my: 4, bgcolor: pink[100] }} />
      </Box>
    </Box>
  );
};

export default AboutUs;
