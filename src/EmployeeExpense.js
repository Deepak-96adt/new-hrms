import React, { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import handleAuthError from './CommonErrorHandling';
import LoadingPage from './LoadingPage'
import { useSelector } from 'react-redux';
const EmployeeExpense = () => {
  // const empId = localStorage.getItem("EmpID");
  // const token = localStorage.getItem("response-token");
  const  token = useSelector((state) => state.auth.token);
  const  empId = useSelector((state) => state.auth.empId);

  const [loading, setLoading] = useState(false);
  const [expense, setExpense] = useState({
    expenseDescription: "",
    expenseCategory: "",
    expenseAmount: "",
    comments: "",
    paymentDate: "",
    paymentMode: "",
  });

  const [invoice, setInvoice] = useState([]);

  function handleFileChange(e) {
    const fileList = e.target.files;
    setInvoice(fileList);
    console.log(fileList);
  }


  function submit(e) {
    e.preventDefault();
    const formexpense = new FormData();
    for (let i = 0; i < invoice.length; i++) {
      formexpense.append("invoice", invoice[i]);
    }
    formexpense.append("expense", JSON.stringify(expense));
     setLoading(true)
    axios
      .post(`/apigateway/payroll/timeSheet/employeeExpense/${empId}`, formexpense, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
      .then((response) => {
        console.log(response.expense);
        toast.success("Expense data created successfully!!", { position: 'top-center', theme: "colored" });
        setLoading(false); 
      })
      .catch((error) => {
        console.log(error);
        toast.error( error.response.data.message || "Error creating details" );
        setLoading(false); 
      });
  }

  function handle(e) {
    const newexpense = { ...expense };
    newexpense[e.target.id] = e.target.value;
    setExpense(newexpense);
    console.log(newexpense);
  }
  return (
    <div className="container pt-3"> 
       {loading ? <LoadingPage/> : ''}
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card border-0 shadow">
            <div className="card-body">
              <form
                className="container py-3  mb-3"
                onSubmit={(e) => {
                  submit(e);
                }}
              >
                <div className="row mb-3">
                  <label
                    htmlFor="inputEmail3"
                    className="col-sm-2 col-form-label"
                    name="expenseDescription"
                  >
                    Expense Description
                  </label>
                  <div className="col-sm-10">
                    <input
                      onChange={(e) => {
                        handle(e);
                      }}
                      value={expense.expenseDescription}
                      type="text"
                      id="expenseDescription"
                      placeholder="enter expenseDescription"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <label
                    htmlFor="inputPassword3"
                    className="col-sm-2 col-form-label"
                    name="expenseCategory"
                  >
                    Expense Category
                  </label>
                  <div className="col-sm-10">
                    <input
                      onChange={(e) => {
                        handle(e);
                      }}
                      value={expense.expenseCategory}
                      type="text"
                      placeholder="Enter expense category"
                      className="form-control"
                      id="expenseCategory"
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <label
                    htmlFor="inputPassword3"
                    className="col-sm-2 col-form-label"
                    name="paymentDate"
                  >
                    Payment Date
                  </label>
                  <div className="col-sm-10">
                    <input
                      onChange={(e) => {
                        handle(e);
                      }}
                      value={expense.paymentDate}
                      type="date"
                      className="form-control"
                      id="paymentDate"
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <label
                    htmlFor="inputPassword3"
                    className="col-sm-2 col-form-label"
                    name="paymentMode"
                  >
                    Payment Mode
                  </label>
                  <div className="col-sm-10">
                    <input
                      onChange={(e) => {
                        handle(e);
                      }}
                      value={expense.paymentMode}
                      type="text"
                      className="form-control"
                      placeholder="Enter your Payment Mode."
                      id="paymentMode"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    htmlFor="inputPassword3"
                    className="col-sm-2 col-form-label"
                    name="expenseAmount"
                  >
                    Expense Amount
                  </label>
                  <div className="col-sm-10">
                    <input
                      onChange={(e) => {
                        handle(e);
                      }}
                      value={expense.expenseAmount}
                      type="number"
                      className="form-control"
                      placeholder="expense Amount"
                      id="expenseAmount"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    htmlFor="inputPassword3"
                    className="col-sm-2 col-form-label"
                  >
                    Comments
                  </label>
                  <div className="col-sm-10">
                    <input
                      onChange={(e) => {
                        handle(e);
                      }}
                      value={expense.comments}
                      type="text"
                      className="form-control"
                      placeholder="Enter your comments"
                      id="comments"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    htmlFor="inputPassword3"
                    className="col-sm-2 col-form-label"
                  >
                    Invoice
                  </label>
                  <div className="col-sm-10">
                    <input
                      onChange={handleFileChange}
                      value={expense.invoice}
                      type="file"
                      multiple
                      className="form-control"
                      id="invoice"
                    />
                  </div>
                </div>
                <div className="d-grid gap-2 col-6 mx-auto">
                  <button className="btn btn-outline-danger" type="submit">
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

export default EmployeeExpense;
