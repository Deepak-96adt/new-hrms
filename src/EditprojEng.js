import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import { useSelector } from "react-redux";
import {
  validateString,
  validateDateDuration,
  validateRadioButton,
} from "./Validations/InputValidation";
import { Button, Divider, Paper, Typography } from "@mui/material";

const EditprojEng = () => {
  // const token = localStorage.getItem("response-token");
  const [contractorError, setContractorError] = useState();
  const [endClientError, setEndClientError] = useState();
  const [primaryResourceError, setPrimaryResourceError] = useState();
  const [secondaryError, setSecondaryError] = useState();
  const [dateError, setDateError] = useState();
  const [statusError, setStatusError] = useState();
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    projectId: "",
    contractor: "",
    endClient: "",
    primaryResource: "",
    secondaryResource: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/apigateway/hrms/engagement/ProjectEngagementDetailById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message || "Error fetching details");
        setLoading(false);
      });
  }, [token, id]);

  function HandleSubmit(e) {
    e.preventDefault();

    const contractorerror = validateString(data.contractor);
    const endclienterror = validateString(data.endClient);
    const primaryresourceerror = validateString(data.primaryResource);
    const secondaryerror = validateString(data.secondaryResource);
    const dateerror = validateDateDuration(data.startDate, data.endDate);
    const statuserror = validateRadioButton(data.status);

    if (
      contractorerror ||
      endclienterror ||
      primaryresourceerror ||
      secondaryerror ||
      dateerror ||
      statuserror
    ) {
      setContractorError(contractorerror);
      setEndClientError(endclienterror);
      setPrimaryResourceError(primaryresourceerror);
      setSecondaryError(secondaryerror);
      setDateError(dateerror);
      setStatusError(statuserror);
      return;
    }

    setContractorError(null);
    setEndClientError(null);
    setPrimaryResourceError(null);
    setSecondaryError(null);
    setDateError(null);
    setStatusError(null);

    setLoading(true);
    axios
      .put(
        `/apigateway/hrms/engagement/updateProjectEngagement/${id}`,
        {
          projectId: data.projectId,
          contractor: data.contractor,
          endClient: data.endClient,
          primaryResource: data.primaryResource,
          secondaryResource: data.secondaryResource,
          startDate: data.startDate,
          endDate: data.endDate,
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
        navigate("/GetAllPrEngagement");
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
  function HandleDelete() {
    if (!window.confirm("Are you sure you want to delete this Project?")) {
      return;
    }
    setLoading(true);
    axios
      .delete(`/apigateway/hrms/engagement/DeleteProjectEngagement/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
        toast.error(error.response.data.message || "Error deleting details");
        setLoading(false);
      });
  }

  const style = {
    width: "100%",
    height: "46px",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  return (
    <div>
      {loading ? <LoadingPage /> : ""}
      <Paper
        sx={{
          width: "80%",
          marginLeft: { xs: "50px", sm: "100px", md: "180px", lg: "220px" },
          padding: "5%",
          marginTop: "5%",
        }}
      >
        <Typography
          sx={{ fontSize: "20px", color: "var(--red)", marginLeft: "10%" }}
        >
          Update Project Engagement
        </Typography>
        <Divider sx={{ color: "black" }} />
        <form onSubmit={HandleSubmit} style={{ marginTop: "5%" }}>
          <div>
            <label name="projectId">Project ID</label>
            <div>
              <input
                disabled
                value={data.projectId || ""}
                type="text"
                id="projectId"
                style={style}
              />
            </div>
          </div>

          <div>
            <label name="contractor">Contractor</label>
            <div>
              <input
                value={data.contractor || ""}
                onChange={(e) =>
                  setData({ ...data, contractor: e.target.value })
                }
                type="text"
                id="contractor"
                placeholder="enter contractor"
                style={style}
              />
              {contractorError && (
                <span style={{ color: "red" }}>{contractorError}</span>
              )}
            </div>
          </div>

          <div>
            <label name="endClient">End Client</label>
            <div>
              <input
                value={data.endClient || ""}
                onChange={(e) =>
                  setData({ ...data, endClient: e.target.value })
                }
                type="text"
                id="endClient"
                placeholder="enter end client"
                style={style}
              />
              {endClientError && (
                <span style={{ color: "red" }}>{endClientError}</span>
              )}
            </div>
          </div>

          <div>
            <label name="primaryResource">Primary Resource</label>
            <div>
              <input
                value={data.primaryResource || ""}
                onChange={(e) =>
                  setData({ ...data, primaryResource: e.target.value })
                }
                type="text"
                id="primaryResource"
                placeholder="enter primary resource name"
                style={style}
              />
              {primaryResourceError && (
                <span style={{ color: "red" }}>{primaryResourceError}</span>
              )}
            </div>
          </div>

          <div>
            <label name="secondaryResource">Secondary Resource</label>
            <div>
              <input
                value={data.secondaryResource || ""}
                onChange={(e) =>
                  setData({ ...data, secondaryResource: e.target.value })
                }
                type="text"
                id="secondaryResource"
                placeholder="enter secondary resource name"
                style={style}
              />
              {secondaryError && (
                <span style={{ color: "red" }}>{secondaryError}</span>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10%", width: "100%" }}>
            <div style={{ width: "45%" }}>
              <label name="startDate">Start Date</label>
              <div>
                <input
                  value={data.startDate || ""}
                  onChange={(e) =>
                    setData({ ...data, startDate: e.target.value })
                  }
                  type="date"
                  id="startDate"
                  style={style}
                />
                {dateError && <span style={{ color: "red" }}>{dateError}</span>}
              </div>
            </div>

            <div style={{ width: "45%" }}>
              <label name="endDate">End Date</label>
              <div>
                <input
                  value={data.endDate || ""}
                  onChange={(e) =>
                    setData({ ...data, endDate: e.target.value })
                  }
                  type="date"
                  id="endDate"
                  style={style}
                />
                {dateError && <span style={{ color: "red" }}>{dateError}</span>}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "5%",
              marginTop: "2%",
              marginBottom: "2%",
            }}
          >
            <label name="status">Status</label>
            <div style={{ display: "flex", gap: "5%" }}>
              <input
                checked={data.status === true}
                onChange={(e) => setData({ ...data, status: true })}
                value={data.status || ""}
                type="radio"
                name="inlineRadioOptions"
                id="status"
              />
              <label>Active</label>
            </div>
            <div style={{ display: "flex", gap: "5%" }}>
              <input
                checked={data.status === false}
                onChange={(e) => setData({ ...data, status: false })}
                value={data.status || ""}
                type="radio"
                name="inlineRadioOptions"
                id="status"
              />
              <label>InActive</label>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10%" }}>
            <Button
              sx={{
                backgroundColor: "var(--red)",
                color: "var(--white)",
                transition: "transform",
                "&:hover": {
                  backgroundColor: "var(--red)",
                  transform: "scale(1.03)",
                },
                width: "30%",
              }}
              type="submit"
            >
              Submit
            </Button>

            <Button
              sx={{
                backgroundColor: "var(--warmGrey)",
                color: "var(--white)",
                transition: "transform",
                "&:hover": {
                  backgroundColor: "var(--warmGrey)",
                  transform: "scale(1.03)",
                },
                width: "30%",
              }}
              type="submit"
              onClick={HandleDelete}
            >
              Delete
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default EditprojEng;
