

import { MdHistory } from "react-icons/md";
import { MdHistoryToggleOff } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import React, { useState, useEffect, useMemo } from "react";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  MenuItem,
  Modal,
  Select,
  InputLabel,
  FormControl,
  TablePagination,
  Grid,
} from "@mui/material";
import { useTable, usePagination, useSortBy } from "react-table";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { MdAddBox } from "react-icons/md";
import { getCoreRowModel, getFacetedMinMaxValues, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

const ViewAssets = ({
  assetTypeData,
  fetchAssetTypeData,
  setAssetTypeData,
}) => {
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState([]);
  const [editingAsset, setEditingAsset] = useState(null);
  const [assetAttributes, setAssetAttributes] = useState([]);
  const [assetAttribute, setAssetAttribute] = useState([]);
  //  const [assetTypeData, setassetTypeData] = useState([]);
  const [selectedAssetType, setSelectedAssetType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [status, setStatus] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);
  const [updationhistoryModal, setUpdationHistoryModal] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [allAssets, setAllAssets] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [assetHistory, setAssetHistory] = useState([]);
  const [assetUpdationHistory, setAssetUpdationHistory] = useState([]);
  const [searchCriterion, setSearchCriterion] = useState("firstName");
  const [searchValue, setSearchValue] = useState("");
  const [employees, setEmployees] = useState([]);
  const [empAdtid, setEmpAdtid] = useState("");
  const [assetAdtId, setAssetAdtId] = useState("");
  const [emptyAssetError, setEmptyAssetError] = useState("");
  const [emptyHistoryError, setEmptyHistoryError] = useState("");
  const [showAttributes, setShowAttributes] = useState(false);
  const [assetTypeId, setAssetTypeId] = useState("");

  const token = useSelector((state) => state.auth.token);

  const fetchAssets = async (assetTypeId) => {
    var a;
    var b;
    if (status) {
      a = `assetStatus=${status}&`;
    } else {
      a = "";
    }
    if (searchId) {
      b = `assetAdtId=${searchId}&`;
    } else {
      b = "";
    }
    console.log(a);
    if (assetTypeId) {
      try {
        setLoading(true);
        const response = await axios.get(
          `/apigateway/hrms/masterAsset/getAllAssetInfoByAssetTypeIdAndPagination/${selectedAssetType}?${a}${b}page=0&size=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data);
        if (response.data.data == null) {
          setAssets([]);
          toast.error("Asset info list not found");
        }
        else {
          setAssets(response.data.data);

        }
        setEmptyAssetError("");
        setAllAssets(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching assets:", error);
        setAssets([]);
        setEmptyAssetError(error.response.data.message);
        setLoading(false);
      }
    } else {
      toast.error("Must select any asset type");
    }
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // Reset to first page on rows per page change
  };


  const addAttributes = async () => {
    setShowAttributes(true);

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
      console.log(response.data.data);
      setAssetAttribute(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching assets:", error);
      setAssets([]);
      setEmptyAssetError(error.response.data.message);
      setLoading(false);
    }

  }

  const AssignAsset = async () => {
    console.log(empAdtid);
    console.log(assetAdtId);
    try {
      setLoading(true);
      const data = {
        "empAdtId": empAdtid,
        "assetAdtIdList": [assetAdtId]
      }
      await axios.put(
        "/apigateway/hrms/masterAsset/assignAssetsToEmp",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Asset Assigned successfully");
      setAssignModal(false);
      setHistoryModal(false);
      setEmpAdtid("");
      setSearchValue("");
      setEmployees([]);
      fetchAssets(selectedAssetType);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update asset");
      setLoading(false);
    }
  };

  const DeAssignAsset = async (empId) => {
    console.log(empId);
    console.log(assetAdtId);
    try {
      setLoading(true);
      const data = {
        "empAdtId": empId,
        "assetAdtIdList": [assetAdtId]
      }
      await axios.put(
        "/apigateway/hrms/masterAsset/dessignAssetsToEmp",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Asset Unassigned successfully");
      setHistoryModal(false);
      fetchAssets(selectedAssetType);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update asset");
      setLoading(false);
    }
  };


  const SearchEmployee = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/apigateway/hrms/masterAsset/searchEmployeeDetails`,
        {
          params: {
            [searchCriterion]: searchValue,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data);
      setEmployees(response.data.data);
    } catch (error) {
      setEmployees([]);
      console.error("Error searching employees:", error);
      toast.error(
        error.response.data.message || "Error searching employees"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAsset = async (assetId) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      try {
        setLoading(true);
        await axios.delete(
          `/apigateway/hrms/masterAsset/deleteAssetInfoByAssetAdtId?assetAdtId=${assetId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Asset deleted successfully");
        setAssets(assets.filter((asset) => asset.assetId !== assetId));
        fetchAssetTypeData();
        fetchAssets(selectedAssetType);
        setLoading(false);
      } catch (error) {
        console.error("Error deleting asset:", error);
        toast.error(error.response?.data?.message || "Failed to delete asset");
        setLoading(false);
      }
    }
  };

  const HandleAssetHistory = async (assetvalues) => {
    setAssetAdtId(assetvalues.assetADTId);
    setHistoryModal(true);
    try {
      setLoading(true);
      const response = await axios.get(
        `/apigateway/hrms/masterAsset/getAssetHistoryByAssetADTId?assetAdtId=${assetvalues.assetADTId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data);
      if (Array.isArray(response.data.data.empDataList)) {
        setAssetHistory(response.data.data.empDataList);

      } else {
        setAssetHistory([]);
        setEmptyHistoryError(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching assets:", error);
      setEmptyHistoryError(error.response?.data?.message || 'An error occurred');
      setLoading(false);
    }
  };

  const HandleAssetUpdateHistory = async (assetvalues) => {
    setAssetAdtId(assetvalues.assetADTId);
    setUpdationHistoryModal(true);
    try {
      setLoading(true);
      const response = await axios.get(
        `/apigateway/hrms/masterAsset/getAssetCreatedUpdatedHistoryByAssetAdtId?assetAdtId=${assetvalues.assetADTId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data);
      setAssetUpdationHistory(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching assets:", error);
      setLoading(false);
    }
  }


  const handleEditAsset = (asset) => {
    console.log("Editing asset:", asset.assetStatus);
    const status =
      asset.assetStatus || asset.status || asset.asset_status || "";
    setEditingAsset({ ...asset, assetStatus: status });
    setAssetAttributes(asset.assetAttributeMappingList || []);
    setAssetTypeId(asset.assetTypeId);
    setOpenModal(true);
  };

  const handleAttributeChange = (index, attribute, value) => {
    const updatedAttributes = [...assetAttributes];
    updatedAttributes[index] = {
      ...updatedAttributes[index],
      [attribute]: value,
    };
    setAssetAttributes(updatedAttributes);
  };

  const handleUpdateAsset = async () => {
    try {
      setLoading(true);
      const updatedAsset = {
        assetADTId: editingAsset.assetADTId,
        assetStatus: editingAsset.assetStatus,
        assetAttributeMappingList: assetAttributes.filter(
          (attr) =>
            attr.assetAttributeValue !== "NULL" &&
            attr.assetAttributeValue !== null &&
            attr.assetAttributeValue !== "null" &&
            attr.assetAttributeValue !== ""
        ),

      };
      await axios.put(
        "/apigateway/hrms/masterAsset/updateAssetAttributeMappingByAssetAdtId",
        updatedAsset,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Asset updated successfully");
      setShowAttributes(false);
      setOpenModal(false);
      fetchAssets(selectedAssetType);
      setLoading(false);
    } catch (error) {
      console.error("Error updating asset:", error);
      toast.error(error.response?.data?.message || "Failed to update asset");
      setLoading(false);
    }
  };
  const handleRemoveAttribute = (index) => {
    const updatedAttributes = assetAttributes.filter((_, i) => i !== index);
    console.log(updatedAttributes);
    setAssetAttributes(updatedAttributes);
  };

  const handleAddAttribute = (event) => {
    console.log(event.target.value);
    var assetname = event.target.value;
    const newAttribute = { assetAttributeName: assetname, assetAttributeValue: "" };
    setAssetAttributes([...assetAttributes, newAttribute]);
  };

  const handleAssetTypeChange = (event) => {
    console.log(event.target.value);
    setStatus("");
    setSelectedAssetType(event.target.value);
    setSelectedStatus("ALL");
  };

  const HandleStatus = (value) => {
    setSelectedStatus(value);
    if (value == "ALL") {
      setStatus("");
    } else {
      setStatus(value);
    }
  }

  const HandleSearchById = () => {
    fetchAssets(selectedAssetType);
  }

  const handleCloseModal = () => {
    setOpenModal(false);
    setShowAttributes(false);
    setEditingAsset(null);
  };

  const handleHistoryModal = () => {
    setHistoryModal(false);
    setEmptyHistoryError("");
    setAssetAdtId("");
    setAssetHistory([]);
  };

  const handleUpdationHistoryModal = () => {
    setUpdationHistoryModal(false);
    setAssetAdtId("");
    setAssetUpdationHistory([]);
  };

  const handleAssignModal = () => {
    setAssignModal(false);
    setEmpAdtid("");
    setEmployees([]);
    setSearchValue("");
  }

  const handleCriterionChange = (event) => {
    setSearchCriterion(event.target.value);
  };

  const handleValueChange = (event) => {
    setSearchValue(event.target.value);
  };

  const SelectEmployee = (event) => {
    // console.log(event.target.value);
    setEmpAdtid(event.target.value);
  }

  const addAttributes2 = () => {
    setShowAttributes(false);
  }

  const columns = useMemo(
    () => [
      {
        accessor: "assetId",
        Header: "Asset ID",
      },
      {
        accessor: "assetName",
        Header: "Asset Name",
      },
      {
        accessor: "attributes",
        Header: "Attributes",
      },
      {
        accessor: "status",
        Header: "Status",
      },
      {
        accessor: "actions",
        Header: "Actions",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page, // for pagination
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: assets,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    useSortBy,
    usePagination
  );
  const btnStyle = {

    backgroundColor: "#ab2217",
    color: "white",
    "&:hover": {
      backgroundColor: "rgb(114, 108, 108)",

    }
  }

  const style = {
    width: '80%',
    height: '40px',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginTop: "4%"
  }

  return (
    <Box sx={{ p: 2 }}>
      {loading && <LoadingPage />}
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Box sx={{ mb: 2 }}>
          <TextField
            select
            label="Asset Type"
            value={selectedAssetType}
            onChange={handleAssetTypeChange}
            variant="outlined"
            sx={{ width: "30vh", mr: 1 }}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: {
                    maxHeight: 200, // Set the maximum height for the dropdown
                    overflowY: "auto", // Enable vertical scrolling
                  },
                },
              },
            }}
          >
            {assetTypeData.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.assetName}
              </MenuItem>
            ))}
          </TextField>

        </Box>

        <TextField
          select
          label="Status"
          value={selectedStatus}
          onChange={(e) => HandleStatus(e.target.value)}
          variant="outlined"
          sx={{ width: "30vh", mr: 1 }}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: {
                  maxHeight: 200, // Set the maximum height for the dropdown
                  overflowY: "auto", // Enable vertical scrolling
                },
              },
            },
          }}
        >
          <MenuItem value="ALL">ALL</MenuItem>
          <MenuItem value="ALLOTTED">ALLOTTED</MenuItem>
          <MenuItem value="AVAILABLE">AVAILABLE</MenuItem>
          <MenuItem value="DEFECTIVE">DEFECTIVE</MenuItem>
          <MenuItem value="DISCARDED">DISCARDED</MenuItem>
          <MenuItem value="SEND TO REPAIR">SENT TO REPAIR</MenuItem>
        </TextField>
        <input type="text" value={searchId} onChange={(e) => setSearchId(e.target.value)} placeholder="Asset ADTID" style={{ width: '30vh', height: "53px" }}></input>
        <button
          style={{
            width: '20vh',
            height: "40px",
            marginLeft: "10px",
            backgroundColor: "#ab2217",
            color: "white",
            marginBottom: "5px",
            marginTop: "5px"
          }} onClick={HandleSearchById}>SEARCH</button>
      </div>

      <Paper sx={{ width: "100ch", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader aria-label="sticky table" {...getTableProps()}>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <TableCell
                      key={column.id}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      style={{
                        cursor: column.canSort ? "pointer" : "auto",
                        backgroundColor: "rgb(114, 108, 108)",
                        color: "white",
                        position: "sticky",
                        top: "0",
                        zIndex: 1,
                      }}
                    >
                      {column.render("Header")}
                      {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {assets.map((asset) => (
                <TableRow key={asset.assetAdtId}>
                  <TableCell>{asset.assetADTId}</TableCell>
                  <TableCell>{asset.assetTypeName}</TableCell>
                  <TableCell>
                    {asset.assetAttributeMappingList
                      .filter(
                        (attr) =>
                          attr.assetAttributeName !== null &&
                          attr.assetAttributeName !== "null" &&
                          attr.assetAttributeName !== "NULL" &&
                          attr.assetAttributeName !== ""
                      )
                      .map((attr, index) => (
                        <div key={index}>
                          <strong>{attr.assetAttributeName}:</strong>
                          {attr.assetAttributeValue}
                        </div>
                      ))}
                  </TableCell>
                  <TableCell>{asset.assetStatus || "N/A"}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditAsset(asset)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteAsset(asset.assetADTId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <MdHistory title="Asset Association History" onClick={() => HandleAssetHistory(asset)} style={{ marginLeft: "10px", cursor: "pointer" }} size={30} />
                    <MdHistoryToggleOff title="Asset Updation History" style={{ marginLeft: "10px", cursor: "pointer" }} size={29} onClick={() => HandleAssetUpdateHistory(asset)} />
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          sx={{ backgroundColor: "rgb(114, 108, 108)", color: "#fff" }}
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={pageSize}
          page={pageIndex}
          onPageChange={(_, newPage) => gotoPage(newPage)}
          onRowsPerPageChange={(e) => {
            
          }}
        />
      </Paper>
      {/*---Edit Asset Attribute Modal---*/}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={(theme) => ({
          ...modalStyle,
          width: '40%',
          maxWidth: '1000px',
          minHeight: '40vh',
          borderRadius: '20px',
          overflowY: 'auto',
          [theme.breakpoints.down('sm')]: {
            width: '100%',
            minHeight: '30vh',
          },
        })}>
          {loading && <LoadingPage />}
          <Typography id="modal-title" variant="h6" gutterBottom>
            Edit Asset Attributes
          </Typography>
          {/* Status Field */}
          {editingAsset && (
            <TextField
              select
              label="Status"
              value={editingAsset.assetStatus}
              onChange={(e) =>
                setEditingAsset((prev) => ({
                  ...prev,
                  assetStatus: e.target.value,
                }))
              }
              sx={{
                width: "30vh",
                mr: 1,
                margin: "4px 0px",
                '& .MuiOutlinedInput-root': {
                  width: '100%',
                  height: '46px',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                },
                '& .MuiInputBase-input': {
                  padding: 0,
                },
                '& .MuiPaper-root': {
                  maxHeight: '150px', 
                },
                '& .MuiMenu-paper': {
                  maxHeight: '150px',  
                },
                '& .MuiSelect-select': {
                  paddingRight: '24px',
                }
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: {
                      maxHeight: '150px',  
                      overflowY: 'scroll',   
                    },
                  },
                },
              }}
            >
              <MenuItem value="ALLOTTED">ALLOTTED</MenuItem>
              <MenuItem value="AVAILABLE">AVAILABLE</MenuItem>
              <MenuItem value="DEFECTIVE">DEFECTIVE</MenuItem>
              <MenuItem value="DISCARDED">DISCARDED</MenuItem>
              <MenuItem value="SEND TO REPAIR">SENT TO REPAIR</MenuItem>
            </TextField>
          )}
          {assetAttributes.map((attr, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <FormControl sx={{ width: "30vh", margin: '6px 0px', mr: 1 }}>
                <input
                  type="text"
                  value={attr.assetAttributeName || ""}
                  disabled
                  style={{
                    width: "100%",
                    height: "46px",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    outline: "none",
                    boxSizing: "border-box",
                    backgroundColor: "#f5f5f5",
                  }}
                />
              </FormControl>

              <FormControl sx={{ width: "30vh", margin: '6px 0px', mr: 1 }}>
                <input
                  type="text"
                  value={attr.assetAttributeValue || ""}
                  onChange={(e) =>
                    handleAttributeChange(index, "assetAttributeValue", e.target.value)
                  }
                  style={{
                    width: "100%",
                    height: "46px",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </FormControl>

              <IconButton
                color="error"
                onClick={() => handleRemoveAttribute(index)}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ))}

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            {showAttributes &&
              <TextField
                select
                label="Asset Attributes"
                value=""
                onChange={handleAddAttribute}
                variant="outlined"
                sx={{ width: "35vh", mr: 10 ,}}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: '150px',  
                        overflowY: 'scroll',   
                      },
                    },
                  },
                }}
              >
                {assetAttribute
                  .filter(
                    (row) =>
                      !assetAttributes.some(
                        (attribute) => attribute.assetAttributeName === row.assetAttributeName
                      )
                  )
                  .map((row) => (
                    <MenuItem key={row.id} value={row.assetAttributeName}>
                      {row.assetAttributeName}
                    </MenuItem>
                  ))}
              </TextField>
            }

            <MdAddBox size={50} style={{ marginRight: '10px', cursor: 'pointer', height: "40px" }} onClick={addAttributes} />
            <Button
              sx={{ height: "40px", marginTop: "1%" }}
              variant="contained"
              color="primary"
              style={btnStyle}
              onClick={handleUpdateAsset}
            >
              Update Asset
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* ------------------------- */}
      <Modal
        open={historyModal}
        onClose={handleHistoryModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={(theme) => ({
          ...modalStyle,
          width: '90%',
          maxWidth: '1000px',
          minHeight: '40vh',
          borderRadius: '20px',
          overflowY: 'auto',
          [theme.breakpoints.down('sm')]: {
            width: '100%',
            minHeight: '30vh',
          },
        })}>
          {loading && <LoadingPage />}
          <Typography id="modal-title" variant="h6" gutterBottom>
            Asset Association History
          </Typography>

          {assetHistory ? (
            <TableContainer component={Paper} sx={{
              mt: 2,
              maxHeight: "300px", 
              overflowY: "auto", 
            }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee ADT ID</TableCell>
                    <TableCell>Employee Name</TableCell>
                    <TableCell>Asset Assigned Date</TableCell>
                    <TableCell>Asset Unassigned Date</TableCell>
                    <TableCell>Asset Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assetHistory
                    .sort((a, b) => new Date(b.assetAssignedDate) - new Date(a.assetAssignedDate))
                    .map((asset) => (
                      <TableRow key={asset.assetAdtId}>
                        <TableCell>{asset.empADTId || "N/A"}</TableCell>
                        <TableCell>{asset.empName || "N/A"}</TableCell>
                        <TableCell>{asset.assetAssignedDate || "N/A"}</TableCell>
                        <TableCell>{asset.assetDeassignedDate || "N/A"}</TableCell>
                        <TableCell>{asset.assetStatus || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography sx={{ mt: 2 }}>
              {emptyHistoryError || "No asset history available"}
            </Typography>
          )}

          <br />
          <button
            style={{ padding: "10px", margin: "10px", backgroundColor: "var(--red)" }}
            onClick={() => setAssignModal(true)}
          >
            Assign
          </button>

          {Array.isArray(assetHistory) &&
            assetHistory.map((asset) =>
              asset.assetStatus === "ASSOCIATE" ? (
               <button
                  style={{ padding: "10px", margin: "10px", backgroundColor: "var(--red)" }}
                  onClick={() => DeAssignAsset(asset.empADTId)}
                  key={asset.assetAdtId}
                >
                  Unassign
                </button>
              ) : null
            )}
        </Box>
      </Modal>


      <Modal
        open={updationhistoryModal}
        onClose={handleUpdationHistoryModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={(theme) => ({
          ...modalStyle,
          width: '90%',
          maxWidth: '1000px',
          minHeight: '40vh',
          borderRadius: '20px',
          overflowY: 'auto',  
          maxHeight: '70vh',  
          [theme.breakpoints.down('sm')]: {
            width: '100%',
            minHeight: '30vh',
            maxHeight: '60vh',  
          },
        })}>
          {loading && <LoadingPage />}
          <Typography id="modal-title" variant="h6" gutterBottom>
            Asset Updation History
          </Typography>
          {assetUpdationHistory && (
            <Typography>

              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Asset ID</TableCell>
                      <TableCell>Asset Name</TableCell>
                      <TableCell>Attributes</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Updation Date</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {assetUpdationHistory.map((asset) => (
                      <TableRow key={asset.assetAdtId}>
                        <TableCell>{asset.assetADTId}</TableCell>
                        <TableCell>{asset.assetTypeName}</TableCell>
                        <TableCell>
                          {asset.assetAttributeMappingList
                            .filter(
                              (attr) =>
                                attr.assetAttributeName !== null &&
                                attr.assetAttributeName !== "null" &&
                                attr.assetAttributeName !== "NULL" &&
                                attr.assetAttributeName !== ""
                            )
                            .map((attr, index) => (
                              <div key={index}>
                                <strong>{attr.assetAttributeName}:</strong>
                                {attr.assetAttributeValue}
                              </div>
                            ))}
                        </TableCell>
                        <TableCell>{asset.assetStatus || "N/A"}</TableCell>
                        <TableCell>{asset.date || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <span style={{ padding: "20px", margin: "20px", fontSize: "16px" }}>{emptyAssetError}</span>
                </Table>
              </TableContainer>
            </Typography>
          )}
          <span style={{ padding: "20px", margin: "20px", fontSize: "16px" }}>{emptyHistoryError}</span><br /><br />
        </Box>
      </Modal>


      <Modal
        open={assignModal}
        onClose={handleAssignModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={(theme) => ({
          ...modalStyle,
          width: '50%',
          maxWidth: '1000px',
          minHeight: '40vh',
          borderRadius: '20px',
          overflowY: 'auto',
          [theme.breakpoints.down('sm')]: {
            width: '100%',
            minHeight: '30vh',
          },
        })}>
          {loading && <LoadingPage />}
          <Typography id="modal-title" variant="h6" gutterBottom>
            Assign Asset To Any Employee
          </Typography>

          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <TextField
              select
              label="Search By"
              value={searchCriterion}
              onChange={handleCriterionChange}
              variant="outlined"
              sx={{
                width: '28vh', mr: 1, '& .MuiOutlinedInput-root': {
                  height: '40px',
                }
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200, // Maximum height of the dropdown
                    overflowY: "auto", // Enable vertical scrolling
                  },
                },
              }}
            >
              <MenuItem value="firstName">First Name</MenuItem>
              <MenuItem value="lastName">Last Name</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="empAdtId">Employee AdtId</MenuItem>
            </TextField>

            <FormControl sx={{ width: '35%' }} variant="standard">
              <input
                type="text"
                placeholder="Enter Search Value"
                value={searchValue}
                onChange={handleValueChange}
                style={style}
              />
            </FormControl>
            <Button variant="contained"
              onClick={SearchEmployee}
              disabled={loading}
              sx={{ ...btnStyle, width: "15%", marginLeft: "-30px" }}>
              Search
            </Button>
          </Box>

          {employees.map((value) => (

            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "20px" }}>
              <FormControl sx={{ width: '30%' }} variant="standard">
                <input
                  type="text"
                  disabled
                  value={value.firstName + " " + value.lastName}
                  style={{ ...style, width: "100%" }}
                />
              </FormControl>
              <FormControl sx={{ width: '30%' }} variant="standard">
                <input
                  type="text"
                  disabled
                  value={value.empADTId}
                  style={{ ...style, width: "100%" }}
                />
              </FormControl>
              <FormControl sx={{ width: '30%' }} variant="standard">
                <input
                  type="text"
                  disabled
                  value={value.designation}
                  style={{ ...style, width: "100%" }}
                />
              </FormControl>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  style={{
                    marginLeft: "10px",
                    transform: "scale(1.5)",
                  }}
                  onChange={SelectEmployee}
                  type="radio"
                  name="employee"
                  value={value.empADTId}
                />
              </div>
            </div>
          ))}

          {/* <Button
            class="btn btn-primary"
            onClick={AssignAsset}
            style={{ margin: "10px", height: "40px", backgroundColor: "var(--red)" }}
            disabled={!empAdtid} >Assign</Button> */}
            <Button variant="contained"
              onClick={AssignAsset}
              disabled={!empAdtid} 
              sx={{ ...btnStyle, width: "15%" }}
              >
              Assign
            </Button>
        </Box>
      </Modal>

    </Box>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default ViewAssets;
