import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import { useSelector } from "react-redux";
import {
  validateDate,
  validateNullCheck,
  validateNumber,
  validateString,
} from "./Validations/InputValidation";
import { Button, Paper } from "@mui/material";
const EditExpenses = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const token = localStorage.getItem("response-token");
  const token = useSelector((state) => state.auth.token);
  const empId = useSelector((state) => state.auth.empId);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    amount: "",
    description: "",
    paymentMode: "",
    paymentDate: "",
    createdBy: "",
    category: "",
    gst: "",
    paidBy: "",
    comments: "",
    settledDate: "",
    status: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/apigateway/expensemanagement/getExpenseById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data);
        console.log(res.data.gst);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message || "Error fetching details");
        setLoading(false);
      });
  }, []);
  function handleSubmit(e) {
    e.preventDefault();

    const amounterror = validateNumber(data.amount);
    const paymentdateerror = validateNullCheck(data.paymentDate);
    const categoryerror = validateString(data.category);
    const createdbyerror = validateString(data.createdBy);
    const paymentmodeerror = validateString(data.paymentMode);
    const paidbyerror = validateString(data.paidBy);
    const settleddateerror = validateDate(data.settledDate);
    const statuserror = validateNullCheck(data.status);

    if (
      amounterror ||
      paymentdateerror ||
      categoryerror ||
      createdbyerror ||
      paymentmodeerror ||
      paidbyerror ||
      settleddateerror ||
      statuserror
    ) {
      setErrors({
        amount: amounterror,
        payment: paymentdateerror,
        category: categoryerror,
        createdBy: createdbyerror,
        paymentMode: paymentmodeerror,
        paidBy: paidbyerror,
        settledDate: settleddateerror,
        status: statuserror,
      });
      return;
    }

    setErrors({
      amount: null,
      payment: null,
      category: null,
      createdBy: null,
      paymentMode: null,
      paidBy: null,
      settledDate: null,
      status: null,
    });

    setLoading(true);
    axios
      .put(
        `/apigateway/expensemanagement/updateExpense/${id}`,
        {
          empId: data.empId,
          amount: parseInt(data.amount),
          description: data.description,
          paymentMode: data.paymentMode,
          paymentDate: data.paymentDate,
          createdBy: data.createdBy,
          category: data.category,
          gst: data.gst,
          paidBy: data.paidBy,
          comments: data.comments,
          settledDate: data.settledDate,
          status: data.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        toast.success("data has been updated successfully!!", {
          position: "top-center",
          theme: "colored",
        });
        navigate("/Getallexpenses");
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
    marginBottom: "2%",
    borderRadius: "4px",
    "&:focus": {
      border: "1px solid #ab2217",
      outline: "none",
    },
  };

  return (
    <div>
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
        <form onSubmit={handleSubmit}>
          <div>
            <label name="amount">Amount</label>
            <div>
              <input
                value={data.amount || ""}
                onChange={(e) => setData({ ...data, amount: e.target.value })}
                type="number"
                id="amount"
                step="0.1"
                placeholder="enter amount"
                style={style}
              />
              {errors.amount && (
                <span style={{ color: "red" }}>{errors.amount}</span>
              )}
            </div>
          </div>
          <div>
            <label name="description">Description</label>
            <div>
              <input
                value={data.description || ""}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
                type="text"
                id="description"
                style={style}
              />
            </div>
          </div>
          <div>
            <label name="paymentDate">Payment Date</label>
            <div>
              <input
                value={data.paymentDate || ""}
                onChange={(e) =>
                  setData({ ...data, paymentDate: e.target.value })
                }
                type="date"
                id="paymentDate"
                style={style}
              />
              {errors.payment && (
                <span style={{ color: "red" }}>{errors.payment}</span>
              )}
            </div>
          </div>
          <div>
            <label name="paymentMode">Payment Mode</label>
            <div>
              <input
                value={data.paymentMode || ""}
                onChange={(e) =>
                  setData({ ...data, paymentMode: e.target.value })
                }
                type="text"
                placeholder="enter your Payment Mode."
                id="paymentMode"
                style={style}
              />
              {errors.paymentMode && (
                <span style={{ color: "red" }}>{errors.paymentMode}</span>
              )}
            </div>
          </div>
          <div>
            <label name="createdBy">Created By</label>
            <div>
              <input
                value={data.createdBy || ""}
                onChange={(e) =>
                  setData({ ...data, createdBy: e.target.value })
                }
                type="text"
                placeholder="created By"
                id="createdBy"
                style={style}
              />
              {errors.createdBy && (
                <span style={{ color: "red" }}>{errors.createdBy}</span>
              )}
            </div>
          </div>
          <div>
            <label name="category">Category</label>
            <div>
              <input
                value={data.category || ""}
                onChange={(e) => setData({ ...data, category: e.target.value })}
                type="text"
                placeholder="enter the expense type."
                id="category"
                style={style}
              />
              {errors.category && (
                <span style={{ color: "red" }}>{errors.category}</span>
              )}
            </div>
          </div>
          <div style={{display:"flex", gap: "5%"}}>
            <label>GST</label>
            <div style={{display:"flex",gap: "5%"}}>
              <div style={{display:"flex"}}>
                <input
                  checked={data.gst === true}
                  onChange={(e) => setData({ ...data, gst: true })}
                  value={true || ""}
                  type="radio"
                  name="inlineRadioOptions"
                  id="gst"
                />
                <label>Yes</label>
              </div>
              <div style={{display:"flex"}}>
                <input
                  checked={data.gst === false}
                  onChange={(e) => setData({ ...data, gst: false })}
                  value={false || ""}
                  type="radio"
                  name="inlineRadioOptions"
                  id="gst"
                />
                <label>No</label>
              </div>
            </div>
          </div>
          <div>
            <label>Paid By</label>
            <div>
              <input
                value={data.paidBy || ""}
                onChange={(e) => setData({ ...data, paidBy: e.target.value })}
                type="text"
                placeholder="paid By"
                id="paidBy"
                style={style}
              />
              {errors.paidBy && (
                <span style={{ color: "red" }}>{errors.paidBy}</span>
              )}
            </div>
          </div>
          <div>
            <label>Comments</label>
            <div>
              <input
                value={data.comments || ""}
                onChange={(e) => setData({ ...data, comments: e.target.value })}
                type="text"
                placeholder="enter your comments"
                id="comments"
                style={style}
              />
            </div>
          </div>
          <div>
            <label>Status</label>
            <div>
              <select
                disabled={data.status === "Settled"}
                id="status"
                value={data.status || ""}
                onChange={(e) => setData({ ...data, status: e.target.value })}
                style={style}
              >
                <option defaultValue value="">
                  Select your position type
                </option>
                <option value="Settled">Settled</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>
              {errors.status && (
                <span style={{ color: "red" }}>{errors.status}</span>
              )}
            </div>
          </div>
          <div>
            <label>Settled Date</label>
            <div>
              <input
                value={data.settledDate || ""}
                onChange={(e) =>
                  setData({ ...data, settledDate: e.target.value })
                }
                type="date"
                id="settledDate"
                style={style}
              />
              {errors.settledDate && (
                <span style={{ color: "red" }}>{errors.settledDate}</span>
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
              Update Expenses
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default EditExpenses;
