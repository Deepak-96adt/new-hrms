import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Box, Tabs, Tab, Grid, Paper } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UpdateEmpDocumentByAdmin from "./UpdateEmpDocumentByAdmin";
import LoadingPage from "./LoadingPage";
import { useSelector } from "react-redux";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import {  FormControl, FormLabel, FormControlLabel} from '@mui/material';

const EditEmployee = () => {
  const [activeTab, setActiveTab] = useState("one");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    adtId: "",
    firstName: "",
    lastName: "",
    maritalStatus: "",
    mobileNo: "",
    gender: "",
    dob: "",
    designation: "",
    isActive: "",
    email: "",
    isEmailVerified: "",
    userName: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const baseURL = "/apigateway/hrms/employee";

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${baseURL}/getById/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Error fetching details");
        setLoading(false);
      });
  }, [id, token]);

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .put(`${baseURL}/updateEmpById`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        toast.success(response.data, { position: "top-center", theme: "colored" });
        navigate("/empfunc");
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Error updating details");
        setLoading(false);
      });
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this Employee Data?")) return;

    setLoading(true);
    axios
      .delete(`${baseURL}/deleteEmployeeById/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        toast.success(response.data, { position: "top-center", theme: "colored" });
        navigate("/empfunc");
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Error deleting details");
        setLoading(false);
      });
  };

  return (
    <Container sx={{ width: "60vw", display: "flex", flexDirection: "column" }}>
      {loading && <LoadingPage />}
      <Box sx={{ width: "100%", marginLeft: { xs: "20px", sm: "40px", md: "60px" } }}>
        <Box sx={{ borderBottom: 2, borderColor: "divider", width: "100%" }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="Edit Employee Tabs">
            <Tab value="one" label="Edit Employee" />
            <Tab value="two" label="Document Details" />
          </Tabs>
        </Box>

        {activeTab === "one" && (
          <Box sx={{ flexGrow: 1, mt: 3, display: "flex", justifyContent: "center" }}>
            {/* <Paper elevation={3} sx={{ p: 2, width: "60vw" }}> */}
            <Paper
              elevation={3}
              sx={{
                p: 1.5, // Slightly reduced padding inside the Paper
                mt: 1.5, // Slightly reduced margin-top
                mb: 1.5, // Slightly reduced margin-bottom
              }}
            >
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2.5}>
                  {[
                    { label: "ID", name: "adtId", type: "text", readOnly: true },
                    { label: "First Name", name: "firstName", type: "text" },
                    { label: "Last Name", name: "lastName", type: "text" },
                    { label: "Email", name: "email", type: "email", readOnly: true },
                    { label: "DOB", name: "dob", type: "date" },
                    { label: "Mobile No", name: "mobileNo", type: "text" },
                    { label: "Marital Status", name: "maritalStatus", type: "text" },
                    { label: "Gender", name: "gender", type: "text" },
                    { label: "Designation", name: "designation", type: "text" },
                  ].map((field, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <label htmlFor={field.name}>{field.label}</label>
                      <input
                        value={data[field.name] || ""}
                        name={field.name}
                        onChange={handleInputChange}
                        type={field.type}
                        className="form-control"
                        id={field.name}
                        readOnly={field.readOnly || false}
                      />
                    </Grid>
                  ))}

                  {/* <Grid item xs={12} md={6}>
                    <label htmlFor="activeStatus">Active Status</label>
                    <select
                      name="activeStatus"
                      value={data.activeStatus || ""}
                      onChange={handleInputChange}
                      className="form-control" // Matches the input field styling
                      id="activeStatus"
                    >
                      <option value="">Select</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </Grid> */}

                  <Grid item xs={12} md={6}>
                    <FormControl component="fieldset" fullWidth>
                      <FormLabel >Active Status</FormLabel>
                      <RadioGroup
                        name="activeStatus"
                        value={data.activeStatus || ""}
                        onChange={handleInputChange}
                        row // Makes the radio buttons display horizontally
                      >
                        <FormControlLabel value="Active" control={<Radio />} label="Active" />
                        <FormControlLabel value="Inactive" control={<Radio />} label="Inactive" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid container justifyContent="center" spacing={2} sx={{ mt: 2 }}>
                    <Grid item>
                      <button style={{ backgroundColor: '#ab2217' }} type="submit">
                        Update
                      </button>
                    </Grid>
                    <Grid item>
                      <button
                        style={{
                          backgroundColor: "rgb(114, 108, 108)",
                          color: "white",
                        }}
                        type="button"
                        onClick={handleDelete}
                      >
                        Delete
                      </button>
                    </Grid>
                  </Grid>

                </Grid>
              </form>
            </Paper>
          </Box>
        )}

        {activeTab === "two" && <UpdateEmpDocumentByAdmin />}
      </Box>
    </Container>
  );
};

export default EditEmployee;


