import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const ManageAssetAttributes = ({ assetTypeId }) => {
  const token = useSelector((state) => state.auth.token);
  const [newAssetAttribute, setNewAssetAttribute] = useState({
    assetAttributeName: "",
  });
  const [open, setOpen] = useState(false);
  const [assetAttributes, setAssetAttributes] = useState([]);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assetName, setAssetName] = useState('');

  useEffect(() => {
    fetchAssetAttributes();
  }, []);

  const fetchAssetAttributes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/apigateway/hrms/masterAsset/getAllAssetAttributesByAssetTypeId/${assetTypeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.data !== null) {
        setAssetAttributes(response.data.data);
        if (response.data.data.length > 0) {
          setAssetName(response.data.data[0].assetType.assetName.toUpperCase());
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching asset attributes", error);
      setLoading(false);
    }
  };

  const handleAddAssetAttribute = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `/apigateway/hrms/masterAsset/addAssetAttributeByAssetTypeId/${assetTypeId}?assetAttributeName=${newAssetAttribute.assetAttributeName}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssetAttributes([...assetAttributes, response.data]);
      setNewAssetAttribute({ assetAttributeName: "" });
      toast.success("attribute added successfully");
      fetchAssetAttributes();
      setLoading(false);
    } catch (error) {
      console.error("Error adding asset attribute", error);
      toast.error(error.response.data.message || "Failed to add asset attribute");
      setLoading(false);
    }
  };
  const handleDeleteAssetAttribute = async (attributeId) => {
    if (!window.confirm("Are you sure you want to delete this asset attribute?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(
        `/apigateway/hrms/masterAsset/deleteAssetAttributeById/${attributeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 'AlreadyAssociated') {
        toast.error(response.data.message);
      } else {
        setAssetAttributes(assetAttributes.filter((attr) => attr.id !== attributeId));
        toast.success("Asset attribute deleted successfully");
      }
      fetchAssetAttributes();
    } catch (error) {
      console.error("Error deleting asset attribute", error);
      toast.error(
        error.response?.data?.message || "Failed to delete asset attribute"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleEditAssetAttribute = (attribute) => {
    setEditingAttribute(attribute);
  };

  const handleSaveAssetAttribute = async () => {
    try {
      setLoading(true);
      await axios.put(
        `/apigateway/hrms/masterAsset/updateAssetAttributeById/${editingAttribute.id}?assetTypeId=${assetTypeId}&assetAttributeName=${editingAttribute.assetAttributeName}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssetAttributes(
        assetAttributes.map((attr) =>
          attr.id === editingAttribute.id ? editingAttribute : attr
        )
      );
      setEditingAttribute(null);
      toast.success("Asset attribute updated successfully");
      fetchAssetAttributes();
      setLoading(false);
    } catch (error) {
      console.error("Error updating asset attribute", error);
      toast.error(
        error.response.data.message || "Failed to update asset attribute"
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

  return (
    <Box display="flex" justifyContent="flex" alignItems="center">
      <IconButton color="primary" onClick={handleClickOpen}>
        <AddIcon />
      </IconButton>

      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        {loading && <LoadingPage />}
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Create {assetName} Attributes
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
       
        <DialogContent dividers>
          <Box display="flex" alignItems="center" mb={2}>
            <input
              placeholder="Attribute Name"
              variant="outlined"
              value={newAssetAttribute.assetAttributeName}
              onChange={(e) =>
                setNewAssetAttribute({
                  ...newAssetAttribute,
                  assetAttributeName: e.target.value,
                })
              }
              style={{ marginRight: "10px" }}
              fullWidth
            />
            <IconButton color="primary" onClick={handleAddAssetAttribute}>
              <AddIcon />
            </IconButton>
          </Box>
          <TableContainer sx={{
            maxHeight: "300px", // Set the maximum height for the table container
            overflowY: "auto",  // Enable vertical scrolling
          }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Attribute Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assetAttributes.map((attr) => (
                  <TableRow key={attr.id}>
                    <TableCell>
                      {editingAttribute && editingAttribute.id === attr.id ? (
                        <TextField
                          value={editingAttribute.assetAttributeName}
                          onChange={(e) =>
                            setEditingAttribute({
                              ...editingAttribute,
                              assetAttributeName: e.target.value,
                            })
                          }
                          fullWidth
                        />
                      ) : (
                        <Typography>{attr.assetAttributeName}</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingAttribute && editingAttribute.id === attr.id ? (
                        <IconButton sx={{color:" rgb(114, 108, 108)"}} onClick={handleSaveAssetAttribute}>
                          <SaveIcon />
                        </IconButton>
                      ) : (
                        <IconButton sx={{color:" rgb(114, 108, 108)"}} onClick={() => handleEditAssetAttribute(attr)}>
                          <EditIcon />
                        </IconButton>
                      )}
                      <IconButton  sx={{color:" rgb(114, 108, 108)"}} onClick={() => handleDeleteAssetAttribute(attr.id)}>
                        <DeleteIcon />
                      </IconButton>
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

export default ManageAssetAttributes;

