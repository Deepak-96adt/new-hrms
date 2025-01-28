import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Button, CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Autocomplete } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingPage from "./LoadingPage"; 
import { useSelector } from 'react-redux';

const AssignRole = () => {
  const [searchCriterion, setSearchCriterion] = useState("firstName");
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allRoles, setAllRoles] = useState([]);
  const [employeeRoles, setEmployeeRoles] = useState({});
  const [updating, setUpdating] = useState({});
  const [loadingg, setLoadingg] = useState(true);

  
  //const token = localStorage.getItem("response-token");
  const  token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchAllRoles = async () => {
      try {
        const response = await axios.get('/apigateway/api/role/getAllRoles', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAllRoles(response.data.content);
        setLoadingg(false)
      } catch (error) {
        console.error('Error fetching all roles:', error);
        setLoadingg(false);
        toast.error(
          error.response.data.message || "Failed to fetching all roles"
        );
      }
    };

    fetchAllRoles();
  }, [token]);

  const handleCriterionChange = (event) => {
    setSearchCriterion(event.target.value);
  };

  const handleValueChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = async () => {  
    setLoading(true);
    try {
      const response = await axios.get(
        `/apigateway/hrms/employee/searchEmployees`,
        {
          params: {
            [searchCriterion]: searchValue,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const employees = response.data.content;
      setSearchResult(employees);

      const employeeRolesData = {};
      for (const employee of employees) {
        const roleResponse = await axios.get(
          `/apigateway/api/role/getRoleAssignToEmployee`,
          {
            params: { employeeId: employee.employeeId },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        employeeRolesData[employee.employeeId] = roleResponse.data.body.map(role => role.role_name);
      }
      setEmployeeRoles(employeeRolesData);
    } catch (error) {
      console.error("Error searching employees:", error);
      toast.error(
        error.response.data.message || "Error searching employees"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (employeeId, newRoles) => {
    setEmployeeRoles((prevRoles) => ({
      ...prevRoles,
      [employeeId]: newRoles,
    }));
  };

  const handleUpdateRoles = async (employeeId) => {
    try {
      setUpdating((prevUpdating) => ({ ...prevUpdating, [employeeId]: true }));
      const newRoles = employeeRoles[employeeId];
      await axios.put(
        `/apigateway/api/role/updateRoleOfEmployee`,
        newRoles,
        {
          params: { employeeId },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Roles updated successfully.");
    } catch (error) {
      console.error('Error updating roles:', error);
      toast.error(
        error.response.data.message || "Error updating roles"
      );
    } finally {
      setUpdating((prevUpdating) => ({ ...prevUpdating, [employeeId]: false }));
    }
  };

  return (
    <Box sx={{ p: 2 }}>
        {loadingg ? <LoadingPage/> : ''}
      <Typography variant="h6" gutterBottom>
        Manage Role Permissions
      </Typography>
      <Box sx={{ mb: 2,display:'flex' }}>
        <TextField
          select
          label="Search By"
          value={searchCriterion}
          onChange={handleCriterionChange}
          variant="outlined"
          sx={{ width: '39vh', mr: 1 }}
        >
          <MenuItem  value="firstName">First Name</MenuItem>
          <MenuItem value="lastName">Last Name</MenuItem>
          <MenuItem value="email">Email</MenuItem>
        </TextField>
        <input type='text' placeholder='Enter Search Value' value={searchValue} onChange={handleValueChange} style={{height:'55px',borderRadius:'0px', width: '30vh', marginRight: '10px' }}/>
        <Button variant="contained" color="primary" onClick={handleSearch} disabled={loading}
         sx={{
          // marginTop: "5%",
          width: '15vh', 
          height: '7vh', 
          backgroundColor: "var(--red)",
          color: "var(--white)",
          transition: "transform",
          "&:hover": {
            backgroundColor: "var(--red)",
            transform: "scale(1.03)",
          },
        }}>
          {loading ? <CircularProgress size={24} /> : "Search"}
        </Button>
      </Box>
      {searchResult.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResult.map((employee) => (
                <TableRow key={employee.employeeId}>
                  <TableCell>{employee.adtId}</TableCell>
                  <TableCell>{employee.firstName}</TableCell>
                  <TableCell>{employee.lastName}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <Autocomplete
                      multiple
                      options={allRoles.map(role => role.role)}
                      value={employeeRoles[employee.employeeId] || []}
                      onChange={(event, newValue) => handleRoleChange(employee.employeeId, newValue)}
                      renderInput={(params) => <TextField {...params} variant="outlined" label="Roles" />}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdateRoles(employee.employeeId)}
                      disabled={updating[employee.employeeId]}
                    >
                      {updating[employee.employeeId] ? <CircularProgress size={24} /> : "Update"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AssignRole;


