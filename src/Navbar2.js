import React, { useState, useEffect } from "react";
import HomeIcon from "@mui/icons-material/Home";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  useTheme,
  Modal,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GroupIcon from "@mui/icons-material/Group";
import MyProfile from "./MyProfile";
import logoImg from "./Images/logo.png";
import { useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";

const AppNavbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);
  const empId = useSelector((state) => state.auth.empId);
  const name = useSelector((state) => state.auth.name);
  const roles = useSelector((state) => state.auth.roles);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoginButton, setShowLoginButton] = useState(true);

  useEffect(() => {
    if (location.pathname === "/login") {
      setShowLoginButton(false);
    } else {
      setShowLoginButton(true);
    }
  }, [location.pathname]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleLogin = () => {
    setShowLoginButton(false);
    navigate("/login");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <AppBar
        sx={{
          background: "linear-gradient(208deg, #ab2217, white)",
          height: "80px",
          position: "fixed",
          zIndex: 1200,
          padding: "5px 20px",
        }}
      >
        {/* <Container sx={{border:'2px solid green',width:'120%',margin:'0' }}> */}
        <Toolbar disableGutters>
          <Link style={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <img src={logoImg} alt="Logo" style={{ height: "40px" }} />
          </Link>

          {empId ? (
            <>
              {isMobile ? (
                <Box>
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMenu}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
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
                    <MenuItem onClick={handleClose}>
                      <Typography style={{ color: "white" }}>{name}</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleClickOpen}>
                      <GroupIcon sx={{ mr: 1, color: "white" }} /> View Roles
                    </MenuItem>
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <MenuItem component={Link} to={"/"}>
                        <HomeIcon />
                      </MenuItem>
                      <MyProfile />
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ mr: 2, color: "white" }}>{name}</Typography>
                  <Tooltip title="View Roles" arrow>
                    <IconButton onClick={handleClickOpen} color="inherit">
                      <GroupIcon />
                    </IconButton>
                  </Tooltip>
                  <MenuItem component={Link} to={"/"}>
                    <HomeIcon />
                  </MenuItem>
                  <MyProfile />
                </Box>
              )}
            </>
          ) : (
            showLoginButton && (
              <Button
                onClick={handleLogin}
                sx={{
                  my: 1,
                  mx: 1.5,
                  backgroundColor: "white",
                  color: "black",
                  "&:hover": { backgroundColor: "#fff", color: "black" },
                }}
              >
                Login
              </Button>
            )
          )}
        </Toolbar>
        {/* </Container> */}
      </AppBar>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="roles-modal-title"
        aria-describedby="roles-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="roles-modal-title"
            variant="h6"
            component="h2"
            style={{ textAlign: "center" }}
          >
            Roles
          </Typography>
          <ul
            style={{ listStyleType: "none", padding: 0, textAlign: "center" }}
          >
            {roles.map((role, index) => (
              <li key={index}>{role}</li>
            ))}
          </ul>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="contained" onClick={handleClose}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default AppNavbar;
