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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import { useSelector } from "react-redux";
import { Close as CloseIcon } from "@mui/icons-material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const ManageUserAsset = ({ assetTypeData, fetchAssetTypeData }) => {
  const token = useSelector((state) => state.auth.token);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState("");
  const [assetAttributes, setAssetAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState({});
  const [assetStatus, setAssetStatus] = useState('')
  const status = ["ALLOTED", "AVAILABLE", "DEFECTIVE", "DISCARDED", "SENT TO REPAIR"];

  const fetchAssetAttributes = async (assetTypeId) => {
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
      if (response.data.data == null) {
        setAssetAttributes = ([]);
      }
      else {
        setAssetAttributes(response.data.data);
        setAttributeValues(
          response.data.data.reduce(
            (acc, attr) => {
              acc[attr.id] = "";
              return acc;
            },
            fetchAssetTypeData(),
            setLoading(false),
            {}
          )
        );
      }
    } catch (error) {
      console.error("Error fetching asset attributes", error);
      toast.error(
        error.response?.data?.message || "No asset attributes found"
      );
      setLoading(false);
    }
  };

  const handleSelectAssetType = (event) => {
    const assetTypeId = event.target.value;
    setSelectedAssetType(assetTypeId);
    fetchAssetAttributes(assetTypeId);
  };

  const handleAttributeChange = (id, value) => {
    setAttributeValues({ ...attributeValues, [id]: value });
  };

  const handleSubmit = async () => {
    const payload = {
      assetTypeName: assetTypeData.find((type) => type.id === selectedAssetType)
        ?.assetName,
      assetStatus: assetStatus,
      assetAttributeMappingList: assetAttributes.map((attr) => ({
        assetAttributeName: attr.assetAttributeName,
        assetAttributeValue: attributeValues[attr.id] || "",
      })),
    };

    try {
      setLoading(true);
      await axios.post(`/apigateway/hrms/masterAsset/saveAssetInfo`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Asset info saved successfully");
      fetchAssetTypeData();
      setLoading(false);
      setOpen(false);
      setSelectedAssetType("");
      setAssetAttributes(assetAttributes);
      setAttributeValues({});
      setAssetStatus("");
    } catch (error) {
      setLoading(false);
      console.error("Error saving asset info", error);
      toast.error(error.response?.data?.message || "Failed to save asset info");
      setSelectedAssetType(selectedAssetType);
      setAssetAttributes(assetAttributes);
      assetAttributes.map((attr) => ({
        assetAttributeName: attr.assetAttributeName,
        assetAttributeValue: attributeValues[attr.id] || "",
      }))
      // setAttributeValues({});
      setAssetStatus("");
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAssetType("");
    setAssetAttributes([]);
    setAttributeValues({});
  };

  const btnStyle = {

    backgroundColor: "#ab2217",
    color: "white",
    "&:hover": {
      backgroundColor: "rgb(114, 108, 108)",

    }
  }
  const style = {
    width: '100%',
    height: '46px',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Button
        sx={btnStyle}
        onClick={handleClickOpen}
      >
        MANAGE ASSET
      </Button>

      <BootstrapDialog
        fullWidth
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        {loading && <LoadingPage />}
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Manage Asset Attributes
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
          {/* -------------------- */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  sx={{ m: 0, p: 2, fontSize: "1rem" }}
                >
                  Asset Type
                </InputLabel>
                <Select
                  value={selectedAssetType}
                  onChange={handleSelectAssetType}
                  label="Asset Type"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200, // Maximum height of the dropdown
                        overflowY: "auto", // Enable vertical scrolling
                      },
                    },
                  }}
                >
                  {assetTypeData.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.assetName}--{type.assetAbbreviation}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" >
                <InputLabel
                  sx={{
                    m: 0,
                    p: 2,
                    fontSize: "1 rem",
                  }}
                >
                  Asset Status
                </InputLabel>
                <Select
                  value={assetStatus}
                  onChange={(e) => setAssetStatus(e.target.value)}
                  label="Asset Status"
                >
                  <div
                    style={{ height: "150px", overflowY: "auto" }}>
                    {status.map((status, index) => (
                      <MenuItem key={index} value={status} >
                        {status}
                      </MenuItem>
                    ))}
                  </div>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {/* -------------- */}
          {assetAttributes.map((attr) => (
            <FormControl sx={{ width: '60%' }} variant="standard">
              <input
                type="text"
                key={attr.id}
                placeholder={attr.assetAttributeName}
                value={attributeValues[attr.id]}
                onChange={(e) => handleAttributeChange(attr.id, e.target.value)}
                fullWidth
                margin="normal"
                style={style}
              /></FormControl>

          ))}
          <Button
            sx={{
              marginleft: "40px",
              backgroundColor: "#ab2217",
              color: "white",
              "&:hover": {
                backgroundColor: "rgb(114, 108, 108)",
              },
            }}
            onClick={handleClickOpen}
          >
            Submit
          </Button>
        </DialogContent>
      </BootstrapDialog>
    </Box>
  );
};

export default ManageUserAsset;
