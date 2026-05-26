import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
  Favorite,
} from "@mui/icons-material";

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "About Us", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
  ];

  const services = [
    { label: "Hair Styling", href: "/services/hair" },
    { label: "Makeup", href: "/services/makeup" },
    { label: "Nail Care", href: "/services/nails" },
    { label: "Spa Treatments", href: "/services/spa" },
    { label: "Skin Care", href: "/services/skin" },
  ];

  const contactInfo = [
    { icon: <LocationOn />, text: "Gofa Gebriel, Addis Ababa, Ethiopia" },
    { icon: <Phone />, text: "+251967274003 | +251984869468" },
    { icon: <Email />, text: "info@samrrrbeautysalon.com" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
        pt: 8,
        pb: 4,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Salon */}
          <Grid sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              ሳምር የውበት ሳሎን
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your premier destination for luxury beauty treatments. We're
              committed to helping you look and feel your absolute best with our
              expert services.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <IconButton
                aria-label="Facebook"
                sx={{
                  color: theme.palette.common.white,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.light,
                  },
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                aria-label="Instagram"
                sx={{
                  color: theme.palette.common.white,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.light,
                  },
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                aria-label="Twitter"
                sx={{
                  color: theme.palette.common.white,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.light,
                  },
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                aria-label="LinkedIn"
                sx={{
                  color: theme.palette.common.white,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.light,
                  },
                }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid sx={{}}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Quick Links
            </Typography>
            <List dense>
              {quickLinks.map((link) => (
                <ListItem key={link.label} disableGutters>
                  <Link
                    href={link.href}
                    color="inherit"
                    underline="hover"
                    sx={{ display: "block", width: "100%" }}
                  >
                    {link.label}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Services */}
          <Grid sx={{}}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Our Services
            </Typography>
            <List dense>
              {services.map((service) => (
                <ListItem key={service.label} disableGutters>
                  <Link
                    href={service.href}
                    color="inherit"
                    underline="hover"
                    sx={{ display: "block", width: "100%" }}
                  >
                    {service.label}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Contact Info */}
          <Grid sx={{}}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Contact Us
            </Typography>
            <List dense>
              {contactInfo.map((item, index) => (
                <ListItem key={index} disableGutters sx={{ mb: 1 }}>
                  <ListItemIcon
                    sx={{ minWidth: 32, color: theme.palette.common.white }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Open Hours: Mon-Fri 9AM-8PM, Sat 10AM-6PM
            </Typography>
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: 4,
            backgroundColor: "rgba(255,255,255,0.2)",
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">
            © {currentYear} ሳምር የውበት ሳሎን. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ mt: { xs: 2, sm: 0 } }}>
            Made with{" "}
            <Favorite
              sx={{ color: theme.palette.secondary.main, fontSize: 16 }}
            />{" "}
            by Beauty Team
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
