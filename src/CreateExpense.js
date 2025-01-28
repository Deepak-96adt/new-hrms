import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import { useSelector } from "react-redux";
import {
  validateNullCheck,
  validateNumber,
  validateRadioButton,
  validateString,
} from "./Validations/InputValidation";
import { Button, Paper } from "@mui/material";
import "./Hrmscss/VarColors.css";

const CreateExpense = () => {
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const empid = useSelector((state) => state.auth.empId);
  const [errors, setErrors] = useState({});

  const [data, setData] = useState({
    empId: empid,
    amount: "",
    description: "",
    paymentMode: "",
    paymentDate: "",
    // createdBy: "",
    category: "",
    gst: "",
    // paidBy: "",
    comments: "",
  });

  function submit(e) {
    e.preventDefault();

    var amountError = validateNumber(data.amount);
    var descriptionError = validateString(data.description);
    var paymentDateError = validateNullCheck(data.paymentDate);
    var paymentModeError = validateString(data.paymentMode);
    var categoryError = validateString(data.category);
    var gstError = validateRadioButton(data.gst);

    if (
      amountError ||
      paymentDateError ||
      paymentModeError ||
      categoryError ||
      gstError ||
      descriptionError
    ) {
      setErrors({
        amount: amountError,
        paymentDate: paymentDateError,
        paymentMode: paymentModeError,
        category: categoryError,
        gst: gstError,
        description: descriptionError,
      });
      return;
    }

    setErrors({
      amount: null,
      paymentDate: null,
      paymentMode: null,
      category: null,
      gst: null,
      description: null,
    });

    setLoading(true);

    axios
      .post(
        `/apigateway/expensemanagement/createExpenses`,
        {
          empId: data.empId,
          amount: parseInt(data.amount),
          description: data.description,
          paymentMode: data.paymentMode,
          paymentDate: data.paymentDate,
          // createdBy: data.createdBy,
          category: data.category,
          gst: data.gst,
          // paidBy: data.paidBy,
          comments: data.comments,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        //  console.log(response.data);
        toast.success("Expense data created successfully!!", {
          position: "top-center",
          theme: "colored",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          error.response.data.message || "Error creating expense data"
        );
        setLoading(false);
      });
  }
  var str2bool = (value) => {
    if (value && typeof value === "string") {
      if (value.toLowerCase() === "true") return true;
      if (value.toLowerCase() === "false") return false;
    }
    return value;
  };
  function radiobut(e) {
    console.log(str2bool(e.target.value));
    // Here we can send the data to further processing (Action/Store/Rest)
    data.gst = str2bool(e.target.value);
  }
  const handle = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  return (
    <div className=" mt-3">
      {loading ? <LoadingPage /> : ""}
      <Paper
        sx={{
          height: "auto",
          width: "200%",
          marginLeft: "150%",
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
            <label name="amount">Amount</label>
            <div>
              <input
                onChange={(e) => {
                  handle(e);
                }}
                value={data.amount}
                type="number"
                name="amount"
                placeholder="enter amount"
                className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                style={style}
              />
              {errors.amount && (
                <div className="invalid-feedback">{errors.amount}</div>
              )}
            </div>
          </div>

          <div>
            <label name="description">Description</label>
            <div>
              <input
                onChange={(e) => {
                  handle(e);
                }}
                value={data.description}
                type="text"
                name="description"
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
                style={style}
              />
              {errors.description && (
                <div className="invalid-feedback">{errors.description}</div>
              )}
            </div>
          </div>

          <div>
            <label name="paymentDate">Payment Date</label>
            <div>
              <input
                onChange={(e) => {
                  handle(e);
                }}
                value={data.paymentDate}
                type="date"
                name="paymentDate"
                className={`form-control ${
                  errors.paymentDate ? "is-invalid" : ""
                }`}
                style={style}
              />
              {errors.paymentDate && (
                <div className="invalid-feedback">{errors.paymentDate}</div>
              )}
            </div>
          </div>

          <div>
            <label name="paymentMode">Payment Mode</label>
            <div>
              <input
                onChange={(e) => {
                  handle(e);
                }}
                value={data.paymentMode}
                type="text"
                name="paymentMode"
                placeholder="enter your Payment Mode."
                className={`form-control ${
                  errors.paymentMode ? "is-invalid" : ""
                }`}
                style={style}
              />
              {errors.paymentMode && (
                <div className="invalid-feedback">{errors.paymentMode}</div>
              )}
            </div>
          </div>
          <div>
            <label name="category">Category</label>
            <div>
              <input
                onChange={(e) => {
                  handle(e);
                }}
                value={data.category}
                type="text"
                placeholder="enter the expense type."
                name="category"
                className={`form-control ${
                  errors.category ? "is-invalid" : ""
                }`}
                style={style}
              />
              {errors.category && (
                <div className="invalid-feedback">{errors.category}</div>
              )}
            </div>
          </div>
          <fieldset style={{ display: "flex", gap: "10%" }}>
            <label name="gst">GST</label>
            <div style={{ display: "flex", gap: "10%" }}>
              <div style={{ display: "flex" }}>
                <input
                  onChange={radiobut}
                  value="true"
                  type="radio"
                  id="gstYes"
                  name="gst"
                  className={`form-check-input ${
                    errors.gst ? "is-invalid" : ""
                  }`}
                />
                <label>Yes</label>
              </div>
              <div style={{ display: "flex" }}>
                <input
                  onChange={radiobut}
                  value="false"
                  type="radio"
                  id="gstNo"
                  name="gst"
                  className={`form-check-input ${
                    errors.gst ? "is-invalid" : ""
                  }`}
                />
                <label>No</label>
              </div>
              {errors.gst && (
                <div className="invalid-feedback d-block">{errors.gst}</div>
              )}
            </div>
          </fieldset>
          <div>
            <label>Comments</label>
            <div>
              <input
                onChange={(e) => {
                  handle(e);
                }}
                value={data.comments}
                type="text"
                className="form-control"
                placeholder="enter your comments"
                name="comments"
                style={style}
              />
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

export default CreateExpense;
