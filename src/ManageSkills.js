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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingPage from "./LoadingPage";
import { useSelector } from "react-redux";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function ManageSkills() {
  const token = useSelector((state) => state.auth.token);

  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState([]);
  const [newDescription, setnewDescription] = useState("");
  const [editingTechId, setEditingTechId] = useState(null);
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
    fetchDescription();
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTechId(null);
  };

  const fetchDescription = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/apigateway/hrms/interview/alltech");
      setDescription(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast.error(error.response.data.message || "Error fetching skills");
      setLoading(false);
    }
  };

  const handleAddDescription = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/apigateway/hrms/interview/saveTechnology",
        { description: newDescription },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        fetchDescription();
        setnewDescription("");
        toast.success(response.data);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Error adding skills");
      console.error("Error adding skills:", error);
      setLoading(false);
    }
  };

  const handleSaveDescription = async (techId, description) => {
    try {
      setLoading(true);
      const response = await axios.put(
        "/apigateway/hrms/interview/updateTechnology",
        { techId: techId, description: description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        fetchDescription();
        setEditingTechId(null);
        toast.success(response.data);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Error editing skills");
      console.error("Error editing skills:", error);
      setLoading(false);
    }
  };

  const handleDeleteDescription = async (techId) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(
        `/apigateway/hrms/interview/deleteTechnology/${techId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        fetchDescription();
        toast.success(response.data);
        setLoading(false);
      }
    } catch (error) {
      toast.error("Error deleting skill");
      toast.error(error.response.data.message || "Error deleting skill");
      console.error("Error deleting skill:", error);
      setLoading(false);
    }
  };

  const style = {
    width: "100%",
    height: "46px",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Button
          sx={{
            backgroundColor: "var(--warmGrey)",
            color: "var(--white)",
            "&:hover": {
              backgroundColor: "var(--red)",
              transform: "scale(1.03)",
            },
          }}
          onClick={handleClickOpen}
        >
          Manage Skills
        </Button>
      </Box>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        {loading ? <LoadingPage /> : ""}
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Manage Skills
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
            <input
              label="New Skills"
              value={newDescription}
              onChange={(e) => setnewDescription(e.target.value)}
              style={style}
            />
            <IconButton onClick={handleAddDescription}>
              <AddIcon sx={{ color: "var(--warmGrey)" }}/>
            </IconButton>
          </Box>
          {Array.isArray(description) &&
            description.map((desc) => (
              <Box key={desc.techId} display="flex" alignItems="center" mb={1}>
                <input
                  value={desc.description}
                  style={style}
                  onChange={(e) => {
                    const updatedDescription = description.map((r) =>
                      r.techId === desc.techId
                        ? { ...r, description: e.target.value }
                        : r
                    );
                    setDescription(updatedDescription);
                  }}
                  disabled={editingTechId !== desc.techId}
                />
                {editingTechId === desc.techId ? (
                  <IconButton
                    onClick={() =>
                      handleSaveDescription(desc.techId, desc.description)
                    }
                  >
                    <AddIcon sx={{ color: "var(--warmGrey)" }}/>
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => setEditingTechId(desc.techId)}
                  >
                    <EditIcon sx={{ color: "var(--warmGrey)" }}/>
                  </IconButton>
                )}
                <IconButton
                  onClick={() => handleDeleteDescription(desc.techId)}
                >
                  <DeleteIcon sx={{ color: "var(--red)" }}/>
                </IconButton>
              </Box>
            ))}
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
