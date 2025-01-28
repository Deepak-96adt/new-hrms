import React, { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import { useSelector } from "react-redux";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  FormControl,
  FormLabel,
  Autocomplete,
  Paper,
  Divider,
  Button,
  Typography,
} from "@mui/material";
const AddAppraisalDetails = () => {
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("appraisal");
  const [suggestions, setSuggestions] = useState([]);

  const initialappraisalData = {
    empId: "",
    appraisalDate: "",
    initiatedDate: "",
    amount: "",
    year: "",
    month: "",
    salary: "",
    variable: "",
    bonus: "",
  };
  const initalrewardsData = {
    empId: "",
    effectiveDate: null,
    amount: "",
    rewardType: "",
  };
  const [appraisalData, setAppraisalData] = useState(initialappraisalData);
  const [rewardsData, setRewardsData] = useState(initalrewardsData);
  const years = Array.from(
    new Array(10),
    (val, index) => new Date().getFullYear() + index
  );
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`/apigateway/payroll/addAppraisalDetails`, appraisalData, {
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
        setAppraisalData(initialappraisalData);
        clearSuggestions();
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data || "Error saving details.");
        setLoading(false);
        setAppraisalData(initialappraisalData);
        clearSuggestions();
      });
  };
  const submitRewards = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`/apigateway/payroll/saveRewardDetails`, rewardsData, {
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
        setRewardsData(initalrewardsData);
        clearSuggestions();
        setInputValue("");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message || "Error saving details.");
        setLoading(false);
        setRewardsData(initalrewardsData);
        clearSuggestions();
      });
  };
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  function handle(e) {
    if (selectedOption === "appraisal") {
      const newdata = { ...appraisalData };
      newdata[e.target.id] = e.target.value;
      setAppraisalData(newdata);
      console.log(newdata);
    } else {
      const newdata = { ...rewardsData };
      newdata[e.target.id] = e.target.value;
      setRewardsData(newdata);
      console.log(newdata);
    }
  }

  const handleName = useCallback((inputValue) => {
    axios
      .get(
        `/apigateway/payroll/getEmpNameByCharacter/${inputValue}`,

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
        setSuggestions(response.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data || "Enter valid keyword.");
        setLoading(false);
      });
  });
  // Function to clear suggestions
  const clearSuggestions = () => {
    setSuggestions([]);
  };
  const handleSuggestionClick = (suggestion) => {
    if (suggestion != null) {
      if (selectedOption === "appraisal") {
        setAppraisalData({ empId: suggestion.empId });
      } else {
        setRewardsData({ empId: suggestion.empId });
      }
    }
    clearSuggestions();
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
      {loading ? <LoadingPage /> : ""}
      <div>
        <Paper
          sx={{
            width: "35vw !important",
            marginLeft: { xs: "30px", sm: "50px", md: "80px", lg: "220px" },
            padding: "5%",
            marginTop: "5%",
          }}
        >
          <center>
            <Typography sx={{ fontSize: "20px", color: "var(--red)" }}>
              Appraisal Details
            </Typography>
          </center>
          <Divider sx={{ marginBottom: "5%" }} />
          <center>
            <div
              style={{
                border: "none",
                padding: "0",
                display: "flex",
                gap: "5%",
              }}
            >
              <label
                style={{
                  marginBottom: "10px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                Select Option
              </label>
              <div>
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "20px" }}
                >
                  <label>
                    <input
                      type="radio"
                      name="option"
                      value="appraisal"
                      checked={selectedOption === "appraisal"}
                      onChange={handleOptionChange}
                    />
                    Add Appraisal Details
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="option"
                      value="rewards"
                      checked={selectedOption === "rewards"}
                      onChange={handleOptionChange}
                    />
                    Add Rewards
                  </label>
                </div>
              </div>
            </div>
          </center>
          <Divider />
          <form style={{ marginTop: "5%" }}>
            {selectedOption !== "appraisal" && (
              <>
                <div>
                  <label>Employee Name</label>
                  <div>
                    <input
                      type="text"
                      list="suggestions-list"
                      placeholder="Enter Employee Name"
                      onChange={(event) => handleName(event.target.value)}
                    />
                    <datalist id="suggestions-list">
                      {suggestions.map((option, index) => (
                        <option
                          key={index}
                          value={option.name}
                          onClick={() => handleSuggestionClick(option)}
                        />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div>
                  <label>Effective Date</label>
                  <div>
                    <input
                      onChange={(e) => {
                        handle(e);
                      }}
                      value={rewardsData.effectiveDate}
                      type="date"
                      id="effectiveDate"
                      style={style}
                    />
                  </div>
                </div>
                <div>
                  <label>Amount</label>
                  <div>
                    <input
                      onChange={handle}
                      value={rewardsData.amount}
                      type="number"
                      id="amount"
                      placeholder="Enter Amount"
                      style={style}
                    />
                  </div>
                </div>
                <div>
                  <label>Reward Type</label>
                  <div>
                    <input
                      onChange={handle}
                      value={rewardsData.rewardType}
                      type="text"
                      id="rewardType"
                      placeholder="Enter Reward type."
                      style={style}
                    />
                  </div>
                </div>
                <div>
                  <Button
                    onClick={(e) => submitRewards(e)}
                    type="submit"
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
                  >
                    Submit
                  </Button>
                </div>
              </>
            )}
            {selectedOption === "appraisal" && (
              <>
                <div>
                  <label>Employee Name</label>
                  <div>
                    <input
                      type="text"
                      list="suggestions-list"
                      placeholder="Enter Employee Name"
                      onChange={(event) => handleName(event.target.value)}
                      style={style}
                    />
                    <datalist id="suggestions-list">
                      {suggestions.map((option, index) => (
                        <option
                          key={index}
                          value={option.name}
                          onClick={() => handleSuggestionClick(option)}
                        />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10%" }}>
                  <div style={{ width: "45%" }}>
                    <label>Initiated Date</label>
                    <div>
                      <input
                        onChange={(e) => {
                          handle(e);
                        }}
                        value={appraisalData.initiatedDate}
                        type="date"
                        id="initiatedDate"
                        style={style}
                      />
                    </div>
                  </div>
                  <div style={{ width: "45%" }}>
                    <label>Effective Date</label>
                    <div>
                      <input
                        onChange={(e) => {
                          handle(e);
                        }}
                        value={appraisalData.appraisalDate}
                        type="date"
                        id="appraisalDate"
                        style={style}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label>Amount</label>
                  <div>
                    <input
                      onChange={handle}
                      value={appraisalData.amount}
                      type="number"
                      id="amount"
                      placeholder="Enter Amount"
                      style={style}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10%" }}>
                  <div style={{ width: "45%" }}>
                    <label>Year</label>
                    <select
                      onChange={handle}
                      value={appraisalData.year}
                      id="year"
                      style={style}
                    >
                      <option value="">Year</option>
                      {years.map((year, index) => (
                        <option key={index} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ width: "45%" }}>
                    <label>Month</label>
                    <select
                      onChange={handle}
                      value={appraisalData.month}
                      id="month"
                      style={style}
                    >
                      <option value="">Month</option>
                      {months.map((month, index) => (
                        <option key={index} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label>Salary</label>
                  <div>
                    <input
                      onChange={handle}
                      value={appraisalData.salary}
                      type="number"
                      id="salary"
                      placeholder="Enter salary"
                      style={style}
                    />
                  </div>
                </div>
                <div>
                  <label>Variable</label>
                  <div>
                    <input
                      onChange={handle}
                      value={appraisalData.variable}
                      type="number"
                      id="variable"
                      placeholder="Enter Variable"
                      style={style}
                    />
                  </div>
                </div>
                <div>
                  <label>Bonus</label>
                  <div>
                    <input
                      onChange={handle}
                      value={appraisalData.bonus}
                      type="number"
                      id="bonus"
                      placeholder="Enter Bonus"
                      style={style}
                    />
                  </div>
                </div>
                <div>
                  <Button
                    onClick={(e) => submit(e)}
                    type="submit"
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
                  >
                    Submit
                  </Button>
                </div>
              </>
            )}
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default AddAppraisalDetails;
