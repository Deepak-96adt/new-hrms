import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import handleAuthError from "./CommonErrorHandling";
import { Link } from "react-router-dom";
import LoadingPage from './LoadingPage';
import { useSelector } from 'react-redux';
const CreatePayslip = () => {
  // const token = localStorage.getItem("response-token");
  // const empId = localStorage.getItem("EmpID");
  const  token = useSelector((state) => state.auth.token);
  const  empId = useSelector((state) => state.auth.empId);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    empId: "",
    basic: "",
    bankName: null,
    designation: null,
    joinDate: null,
    accountNumber: null,
    ifscCode: null,
    houseRentAllowance: "",
    employeeESICAmount: "",
    employerESICAmount: "",
    employeePFAmount: "",
    employerPFAmount: "",
    grossSalary: "",
    netSalary: "",
    medicalInsurance: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    Object.keys(data).forEach((key) => {
      if (!data[key]) {
        newErrors[key] = `${key} is required`;
        isValid = false;
      } else if (isNaN(data[key])) {
        newErrors[key] = `${key} should be a number`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const submit = (e) => {
    e.preventDefault();
      setLoading(true); 
      axios
        .post(
          `apigateway/payroll/salarydetails/saveEmployeeSalaryDetails`,
          data,
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
          toast.error( error.response.data.message || "Error saving details." );
          setLoading(false); 
        });
    
  };

  function handle(e) {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    setData(newdata);
    console.log(newdata);
  }
  return (
    <div className="mt-3">
       {loading ? <LoadingPage/> : ''}
      <nav
        aria-label="breadcrumb"
        style={{ "--bs-breadcrumb-divider": "'>>'" }}
      >
        <ol
          className="breadcrumb"
          style={{ color: "white", marginLeft: "20px" }}
        >
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>{" "}
          </li>
          <li className="breadcrumb-item">
            <Link to="">Payslip</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Salary Details
          </li>
        </ol>
      </nav>

      <div className="container pt-3">
        <h1 className="Heading1" style={{ textAlign: "center" }}>
          Salary Details
        </h1>
        <div className="col-md-8 mx-auto">
          <div
            className="card border-0 shadow"
            style={{ marginRight: "100px", width: "700px", height: "950px" }}
          >
            <div className="card-body">
              <form className="container py-3  mb-3">
                <div className="row mb-3">
                  <label htmlFor="basic" className="col-sm-2 col-form-label">
                    Emp ID
                  </label>
                  <div className="col-sm-10">
                    <input
                      onChange={handle}
                      value={data.empId}
                      type="text"
                      id="empId"
                      placeholder="Enter Emp id"
                      className="form-control"
                    />
                    {errors.basic && (
                      <div className="text-danger">{errors.empId}</div>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <label htmlFor="basic" className="col-sm-2 col-form-label">
                    Basic
                  </label>
                  <div className="col-sm-10">
                    <input
                      onChange={handle}
                      value={data.basic}
                      type="text"
                      id="basic"
                      placeholder="Enter Basic"
                      className="form-control"
                    />
                    {errors.basic && (
                      <div className="text-danger">{errors.basic}</div>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    htmlFor="houseRentAllowance"
                    className="col-sm-2 col-form-label"
                  >
                    HRA
                  </label>
                  <div className="col-sm-10">
                    <input
                      onChange={handle}
                      value={data.houseRentAllowance}
                      type="text"
                      id="houseRentAllowance"
                      placeholder="Enter House Rent Allowance"
                      className="form-control"
                    />
                    {errors.houseRentAllowance && (
                      <div className="text-danger">
                        {errors.houseRentAllowance}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    htmlFor="employeeESICAmount"
                    className="col-sm-2 col-form-label"
                  >
                    Employee ESIC{" "}
                  </label>
                  <div className="col-sm-10">
                    <input
                      onChange={handle}
                      value={data.employeeESICAmount}
                      type="text"
                      id="employeeESICAmount"
                      placeholder="Enter Employee ESIC Amount"
                      className="form-control"
                    />
                    {errors.employeeESICAmount && (
                      <div className="text-danger">
                        {errors.employeeESICAmount}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    htmlFor="employerESICAmount"
                    className="col-sm-2 col-form-label"
                  >
                    Employer ESIC{" "}
                  </label>
                  <div className="col-sm-10">
                    <input
                      onChange={handle}
                      value={data.employerESICAmount}
                      type="text"
                      id="employerESICAmount"
                      placeholder="Enter Employer ESIC Amount"
                      className="form-control"
                    />
                    {errors.employerESICAmount && (
                      <div className="text-danger">
                        {errors.employerESICAmount}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    htmlFor="employeePFAmount"
                    className="col-sm-2 col-form-label"
                  >
                    Employee PF{" "}
                  </label>
                  <div className="col-sm-10">
                    <input
                      onChange={handle}
                      value={data.employeePFAmount}
                      type="text"
                      id="employeePFAmount"
                      placeholder="Enter Employee PF Amount"
                      className="form-control"
                    />
                    {errors.employeePFAmount && (
                      <div className="text-danger">
                        {errors.employeePFAmount}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    htmlFor="employerPFAmount"
                    className="col-sm-2 col-form-label"
                  >
                    Employer PF{" "}
                  </label>
                  <div className="col-sm-10">
                    <input
                      onChange={handle}
                      value={data.employerPFAmount}
                      type="text"
                      id="employerPFAmount"
                      placeholder="Enter Employer PF Amount"
                      className="form-control"
                    />
                    {errors.employerPFAmount && (
                      <div className="text-danger">
                        {errors.employerPFAmount}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    htmlFor="grossSalary"
                    className="col-sm-2 col-form-label"
                  >
                    Gross Salary
                  </label>
                  <div className="col-sm-10">
                    <input
                      onChange={handle}
                      value={data.grossSalary}
                      type="text"
                      id="grossSalary"
                      placeholder="Enter Gross Salary"
                      className="form-control"
                    />
                    {errors.grossSalary && (
                      <div className="text-danger">{errors.grossSalary}</div>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    htmlFor="netSalary"
                    className="col-sm-2 col-form-label"
                  >
                    Net Salary
                  </label>
                  <div className="col-sm-10">
                    <input
                      onChange={handle}
                      value={data.netSalary}
                      type="text"
                      id="netSalary"
                      placeholder="Enter Net Salary"
                      className="form-control"
                    />
                    {errors.netSalary && (
                      <div className="text-danger">{errors.netSalary}</div>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    htmlFor="medicalInsurance"
                    className="col-sm-2 col-form-label"
                  >
                    Medical Insurance
                  </label>
                  <div className="col-sm-10">
                    <input
                      onChange={handle}
                      value={data.medicalInsurance}
                      type="text"
                      id="medicalInsurance"
                      placeholder="Enter Medical Insurance"
                      className="form-control"
                    />
                    {errors.medicalInsurance && (
                      <div className="text-danger">
                        {errors.medicalInsurance}
                      </div>
                    )}
                  </div>
                </div>
                <div className="d-grid gap-2 col-6 mx-auto">
                  <button
                    onClick={(e) => submit(e)}
                    className="btn btn-outline-danger"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePayslip;
