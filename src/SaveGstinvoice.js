import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import { Button, Divider, Paper } from "@mui/material";
import "./Hrmscss/VarColors.css";

export default function SaveGstinvoice() {
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [isOB, setIsOB] = useState(false); // State to track the toggle value
  const [data, setData] = useState({
    invoiceNumber: "",
    fy: "",
    invoiceDate: "",
    gstPeriod: "",
    billingPeriod: "",
    customerId: "",
    paidTo: "",
    taxableAmount: "",
    // tds: "",
    gst: "",
    invoiceAmount: "",
    receivable: "",
    amountReceived: "",
    dateReceived: "",
    invoiceBalance: "",
    status: "",
    // tdsCredited: "",
    // tdsBalance: "",
    tdsDetails: {
      tds: "",
      tdsBalance: "",
      tdsCredited: "",
    },
  });

  function submit(e) {
    e.preventDefault();
    setLoading(true);
    axios
      .post(
        `/apigateway/expensemanagement/gst/saveGSTDetails`,
        {
          // invoiceNumber: data.invoiceNumber,
          fy: data.fy,
          invoiceDate: data.invoiceDate,
          gstPeriod: data.gstPeriod,
          billingPeriod: data.billingPeriod,
          customerId: data.customerId,
          paidTo: data.paidTo,
          taxableAmount: parseInt(data.taxableAmount),
          // tds: parseInt(data.tds),
          gst: parseInt(data.gst),
          invoiceAmount: parseInt(data.invoiceAmount),
          receivable: parseInt(data.receivable),
          amountReceived: parseInt(data.amountReceived),
          dateReceived: data.dateReceived,
          invoiceBalance: parseInt(data.invoiceBalance),
          status: data.status,
          projectType: data.projectType,
          // tdsCredited: parseInt(data.tdsCredited),
          // tdsBalance: parseInt(data.tdsBalance),
          tdsDetails: {
            tds: parseFloat(data.tds), // Convert to float if necessary
            tdsCredited: parseInt(data.tdsCredited),
            tdsBalance: parseInt(data.tdsBalance),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        toast.success("GST data created successfully!!", {
          position: "top-center",
          theme: "colored",
        });
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message || "Error saving details");
        console.log(error);
        setLoading(false);
      });
  }

  function handle(e) {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    setData(newdata);
    console.log(newdata);
  }

  const style = {
    width: "100%",
    height: "46px",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const divStyle = {
    display: "flex",
    gap: "10%",
    padding: "2%",
  };

  return (
    <div>
      {loading ? <LoadingPage /> : ""}
      <h1
        className="Heading1 my-4"
        style={{
          backgroundColor: "var(--red)",
          color: "var(--white) ",
          marginLeft: "85%",
        }}
      >
        GST INVOICE
      </h1>
      <Paper
        sx={{
          width: "120%",
          height: "auto",
          marginBottom: "10%",
          marginTop: "10%",
          marginLeft: "60%",
          padding: "5%",
        }}
      >
        <form
          onSubmit={(e) => {
            submit(e);
          }}
        >
          <div style={{ display: "flex", gap: "5%", marginLeft: "2%" }}>
            <label>Type</label>
            <div style={{ display: "flex", gap: "15%" }}>
              <div style={{ display: "flex", gap: "2%" }}>
                <input
                  onChange={() => setIsOB(false)}
                  type="radio"
                  name="typeOptions"
                  id="typeIB"
                  checked={!isOB}
                />
                <label>InBound</label>
              </div>
              <div style={{ display: "flex", gap: "2%" }}>
                <input
                  onChange={() => setIsOB(true)}
                  type="radio"
                  name="typeOptions"
                  id="typeOB"
                  checked={isOB}
                />
                <label>OutBound</label>
              </div>
            </div>
          </div>
          <Divider />

          <div style={{ marginLeft: "2%" }}>
            <div style={{ marginBottom: "2%" }}>
              <label>Financial Year</label>
              <div>
                <input
                  onChange={(e) => handle(e)}
                  value={data.fy}
                  type="date"
                  id="fy"
                  style={style}
                />
              </div>
            </div>
            <div>
              <label>Invoice Date</label>
              <div>
                <input
                  onChange={(e) => handle(e)}
                  value={data.invoiceDate}
                  type="date"
                  id="invoiceDate"
                  style={style}
                />
              </div>
            </div>
          </div>

          <div style={divStyle}>
            <div>
              <label>GST Period</label>
              <div>
                <input
                  onChange={(e) => handle(e)}
                  value={data.gstPeriod}
                  type="text"
                  id="gstPeriod"
                  style={style}
                />
              </div>
            </div>
            <div>
              <label>Billing Period</label>
              <div>
                <input
                  onChange={(e) => handle(e)}
                  value={data.billingPeriod}
                  type="text"
                  id="billingPeriod"
                  style={style}
                />
              </div>
            </div>
          </div>

          <div style={divStyle}>
            <div>
              <label>Cust ID</label>
              <div>
                <input
                  onChange={(e) => handle(e)}
                  value={data.customerId}
                  type="text"
                  placeholder="Enter Customer ID"
                  id="customerId"
                  style={style}
                />
              </div>
            </div>
            <div>
              <label>Paid To</label>
              <div>
                <input
                  onChange={(e) => handle(e)}
                  value={data.paidTo}
                  type="text"
                  placeholder="Enter client name"
                  id="paidTo"
                  style={style}
                />
              </div>
            </div>
          </div>

          <div style={divStyle}>
            <div>
              <label>Taxable Amount</label>
              <div>
                <input
                  onChange={(e) => handle(e)}
                  value={data.taxableAmount}
                  type="number"
                  step="0.1"
                  placeholder="Enter Taxable Amount"
                  id="taxableAmount"
                  style={style}
                />
              </div>
            </div>
            <div>
              <label>TDS</label>
              <div>
                <input
                  onChange={(e) => handle(e)}
                  value={data.tds}
                  type="number"
                  step="0.1"
                  placeholder="Enter TDS"
                  id="tds"
                  disabled={!isOB}
                  style={style}
                />
              </div>
            </div>
          </div>

          <div style={divStyle}>
            <div>
              <label>GST @ 18%</label>
              <div>
                <input
                  onChange={(e) => handle(e)}
                  value={data.gst}
                  type="number"
                  step="0.1"
                  placeholder="Enter GST"
                  id="gst"
                  style={style}
                />
              </div>
            </div>
            <div>
              <label>Invoice Amount</label>
              <div>
                <input
                  onChange={(e) => handle(e)}
                  value={data.invoiceAmount}
                  type="number"
                  step="0.1"
                  placeholder="Enter Invoice Amount"
                  id="invoiceAmount"
                  style={style}
                />
              </div>
            </div>
          </div>

          <div style={divStyle}>
            <div>
              <label>Receivable</label>
              <div>
                <input
                  onChange={(e) => handle(e)}
                  value={data.receivable}
                  type="number"
                  step="0.1"
                  placeholder="Enter Receivable"
                  id="receivable"
                  style={style}
                />
              </div>
            </div>
            <div>
              <label>Amount Received</label>
              <div>
                <input
                  disabled
                  onChange={(e) => handle(e)}
                  value={data.amountReceived}
                  type="number"
                  step="0.1"
                  placeholder="Enter Amount Received"
                  id="amountReceived"
                  style={style}
                />
              </div>
            </div>
          </div>

          <div style={divStyle}>
            <div>
              <label>TDS Credited</label>
              <div>
                <input
                  disabled
                  onChange={(e) => handle(e)}
                  value={data.tdsCredited}
                  type="number"
                  step="0.1"
                  placeholder="Enter TDS Credited"
                  id="tdsCredited"
                  style={style}
                />
              </div>
            </div>
            <div>
              <label>TDS Balance</label>
              <div>
                <input
                  disabled
                  onChange={(e) => handle(e)}
                  value={data.tdsBalance}
                  type="number"
                  step="0.1"
                  placeholder="Enter TDS Balance"
                  id="tdsBalance"
                  style={style}
                />
              </div>
            </div>
          </div>

          <div style={{ marginLeft: "2%" }}>
            <div style={{ marginBottom: "2%" }}>
              <label>Date Received</label>
              <div>
                <input
                  disabled
                  onChange={(e) => handle(e)}
                  value={data.dateReceived}
                  type="date"
                  id="dateReceived"
                  style={style}
                />
              </div>
            </div>
            <div>
              <label>Invoice Balance</label>
              <div>
                <input
                  disabled
                  onChange={(e) => handle(e)}
                  value={data.invoiceBalance}
                  type="number"
                  step="0.1"
                  placeholder="Enter Invoice Balance"
                  id="invoiceBalance"
                  style={style}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "5%", marginLeft: "2%" }}>
            <label>Status</label>
            <div style={{ display: "flex", gap: "15%" }}>
              <div style={{ display: "flex", gap: "2%" }}>
                <input
                  disabled
                  onChange={(e) => {
                    handle(e);
                  }}
                  value="Pending"
                  type="radio"
                  name="inlineRadioOptions"
                  id="status"
                />
                <label>Pending</label>
              </div>
              <div style={{ display: "flex", gap: "2%" }}>
                <input
                  disabled
                  onChange={(e) => {
                    handle(e);
                  }}
                  value="Completed"
                  type="radio"
                  name="inlineRadioOptions"
                  id="status"
                />
                <label>Completed</label>
              </div>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              sx={{
                backgroundColor: "var(--red)",
                color: "var(--white)",
                transition: "transform",
                "&:hover": {
                  backgroundColor: "var(--red)",
                  transform: "scale(1.03)",
                },
                marginTop: "5%",
                marginLeft: "35%",
                width: "30%",
              }}
            >
              Submit
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}
