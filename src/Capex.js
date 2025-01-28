import axios from "axios";
import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import { useSelector } from "react-redux";
import {
  validateNullCheck,
  validateNumber,
  validateString,
  validateInvoice,
  validateGSTBill,
  validateAlphaNumeric,
} from "./Validations/InputValidation";
import { Button, Paper, TextField } from "@mui/material";
import "./Hrmscss/VarColors.css";

const Capex = () => {
  // const token = localStorage.getItem("response-token");
  const token = useSelector((state) => state.auth.token);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    date: "",
    expenseDetails: "",
    gstBill: "",
    amount: "",
    paidBy: "",
    comment: "",
    mode: "",
    invoice: [],
  });
  const [loading, setLoading] = useState(false);
  function submit(e) {
    e.preventDefault();

    var dateError = validateNullCheck(data.date);
    var expenseDetailsError = validateAlphaNumeric(data.expenseDetails);
    var gstBillError = validateGSTBill(data.gstBill);
    var amoutError = validateNumber(data.amount);
    var paidByError = validateString(data.paidBy);
    var invoiceError = validateInvoice(data.invoice);
    var modeError = validateString(data.mode);

    if (
      dateError ||
      amoutError ||
      paidByError ||
      invoiceError ||
      expenseDetailsError ||
      gstBillError ||
      modeError
    ) {
      setErrors({
        date: dateError,
        expenseDetails: expenseDetailsError,
        gstBill: gstBillError,
        amount: amoutError,
        paidBy: paidByError,
        invoice: invoiceError,
        mode: modeError,
      });
      return;
    }
    setErrors({
      date: null,
      expenseDetails: null,
      gstBill: null,
      amount: null,
      paidBy: null,
      invoice: null,
      mode: null,
    });

    setLoading(true);
    const formData = new FormData();
    const body = {
      date: data.date,
      expenseDetails: data.expenseDetails,
      gstBill: data.gstBill,
      amount: parseInt(data.amount),
      paidBy: data.paidBy,
      comment: data.comment,
      mode: data.mode,
    };
    //Append "invoice" file(s) to FormData
    for (let i = 0; i < data.invoice.length; i++) {
      formData.append("invoice", data.invoice[i]);
    }
    formData.append("body", JSON.stringify(body));
    axios
      .post(
        `/apigateway/expensemanagement/capExDetails/createCapExDetails`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        toast.success("Data has been created successfully.", {
          position: "top-center",
          theme: "colored",
        });
        setLoading(false);
      })
      .catch((error) => {
        toast.error(
          error.response.data.message || "Error creating capex details."
        );
        console.log(error);
        setLoading(false);
      });
  }

  const style = {
    width: "100%",
    height: "46px",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    "&:focus": {
      border: "1px solid #ab2217",
      outline: "none",
    },
  };

  const handle = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  return (
    <div>
      {loading ? <LoadingPage /> : ""}
      <Paper
        sx={{
          height: "auto",
          width: "150%",
          marginLeft: {xs: "30%", sm: "50%", md: "80%"},
          padding: "10%",
          marginTop: "10%",
          marginBottom: "10%",
        }}
      >
        <form
          onSubmit={(e) => {
            submit(e);
          }}
        >
          <div>
            <label name="date">Date</label>
            <input
              name="date"
              onChange={handle}
              value={data.date}
              type="date"
              className={`form-control ${errors.date ? "is-invalid" : ""}`}
              style={style}
            />
          </div>
          <div>
            <label name="expenseDetails">ExpenseDetails</label>
            <div>
              <input
                onChange={(e) => {
                  handle(e);
                }}
                name="expenseDetails"
                value={data.expenseDetails}
                type="text"
                className={`form-control ${
                  errors.expenseDetails ? "is-invalid" : ""
                }`}
                style={style}
              />

              {errors.expenseDetails && (
                <div className="invalid-feedback">{errors.expenseDetails}</div>
              )}
            </div>
          </div>
          <div>
            <label name="gstBill">GstBill No</label>
            <div>
              <input
                onChange={(e) => {
                  handle(e);
                }}
                value={data.gstBill}
                type="text"
                name="gstBill"
                placeholder="enter your Gst Bill number"
                className={`form-control ${errors.gstBill ? "is-invalid" : ""}`}
                style={style}
              />
              {errors.gstBill && (
                <div className="invalid-feedback">{errors.gstBill}</div>
              )}
            </div>
          </div>

          <div>
            <label name="amount">Amount</label>
            <div>
              <input
                onChange={(e) => {
                  handle(e);
                }}
                value={data.amount}
                type="number"
                name="amount"
                className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                style={style}
              />
              {errors.amount && (
                <div className="invalid-feedback">{errors.amount}</div>
              )}
            </div>
          </div>

          <div>
            <label name="paidBy">PaidBy</label>
            <div>
              <input
                onChange={(e) => {
                  handle(e);
                }}
                value={data.paidBy}
                type="text"
                name="paidBy"
                placeholder="enter your paidBy"
                className={`form-control ${errors.paidBy ? "is-invalid" : ""}`}
                style={style}
              />

              {errors.paidBy && (
                <div className="invalid-feedback">{errors.paidBy}</div>
              )}
            </div>
          </div>

          <div>
            <label name="comment">Comment</label>
            <div>
              <input
                onChange={(e) => {
                  handle(e);
                }}
                value={data.comment}
                type="text"
                name="comment"
                className="form-control"
                placeholder="enter your comment"
                style={style}
              />
            </div>
          </div>

          <div>
            <label name="mode">Mode</label>
            <div>
              <input
                onChange={(e) => {
                  handle(e);
                }}
                value={data.mode}
                type="text"
                name="mode"
                placeholder="enter your mode"
                className={`form-control ${errors.mode ? "is-invalid" : ""}`}
                style={style}
              />
              {errors.mode && (
                <div className="invalid-feedback">{errors.mode}</div>
              )}
            </div>
          </div>

          <div>
            <label>Invoice</label>
            <div>
              <input
                name="invoice"
                onChange={(e) =>
                  setData((prevData) => ({
                    ...prevData,
                    invoice: e.target.files,
                  }))
                }
                type="file"
                multiple
                accept="application/pdf"
                className={`form-control ${errors.invoice ? "is-invalid" : ""}`}
                style={style}
              />

              {errors.invoice && (
                <div className="invalid-feedback">{errors.invoice}</div>
              )}
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
              }}
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default Capex;
