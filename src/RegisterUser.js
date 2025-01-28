import React, { useState } from "react";
import axios from "axios";
import { Formik, Form } from "formik";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  // Breadcrumbs,
  Link,
  Paper,
  Snackbar,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MuiAlert from "@mui/material/Alert";
import LoadingPage from "./LoadingPage";
import { registerUserSchema } from "./Validations/registeryup";
import "./Hrmscss/VarColors.css";


const theme = createTheme({
  palette: {
    primary: {
      main: "#ab2217",
    },
    secondary: {
      main: "rgb(114, 108, 108)",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

const style = {
  width: '100%',
  height: '46px',
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
}

const PassStyle = {
  position: 'absolute',
  right: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 1
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Registerformik() {

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const token = useSelector((state) => state.auth.token);

  const initialValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    employeeType: "Contractual",
  };
  const createPayload = (values) => ({
    firstName: values.firstName,
    middleName: values.middleName,
    lastName: values.lastName,
    email: values.email,
    password: values.password,
    confirmPassword: values.confirmPassword,
  });

  const handleResend = (values) => {
    setLoading(true);
    axios
      .post(
        "/apigateway/api/auth/resendRegisterVerifyEmail",
        createPayload(values),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setSnackbar({
          open: true,
          message: "Mail resend successfully. Please verify your email.",
          severity: "success",
        });
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          message:
            error.response?.data?.message ||
            "Please fill the above details before sending mail",
          severity: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    axios
      .post(
        "/apigateway/api/auth/register",
        {
          ...createPayload(values),
          employeeType: values.employeeType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        resetForm();
        setSnackbar({
          open: true,
          message: "Registered successfully. Please verify your email.",
          severity: "success",
        });
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          message:
            error.response?.data?.message ||
            "An error occurred while registering the user",
          severity: "error",
        });
      })
      .finally(() => {
        setLoading(false);
        setSubmitting(false);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="100%" >
        {loading && <LoadingPage />}
        <Snackbar
          sx={{
            marginBottom: "60ch",
            marginLeft: "30ch",
          }}
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
        <Box
          display='flex'
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
          width='75vw'>

          <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 6, width: "100%", maxWidth: 600, }}>
            <Formik
              initialValues={initialValues}
              validationSchema={registerUserSchema}
              onSubmit={handleSubmit} >

              {({ errors, touched, isSubmitting, values, handleChange, handleBlur }) => (
                <Form>
                  <Container>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <FormControl sx={{ width: '100%' }} variant="standard">
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            placeholder="First Name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.firstName && Boolean(errors.firstName)}
                            aria-describedby="firstName-helper-text"
                            style={style}
                          />
                          {touched.firstName && errors.firstName && (
                            <FormHelperText error id="firstName-helper-text">
                              {errors.firstName}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControl sx={{ width: '100%' }} variant="standard">
                          <input
                            type="text"
                            id="middleName"
                            name="middleName"
                            placeholder="Middle Name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.middleName && Boolean(errors.middleName)}
                            aria-describedby="middleName-helper-text"
                            style={style}
                          />
                          {touched.middleName && errors.middleName && (
                            <FormHelperText error id="middleName-helper-text">
                              {errors.middleName}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControl sx={{ width: '100%' }} variant="standard">
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            placeholder="Last Name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.lastName && Boolean(errors.lastName)}
                            aria-describedby="lastName-helper-text"
                            style={style}
                          />
                          {touched.lastName && errors.lastName && (
                            <FormHelperText error id="lastName-helper-text">
                              {errors.lastName}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl sx={{ width: '100%' }} variant="standard">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.email && Boolean(errors.email)}
                            aria-describedby="email-helper-text"
                            style={style}
                          />
                          {touched.email && errors.email && (
                            <FormHelperText error id="email-helper-text">
                              {errors.email}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl
                          fullWidth
                          error={touched.employeeType && Boolean(errors.employeeType)}
                          sx={{ marginBottom: 2 }}
                        >
                          <InputLabel>Employee Type</InputLabel>
                          <Select
                            name="employeeType"
                            value={values.employeeType}
                            onChange={handleChange}
                            label="Employee Type"
                            sx={{
                              height: '46px',
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#ccc'
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#ab2217'
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#ab2217'
                              }
                            }}
                          >
                            <MenuItem value="Contractual">Contractual</MenuItem>
                            <MenuItem value="FullTime">Full Time</MenuItem>
                          </Select>
                          {touched.employeeType && errors.employeeType && (
                            <FormHelperText>{errors.employeeType}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid><br></br>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl sx={{ width: '100%', position: 'relative', marginTop: '10px' }}>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.password && Boolean(errors.password)}
                            aria-describedby="password-helper-text"
                            style={style}
                          />
                          <div style={PassStyle}>
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </div>
                        </div>
                        {touched.password && errors.password && (
                          <FormHelperText sx={{ marginInlineStart: "3px" }} error id="password-helper-text">
                            {errors.password}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl sx={{ width: '100%', marginTop: "10px", position: 'relative' }}>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                            aria-describedby="confirmPassword-helper-text"
                            style={style}
                          />
                          <div style={PassStyle}>
                            <IconButton
                              aria-label="toggle confirmPassword visibility"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </div>
                        </div>
                        {touched.confirmPassword && errors.confirmPassword && (
                          <FormHelperText sx={{ marginInlineStart: "3px" }} error id="confirmPassword-helper-text">
                            {errors.confirmPassword}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Box mt={3}>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isSubmitting}
                        backgroundColor='#ab2217'
                      >
                        {isSubmitting ? "Registering..." : "Register User"}
                      </Button>
                      <span title="Fill the above details to Resend mail">
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            handleResend(values);
                          }}
                          variant="contained"
                          color="warning"
                          sx={{
                            marginLeft: "10%",
                            backgroundColor: "rgb(114, 108, 108)",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "green",
                            },
                          }}
                          disabled={
                            !values.firstName ||
                            !values.lastName ||
                            !values.email ||
                            !values.password ||
                            !values.confirmPassword
                          }
                        >
                          Resend
                        </Button>
                      </span>
                    </Box>
                  </Container>
                </Form>
              )}
            </Formik>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};


