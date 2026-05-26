import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loginData, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  // const [notificationAnchorEl, setNotificationAnchorEl] =
  //   useState<null | HTMLElement>(null);

  // Define allowed roles as a type
  type UserRole = "Customer" | "Manager" | "Receptionist" | "Staff";

  // Navigation links for each role
  const roleBasedLinks: Record<UserRole, { label: string; path: string }[]> = {
    Customer: [
      { label: "Home", path: "/" },
      // { label: "Dashboard", path: "/dashboard" },
      { label: "Book Appointment", path: "/book" },
      { label: "History", path: "/history" },
    ],
    Manager: [
      { label: "Home", path: "/" },
      { label: "Bookings", path: "/bookings" },
      { label: "Customers", path: "/customers" },
      { label: "Staff", path: "/staff" },
      { label: "Inventory", path: "/inventory" },
      { label: "Reports", path: "/reports" },
      { label: "Settings", path: "/settings" },
      { label: "Messages", path: "/messages" },
    ],
    Receptionist: [
      { label: "Home", path: "/" },
      // { label: "Book Appointment", path: "/book" },
      { label: "Bookings", path: "/bookings" },
      { label: "Customers", path: "/customers" },
      { label: "Messages", path: "/messages" },
    ],
    Staff: [
      { label: "Home", path: "/" },
      // { label: "Dashboard", path: "/dashboard" },
      { label: "Appointments", path: "/my-appointments" },
    ],
  };

  // Safely get the user's role as UserRole, defaulting to "customer"
  const userRole: UserRole =
    (loginData?.user?.role?.name as UserRole) || "customer";

  const currentLinks = isAuthenticated
    ? roleBasedLinks[userRole as UserRole]
    : [
        { label: "Home", path: "/" },
        { label: "Service", path: "#service" },
        { label: "About Us", path: "#about-us" },
        { label: "Branch", path: "#branch" },
        { label: "Contact", path: "#contact" },
        { label: "Login", path: "/login" },
      ];

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
  //   setNotificationAnchorEl(event.currentTarget);
  // };

  const handleClose = () => {
    setAnchorEl(null);
    // setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/");
  };

  const handleNavigation = (path: string) => {
    if (path === "/") {
      navigate("/");
    } else if (path.startsWith("#")) {
      const el = document.getElementById(path.substring(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(path);
    }
    setMobileOpen(false);
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: theme.palette.primary.main }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "1.5rem",
          }}
          onClick={() => navigate("/")}
        >
          ሳምር የውበት ሳሎን
        </Typography>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {currentLinks?.map((link: any) => (
              <Button
                key={link.path}
                color="inherit"
                onClick={() => handleNavigation(link.path)}
                sx={{
                  mx: 1,
                  fontWeight: location.pathname === link.path ? 700 : 400,
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Right side icons */}
        <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
          {isAuthenticated && (
            <>
              {/* <IconButton
                size="large"
                aria-label="show notifications"
                color="inherit"
                onClick={handleNotificationClick}
              >
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton> */}

              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                sx={{ ml: 1 }}
              >
                <AccountCircle />
              </IconButton>
            </>
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {/* Mobile menu */}
      {isMobile && mobileOpen && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 2,
            bgcolor: theme.palette.primary.dark,
          }}
        >
          {currentLinks.map((link) => (
            <Button
              key={link.path}
              color="inherit"
              fullWidth
              onClick={() => handleNavigation(link.path)}
              sx={{
                justifyContent: "flex-start",
                px: 3,
                py: 1.5,
                textAlign: "left",
                fontWeight: location.pathname === link.path ? 700 : 400,
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>
      )}

      {/* User menu */}
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      {/* Notifications menu */}

      {/* <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>New appointment booked</MenuItem>
        <MenuItem onClick={handleClose}>Customer review received</MenuItem>
        <MenuItem onClick={handleClose}>System update available</MenuItem>
      </Menu> */}
    </AppBar>
  );
};

export default Navbar;
