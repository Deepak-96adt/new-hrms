import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";

const LeaveForm = () => {
  const [loading, setLoading] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leave: {},
    name: "",
    leaveBalance: "",
    leaveType: "",
    adtId: "",
    leaveReason: "",
    selectedDates: [],
  });
  const token = useSelector((state) => state.auth.token);
  const empID = useSelector((state) => state.auth.empId);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/apigateway/payroll/leave/getById/${empID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const leaveData = response.data;
        setLeaveForm((prevState) => ({
          ...prevState,
          leave: leaveData,
          name: leaveData.employee.firstName,
          adtId: leaveData.employee.adtId,
          leaveBalance: leaveData.leaveBalance,
        }));
        toast.success("Leave data found successfully!!", {
          position: "top-center",
          theme: "colored",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message || "Error fetching details");
        setLoading(false);
      });
  }, [empID, token]);

  const handleDateChange = (date) => {
    setLeaveForm((prevState) => ({
      ...prevState,
      selectedDates: [...prevState.selectedDates, date],
    }));
  };

  const removeDate = (dateToRemove) => {
    setLeaveForm((prevState) => ({
      ...prevState,
      selectedDates: prevState.selectedDates.filter(
        (date) =>
          format(date, "yyyy-MM-dd") !== format(dateToRemove, "yyyy-MM-dd")
      ),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveForm((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, leaveBalance,adtId, leaveType, leaveReason, selectedDates } =
      leaveForm;
    const payload = {
      empid: empID,
      leavedate: selectedDates.map((date) => format(date, "yyyy/MM/dd")),
      name: name,
      adtId:adtId,
      leaveBalance: leaveBalance,
      leaveType: leaveType,
      leaveReason: leaveReason,
    };
    try {
      setLoading(true);
      const response = await axios.post(
        `/apigateway/payroll/leave/leave`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data, {
        position: "top-center",
        theme: "colored",
        backgroundColor:"crimson",
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Error creating details");
      setLoading(false);
    }
  };

  const { leave, name, adtId, leaveBalance, leaveType, leaveReason, selectedDates } =
    leaveForm;

  return (
    <div>
      <div
        style={{
          width: "140vh",
          height: "auto",
          display: "flex",
          alignItems: "center",
          marginLeft: "300px",
        }}
      >
        

        <div style={{ width: "60vh", marginLeft:"65px" }}>
        <h1 className="Heading1" style={{ backgroundColor: "var(--red)", color: "var(--white)", marginLeft:"180px" }}>Leave Request</h1>
        <div style={{marginLeft:"-137px"}}>
          {loading && <LoadingPage />}
          <Paper sx={{ width: "90ch", overflow: "hidden", marginLeft:"100px" }}>
          <TableContainer sx={{ maxHeight: 600, width:"100%" }}>

          <Table >
              <TableHead>
                <TableRow>
                <TableCell  style={{ backgroundColor: "var(--warmGrey)", color: "var(--white)" }}>Leave ID</TableCell>
                  <TableCell  style={{ backgroundColor: "var(--warmGrey)", color: "var(--white)" }}>Employee ID</TableCell>
                  <TableCell  style={{ backgroundColor: "var(--warmGrey)", color: "var(--white)" }}>Name</TableCell>
                  <TableCell  style={{ backgroundColor: "var(--warmGrey)", color: "var(--white)" }}>Leave Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              
                  
                    <>
                      <TableCell>{leave.id}</TableCell>
                      <TableCell>{adtId}</TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{leave.leaveBalance}</TableCell>
                    </>
                  
                
              </TableBody>
              
            </Table>

            <div className="pt-5 container">
              <form onSubmit={handleSubmit} style={{maxWidth:"700px"}}>
                <label htmlFor="Leave Type">Leave Type</label>
                <input
                  type="text"
                  name="leaveType"
                  placeholder="Leave Type"
                  value={leaveType}
                  onChange={handleChange}
                />
                <label htmlFor="Leave Reason">Leave Reason</label>
                <textarea
                  name="leaveReason"
                  placeholder="Leave Reason"
                  value={leaveReason}
                  onChange={handleChange}
                ></textarea>

                <label htmlFor="Select Date">Select Date</label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <DatePicker
                    selected={null}
                    onChange={handleDateChange}
                    selectsMultiple
                    placeholderText="Select a date"
                    dateFormat="yyyy-MM-dd"
                    selectedDates={selectedDates}
                    shouldCloseOnSelect={false}
                  />

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginTop: "10px",
                    }}
                  >
                    {selectedDates.map((date) => (
                      <div
                        key={date}
                        style={{
                          backgroundColor: "#f8d7da",
                          color: "#721c24",
                          padding: "5px 10px",
                          borderRadius: "20px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {format(date, "yyyy-MM-dd")}
                        <FontAwesomeIcon
                          icon={faTimes}
                          onClick={() => removeDate(date)}
                          style={{
                            marginLeft: "10px",
                            cursor: "pointer",
                            color: "#721c24",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <button type="submit" style={{ backgroundColor: "var(--red)", color: "var(--white)",
                   width:"30%",height:"50px",marginBottom:"20px", fontSize:"20px"
                    }}
                  disabled={loading}>
                    Submit
                  </button>
                </div>
              </form>
            </div>
            </TableContainer>
          </Paper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveForm;
