import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import LockIcon from "@mui/icons-material/Lock";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import Logout from "@mui/icons-material/Logout";
import { useSelector } from 'react-redux';
import SettingsIcon from '@mui/icons-material/Settings';

export default function AccountMenu() {
  const permission = useSelector((state)=>state.auth.permissions);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [profilePicture, setProfilePicture] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  // const token = localStorage.getItem("response-token");
  // const EmpId = localStorage.getItem("EmpID");
  const  token = useSelector((state) => state.auth.token);
  const  EmpId = useSelector((state) => state.auth.empId);

  React.useEffect(() => {
    fetchProfilePicture();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchProfilePicture = async () => {
    try {
      const response = await axios.get(
            `/apigateway/hrms/employee/profilePicture/${EmpId}`,
        //`/apigateway/hrms/employee/profilePicture/${EmpId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "arraybuffer",
        }
      );
      if (response.status === 200) {
        const contentType = response.headers["content-type"];
        const blob = new Blob([response.data], { type: contentType });
        const imageUrl = URL.createObjectURL(blob);
        setProfilePicture(imageUrl);
      }
    } catch (error) {
      console.error("Error fetching profile picture", error);
    }
  };

  const handleLogout = () => {
    setLoading(true);
    axios
      .post(
        `/apigateway/api/user/logout`,
        {
          deviceInfo: {
            deviceId: "D1",
            deviceType: "DEVICE_TYPE_ANDROID",
            notificationToken: null,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setTimeout(() => {
            toast.success("Logout Successful.", {
              position: "top-center",
              theme: "colored",
            });
            navigate("/");
            window.location.reload();
            localStorage.clear();
            setLoading(false);
          }, 4000);
        }
      })
      .catch((error) => {
        localStorage.clear();
        toast.error(error.response.data.message || "Error while logging out.");
        window.location.reload();
        setLoading(false);
      });
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            {loading ? (
              <LoadingPage />
            ) : profilePicture ? (
              <Avatar src={profilePicture} />
            ) : (
              <Avatar />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {(permission.includes("BASIC_HRMS")) &&<>
        <MenuItem component={Link} to="/MyProfileDetails" onClick={handleClose}>
          <ListItemIcon>
              <Avatar fontSize="small" />
          </ListItemIcon>
          My Profile
        </MenuItem>
         
        <MenuItem
          component={Link}
          to="/ChangepasswordForm"
          onClick={handleClose}
        >
          <ListItemIcon>
            <Avatar>
              <LockIcon fontSize="small" />
            </Avatar>
          </ListItemIcon>
          Change Password
        </MenuItem>
        </>
         }

        {(permission.includes("MANAGE_PERMISSION")) &&
        <MenuItem component={Link} to="/ManageRoles" onClick={handleClose}>
        <ListItemIcon>
          <Avatar>
            <SupervisorAccountIcon fontSize="small" />
          </Avatar>
        </ListItemIcon>
        Manage Permission
      </MenuItem>
        }
        <Divider />
        {(permission.includes("BASIC_HRMS")) &&
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
        }
      </Menu>
    </React.Fragment>
  );
}
