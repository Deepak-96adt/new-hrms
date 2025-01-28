import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import handleAuthError from "./CommonErrorHandling";
import LoadingPage from "./LoadingPage";
import { useSelector } from "react-redux";
import "./Hrmscss/App.css";
import { Button, Divider, Paper, Typography } from "@mui/material";
const EditCandidate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const token = localStorage.getItem("response-token");
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState([]);
  const [data, setData] = useState({
    candidateName: "",
    emailId: "",
    contactNo: "",
    address: "",
    highestQualification: "",
    workExperience: "",
    technicalStack: "",
    cvShortlisted: "",
    lastCTC: "",
    expectedCTC: "",
    passingYear: "",
    noticePeriod: "",
    dob: "",
    resumeSubmissionDate: "",
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/apigateway/hrms/interviewCandidate/interviewCandidateById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        // console.log(response);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message || "Error updating details");
        // console.log(error);
        // console.log(error.response.data)
        setLoading(false);
      });
  }, []);
  function HandleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    setLoading(true);
    for (let i = 0; i < resume.length; i++) {
      formData.append("resume", resume[i]);
    }
    formData.append("candidateDetails", JSON.stringify(data));
    axios
      .put(
        `/apigateway/hrms/interviewCandidate/updateInterviewCandidate/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setLoading(false);
        // alert("Candidate data has been updated successfully.");
        toast.success("Candidate data has been updated successfully.", {
          position: "top-center",
          theme: "colored",
        });
        navigate("/getcandidate");
      })
      .catch((error) => {
        handleAuthError(error);
        console.log(error);
        setLoading(false);
        // toast.error("Something Bad happened try after sometime.", { position: 'top-center', theme: "colored" })
      });
  }
  function HandleDelete() {
    setLoading(true);
    if (!window.confirm("Are you sure you want to delete this candidate?")) {
      return;
    }
    axios
      .delete(
        `/apigateway/hrms/interviewCandidate/interviewCandidateById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        console.log(response);
        toast.success("Candidate Data Deleted successfully.", {
          position: "top-center",
          theme: "colored",
        });
        navigate("/getcandidate");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        // toast.error("Cannot delete Candidate Details Try after sometime.", { position: 'top-center', theme: "colored" })
      });
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
    <div style={{ width: "100%" }}>
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
            Edit Candidate Details
          </Typography>
        </center>
        <Divider sx={{ color: "black", marginBottom: "5%" }} />
        <form onSubmit={HandleSubmit}>
          <div>
            <label name="candidateName">Candidate Name</label>
            <div>
              <input
                value={data.candidateName || ""}
                onChange={(e) =>
                  setData({ ...data, candidateName: e.target.value })
                }
                type="text"
                id="candidateName"
                style={style}
              />
            </div>
          </div>
          <div>
            <label name="emailId">Email Id</label>
            <div>
              <input
                value={data.emailId || ""}
                onChange={(e) => setData({ ...data, emailId: e.target.value })}
                type="email"
                id="emailId"
                step="0.1"
                placeholder="enter EmailId"
                style={style}
              />
            </div>
          </div>
          <div>
            <label name="contactNo">Contact No</label>
            <div>
              <input
                value={data.contactNo || ""}
                onChange={(e) =>
                  setData({ ...data, contactNo: e.target.value })
                }
                type="number"
                id="contactNo"
                style={style}
              />
            </div>
          </div>
          <div>
            <label name="address">Address</label>
            <div>
              <input
                value={data.address || ""}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                type="text"
                id="address"
                style={style}
              />
            </div>
          </div>
          <div>
            <label name="highestQualification">Highest Qualification</label>
            <div>
              <input
                value={data.highestQualification || ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    highestQualification: e.target.value,
                  })
                }
                type="text"
                placeholder="enter your highest Qualification."
                id="highestQualification"
                style={style}
              />
            </div>
          </div>
          <div>
            <label name="workExperience">Work Experience</label>
            <div>
              <input
                value={data.workExperience || ""}
                onChange={(e) =>
                  setData({ ...data, workExperience: e.target.value })
                }
                type="text"
                placeholder="Enter work Experience"
                id="workExperience"
                style={style}
              />
            </div>
          </div>
          <div>
            <label name="technicalStack">Technical Stack</label>
            <div>
              <input
                value={data.technicalStack || ""}
                onChange={(e) =>
                  setData({ ...data, technicalStack: e.target.value })
                }
                type="text"
                placeholder="enter the technical Stack."
                id="technicalStack"
                style={style}
              />
            </div>
          </div>

          <div>
            <label name="lastCTC">Last CTC</label>
            <div>
              <input
                value={data.lastCTC || ""}
                onChange={(e) => setData({ ...data, lastCTC: e.target.value })}
                type="number"
                placeholder="enter Last CTC"
                id="lastCTC"
                style={style}
              />
            </div>
          </div>
          <div>
            <label name="expectedCTC">Expected CTC</label>
            <div>
              <input
                value={data.expectedCTC || ""}
                onChange={(e) =>
                  setData({ ...data, expectedCTC: e.target.value })
                }
                type="number"
                placeholder="enter expected CTC"
                id="expectedCTC"
                style={style}
              />
            </div>
          </div>
          <div>
            <label name="passingYear">Passing Year </label>
            <div>
              <input
                value={data.passingYear || ""}
                onChange={(e) =>
                  setData({ ...data, passingYear: e.target.value })
                }
                type="text"
                placeholder="enter passing year"
                id="passingYear"
                style={style}
              />
            </div>
          </div>

          <div>
            <label name="noticePeriod">Notice Period </label>
            <div>
              <input
                value={data.noticePeriod || ""}
                onChange={(e) =>
                  setData({ ...data, noticePeriod: e.target.value })
                }
                type="text"
                placeholder="enter your noticePeriod"
                id="noticePeriod"
                style={style}
              />
            </div>
          </div>
          <div>
            <label name="noticePeriod">DOB</label>
            <div>
              <input
                value={data.dob || ""}
                onChange={(e) => setData({ ...data, dob: e.target.value })}
                type="date"
                id="dob"
                style={style}
              />
            </div>
          </div>
          <div>
            <label name="noticePeriod">Resume Submission</label>
            <div>
              <input
                value={data.resumeSubmissionDate || ""}
                onChange={(e) =>
                  setData({ ...data, resumeSubmissionDate: e.target.value })
                }
                type="date"
                id="resumeSubmissionDate"
                style={style}
              />
            </div>
          </div>

          <div>
            <label>Upload Resume</label>
            <div>
              <input
                onChange={(e) => setResume(e.target.files)}
                type="file"
                id="resumeUpload"
                multiple
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "5%", marginTop: "5%" }}>
            <label>CV Shortlisted</label>
            <div style={{ display: "flex", gap: "5%" }}>
              <input
                checked={data.cvShortlisted === true}
                onChange={(e) => setData({ ...data, cvShortlisted: true })}
                value={data.cvShortlisted || ""}
                type="radio"
                name="inlineRadioOptions"
                id="cvShortlisted"
              />
              <label>Yes</label>
            </div>
            <div style={{ display: "flex", gap: "5%" }}>
              <input
                checked={data.cvShortlisted === false}
                onChange={(e) => setData({ ...data, cvShortlisted: false })}
                value={data.cvShortlisted || ""}
                type="radio"
                name="inlineRadioOptions"
                id="cvShortlisted"
              />
              <label>No</label>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10%", marginTop: "5%" }}>
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
              Update Candidate
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
                marginTop: "2%",
              }}
              onClick={HandleDelete}
              type="submit"
            >
              Delete Candidate
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default EditCandidate;
