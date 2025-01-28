import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Close as CloseIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import { useSelector } from 'react-redux';
import ManageAssetAttributes from './ManageAssetAttributes';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const ManageAsset = ({ assetTypeData, fetchAssetTypeData, setAssetTypeData }) => {
  const token = useSelector((state) => state.auth.token);
  const [newAssetType, setNewAssetType] = useState({
    assetName: "",
    assetAbbreviation: ""
  });
  const [open, setOpen] = useState(false);
  const [editingAssetType, setEditingAssetType] = useState({
    assetName: "",
    assetAbbreviation: ""
  });
  const [loading, setLoading] = useState(false);

  const handleAddAssetType = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `/apigateway/hrms/masterAsset/addAssetType`,
        newAssetType,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssetTypeData([...assetTypeData, response.data]);
      setNewAssetType({ assetName: "", assetAbbreviation: "" });
      toast.success("Asset type added successfully");
      fetchAssetTypeData();
      setLoading(false);
    } catch (error) {
      console.error("Error adding asset type", error);
      toast.error(error.response.data.message || "Failed to add asset type");
      setLoading(false);
    }
  };

  const style = {
    width: '100%',
    height: '46px',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  }

  const handleDeleteAssetType = async (assetTypeId) => {
    if (!window.confirm("Are you sure you want to delete this asset type?")) {
      return;
    }
    try {
      setLoading(true);
      const response = await axios.delete(
        `/apigateway/hrms/masterAsset/deleteAssetTypeById/${assetTypeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === "AlreadyAssociated") {
        toast.error(`Cannot delete asset type: ${response.data.message}`);
      } else {
        setAssetTypeData(assetTypeData.filter((type) => type.id !== assetTypeId));
        toast.success("Asset type deleted successfully");
        fetchAssetTypeData();
      }
      setLoading(false);
    } catch (error) {
      console.error("Error deleting asset type", error);
      toast.error(
        error.response?.data?.message || "Failed to delete asset type"
      );
      setLoading(false);
    }
  };


  const handleEditAssetType = (assetType) => {
    setEditingAssetType(assetType);
  };

  const handleSaveAssetType = async () => {
    try {
      setLoading(true);
      await axios.put(
        `/apigateway/hrms/masterAsset/updateAssetTypeById/${editingAssetType.id}`, editingAssetType,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssetTypeData(
        assetTypeData.map((type) =>
          type.id === editingAssetType.id ? editingAssetType : type
        )
      );
      setEditingAssetType(null);
      toast.success("Asset type updated successfully");
      fetchAssetTypeData();
      setLoading(false);
    } catch (error) {
      console.error("Error updating asset type", error);
      toast.error(
        error.response.data.message || "Failed to update asset type"
      );
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const btnStyle = {

    backgroundColor: "#ab2217",
    color: "white",
    "&:hover": {
      backgroundColor: "rgb(114, 108, 108)",

    }
  }

  return (
    <Box display="flex" justifyContent="flex" alignItems="center" height="100vh">
      <Button
        sx={btnStyle}
        onClick={handleClickOpen}
      >CREATE ASSET TYPE
      </Button>
      <BootstrapDialog fullWidth onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        {loading && <LoadingPage />}
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Create Asset Types
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" alignItems="center" mb={2} sx={{ gap: "5%" }}>
            <div>
              <label >Asset Type Name</label>
               <input
                value={newAssetType.assetName}
                onChange={(e) => setNewAssetType({ ...newAssetType, assetName: e.target.value })}
                style={{ style }}
              />
            </div>
            <div>
              <label>Asset Abbreviation</label>
              <input
                value={newAssetType.assetAbbreviation}
                onChange={(e) => setNewAssetType({ ...newAssetType, assetAbbreviation: e.target.value })}
                style={{ style }}
                fullWidth
              />
            </div>
            <IconButton sx={{marginTop: "5%" ,color:" rgb(114, 108, 108)"}} onClick={handleAddAssetType}>
              <AddIcon />
            </IconButton>
          </Box>
          <TableContainer>
            <Table>
              <TableHead >
                <TableRow > 
                  <TableCell>Asset Type Name</TableCell>
                  <TableCell>Abbreviation</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              
              <TableBody >
                {assetTypeData.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell>
                      {editingAssetType && editingAssetType.id === type.id ? (
                        <TextField
                          value={editingAssetType.assetName}
                          onChange={(e) =>
                            setEditingAssetType({
                              ...editingAssetType,
                              assetName: e.target.value,
                            })
                          }
                          fullWidth
                        />
                      ) : (
                        <Typography>{type.assetName}</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingAssetType && editingAssetType.id === type.id ? (
                        <TextField
                          value={editingAssetType.assetAbbreviation}
                          onChange={(e) =>
                            setEditingAssetType({
                              ...editingAssetType,
                              assetAbbreviation: e.target.value,
                            })
                          }
                          fullWidth
                        />
                      ) : (
                        <Typography>{type.assetAbbreviation}</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingAssetType && editingAssetType.id === type.id ? (
                        <IconButton color= "rgb(114, 108, 108)" onClick={handleSaveAssetType}>
                          <SaveIcon />
                        </IconButton>
                      ) : (
                        <IconButton color= "rgb(114, 108, 108)" onClick={() => handleEditAssetType(type)}>
                          <EditIcon />
                        </IconButton>
                      )}
                      <IconButton color= "rgb(114, 108, 108)" onClick={() => handleDeleteAssetType(type.id)}>
                        <DeleteIcon />
                      </IconButton>
                      <ManageAssetAttributes assetTypeId={type.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </BootstrapDialog>
    </Box>
  );
};

export default ManageAsset;

