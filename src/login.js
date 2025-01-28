import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./Store/authSlice";
import LoadingPage from "./LoadingPage";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Container,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { Padding, Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import alphaLogo from "./Images/alphaLogo.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (values) => {
    dispatch(login(values))
      .unwrap()
      .then(() => {
        toast.success("Login successful", {
          position: "top-center",
          theme: "colored",
        });
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Incorrect Credentials", {
          position: "top-center",
          theme: "colored",
        });
      });
  };


  const inputContainerStyle = {
    position: "relative",
    width: "100%",
    marginBottom: "1rem",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    paddingRight: "40px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
    outline: "none",
  };

  const iconStyle = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#777",
  };

  const errorStyle = {
    color: "red",
    fontSize: "12px",
    marginTop: "4px",
  };

  const style = {
    width: "100%",
    height: "46px",
    padding: "8px",
    marginBottom: "5%",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        height: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading && <LoadingPage />}
      <Paper
        elevation={5}
        sx={{
          p: "2rem",
          borderRadius: "25px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Link to="/">
            <img
              src={alphaLogo}
              style={{ width: "80px", height: "80px" }}
              alt="alphaLogo"
            />
          </Link>
          <Typography
            variant="h5"
            component="h1"
            sx={{ mt: 2, fontWeight: 600 }}
          >
            Welcome
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "#666" }}>
            Please log in to continue
          </Typography>
        </Box>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched }) => (
            <Form>
              <Field
                name="email"
                sx={{
                  backgroundColor: "white",
                  Padding: "0px",
                  textDecoration: "none",
                  border: "none",
                }}
              >
                {({ field }) => (
                  <input
                    {...field}
                    placeholder="Enter your email address"
                    fullWidth
                    margin="normal"
                    type="email"
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    InputProps={{
                      disableUnderline: true,
                    }}
                    style={style}
                  />
                )}
              </Field>
              <Field name="password">
                {({ field }) => (
                  <div style={inputContainerStyle}>
                    <input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      style={inputStyle}
                    />
                    <div style={iconStyle} onClick={toggleShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </div>
                    {touched.password && errors.password && (
                      <div style={errorStyle}>{errors.password}</div>
                    )}
                  </div>
                )}
              </Field>
              <Box sx={{ textAlign: "right", mt: 1 }}>
                <Link
                  to="/Forgotpassword"
                  style={{
                    color: "#000000",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  Forgot Password?
                </Link>
              </Box>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  backgroundColor: "var(--red)",
                  color: "var(--white)",
                  transition: "transform",
                  "&:hover": {
                    backgroundColor: "var(--red)",
                    transform: "scale(1.03)",
                  },
                }}
                disabled={loading || !values.email || !values.password}
              >
                Log In
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default Login;
