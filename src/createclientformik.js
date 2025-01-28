import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { clientInfoSchema } from "./Validations/createclientyup";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import { useSelector } from "react-redux";
import { Button, Divider, Paper, Typography } from "@mui/material";
import "./Hrmscss/VarColors.css";

export default function SaveClientFormik() {
  // const token = localStorage.getItem("response-token");
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      Companyname: "",
      Address: "",
      number: "",
      Email: "",
      Cperson: "",
      GST: "",
    },
    validationSchema: clientInfoSchema,
    onSubmit: (values, action) => {
      setLoading(true);
      console.log(values);
      axios
        .post(
          `/apigateway/expensemanagement/clientInfo/saveClientInfo`,
          {
            companyName: values.Companyname,
            address: values.Address,
            phone: values.number,
            email: values.Email,
            contactPerson: values.Cperson,
            gstin: values.GST,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          toast.success("Client info created Successfully !!", {
            position: "top-center",
            theme: "colored",
          });
          setLoading(false);
        })
        .catch((error) => {
          toast.error(error.response.data.message || "Error creating client.");
          console.log(error);
          setLoading(false);
        });
      action.resetForm();
    },
  });

  const style = {
    width: "100%",
    height: "46px",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  return (
    <>
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
          sx={{ fontSize: "20px", color: "var(--red)", marginLeft: "35%" }}
        >
          Add Client Info
        </Typography>
        <Divider sx={{ color: "black" }} />
        <form onSubmit={formik.handleSubmit} style={{ marginTop: "5%" }}>
          <div>
            <label name="Companyname">Company Name </label>
            <div>
              <input
                id="Companyname"
                name="Companyname"
                type="text"
                placeholder="Enter Your Company Name"
                className={`form-control ${
                  formik.touched.Companyname && formik.errors.Companyname
                    ? "is-invalid"
                    : ""
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.Companyname}
                style={style}
              />
              {formik.touched.Companyname && formik.errors.Companyname ? (
                <div style={{ color: "var(--red)" }}>
                  {formik.errors.Companyname}
                </div>
              ) : null}
            </div>
          </div>
          <div>
            <label name="Address">Address</label>
            <div>
              <input
                id="Address"
                name="Address"
                type="text"
                className={`form-control ${
                  formik.touched.Address && formik.errors.Address
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Enter Address.."
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.Address}
                style={style}
              />
              {formik.touched.Address && formik.errors.Address ? (
                <div>{formik.errors.Address}</div>
              ) : null}
            </div>
          </div>
          <div>
            <label name="number">Number</label>
            <div>
              <input
                type="text"
                name="number"
                className={`form-control ${
                  formik.touched.number && formik.errors.number
                    ? "is-invalid"
                    : ""
                }`}
                id="number"
                placeholder="Enter phone number..."
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.number}
                style={style}
              />
              {formik.touched.number && formik.errors.number ? (
                <div>{formik.errors.number}</div>
              ) : null}
            </div>
          </div>
          <div>
            <label name="Email">Email</label>
            <div>
              <input
                type="Email"
                name="Email"
                className={`form-control ${
                  formik.touched.Email && formik.errors.Email
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Enter email..."
                id="Email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.Email}
                style={style}
              />
              {formik.touched.Email && formik.errors.Email ? (
                <div>{formik.errors.Email}</div>
              ) : null}
            </div>
          </div>
          <div>
            <label name="Cperson">Contact Person </label>
            <div>
              <input
                type="text "
                name="Cperson"
                id="Cperson"
                placeholder="Contact person"
                className={`form-control ${
                  formik.touched.Cperson && formik.errors.Cperson
                    ? "is-invalid"
                    : ""
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.Cperson}
                style={style}
              />
              {formik.touched.Cperson && formik.errors.Cperson ? (
                <div>{formik.errors.Cperson}</div>
              ) : null}
            </div>
          </div>
          <div>
            <label name="GST">GST-IN </label>
            <div>
              <input
                type="text "
                name="GST"
                id="GST"
                placeholder="Enter GST number..."
                className={`form-control ${
                  formik.touched.GST && formik.errors.GST ? "is-invalid" : ""
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.GST}
                style={style}
              />
              {formik.touched.GST && formik.errors.GST ? (
                <div>{formik.errors.GST}</div>
              ) : null}
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
                width: "30%",
              }}
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>
      </Paper>
    </>
  );
}
