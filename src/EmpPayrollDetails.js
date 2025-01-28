import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import handleAuthError from "./CommonErrorHandling";
import LoadingPage from "./LoadingPage";
import { useSelector } from "react-redux";
import {
  validateAccountNumber,
  validateBankName,
  validateIfscCode,
} from "./Validations/InputValidation";
import { Button, Divider, Paper, Typography } from "@mui/material";

export default function EmpPayrollDetail() {
  // const token = localStorage.getItem("response-token");
  // const EmpId = localStorage.getItem("EmpID");
  const token = useSelector((state) => state.auth.token);
  const EmpId = useSelector((state) => state.auth.empId);

  const [bankNameDropdown, setBankNameDropdown] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    empId: "",
    designation: "",
    joinDate: "",
    salary: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });

  function HandleSubmit(e) {
    e.preventDefault();
    const bankNameError = validateBankName(data.bankName);
    const accountNumberError = validateAccountNumber(data.accountNumber);
    const ifscCodeError = validateIfscCode(data.ifscCode);
    if (bankNameError || accountNumberError || ifscCodeError) {
      setErrors({
        bankName: bankNameError,
        accountNumber: accountNumberError,
        ifscCode: ifscCodeError,
      });
      return;
    }
    setErrors({});
    setLoading(true);
    axios
      .post(
        `/apigateway/hrms/employee/updatePayrollByUser`,
        {
          empId: data.employee.employeeId,
          designation: data.designation,
          joinDate: data.joinDate,
          salary: data.salary,
          bankName: data.bankName,
          accountNumber: data.accountNumber,
          ifscCode: data.ifscCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
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

  const fetchBankName = async () => {
    await axios
      .get(`/apigateway/hrms/employee/bank_name`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBankNameDropdown(response.data);
      })
      .catch((error) => {
        toast.error(error || "Error fetching details");
      });
  };

  useEffect(() => {
    setLoading(true);
    fetchBankName();
    axios
      .get(`/apigateway/hrms/employee/getEmpPayrollById/${EmpId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message || "Error fetching details");
        setLoading(false);
      });
  }, []);

  const style = {
    width: "100%",
    height: "46px",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginBottom: "2%",
  };

  return (
    <div style={{ width: "100%" }}>
      {loading ? <LoadingPage /> : ""}
      <Paper
        sx={{
          height: "auto",
          width: "500px !important",
          padding: "5%",
          marginTop: "5%",
          marginBottom: "10%",
          marginLeft: "20%",
        }}
      >
        <center>
          <Typography sx={{ fontSize: "20px", color: "var(--red)" }}>
            Payroll Details
          </Typography>
        </center>
        <Divider sx={{ color: "black", marginBottom: "5%" }} />
        <form onSubmit={HandleSubmit}>
          <div>
            <label name="employeeId">EmployeeId</label>
            <div>
              <input
                disabled
                value={data?.employee?.adtId || ""}
                type="text"
                id="employeeId"
                style={style}
              />
            </div>
          </div>
          <div>
            <label name="salary">Salary</label>
            <div>
              <input
                disabled
                value={data.salary || ""}
                type="text"
                id="salary"
                style={style}
              />
            </div>
          </div>
          <div>
            <label name="bankName">Bank Name</label>
            <div>
              <select
                value={data.bankName?.toUpperCase() || ""}
                onChange={(e) => setData({ ...data, bankName: e.target.value })}
                style={style}
              >
                {bankNameDropdown.map((row) => (
                  <option key={row.id} value={row.name}>
                    {row.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label name="designation">Designation</label>
            <div>
              <input
                disabled
                value={data.designation || ""}
                type="text"
                id="designation"
                style={style}
              />
            </div>
          </div>
          <div>
            <label name="joinDate">Join Date</label>
            <div>
              <input
                disabled
                value={data.joinDate || ""}
                type="text"
                id="joinDate"
                style={style}
              />
            </div>
          </div>
          <div>
            <label name="accountNumber">Account Number</label>
            <div>
              <input
                value={data.accountNumber || ""}
                onChange={(e) =>
                  setData({ ...data, accountNumber: e.target.value })
                }
                type="text"
                id="accountNumber"
                style={style}
              />
              {errors.accountNumber && (
                <small className="text-danger">{errors.accountNumber}</small>
              )}
            </div>
          </div>
          <div>
            <label name="ifscCode">IFSC Code</label>
            <div>
              <input
                value={data.ifscCode || ""}
                onChange={(e) => setData({ ...data, ifscCode: e.target.value })}
                type="text"
                id="ifscCode"
                style={style}
              />
              {errors.ifscCode && (
                <small className="text-danger">{errors.ifscCode}</small>
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
                marginTop: "2%",
              }}
              type="submit"
            >
              Update
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}
