import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Box, Button, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, IconButton, CircularProgress,
  Checkbox
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "./Hrmscss/VarColors.css";

const ManageAPIRoleMapping = () => {
  const token = useSelector((state) => state.auth.token);
  const [open, setOpen] = useState(false);
  const [searchCriterion, setSearchCriterion] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiloading, setApiLoading] = useState(false);
  const [updateBtn, setUpdateBtn] = useState(true);
  const [allRoles, setAllRoles] = useState([]);
  const [checkedApis, setCheckedApis] = useState([]);
  const [uncheckedApis, setUncheckedApis] = useState([]);
  const [selectedForShiftRight, setSelectedForShiftRight] = useState([]);
  const [selectedForShiftLeft, setSelectedForShiftLeft] = useState([]);

  useEffect(() => {
    const fetchAllRoles = async () => {
      try {
        const response = await axios.get("/apigateway/api/role/getAllRoles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllRoles(response?.data?.content);
      } catch (error) {
        console.error("Error fetching all roles:", error);
        toast.error(error.response?.data?.message || "Error fetching all roles");
      }
    };

    fetchAllRoles();
  }, [token]);

  const handleCriterionChange = (event) => {
    setSearchCriterion(event.target.value);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const [roleApisResponse, allApisResponse] = await Promise.all([
        axios.get(`/apigateway/api/role/getListOfApiNameByRole?roleName=${searchCriterion}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/apigateway/api/role/getAllApiDetails", {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      const roleApis = roleApisResponse.data.body.map(api => api.api_name);
      const allApis = allApisResponse.data.map(api => api.apiName);

      setCheckedApis(roleApis);
      setUncheckedApis(allApis.filter(api => !roleApis.includes(api)));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching API data:", error);
      toast.error(error.response?.data?.message || "Error fetching API data");
      setLoading(false);
    }
  };

  const handleUpdateApi = async () => {
    setApiLoading(true);
    try {
      await axios.put(
        `/apigateway/api/role/addAndUpdateRoleMapping?roleName=${searchCriterion}`,
        checkedApis,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApiLoading(false);
      toast.success('API role mappings updated successfully');
      setUpdateBtn(true);
    } catch (error) {
      console.error('Error updating API role mappings:', error);
      setApiLoading(false);
      toast.error(error.response?.data?.message || "Error updating API role mappings");
    }
  };


  const handleToggleRight = (api) => {
    setSelectedForShiftRight((prev) =>
      prev.includes(api) ? prev.filter((item) => item !== api) : [...prev, api]
    );
  };

  const handleToggleLeft = (api) => {
    setSelectedForShiftLeft((prev) =>
      prev.includes(api) ? prev.filter((item) => item !== api) : [...prev, api]
    );
  };


  const handleShiftRight = () => {
    setUpdateBtn(false);
    setUncheckedApis((prev) => [...prev, ...selectedForShiftRight]);
    setCheckedApis((prev) => prev.filter((api) => !selectedForShiftRight.includes(api)));
    setSelectedForShiftRight([]); // Clear selection
  };

  const handleShiftLeft = () => {
    setUpdateBtn(false);
    setCheckedApis((prev) => [...prev, ...selectedForShiftLeft]);
    setUncheckedApis((prev) => prev.filter((api) => !selectedForShiftLeft.includes(api)));
    setSelectedForShiftLeft([]); // Clear selection
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setUpdateBtn(true);
    setCheckedApis([]);
    setUncheckedApis([]);
    setSearchCriterion("");
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
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
        Manage API Role Mapping
      </Button>
      <Dialog onClose={handleClose} open={open} maxWidth="lg" fullWidth>
        <DialogTitle>
          Manage API Role Mapping
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" alignItems="center" mb={2}>
            <TextField
              select
              label="Select Role"
              value={searchCriterion}
              onChange={handleCriterionChange}
              variant="outlined"
              sx={{ width: "39vh", mr: 1 }}
            >
              <MenuItem value="">Select Role</MenuItem>
              {allRoles.map((role) => (
                <MenuItem key={role.id} value={role.role}>
                  {role.role}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              disabled={loading|| searchCriterion==""}
              sx={{ mr: 1, height:"45px" }}
            >
              {loading ? <CircularProgress size={24} /> : "Search"}
            </Button>
          </Box>
          
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
            
            {/* Checked APIs Section */}
            <Box sx={{ width: "45%" }}>
            <h6 className='bg-dark text-light' style={{ textAlign: "center", margin: 0, padding: "5px"}}>
                Assigned APIs ({checkedApis.length})
              </h6>
              <TableContainer sx={{ maxHeight: "370px", overflow: "auto", border: "1px solid #ddd" }}>
                <Table>
                  <TableBody>
                    {checkedApis.map((api) => (
                      <TableRow key={api} >
                        <TableCell style={{height:"20px",padding:0}}>
                          <Checkbox
                            checked={selectedForShiftRight.includes(api)}
                            onChange={() => handleToggleRight(api)}
                          />
                        </TableCell>
                        <TableCell style={{height:"20px",padding:0}}>&nbsp;&nbsp;{api}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Shift Buttons Section */}
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ width: "10%" }}>
              <Button
                onClick={handleShiftRight}
                disabled={selectedForShiftRight.length === 0}
                sx={{ mb: 2 }}
              >
                <ArrowForwardIcon />
              </Button>
              <Button onClick={handleShiftLeft} disabled={selectedForShiftLeft.length === 0}>
                <ArrowBackIcon />
              </Button>
            </Box>

            {/* Unchecked APIs Section */}
            <Box sx={{ width: "45%" }}>
              <h6 className='bg-dark text-light' style={{ textAlign: "center", margin: 0, padding: "5px"}}>
                Unassigned APIs ({uncheckedApis.length})
              </h6>
              <TableContainer sx={{ maxHeight: "370px", overflow: "auto", border: "1px solid #ddd" }}>
                <Table>
                  <TableBody>
                    {uncheckedApis.map((api) => (
                      <TableRow key={api}>
                        <TableCell style={{height:"20px",padding:0}}>
                          <Checkbox
                            checked={selectedForShiftLeft.includes(api)}
                            onChange={() => handleToggleLeft(api)}
                          />
                        </TableCell>
                        <TableCell style={{height:"20px",padding:0}}>&nbsp;&nbsp;{api}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
          <Button
              style={{marginTop:"15px"}}
              variant="contained"
              color="primary"
              onClick={handleUpdateApi}
              disabled={apiloading || updateBtn}
              sx={{ height:"45px" }}
            >
              {apiloading ? <CircularProgress size={24} /> : "Update API"}
            </Button> 
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ManageAPIRoleMapping;




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   CircularProgress,
//   MenuItem,
//   Box,
//   Button,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   Checkbox,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import { Close as CloseIcon} from "@mui/icons-material";
// import { toast } from "react-toastify";
// import LoadingPage from "./LoadingPage";  
// import { useSelector } from 'react-redux';

// const BootstrapDialog = styled(Dialog)(({ theme }) => ({
//   "& .MuiDialogContent-root": {
//     padding: theme.spacing(2),
//   },
//   "& .MuiDialogActions-root": {
//     padding: theme.spacing(1),
//   },
// }));

// const TotalApiCount = ({ count }) => (
//   <Box mb={2}>Selected APIs: {count}</Box>
// );

// const ManageAPIRoleMapping = () => {
//   // const token = localStorage.getItem("response-token");
//   const  token = useSelector((state) => state.auth.token);
//   const [open, setOpen] = useState(false);
//   const [searchCriterion, setSearchCriterion] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [apiloading, setApiLoading] = useState(false);
//   const [allRoles, setAllRoles] = useState([]);
//   const [allApiData, setAllApiData] = useState([]);
//   const [roleApiData, setRoleApiData] = useState([]);
//   const [checkedApis, setCheckedApis] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalElements, setTotalElements] = useState(0);
//   const [loadingPage, setLoadingPage] = useState(false); 

//   useEffect(() => {
//     const fetchAllRoles = async () => {
//       try {
//         const response = await axios.get("/apigateway/api/role/getAllRoles", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setAllRoles(response.data.content);
//       } catch (error) {
//         console.error("Error fetching all roles:", error);
//         toast.error(
//           error.response.data.message || "Error fetching all roles"
//         );
//       }
//     };

//     const fetchAllApis = async () => {
//       try {
//         const response = await axios.get(
//           "/apigateway/api/role/getAllApiDetails",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setAllApiData(response.data.content);
//         setTotalPages(response.data.totalPages);
//         setTotalElements(response.data.totalElements);
//       } catch (error) {
//         console.error("Error fetching all APIs:", error);
//         toast.error(
//           error.response.data.message || "Error fetching all APIs"
//         );
//       }
//     };

//     fetchAllRoles();
//     fetchAllApis();
//   }, [token]);

//   useEffect(() => {
//     const checkedApis = roleApiData.map((api) => api.api_name);
//     setCheckedApis(checkedApis);
//   }, [roleApiData]);

//   const handleCriterionChange = (event) => {
//     setSearchCriterion(event.target.value);
//   };

//   const handleSearch = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `/apigateway/api/role/getListOfApiNameByRole?roleName=${searchCriterion}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setRoleApiData(response.data.body);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching API data:", error);
//       toast.error(
//         error.response.data.message || "Error fetching API data"
//       );
//       setLoading(false);
//     }
//   };

//   const handleUpdateApi = async () => {
//     setApiLoading(true);
//     try {
//       const response = await axios.put(
//         `/apigateway/api/role/addAndUpdateRoleMapping?roleName=${searchCriterion}`, checkedApis,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log('API role mappings updated successfully:', response.data);
//       setApiLoading(false);
//       toast.success('API role mappings updated successfully');
//     } catch (error) {
//       console.error('Error updating API role mappings:', error);
//       setApiLoading(false);
//       toast.error(
//         error.response.data.message || "Error updating API role mappings"
//       );
//     }
//   };

//   const handleToggle = (apiName) => {
//     setCheckedApis((prev) =>
//       prev.includes(apiName)
//         ? prev.filter((name) => name !== apiName)
//         : [...prev, apiName]
//     );
//   };

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//     fetchAllApis(newPage, rowsPerPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//     fetchAllApis(0, parseInt(event.target.value, 10));
//   };

//   const fetchAllApis = async (page, size) => {
//     try {
//       setLoadingPage(true);
//       const response = await axios.get(
//         `/apigateway/api/role/getAllApiDetails?page=${page}&size=${size}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setAllApiData(response.data.content);
//       setTotalPages(response.data.totalPages);
//       setTotalElements(response.data.totalElements);
//       setLoadingPage(false);
//     } catch (error) {
//       console.error("Error fetching all APIs:", error);
//       toast.error(
//         error.response.data.message || "Error fetching all APIs"
//       );
//       setLoadingPage(false);
//     }
//   };

//   return (
//     <Box
//       display="flex"
//       justifyContent="center"
//       alignItems="center"
//       height="100vh"
//     >
//       <Button variant="outlined" onClick={handleClickOpen}>
//         Manage API Role Mapping
//       </Button>
//       <BootstrapDialog
//         onClose={handleClose}
//         aria-labelledby="customized-dialog-title"
//         open={open}
//       >
//         <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
//           Manage API Role Mapping
//           <IconButton
//             aria-label="close"
//             onClick={handleClose}
//             sx={{
//               position: "absolute",
//               right: 8,
//               top: 8,
//               color: (theme) => theme.palette.grey[500],
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent dividers>
//           <Box display="flex" alignItems="center" mb={2}>
//             <TextField
//               select
//               label="Select Role"
//               value={searchCriterion}
//               onChange={handleCriterionChange}
//               variant="outlined"
//               sx={{ width: "39vh", mr: 1 }}
//             >
//               <MenuItem value="">Select Role</MenuItem>
//               {allRoles.map((role) => (
//                 <MenuItem key={role.id} value={role.role}>
//                   {role.role}
//                 </MenuItem>
//               ))}
//             </TextField>

//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleSearch}
//               disabled={loading}
//               sx={{ width: "15vh", height: "8vh", marginRight: "5vh" }}
//             >
//               {loading ? <CircularProgress size={24} /> : "Search"}
//             </Button>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleUpdateApi}
//               disabled={loading}
//               sx={{ width: "15vh", height: "8vh" }}
//             >
//               {apiloading ? <CircularProgress size={24} /> : "Update API"}
//             </Button>
//           </Box>
//           {loadingPage ? <LoadingPage /> : ''}
//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>
//                     <TotalApiCount count={checkedApis.length} />
//                   </TableCell>
//                   <TableCell>API Name</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {allApiData.map((api) => (
//                   <TableRow key={api.apiId}>
//                     <TableCell>
//                       <Checkbox
//                         checked={checkedApis.includes(api.apiName)}
//                         onChange={() => handleToggle(api.apiName)}
//                       />
//                     </TableCell>
//                     <TableCell>{api.apiName}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//             <TablePagination
//               rowsPerPageOptions={[10, 25, 50]}
//               component="div"
//               count={totalElements}
//               rowsPerPage={rowsPerPage}
//               page={page}
//               onPageChange={handleChangePage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//           </TableContainer>
//         </DialogContent>
//       </BootstrapDialog>
//     </Box>
//   );
// };

// export default ManageAPIRoleMapping;
 




















// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   CircularProgress,
//   MenuItem,
//   Box,
//   Button,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   Checkbox,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import { Close as CloseIcon } from "@mui/icons-material";
// import { toast } from "react-toastify";
// import LoadingPage from "./LoadingPage";
// import { useSelector } from 'react-redux';

// const BootstrapDialog = styled(Dialog)(({ theme }) => ({
//   "& .MuiDialogContent-root": {
//     padding: theme.spacing(2),
//   },
//   "& .MuiDialogActions-root": {
//     padding: theme.spacing(1),
//   },
// }));

// const TotalApiCount = ({ count }) => (
//   <Box mb={2}>Selected APIs: {count}</Box>
// );

// const ManageAPIRoleMapping = () => {
//   // const token = localStorage.getItem("response-token");
//   const token = useSelector((state) => state.auth.token);
//   const [open, setOpen] = useState(false);
//   const [searchCriterion, setSearchCriterion] = useState("");
//   const [searchService, setSearchService] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [apiloading, setApiLoading] = useState(false);
//   const [allRoles, setAllRoles] = useState([]);
//   const [allServiceNames, setAllServiceNames] = useState([]);
//   const [listOfServiceApiNames, setListOfServiceApiNames] = useState([]);
//   const [allApiData, setAllApiData] = useState([]);
//   const [listOfApiNames, setlistOfApiNames] = useState([]);
//   const [checkedApis, setCheckedApis] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalElements, setTotalElements] = useState(0);
//   const [loadingPage, setLoadingPage] = useState(false);
//   const [serviceApiData, setServiceApiData] = useState([])

//   useEffect(() => {
//     const fetchAllRoles = async () => {
//       try {
//         const response = await axios.get("/apigateway/api/role/getAllRoles", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setAllRoles(response.data.content);
//       } catch (error) {
//         console.error("Error fetching all roles:", error);
//         toast.error(
//           error.response.data.message || "Error fetching all roles"
//         );
//       }
//     }

//     const fetchAllServiceNames = async () => {
//       try {
//         const response = await axios.get("/apigateway/api/role/getAllServiceName", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setAllServiceNames(response.data.body);
//       } catch (error) {
//         console.error("Error fetching all roles:", error);
//         toast.error(
//           error.response.data.message || "Error fetching all roles"
//         );
//       }
//     };

//     const fetchAllApis = async () => {
//       try {
//         const response = await axios.get(
//           "/apigateway/api/role/getAllApiDetails",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setAllApiData(response.data.content);
//         setTotalPages(response.data.totalPages);
//         setTotalElements(response.data.totalElements);
//       } catch (error) {
//         console.error("Error fetching all APIs:", error);
//         toast.error(
//           error.response.data.message || "Error fetching all APIs"
//         );
//       }
//     };

//     fetchAllRoles();
//     fetchAllApis();
//     fetchAllServiceNames();
//   }, [token]);


//   useEffect(() => {
//     const checkedApis = listOfApiNames.map((api) => api.api_name);
//     setCheckedApis(checkedApis);
//     // const serviceApi = serviceApiData.map((api)=>api.api_name);
//     // setCheckedApis(serviceApi);
//   }, [listOfApiNames]);

//   useEffect(() => {
//     const checkedApis = listOfServiceApiNames.map((api) => api.apiName); // Get apiName
//     setCheckedApis(checkedApis);
//   }, [listOfServiceApiNames]);

//   useEffect(() => {
//     const serviceApi = serviceApiData.map((api) => api.api_name);
//     setCheckedApis(serviceApi);
//   }, [serviceApiData]);

//   const handleCriterionChange = async (event) => {
//     const selectedRole = event.target.value;
//     setSearchCriterion(selectedRole);

//     if (selectedRole) {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `/apigateway/api/role/getListOfApiNameByRole?roleName=${selectedRole}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setlistOfApiNames(response.data.body);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching API data:", error);
//         toast.error(error.response.data.message || "Error fetching API data");
//         setLoading(false);
//       }
//     }
//   };

//   const handleServiceChange = async (event) => {
//     const selectedService = event.target.value;
//     setSearchService(selectedService);

//     if (selectedService) {
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           `/apigateway/api/role/getApiNameByServiceName?serviceName=${selectedService}`, [{ listOfApiNames }],
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setListOfServiceApiNames(response.data.body);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching API data:", error);
//         toast.error(error.response.data.message || "Error fetching API data");
//         setLoading(false);
//       }
//     }
//   };
//   // const handleSearch = async () => {

//   const handleSearch = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(

//         {
//           params: {
//             [searchCriterion]: searchValue,
//           },
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setEmployees(response.data.content);
//       setTotalPages(response.data.totalPages);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error searching api:", error);
//       toast.error(error.response?.data?.message || "Error searching details");
//       setLoading(false);
//     }
//   };


//   const handleUpdateApi = async () => {
//     setApiLoading(true);
//     try {
//       const response = await axios.put(
//         `/apigateway/api/role/addAndUpdateRoleMapping?roleName=${searchCriterion}`, checkedApis,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log('API role mappings updated successfully:', response.data);
//       setApiLoading(false);
//       toast.success(response.data || 'API role mappings updated successfully');
//     } catch (error) {
//       console.error('Error updating API role mappings:', error);
//       setApiLoading(false);
//       toast.error(
//         error.response.data.message || "Error updating API role mappings"
//       );
//     }
//   };

//   const handleToggle = (apiName) => {
//     setCheckedApis((prev) =>
//       prev.includes(apiName)
//         ? prev.filter((name) => name !== apiName)
//         : [...prev, apiName]
//     );
//   };

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//     fetchAllApis(newPage, rowsPerPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//     fetchAllApis(0, parseInt(event.target.value, 10));
//   };

//   const fetchAllApis = async (page, size) => {
//     try {
//       setLoadingPage(true);
//       const response = await axios.get(
//         `/apigateway/api/role/getAllApiDetails?page=${page}&size=${size}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setAllApiData(response.data.content);
//       setTotalPages(response.data.totalPages);
//       setTotalElements(response.data.totalElements);
//       setLoadingPage(false);
//     } catch (error) {
//       console.error("Error fetching all APIs:", error);
//       toast.error(
//         error.response.data.message || "Error fetching all APIs"
//       );
//       setLoadingPage(false);
//     }
//   };

//   return (
//     <Box
//       display="flex"
//       justifyContent="center"
//       alignItems="center"
//       height="100vh"
//     >
//       <Button variant="outlined" onClick={handleClickOpen}>
//         Manage API Role Mapping
//       </Button>
//       <BootstrapDialog
//         onClose={handleClose}
//         aria-labelledby="customized-dialog-title"
//         open={open}
//       >
//         <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
//           Manage API Role Mapping
//           <IconButton
//             aria-label="close"
//             onClick={handleClose}
//             sx={{
//               position: "absolute",
//               right: 8,
//               top: 8,
//               color: (theme) => theme.palette.grey[500],
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent dividers>
//           <Box display="flex" alignItems="center" mb={2}>
//             <TextField
//               select
//               label="Select Role"
//               value={searchCriterion}
//               onChange={handleCriterionChange}
//               variant="outlined"
//               sx={{ width: "39vh", mr: 1 }}
//             >
//               <MenuItem value="">Select Role</MenuItem>
//               {allRoles.map((role) => (
//                 <MenuItem key={role.id} value={role.role}>
//                   {role.role}
//                 </MenuItem>
//               ))}
//             </TextField>
//             <TextField
//               select
//               label="Select service"
//               value={searchService}
//               onChange={handleServiceChange}
//               variant="outlined"
//               sx={{ width: "39vh", mr: 1 }}
//             >
//               <MenuItem value="">Select Service</MenuItem>
//               {allServiceNames.map((serviceName) => (
//                 <MenuItem key={serviceName} value={serviceName}>
//                   {serviceName}
//                 </MenuItem>
//               ))}
//             </TextField>
//             <TextField
//               type="text"
//               label="Enter Search Value"
//               variant="outlined"
//               // value={}
//               // onChange={(e) => setSearchValue(e.target.value)}
//               style={{
//                 width: "30vh",
//                 marginRight: "10px",
//                 marginBottom: 0,
//               }}
//             />

//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleSearch}
//               disabled={loading}
//               sx={{ width: "15vh", height: "8vh", marginRight: "5vh" }}
//             >
//               {loading ? <CircularProgress size={24} /> : "Search"}
//             </Button>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleUpdateApi}
//               disabled={loading}
//               sx={{ width: "15vh", height: "8vh" }}
//             >
//               {apiloading ? <CircularProgress size={24} /> : "Update API"}
//             </Button>
//           </Box>
//           {loadingPage ? <LoadingPage /> : ''}
//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>
//                     <TotalApiCount count={checkedApis.length} />
//                   </TableCell>
//                   <TableCell>API Name</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {allApiData.map((api) => (
//                   <TableRow key={api.apiId}>
//                     <TableCell>
//                       <Checkbox
//                         checked={checkedApis.includes(api.apiName)}
//                         onChange={() => handleToggle(api.apiName)}
//                       />
//                     </TableCell>
//                     <TableCell>{api.apiName}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//             <TablePagination
//               rowsPerPageOptions={[10, 25, 50]}
//               component="div"
//               count={totalElements}
//               rowsPerPage={rowsPerPage}
//               page={page}
//               onPageChange={handleChangePage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//           </TableContainer>
//         </DialogContent>
//       </BootstrapDialog>
//     </Box>
//   );
// };

// export default ManageAPIRoleMapping;

