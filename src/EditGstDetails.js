import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import { useSelector } from "react-redux";
import { Button, Paper } from "@mui/material";
const EditGstDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const token = localStorage.getItem("response-token");
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    invoiceNumber: "",
    fy: "",
    invoiceDate: "",
    gstPeriod: "",
    billingPeriod: "",
    customerId: "",
    paidTo: "",
    taxableAmount: "",
    tds: "",
    gst: "",
    invoiceAmount: "",
    receivable: "",
    amountReceived: "",
    dateReceived: "",
    invoiceBalance: "",
    status: "",
    tdsCredited: "",
    tdsBalance: "",
  });

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

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `/apigateway/expensemanagement/gst/displayGSTDetailsByInvoiceNumber/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setData(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message || "Error fetching details");
        setLoading(false);
      });
  }, [token, id]);

  function submit(e) {
    e.preventDefault();
    setLoading(true);
    axios
      .put(
        `/apigateway/expensemanagement/gst/updateGSTDetailsByInvoiceNumber/${id}`,
        {
          invoiceNumber: data.invoiceNumber,
          fy: data.fy,
          invoiceDate: data.invoiceDate,
          gstPeriod: data.gstPeriod,
          billingPeriod: data.billingPeriod,
          customerId: data.customerId,
          paidTo: data.paidTo,
          taxableAmount: parseInt(data.taxableAmount),
          tds: parseInt(data.tds),
          gst: parseInt(data.gst),
          invoiceAmount: parseInt(data.invoiceAmount),
          receivable: parseInt(data.receivable),
          amountReceived: parseInt(data.amountReceived),
          dateReceived: data.dateReceived,
          invoiceBalance: parseInt(data.invoiceBalance),
          status: data.status,
          tdsCredited: parseInt(data.tdsCredited),
          tdsBalance: parseInt(data.tdsBalance),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        toast.success("GST data updated successfully!!", {
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

  function HandleDelete() {
    setLoading(true);
    axios
      .delete(
        `/apigateway/expensemanagement/gst/deleteGSTInvoiceByInvoiceNumber/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        toast.success("Gst Data Deleted successfully.", {
          position: "top-center",
          theme: "colored",
        });
        navigate("/GetGstDetails");
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message || "Error deleting details");
        console.log(error);
        setLoading(false);
      });
  }

  return (
    <div>
      {loading ? <LoadingPage /> : ""}
      <Paper
        sx={{
          width: "100%",
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
          <div style={{ display: "flex", gap: "10%", padding: "2%" }}>
            <div>
              <label name="dataId">Id</label>
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
              <label name="dataUser">Invoice Number</label>
              <div>
                <input
                  onChange={(e) => {
                    setData({ ...data, invoiceNumber: e.target.value });
                  }}
                  value={data.invoiceNumber || ""}
                  type="text"
                  disabled
                  id="invoiceNumber"
                  placeholder="Enter data user name"
                  style={style}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10%", padding: "2%" }}>
            <div>
              <label name="dataName">Financial Year</label>
              <div>
                <input
                  onChange={(e) => {
                    setData({ ...data, fy: e.target.value });
                  }}
                  value={data.fy || ""}
                  type="text"
                  disabled
                  id="fy"
                  style={style}
                />
              </div>
            </div>
            <div>
              <label name="dataNo">Invoice Date</label>
              <div>
                <input
                  onChange={(e) => {
                    setData({ ...data, invoiceDate: e.target.value });
                  }}
                  value={data.invoiceDate || ""}
                  type="text"
                  disabled
                  id="invoiceDate"
                  placeholder="Enter data number"
                  style={style}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10%", padding: "2%" }}>
            <div>
              <label name="warrenty">GST</label>
              <div>
                <input
                  onChange={(e) => {
                    setData({ ...data, gst: e.target.value });
                  }}
                  value={data.gst || ""}
                  disabled
                  type="text"
                  id="gst"
                  style={style}
                />
              </div>
            </div>
            <div>
              <label name="processor">Billing Period</label>
              <div>
                <input
                  onChange={(e) => {
                    setData({ ...data, billingPeriod: e.target.value });
                  }}
                  value={data.billingPeriod || ""}
                  disabled
                  type="text"
                  id="billingPeriod"
                  style={style}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10%", padding: "2%" }}>
            <div>
              <label name="ram">Customer Id</label>
              <div>
                <input
                  onChange={(e) => {
                    setData({ ...data, customerId: e.target.value });
                  }}
                  value={data.customerId || ""}
                  disabled
                  type="text"
                  id="customerId"
                  style={style}
                />
              </div>
            </div>
            <div>
              <label name="diskType">Paid To</label>
              <div>
                <input
                  onChange={(e) => {
                    setData({ ...data, paidTo: e.target.value });
                  }}
                  value={data.paidTo || ""}
                  disabled
                  type="text"
                  id="paidTo"
                  style={style}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10%", padding: "2%" }}>
            <div>
              <label name="operatingSystem">Taxable Amount</label>
              <div>
                <input
                  onChange={(e) => {
                    setData({ ...data, taxableAmount: e.target.value });
                  }}
                  value={data.taxableAmount || ""}
                  disabled
                  type="text"
                  id="taxableAmount"
                  style={style}
                />
              </div>
            </div>
            <div>
              <label name="purchesDate">TDS</label>
              <div>
                <input
                  onChange={(e) => {
                    setData({ ...data, tds: e.target.value });
                  }}
                  value={data.tds || ""}
                  disabled
                  type="text"
                  id="tds"
                  style={style}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10%", padding: "2%" }}>
            <div>
              <label name="warrentyDate">Receivable</label>
              <div>
                <input
                  onChange={(e) => {
                    setData({ ...data, receivable: e.target.value });
                  }}
                  value={data.receivable || ""}
                  type="number"
                  id="receivable"
                  style={style}
                />
              </div>
            </div>
            <div>
              <label name="warrentyDate">Invoice Amount</label>
              <div>
                <input
                  onChange={(e) => {
                    setData({ ...data, invoiceAmount: e.target.value });
                  }}
                  value={data.invoiceAmount || ""}
                  disabled
                  type="number"
                  id="invoiceAmount"
                  style={style}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10%", padding: "2%" }}>
            <div>
              <label name="warrentyDate">TDS Balance</label>
              <div>
                <input
                  onChange={(e) => {
                    setData({ ...data, tdsBalance: e.target.value });
                  }}
                  value={data.tdsBalance || ""}
                  type="number"
                  id="tdsBalance"
                  style={style}
                />
              </div>
            </div>
            <div>
              <label name="warrentyDate">TDS Credited</label>
              <div>
                <input
                  onChange={(e) => {
                    setData({ ...data, tdsCredited: e.target.value });
                  }}
                  style={style}
                  value={data.tdsCredited || ""}
                  type="number"
                  id="tdsCredited"
                />
              </div>
            </div>
          </div>

          <div style={{ marginLeft: "2%" }}>
            <div>
              <label name="dataType">GST Period</label>
              <div>
                <input
                  onChange={(e) => {
                    setData({ ...data, gstPeriod: e.target.value });
                  }}
                  value={data.gstPeriod || ""}
                  disabled
                  type="date"
                  id="gstPeriod"
                  style={style}
                />
              </div>
            </div>
            <div>
              <label name="warrentyDate">Date Received</label>
              <div>
                <input
                  onChange={(e) => {
                    setData({ ...data, dateReceived: e.target.value });
                  }}
                  value={data.dateReceived || ""}
                  type="date"
                  id="dateReceived"
                  style={style}
                />
              </div>
            </div>
          </div>

          <div>
            <label name="warrentyDate">Status</label>
            <div>
              <input
                onChange={(e) => {
                  setData({ ...data, status: e.target.value });
                }}
                value={data.status || ""}
                type="text"
                id="status"
                style={style}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10%", padding: "2%" }}>
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
                Update
              </Button>
            </div>
            <div>
              <Button
                sx={{
                  backgroundColor: "var(--warmGrey)",
                  color: "var(--white)",
                  transition: "transform",
                  "&:hover": {
                    backgroundColor: "var(--warmGrey)",
                    transform: "scale(1.03)",
                  },
                }}
                onClick={() => {
                  if (
                    window.confirm("Are you sure you wish to delete this data?")
                  ) {
                    HandleDelete(document.id);
                  }
                }}
                type="submit"
              >
                Delete
              </Button>
            </div>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default EditGstDetails;
