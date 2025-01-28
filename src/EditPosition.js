import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import Select from "react-select";
import "./Hrmscss/App.css";
import { useSelector } from "react-redux";
import {
  validateString,
  validateNullCheck,
  validateExperience,
  validateVacancy,
  validateDateDuration,
  validateRadioButton,
} from "./Validations/InputValidation";
import { Button, Divider, Paper, Typography } from "@mui/material";

const EditPosition = () => {
  const token = useSelector((state) => state.auth.token);
  const [selectedValue, setSelectedValue] = useState([]);
  const [techOptions, setTechOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    positionName: "",
    techStack: [],
    vacancy: "",
    positionOpenDate: "",
    positionCloseDate: "",
    status: "",
    experienceInYear: "",
    positionType: "",
    remote: "",
  });
  if (data.positionType == null) {
    setData((prevData) => ({
      ...prevData,
      positionType: "",
    }));
  }

  if (data.status === null) {
    setData((prevData) => ({
      ...prevData,
      status: "",
    }));
  }

  useEffect(() => {
    setLoading(true);

    // Fetch the tech stack options
    axios
      .get("/apigateway/hrms/interview/alltech", {
        headers: { Authorization: `Bearer ${token}` },
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
        toast.error(
          error.response?.data?.message || "Error fetching tech options"
        );
      });

    // Fetch position data by position ID
    axios
      .get(`/apigateway/hrms/interview/getByPositionId/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const positionData = response.data;
        setData(positionData);

        // Map the tech stack (which is an array of strings) to the Select format
        const selectedTechStack = positionData.techStack.map((tech) => ({
          label: tech,
          value: tech,
        }));
        setSelectedValue(selectedTechStack);

        // Transform dates if they exist
        const transformedData = {
          positionOpenDate: positionData.positionOpenDate
            ? new Date(positionData.positionOpenDate)
                .toISOString()
                .split("T")[0]
            : "",
          positionCloseDate: positionData.positionCloseDate
            ? new Date(positionData.positionCloseDate)
                .toISOString()
                .split("T")[0]
            : "",
        };
        setData((prevData) => ({ ...prevData, ...transformedData }));

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        toast.error(
          error.response?.data?.message || "Error fetching position details"
        );
      });
  }, [id, token]);

  // Event Handlers
  const handleChange = (selectedOptions) => {
    setSelectedValue(selectedOptions);
    setData((prevData) => ({
      ...prevData,
      techStack: selectedOptions.map((option) => option.value),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const radiobut = (e) => {
    setData({ ...data, remote: e.target.value === "true" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    var nameError = validateString(data.positionName);
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
      nameError ||
      techStackError ||
      vacancyError ||
      expError ||
      dateError ||
      positionError ||
      statusError ||
      remoteError
    ) {
      setErrors({
        positionName: nameError,
        techStack: techStackError,
        vacancy: vacancyError,
        experienceInYear: expError,
        positionDate: dateError,
        positionType: positionError,
        status: statusError,
        remote: remoteError,
      });
      return;
    }

    setErrors({
      positionName: null,
      techStack: null,
      vacancy: null,
      experienceInYear: null,
      positionDate: null,
      positionType: null,
      status: null,
      remote: null,
    });

    setLoading(true);

    const updatedData = {
      ...data,
      techStack: selectedValue.map((option) => option.value),
    };

    axios
      .put("/apigateway/hrms/interview/updatePositionNew", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("Data has been updated successfully!", {
          position: "top-center",
          theme: "colored",
        });
        navigate("/positiondetails");
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Error updating position",
          {
            position: "top-center",
          }
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
      {loading && <LoadingPage />}
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
            Edit Position
          </Typography>
        </center>
        <Divider sx={{ color: "black", marginBottom: "5%" }} />
        <form style={{ marginTop: "2%", gap: "5%" }} onSubmit={handleSubmit}>
          <div>
            <label>Position Name</label>
            <div>
              <input
                onChange={handleInputChange}
                value={data.positionName}
                type="text"
                id="positionName"
                name="positionName"
                placeholder="Enter your position name"
                className={`form-control ${
                  errors.positionName ? "is-invalid" : ""
                }`}
                maxLength={50} // Set maximum length to 50
                style={style}
              />
              {errors.positionName && (
                <div className="invalid-feedback">{errors.positionName}</div>
              )}
            </div>
          </div>

          <div>
            <label>Vacancy</label>
            <div>
              <input
                onChange={handleInputChange}
                value={data.vacancy}
                type="text"
                id="vacancy"
                name="vacancy"
                placeholder="Enter your vacancy"
                style={style}
                className={`form-control ${errors.vacancy ? "is-invalid" : ""}`}
              />
              {errors.vacancy && (
                <div className="invalid-feedback">{errors.vacancy}</div>
              )}
            </div>
          </div>

          <div>
            <label>Tech Stack</label>
            <div>
              <Select
                isMulti
                name="techStack"
                options={techOptions}
                id="techStack"
                className={`basic-multi-select ${
                  errors.techStack ? "is-invalid" : ""
                }`}
                classNamePrefix="select"
                style={style}
                onChange={handleChange} // Pass the function here
                value={selectedValue}
              />
              {errors.techStack && (
                <div className="text-danger">{errors.techStack}</div>
              )}
            </div>
          </div>

          <div>
            <label>Experience in Years</label>
            <div>
              <input
                onChange={handleInputChange}
                value={data.experienceInYear}
                type="text"
                id="experienceInYear"
                name="experienceInYear"
                placeholder="Enter your experience in years"
                className={`form-control ${
                  errors.experienceInYear ? "is-invalid" : ""
                }`}
                style={style}
              />

              {errors.experienceInYear && (
                <div className="invalid-feedback">
                  {errors.experienceInYear}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10%" }}>
            <div style={{ width: "45%" }}>
              <label>Position Open Date</label>
              <div>
                <input
                  onChange={handleInputChange}
                  value={data.positionOpenDate}
                  type="date"
                  id="positionOpenDate"
                  name="positionOpenDate"
                  className={`form-control ${
                    errors.positionDate ? "is-invalid" : ""
                  }`}
                  style={style}
                />

                {errors.positionDate && (
                  <div className="invalid-feedback">{errors.positionDate}</div>
                )}
              </div>
            </div>
            <div style={{ width: "45%" }}>
              <label>Position Close Date</label>
              <div>
                <input
                  onChange={handleInputChange}
                  value={data.positionCloseDate}
                  type="date"
                  id="positionCloseDate"
                  name="positionCloseDate"
                  className={`form-control ${
                    errors.positionDate ? "is-invalid" : ""
                  }`}
                  style={style}
                />

                {errors.positionDate && (
                  <div className="invalid-feedback">{errors.positionDate}</div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label>Position Type</label>
            <div>
              <select
                id="positionType"
                name="positionType"
                value={data.positionType}
                onChange={handleInputChange}
                className={`form-control ${
                  errors.positionType ? "is-invalid" : ""
                }`}
                style={style}
              >
                <option defaultValue value="">
                  Select your position type
                </option>
                <option value="Permanent">Permanent</option>
                <option value="Contractual">Contractual</option>
                <option value="Traineeship">Traineeship</option>
              </select>
              {errors.positionType && (
                <div className="invalid-feedback">{errors.positionType}</div>
              )}
            </div>
          </div>
          <div>
            <label>Status</label>
            <div>
              <select
                id="status"
                name="status"
                value={data.status}
                onChange={handleInputChange}
                className={`form-control ${errors.status ? "is-invalid" : ""}`}
                style={style}
              >
                <option defaultValue value="">
                  Select your status type
                </option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>

              {errors.status && (
                <div className="invalid-feedback">{errors.status}</div>
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
                checked={data.remote === true}
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
                checked={data.remote === false}
              />
              <label>No</label>
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
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default EditPosition;
