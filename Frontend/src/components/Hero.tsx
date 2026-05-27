import { Box, Button, Typography, useTheme } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { pink } from "@mui/material/colors";

const Hero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      id="hero"
      sx={{
        position: "relative",
        width: "100%",
        height: isMobile ? "70vh" : "100vh",
        minHeight: isMobile ? "500px" : "600px",
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <Box
        component="img"
        src="/images/hero1.jpg"
        alt="Beauty salon interior"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          // filter: "brightness(0.7)",
        }}
      />

      {/* Content Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: isMobile ? "center" : "flex-start",
          textAlign: isMobile ? "center" : "left",
          padding: isMobile ? theme.spacing(4) : theme.spacing(8),
          color: pink[300],
          // backgroundColor: "rgba(0,0,0,0.3)",
        }}
      >
        <Typography
          variant={isMobile ? "h3" : "h2"}
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 3,
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            maxWidth: isMobile ? "100%" : "60%",
          }}
        >
          Your Beauty is Our Passion
        </Typography>

        <Typography
          variant={isMobile ? "body1" : "h6"}
          component="p"
          sx={{
            mb: 4,
            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            maxWidth: isMobile ? "100%" : "50%",
            lineHeight: 1.6,
          }}
        >
          We are dedicated to providing you with the best beauty services
          tailored to your needs. Our team of experts is here to help you look
          and feel your best.
        </Typography>

        <Button
          variant="contained"
          href="#contact"
          sx={{
            px: 4,
            py: 2,
            fontSize: isMobile ? "1rem" : "1.1rem",
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.common.white,
            "&:hover": {
              backgroundColor: theme.palette.secondary.dark,
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
};

export default Hero;
