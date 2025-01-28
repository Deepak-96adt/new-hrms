import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import { useSelector } from "react-redux";
import {
  validateString,
  validateAlphaNumeric,
  validateMobileNumber,
  validateEmail,
  validateGSTBill,
} from "./Validations/InputValidation";
import { Button, Divider, Paper, Typography } from "@mui/material";

const EditClientInfo = () => {
  // const token = localStorage.getItem("response-token");
  const [addressError, setAddressError] = useState();
  const [companyNameError, setCompanyNameError] = useState();
  const [contactPersonError, setContactPersonError] = useState();
  const [emailError, setEmailError] = useState();
  const [gstinError, setGSTINError] = useState();
  const [phoneError, setPhoneError] = useState();
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    id: "",
    address: "",
    companyName: "",
    contactPerson: "",
    email: "",
    gstin: "",
    phone: "",
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/apigateway/expensemanagement/clientInfo/getClientInfoById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message || "Error fetching details");
        setLoading(false);
      });
  }, [token, id]);

  function HandleSubmit(e) {
    e.preventDefault();

    const addresserror = validateAlphaNumeric(data.address);
    const companyNameerror = validateString(data.companyName);
    const contactPersonerror = validateString(data.contactPerson);
    const emailerror = validateEmail(data.email); // Assuming email validation function
    const gstinerror = validateGSTBill(data.gstin); // Assuming GSTIN validation function
    const phoneerror = validateMobileNumber(data.phone); // Assuming phone validation function

    if (
      addresserror ||
      companyNameerror ||
      contactPersonerror ||
      emailerror ||
      gstinerror ||
      phoneerror
    ) {
      setAddressError(addresserror);
      setCompanyNameError(companyNameerror);
      setContactPersonError(contactPersonerror);
      setEmailError(emailerror);
      setGSTINError(gstinerror);
      setPhoneError(phoneerror);
      return;
    }

    setAddressError(null);
    setCompanyNameError(null);
    setContactPersonError(null);
    setEmailError(null);
    setGSTINError(null);
    setPhoneError(null);

    setLoading(true);
    axios
      .put(
        `/apigateway/expensemanagement/clientInfo/updateClientInfo/${id}`,
        {
          id: data.id,
          address: data.address,
          companyName: data.companyName,
          contactPerson: data.contactPerson,
          email: data.email,
          gstin: data.gstin,
          phone: data.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        navigate("/Getclientinfo");
        toast.success(response.data, {
          position: "top-center",
          theme: "colored",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message || "Error updating details");
        setLoading(false);
      });
  }

  const style = {
    width: "100%",
    height: "46px",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  return (
    <div>
      {loading ? <LoadingPage /> : ""}
      <Paper
        sx={{
          width: "220%",
          marginLeft: "120%",
          padding: "10%",
          marginTop: "20%",
        }}
      >
        <Typography
          sx={{ fontSize: "20px", color: "var(--red)", marginLeft: "30%" }}
        >
          Update Client Info
        </Typography>
        <Divider sx={{ color: "black" }} />
        <form onSubmit={HandleSubmit} style={{ marginTop: "5%" }}>
          <div>
            <label name="id">Id</label>
            <div>
              <input
                disabled
                value={data.id || ""}
                type="text"
                id="id"
                style={style}
              />
            </div>
          </div>
          <div>
            <label name="address">Address</label>
            <div>
              <input
                value={data.address || ""}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                type="text"
                id="addressr"
                placeholder="enter address"
                style={style}
              />
              {addressError && (
                <span style={{ color: "red" }}>{addressError}</span>
              )}
            </div>
          </div>

          <div>
            <label name="companyName">Company Name</label>
            <div>
              <input
                value={data.companyName || ""}
                onChange={(e) =>
                  setData({ ...data, companyName: e.target.value })
                }
                type="text"
                id="companyName"
                placeholder="enter company Name"
                style={style}
              />
              {companyNameError && (
                <span style={{ color: "red" }}>{companyNameError}</span>
              )}
            </div>
          </div>
          <div>
            <label name="contactPerson">Contact Person</label>
            <div>
              <input
                value={data.contactPerson || ""}
                onChange={(e) =>
                  setData({ ...data, contactPerson: e.target.value })
                }
                type="text"
                id="contactPerson"
                placeholder="enter contact Person"
                style={style}
              />
              {contactPersonError && (
                <span style={{ color: "red" }}>{contactPersonError}</span>
              )}
            </div>
          </div>
          <div>
            <label name="email">Email</label>
            <div>
              <input
                value={data.email || ""}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                type="text"
                id="email"
                placeholder="enter email address"
                style={style}
              />
              {emailError && <span style={{ color: "red" }}>{emailError}</span>}
            </div>
          </div>

          <div>
            <label name="gstin">GST-IN </label>
            <div>
              <input
                value={data.phone || ""}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                type="tel"
                placeholder="Enter phone number"
                title="Enter a valid 10-digit phone number"
                id="phone"
                style={style}
              />
              {phoneError && <span style={{ color: "red" }}>{phoneError}</span>}
            </div>
          </div>

          <div>
            <Button
              sx={{
                backgroundColor: "var(--red)",
                color: "var(--white)",
                transition: "transform",
                "&:hover": {
                  backgroundColor: "var(--red)",
                  transform: "scale(1.03)",
                },
                width: "60%",
                marginTop: "5%"
              }}
              type="submit"
            >
              Update Project Details
            </Button>
          </div>
        </form>
      </Paper>
      ;
    </div>
  );
};

export default EditClientInfo;
