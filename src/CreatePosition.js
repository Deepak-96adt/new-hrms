import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import { useSelector } from "react-redux";
import ManageSkills from "./ManageSkills";
import {
  validateString,
  validateDateDuration,
  validateNullCheck,
  validateVacancy,
  validateExperience,
  validateRadioButton,
} from "./Validations/InputValidation";
import { Button, Divider, Paper, Typography } from "@mui/material";

export default function CreatePosition() {
  // const token = localStorage.getItem("response-token");
  const token = useSelector((state) => state.auth.token);
  const permission = useSelector((state) => state.auth.permissions);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    positionName: "",
    techStack: "",
    vacancy: "",
    positionOpenDate: "",
    positionCloseDate: "",
    status: "",
    experienceInYear: "",
    positionType: "",
    remote: "",
  });
  const [selectedValue, setSelectedValue] = useState([]);
  const [techOptions, setTechOptions] = useState([]);
  const [positionnameerror, setPositionNameError] = useState();
  const [techstackerror, setTechStackError] = useState();
  const [vacancyerror, setVacancyError] = useState();
  const [experienceerror, setExperienceError] = useState();
  const [dateerror, setDateError] = useState();
  const [positionerror, setPositionError] = useState();
  const [statuserror, setStatusError] = useState();
  const [remoteerror, setRemoteError] = useState();

  // console.log(selectedValue);

  useEffect(() => {
    axios
      .get(`/apigateway/hrms/interview/alltech`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const options = response.data.map((tech) => ({
          label: tech.description,
          value: tech.description,
        }));
        setTechOptions(options);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  }, [token]);

  function submit(e) {
    e.preventDefault();
    // setLoading(true);
    console.log(data.remote);

    var pnameError = validateString(data.positionName);
    var techStackError = validateNullCheck(selectedValue);
    var vacancyError = validateVacancy(data.vacancy);
    var expError = validateNullCheck(data.experienceInYear);
    var dateError = validateDateDuration(
      data.positionOpenDate,
      data.positionCloseDate
    );
    var positionError = validateNullCheck(data.positionType);
    var statusError = validateNullCheck(data.status);
    var remoteError = validateRadioButton(data.remote);

    if (
      pnameError ||
      vacancyError ||
      expError ||
      dateError ||
      positionError ||
      statusError ||
      remoteError ||
      techStackError
    ) {
      setPositionNameError(pnameError);
      setTechStackError(techStackError);
      setVacancyError(vacancyError);
      setExperienceError(expError);
      setDateError(dateError);
      setPositionError(positionError);
      setStatusError(statusError);
      setRemoteError(remoteError);
      return;
    }
    setPositionNameError(null);
    setTechStackError(null);
    setVacancyError(null);
    setExperienceError(null);
    setDateError(null);
    setPositionError(null);
    setStatusError(null);
    setRemoteError(null);

    axios
      .post(
        `/apigateway/hrms/interview/savePosition`,
        {
          positionName: data.positionName,
          techStack: selectedValue,
          vacancy: data.vacancy,
          positionOpenDate: data.positionOpenDate,
          positionCloseDate: data.positionCloseDate,
          status: data.status,
          experienceInYear: data.experienceInYear,
          positionType: data.positionType,
          remote: data.remote,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        toast.success("Position created successfully!!", {
          position: "top-center",
          theme: "colored",
        });
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.log(error);
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

  const handleChange = (e) => {
    setSelectedValue(Array.isArray(e) ? e.map((x) => x.value) : []);
    console.log(e);
  };

  function radiobut(e) {
    console.log(str2bool(e.target.value));
    data.remote = str2bool(e.target.value);
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
    marginBottom: "2%",
  };

  return (
    <>
      <div>
        {loading ? <LoadingPage /> : ""}
        <Paper
          sx={{
            height: "auto",
            width: "500px !important",
            padding: "5%",
            marginTop: "5%",
            marginBottom: "10%",
            marginLeft: "40%",
          }}
        >
          <center>
            <Typography sx={{ fontSize: "20px", color: "var(--red)" }}>
              Add New Position
            </Typography>
          </center>
          <Divider sx={{ color: "black", marginBottom: "5%" }} />
          {permission.includes("MANAGE_TECHNOLOGY") && <ManageSkills />}
          <form
            style={{ marginTop: "2%", gap: "5%" }}
            onSubmit={(e) => {
              submit(e);
            }}
          >
            <div>
              <label>Position-Name</label>
              <div>
                <input
                  onChange={(e) => {
                    handle(e);
                  }}
                  value={data.positionName}
                  type="text"
                  id="positionName"
                  placeholder="enter your positionName"
                  style={style}
                />
                {positionnameerror && (
                  <span style={{ color: "red" }}>{positionnameerror}</span>
                )}
              </div>
            </div>
            <div style={{ marginBottom: "2%" }}>
              <label>Tech-Stack</label>
              <div>
                <Select
                  isMulti
                  name="techStack"
                  options={techOptions}
                  classNamePrefix="select"
                  onChange={handleChange}
                  value={techOptions.filter((obj) =>
                    selectedValue.includes(obj.value)
                  )}
                  style={style}
                />
                {techstackerror && (
                  <span style={{ color: "red" }}>{techstackerror}</span>
                )}
              </div>
            </div>
            <div>
              <label>Vacancy</label>
              <div>
                <input
                  onChange={(e) => {
                    handle(e);
                  }}
                  value={data.vacancy}
                  type="text"
                  id="vacancy"
                  placeholder="enter your vacancy"
                  style={style}
                />
                {vacancyerror && (
                  <span style={{ color: "red" }}>{vacancyerror}</span>
                )}
              </div>
            </div>
            <div>
              <label>Experience in years</label>
              <div>
                <input
                  onChange={(e) => {
                    handle(e);
                  }}
                  value={data.experienceInYear}
                  type="text"
                  id="experienceInYear"
                  placeholder="enter your experience in years"
                  style={style}
                  required
                />
                {experienceerror && (
                  <span style={{ color: "red" }}>{experienceerror}</span>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10%" }}>
              <div style={{ width: "45%" }}>
                <label>Position open date</label>
                <div>
                  <input
                    onChange={(e) => {
                      handle(e);
                    }}
                    value={data.positionOpenDate}
                    type="date"
                    id="positionOpenDate"
                    style={style}
                  />
                  {dateerror && (
                    <span style={{ color: "red" }}>{dateerror}</span>
                  )}
                </div>
              </div>
              <div style={{ width: "45%" }}>
                <label>Position close date</label>
                <div>
                  <input
                    onChange={(e) => {
                      handle(e);
                    }}
                    value={data.positionCloseDate}
                    type="date"
                    id="positionCloseDate"
                    style={style}
                  />
                  {dateerror && (
                    <span style={{ color: "red" }}>{dateerror}</span>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label>Position type:</label>
              <div>
                <select
                  id="positionType"
                  value={data.positionType}
                  onChange={(e) => {
                    handle(e);
                  }}
                  style={style}
                >
                  <option defaultValue value="">
                    Select your position type
                  </option>
                  <option value="Permanent">Permanent</option>
                  <option value="Contractual">Contractual</option>
                  <option value="Traineeship">Traineeship</option>
                </select>
                {positionerror && (
                  <span style={{ color: "red" }}>{positionerror}</span>
                )}
              </div>
            </div>
            <div>
              <label>Status</label>
              <div>
                <select
                  id="status"
                  value={data.status}
                  onChange={(e) => {
                    handle(e);
                  }}
                  style={style}
                >
                  <option defaultValue value="">
                    Select your status type
                  </option>
                  <option value="Available">Available</option>
                  <option value="Not Available"> Not Available</option>
                </select>
                {statuserror && (
                  <span style={{ color: "red" }}>{statuserror}</span>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: "5%" }}>
              <label>Remote</label>
              <div style={{ display: "flex", gap: "5%" }}>
                <input
                  onChange={radiobut}
                  value="true"
                  type="radio"
                  name="inlineRadioOptions"
                  id="remote"
                />
                <label>Yes</label>
              </div>
              <div style={{ display: "flex", gap: "5%" }}>
                <input
                  onChange={radiobut}
                  value="false"
                  type="radio"
                  name="inlineRadioOptions"
                  id="remote"
                />
                <label>No</label>
              </div>
              {remoteerror && (
                <span style={{ color: "red" }}>{remoteerror}</span>
              )}
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
                Submit
              </Button>
            </div>
          </form>
        </Paper>
      </div>
    </>
  );
}
