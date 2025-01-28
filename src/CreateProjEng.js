import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import { useSelector } from "react-redux";
import {
  validateString,
  validateDateDuration,
  validateRadioButton,
} from "./Validations/InputValidation";
import { Button, Divider, Paper, Typography } from "@mui/material";

const CreateProjEng = () => {
  // const token = localStorage.getItem("response-token");
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [contractorerror, setContractorError] = useState();
  const [endclienterror, setEndClientError] = useState();
  const [primaryresourceerror, setPrimaryResourceError] = useState();
  const [secondaryerror, setSecondaryError] = useState();
  const [dateerror, setDateError] = useState();
  const [statuserror, setStatusError] = useState();

  const [data, setData] = useState({
    contractor: "",
    endClient: "",
    primaryResource: "",
    secondaryResource: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  function submit(e) {
    e.preventDefault();
    // console.log(data.contractor);

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
      .post(
        `/apigateway/hrms/engagement/saveProjectEngagement`,
        {
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
        toast.success(response.data, {
          position: "top-center",
          theme: "colored",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          error.response.data.message || "Error saving project details."
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
    data.status = str2bool(e.target.value);
  }
  function handle(e) {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
    console.log(newData);
  }

  const style = {
    width: "100%",
    height: "46px",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  return (
    <div className=" mt-3">
      {loading ? <LoadingPage /> : ""}
      
      <Paper
        sx={{
          width: "80%",
          marginLeft: { xs: "30px", sm: "50px", md: "80px", lg: "220px" },
          padding: "5%",
          marginTop: "5%",
        }}
      >
        <Typography
          sx={{ fontSize: "20px", color: "var(--red)", marginLeft: "30%" }}
        >
          Create Project Details
        </Typography>
        <Divider sx={{ color: "black" }} />
        <form
          onSubmit={(e) => {
            submit(e);
          }}
          style={{ marginTop: "5%" }}
        >
          <div>
            <label name="contractor">Contractor</label>
            <div>
              <input
                onChange={(e) => {
                  handle(e);
                }}
                value={data.contractor || ""}
                type="text"
                id="contractor"
                placeholder="Enter project name"
                style={style}
              />
              {contractorerror && (
                <span style={{ color: "red" }}>{contractorerror}</span>
              )}
            </div>
          </div>

          <div>
            <label name="endClient">End Client</label>
            <div>
              <input
                onChange={(e) => {
                  handle(e);
                }}
                value={data.endClient || ""}
                type="text"
                id="endClient"
                style={style}
              />
              {endclienterror && (
                <span style={{ color: "red" }}>{endclienterror}</span>
              )}
            </div>
          </div>

          <div>
            <label name="primaryResource">Primary Resource</label>
            <div>
              <input
                onChange={(e) => {
                  handle(e);
                }}
                value={data.primaryResource || ""}
                type="text"
                id="primaryResource"
                style={style}
              />
              {primaryresourceerror && (
                <span style={{ color: "red" }}>{primaryresourceerror}</span>
              )}
            </div>
          </div>

          <div>
            <label name="secondaryResource">Secondary Resource</label>
            <div>
              <input
                onChange={(e) => {
                  handle(e);
                }}
                value={data.secondaryResource || ""}
                type="text"
                id="secondaryResource"
                style={style}
              />
              {secondaryerror && (
                <span style={{ color: "red" }}>{secondaryerror}</span>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10%" }}>
            <div style={{ width: "50%" }}>
              <label name="startDate">Start Date</label>
              <div>
                <input
                  onChange={(e) => {
                    handle(e);
                  }}
                  value={data.startDate || ""}
                  type="date"
                  id="startDate"
                  style={style}
                />
                {dateerror && <span style={{ color: "red" }}>{dateerror}</span>}
              </div>
            </div>

            <div style={{ width: "50%" }}>
              <label name="endDate">End Date</label>
              <div>
                <input
                  onChange={(e) => {
                    handle(e);
                  }}
                  value={data.endDate || ""}
                  type="date"
                  id="endDate"
                  style={style}
                />
                {dateerror && <span style={{ color: "red" }}>{dateerror}</span>}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "5%", marginTop: "2%", marginBottom: "2%" }}>
            <label name="status">Status</label>
            <div style={{ display: "flex", gap: "5%" }}>
              <input
                onChange={radiobut}
                value="true"
                type="radio"
                name="inlineRadioOptions"
                id="status"
              />
              <label className="form-check-label" htmlFor="inlineRadio1">
                Active
              </label>
            </div>
            <div style={{ display: "flex", gap: "5%" }}>
              <input
                onChange={radiobut}
                value="false"
                type="radio"
                name="inlineRadioOptions"
                id="status"
              />
              <label>InActive</label>
            </div>
            {statuserror && <span style={{ color: "red" }}>{statuserror}</span>}
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
                width: "30%",
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

export default CreateProjEng;
