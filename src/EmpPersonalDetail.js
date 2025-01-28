import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import { useSelector, useDispatch } from "react-redux";
// import {updateTokens} from "./Store/authSlice";
import {
  validateMobileNumber,
  validateNullCheck,
  validateString,
} from "./Validations/InputValidation";
import { Button, Divider, Paper, Typography } from "@mui/material";
export default function EmpPersonalDetail() {
  const token = useSelector((state) => state.auth.token);
  const refreshToken = useSelector((state) => state.auth.refreshToken);
  const EmpId = useSelector((state) => state.auth.empId);
  const [maritalStatusDropdown, setMaritalStatusDropdown] = useState([]);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [nameerror, setNameerror] = useState();
  const [lastnameerror, setLastameerror] = useState();
  const [mobileerror, setMobileError] = useState();
  const [dateError, setDateError] = useState();
  const [data, setData] = useState({
    employeeId: "",
    dob: "",
    email: "",
    firstName: "",
    gender: "",
    lastName: "",
    maritalStatus: "",
    mobileNo: "",
    userName: "",
  });

  function HandleSubmit(e) {
    e.preventDefault();

    var nameerror = validateString(data.firstName);
    var lastnameerror = validateString(data.lastName);
    var mobileerror = validateMobileNumber(data.mobileNo);
    var dateerror = validateNullCheck(data.dob);

    if (nameerror || lastnameerror || mobileerror || dateerror) {
      setNameerror(nameerror);
      setLastameerror(lastnameerror);
      setMobileError(mobileerror);
      setDateError(dateerror);
      return;
    }
    setLoading(true);
    setNameerror(null);
    setLastameerror(null);
    setMobileError(null);
    setDateError(null);

    axios
      .put(
        `/apigateway/hrms/employee/updatePersonalDetailsById`,
        {
          employeeId: data.employeeId,
          dob: data.dob,
          email: data.email,
          firstName: data.firstName,
          gender: data.gender,
          lastName: data.lastName,
          maritalStatus: data.maritalStatus,
          mobileNo: data.mobileNo,
          userName: data.userName,
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

  const fetchMaritalStatus = async () => {
    await axios
      .get(`/apigateway/hrms/employee/marital_status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setMaritalStatusDropdown(response.data);
      })
      .catch((error) => {
        toast.error(error || "Error fetching details");
      });
  };

  useEffect(() => {
    setLoading(true);
    fetchMaritalStatus();

    const fetchEmployeeData = (token) => {
      axios
        .get(`/apigateway/hrms/employee/getById/${EmpId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(refreshToken);
          const Data = response.data;
          setData({
            ...Data,
            dob: Data.dob ? new Date(Data.dob).toISOString().split("T")[0] : "",
          });
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          toast.error(
            error.response?.data?.message || "Error fetching details"
          );
          setLoading(false);
        });
    };

    fetchEmployeeData(token);
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
            Personal Details
          </Typography>
        </center>
        <Divider sx={{ color: "black", marginBottom: "5%" }} />
        <form style={{ marginTop: "2%", gap: "5%" }} onSubmit={HandleSubmit}>
          <div>
            <label name="employeeId">Emp Id</label>
            <div>
              <input
                disabled
                value={data.adtId || ""}
                type="text"
                id="employeeId"
                style={style}
              />
            </div>
          </div>
          <div>
            <label name="dob">DOB</label>
            <div>
              <input
                value={data.dob || ""}
                onChange={(e) => setData({ ...data, dob: e.target.value })}
                type="date"
                id="dob"
                style={style}
              />
              {dateError && <span style={{ color: "red" }}>{dateError}</span>}
            </div>
          </div>
          <div>
            <label name="email">Email</label>
            <div>
              <input
                disabled
                value={data.email || ""}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                type="text"
                id="email"
                style={style}
              />
            </div>
          </div>
          <div>
            <label name="firstName">First Name</label>
            <div>
              <input
                value={data.firstName || ""}
                onChange={(e) =>
                  setData({ ...data, firstName: e.target.value })
                }
                type="text"
                id="firstName"
                style={style}
              />
              {nameerror && <span style={{ color: "red" }}>{nameerror}</span>}
            </div>
          </div>
          <div>
            <label name="lastName">Last Name</label>
            <div>
              <input
                value={data.lastName || ""}
                onChange={(e) => setData({ ...data, lastName: e.target.value })}
                type="text"
                id="lastName"
                style={style}
              />
              {lastnameerror && (
                <span style={{ color: "red" }}>{lastnameerror}</span>
              )}
            </div>
          </div>
          <div>
            <label name="maritalStatus">Marital Status</label>
            <div>
              <select
                value={data.maritalStatus || ""}
                onChange={(e) =>
                  setData({ ...data, maritalStatus: e.target.value })
                }
                style={style}
              >
                {maritalStatusDropdown.map((row) => (
                  <option key={row.id} value={row.name}>
                    {row.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label name="mobileNo">Mobile No</label>
            <div>
              <input
                value={data.mobileNo || ""}
                onChange={(e) => setData({ ...data, mobileNo: e.target.value })}
                type="text"
                id="mobileNo"
                style={style}
              />
              {mobileerror && (
                <span style={{ color: "red" }}>{mobileerror}</span>
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
