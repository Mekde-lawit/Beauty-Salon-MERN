// src/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff4081", // Vibrant pink
      light: "#ff79b0", // Lighter pink
      dark: "#c60055", // Darker pink
      contrastText: "#fff", // White text for better contrast
    },
    secondary: {
      main: "#f50057", // Slightly different pink
    },
    background: {
      default: "#fff5f7", // Very light pink background
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded buttons
          textTransform: "none", // Disable auto-uppercase
        },
      },
    },
  },
});

export default theme;
