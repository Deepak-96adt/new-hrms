import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Card from '@mui/material/Card';
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AssignRole from "./AssignRole";
import ManageAPI from './ManageAPI';
import ManageAPIRoleMapping from "./ManageAPIRoleMapping";
import LoadingPage from "./LoadingPage"; 
import { useSelector } from 'react-redux';
import "./Hrmscss/VarColors.css";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function ManageRoles() {
  // const token = localStorage.getItem("response-token");
  const  token = useSelector((state) => state.auth.token);
  
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [newDefaultRole, setNewDefaultRole] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
    fetchRoles();
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRoleId(null);
  };

  const fetchRoles = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/apigateway/api/role/getAllRoles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoles(response.data.content);
      setLoading(false)
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error(
        error.response.data.message || "Error fetching roles"
      );
      setLoading(false)
    }
  };

  const handleAddRole = async () => {
    try {
      setLoading(true)
      const response = await axios.post(
        "/apigateway/api/role/createRole",
        {
          role: newRole,
          defaultRole: newDefaultRole,
          userList: [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        fetchRoles();
        setNewRole("");
        setNewDefaultRole(false);
        toast.success(response.data);
        setLoading(false);
      }
    } catch (error) {
      toast.error(
        error.response.data.message || "Error adding role"
      );
      console.error("Error adding role:", error);
      setLoading(false);
    }
  };

  const handleSaveRole = async (id, role, defaultRole) => {
    try {
      setLoading(true)
      const response = await axios.put(
        "/apigateway/api/role/updateRole",
        {
          id,
          role,
          defaultRole,
          userList: [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        fetchRoles();
        setEditingRoleId(null);
        toast.success(response.data);
        setLoading(false)
      }
    } catch (error) {
      toast.error(
        error.response.data.message || "Error editing role"
      );
      console.error("Error editing role:", error);
      setLoading(false)
    }
  };

  const handleDeleteRole = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) {
      return;
    }

    try {
      setLoading(true)
      const response = await axios.delete(`/apigateway/api/role/deleteRole?roleId=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        fetchRoles();
        toast.success(response.data);
        setLoading(false)
      }
    } catch (error) {
      toast.error("Error deleting role");
      toast.error(
        error.response.data.message || "Error editing role"
      );
      console.error("Error deleting role:", error);
      setLoading(false)
    }
  };

  return (
    <div
      style={{
        width: screenWidth - 100,
        display: "flex",
        justifyContent:"center",
        alignItems:"center", 
        flexDirection: "column",
        // marginLeft: "5vh",
        padding:"20px", 
      }}
    > 
    <Card variant="outlined" sx={{boxShadow:4,marginTop:'20px',width:"60vw"}}>
    <div style={{maxWidth:"100vw",paddingLeft:"100px",paddingBottom:"50px"}}>
      <Box
        display="flex"
        justifyContent="flex"
        alignItems="center"
        height="30vh"
        marginRight='5vh'
      >
        <Button
        sx={{
          // marginTop: "5%",
          backgroundColor: "var(--red)",
          color: "var(--white)",
          transition: "transform",
          borderRadius:"none",
          "&:hover": {
            backgroundColor: "var(--red)",
            transform: "scale(1.03)",
            border:"none"
          },
        }}
        variant="outlined" onClick={handleClickOpen}>
          ManageRoles
        </Button>
        <Divider orientation="vertical" flexItem sx={{  margin : "5vh", bgcolor: 'grey.700'}} />
        <ManageAPI/>
        <Divider orientation="vertical" flexItem sx={{  margin : "5vh", bgcolor: 'grey.700'}} />
        <ManageAPIRoleMapping/>
      </Box>
      <Divider sx={{  width: '100%', bgcolor: 'grey.700', marginBottom:'10px'}} />
      <AssignRole/>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >  {loading ? <LoadingPage/> : ''}
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Manage Roles
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" alignItems="center" mb={2}>
            <TextField
              label="New Role"  
              variant="outlined"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            />
            <IconButton color="primary" onClick={handleAddRole}>
              <AddIcon />
            </IconButton>
          </Box>
          {roles.map((role) => (
            <Box key={role.id} display="flex" alignItems="center" mb={1}>
              <TextField
                variant="outlined"
                value={role.role}
                onChange={(e) => {
                  const updatedRoles = roles.map((r) =>
                    r.id === role.id ? { ...r, role: e.target.value } : r
                  );
                  setRoles(updatedRoles);
                }}
                disabled={editingRoleId !== role.id}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={role.defaultRole}
                    onChange={(e) => {
                      const updatedRoles = roles.map((r) =>
                        r.id === role.id
                          ? { ...r, defaultRole: e.target.checked }
                          : r
                      );
                      setRoles(updatedRoles);
                    }}
                    disabled={editingRoleId !== role.id}
                  />
                }
                label="Default Role"
              />
              {editingRoleId === role.id ? (
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleSaveRole(role.id, role.role, role.defaultRole)
                  }
                >
                  <AddIcon />
                </IconButton>
              ) : (
                <IconButton
                  color="primary"
                  onClick={() => setEditingRoleId(role.id)}
                >
                  <EditIcon />
                </IconButton>
              )}
              <IconButton
                color="secondary"
                onClick={() => handleDeleteRole(role.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </DialogContent>
      </BootstrapDialog>
      </div>
      </Card>
    </div>
  );
}
