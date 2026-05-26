import { ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/AuthPage";
import theme from "./theme";
import Footer from "./components/Footer";
import SettingsPage from "./pages/SettingPage";
import StaffPage from "./pages/StaffPage";
import CustomerPage from "./pages/CustomerPage";
import BookPage from "./pages/BookPage";
import BookingsPage from "./pages/BookingsPage";
import InventoryPage from "./pages/InventoryPage";
import ProfilePage from "./pages/ProfilePage";
import HistoryPage from "./pages/HistoryPage";
import StylistAppointmentPage from "./pages/StylistAppointmentPage";
import MessagePage from "./pages/MessagePage";
import ReportPage from "./pages/ReportPage";

const ProtectedRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex flex-col flex-1 ml-64">
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />

          {/* Header */}
          <Navbar />

          <main
            className="flex-1 p-6 overflow-y-auto"
            style={{ minHeight: "calc(47vh)" }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                element={<ProtectedRoute isAuthenticated={isAuthenticated} />}
              >
                <Route
                  path="/my-appointments"
                  element={<StylistAppointmentPage />}
                />
                <Route path="/reports" element={<ReportPage />} />
                <Route path="/messages" element={<MessagePage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/book" element={<BookPage />} />
                <Route path="/customers" element={<CustomerPage />} />
                <Route path="/staff" element={<StaffPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route
                path="/login"
                element={isAuthenticated ? <HomePage /> : <LoginPage />}
              />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LocalizationProvider>
    </BrowserRouter>
  );
}
