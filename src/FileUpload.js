import React, { useState } from "react";
import axios from "axios";
import LoadingPage from "./LoadingPage";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Paper, Button, RadioGroup, FormControlLabel, Radio, Box, Container } from "@mui/material";
function FileUpload() {
  // const token = localStorage.getItem("response-token");
  const token = useSelector((state) => state.auth.token);

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState();
  const [isDBSelected, setIsDBSelected] = useState(false);
  function handleFileChange(event) {
    setFile(event.target.files[0]);
  }
  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  var str2bool = (value) => {
    if (value && typeof value === "string") {
      if (value.toLowerCase() === "true") return true;
      if (value.toLowerCase() === "false") return false;
    }
    return value;
  };
  function handleSelectType(event) {
    setIsDBSelected(str2bool(event.target.value));
    console.log(str2bool(event.target.value));
  }

  function Submit(event) {
    event.preventDefault();
    setLoading(true);
    let url = `/apigateway/payroll/generatePaySlipForAll?isDBSelected=${isDBSelected}`;

    if (email) {
      url += `&emailInput=${email}`;
    }
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        alert(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response.data || "Error creating details");
        setLoading(false);
      });
  }


  // function handleSubmit(event) {
  //   console.log(file);
  //   event.preventDefault();
  //   const formData = new FormData();
  //   formData.append("file", file);

  //   let url = "/apigateway/payroll/genPayAll";
  //   if (email) {
  //     url += `?email=${email}`;
  //   }

  //   setLoading(true);
  //   axios
  //     .post(url, formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "multipart/form-data",
  //       },
  //     })
  //     .then((response) => {
  //       console.log(response.data);
  //       alert(response.data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       toast.error(error.response.data.message || "Error creating details");
  //       setLoading(false);
  //     });
  // }

  return (
<div class="d-flex">
  {loading ? <LoadingPage /> : ""}
  <Container>
  <Paper
        sx={{
          height: "auto",
          width: "50ch",
          marginLeft: "10%",
          padding: "5%",
          marginTop: "5%",
          marginBottom: "10%",
          paddingRight: "10%",
        }}
      >
    <form onSubmit={Submit}>
      <p style={{ marginBottom: "4px" }}>Do you want to save the records in the database?</p>
      <RadioGroup
        row
        value={isDBSelected.toString()}
        onChange={handleSelectType}
        sx={{
          alignItems: "flex-start",
          justifyContent: "flex-start", // Align to the left
        }}
      >
        <FormControlLabel
          value="false"
          control={<Radio color="primary" />}
          label="Non-DB"
        />
        <FormControlLabel
          value="true"
          control={<Radio color="primary" />}
          label="DB"
          sx={{ ml: 2 }}
        />
      </RadioGroup>
      <p style={{ marginBottom: "4px", marginTop: "4px" }}>Email</p>
      <input
        type="email"
        onChange={handleEmailChange}
        placeholder="Enter Email."
        style={{ width: '80%', marginBottom: '12px' }} // Reduced margin-bottom
      />
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          sx={{
            backgroundColor: "var(--red)",
            color: "var(--white)",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "var(--red)",
              transform: "scale(1.03)",
            },
          }}
          type="submit"
        >
          Generate Payslip
        </Button>
      </Box>
    </form>
  </Paper>
  </Container>
</div>
);
}

export default FileUpload;
