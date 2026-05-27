import {
  Cake as CakeIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useAuth } from "../context/AuthContext";
import apiClient from "../lib/apiClients";

const AuthPage = ({ isLogin = true }) => {
  const { setLoginData } = useAuth();
  const navigate = useNavigate();

  const theme = useTheme();
  const [isLoginForm, setIsLoginForm] = useState(isLogin);
  const [isLoading, setIsLoading] = useState(false);

  // Validation schemas
  const loginSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const registerSchema = yup.object({
    name: yup
      .string()
      .min(2, "Too short")
      .max(50, "Too long")
      .required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup
      .string()
      .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
      .required("Phone is required"),
    address: yup
      .string()
      .min(5, "Too short")
      .max(100, "Too long")
      .required("Address is required"),
    dateOfBirth: yup
      .date()
      .max(new Date(), "Date cannot be in future")
      .required("Birth date is required"),
    password: yup
      .string()
      .min(8, "Minimum 8 characters")
      .max(100, "Maximum 100 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: isLoginForm
      ? {
          email: "",
          password: "",
        }
      : {
          name: "",
          email: "",
          phone: "",
          address: "",
          sex: "other",
          dateOfBirth: "",
          password: "",
          confirmPassword: "",
        },

    validationSchema: isLoginForm ? loginSchema : registerSchema,

    onSubmit: async (values: any) => {
      try {
        if (isLoginForm) {
          const response = await apiClient.post("auth/login", values);
          const loginData = response.data;
          toast.success("Welcome.");
          sessionStorage.setItem("authToken", JSON.stringify(loginData));
          setLoginData(loginData);
          navigate("/");
          formik.resetForm();
        } else {
          const userData = {
            ...values,
            dateOfBirth: dayjs(values.dateOfBirth).format("YYYY-MM-DD"),
            status: "unauthenticated",
            roleId: 1,
          };

          await apiClient.post("auth/register", userData);
          toast.success("Registered successfully.");
          setIsLoginForm(!isLoginForm);
          formik.resetForm();
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.error || "Authentication error");
        console.error("Authentication error:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Box textAlign="center" mb={4}>
          <LockIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />
          <Typography variant="h4" component="h1" sx={{ mt: 2 }}>
            {isLoginForm ? "Login" : "Register"}
          </Typography>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          {!isLoginForm && (
            <>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Full Name"
                value={formik.values.name || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={
                  formik.touched.name && typeof formik.errors.name === "string"
                    ? formik.errors.name
                    : undefined
                }
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <PersonIcon
                      sx={{ mr: 1, color: theme.palette.action.active }}
                    />
                  ),
                }}
              />

              <DatePicker
                label="Date of Birth"
                value={formik.values.dateOfBirth}
                onChange={(date) => formik.setFieldValue("dateOfBirth", date)}
                maxDate={dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "normal",
                    error:
                      formik.touched.dateOfBirth &&
                      Boolean(formik.errors.dateOfBirth),
                    helperText:
                      formik.touched.dateOfBirth &&
                      typeof formik.errors.dateOfBirth === "string"
                        ? formik.errors.dateOfBirth
                        : undefined,
                    InputProps: {
                      startAdornment: (
                        <CakeIcon
                          sx={{ mr: 1, color: theme.palette.action.active }}
                        />
                      ),
                    },
                  },
                }}
              />
            </>
          )}

          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={
              formik.touched.email && typeof formik.errors.email === "string"
                ? formik.errors.email
                : undefined
            }
            margin="normal"
            InputProps={{
              startAdornment: (
                <EmailIcon sx={{ mr: 1, color: theme.palette.action.active }} />
              ),
            }}
          />

          {!isLoginForm && (
            <>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone Number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={
                  formik.touched.phone &&
                  typeof formik.errors.phone === "string"
                    ? formik.errors.phone
                    : undefined
                }
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
                fullWidth
                id="address"
                name="address"
                label="Address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={
                  formik.touched.address &&
                  typeof formik.errors.address === "string"
                    ? formik.errors.address
                    : undefined
                }
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <HomeIcon
                      sx={{ mr: 1, color: theme.palette.action.active }}
                    />
                  ),
                }}
              />
            </>
          )}

          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={
              formik.touched.password &&
              typeof formik.errors.password === "string"
                ? formik.errors.password
                : undefined
            }
            margin="normal"
            InputProps={{
              startAdornment: (
                <LockIcon sx={{ mr: 1, color: theme.palette.action.active }} />
              ),
            }}
          />

          {!isLoginForm && (
            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword &&
                typeof formik.errors.confirmPassword === "string"
                  ? formik.errors.confirmPassword
                  : undefined
              }
              margin="normal"
              InputProps={{
                startAdornment: (
                  <LockIcon
                    sx={{ mr: 1, color: theme.palette.action.active }}
                  />
                ),
              }}
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            loading={isLoading}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            {isLoginForm ? "Login" : "Register"}
          </Button>
        </form>

        <Divider sx={{ my: 3 }} />

        <Box textAlign="center">
          <Typography variant="body2">
            {isLoginForm
              ? "Don't have an account? "
              : "Already have an account? "}
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsLoginForm(!isLoginForm);
                formik.resetForm();
              }}
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 500,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {isLoginForm ? "Register" : "Login"}
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthPage;
