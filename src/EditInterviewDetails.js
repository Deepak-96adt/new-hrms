import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import { useSelector } from "react-redux";
import { Button, Divider, Paper, Typography } from "@mui/material";

const EditInterviewDetails = () => {
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const { id, id2 } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [technology, setTechnology] = useState([]);
  const [position, setPosition] = useState([]);
  const [candidate, setCandidate] = useState([]);
  const [data, setData] = useState({
    emailId: "",
    techId: { techId: "", description: "" },
    marks: "",
    communication: "",
    enthusiasm: "",
    notes: "",
    offerReleased: "",
    workExInYears: "",
    interviewerName: "",
    candidateId: { candidateId: "", candidateName: "" },
    source: "",
    offerAccepted: "",
    positionId: { positionId: "", positionName: "" },
    type: "",
    date: "",
    clientName: "",
    candidateName: "",
    rounds: "",
    status: "",
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `/apigateway/hrms/interview/getInterviewDetailByIdAndRound?interviewId=${id}&round=${id2}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const interviewData = response.data;
        console.log("------------------");
        console.log(response.data);
        setData({
          ...interviewData,
          techId: interviewData.techId || { techId: "", description: "" },
          candidateId: interviewData.candidateId || {
            candidateId: "",
            candidateName: "",
          },
          positionId: interviewData.positionId || {
            positionId: "",
            positionName: "",
          },
          candidateName: interviewData.candidateName,
        });
        // setEmail(interviewData.candidateId.emailId);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message || "Error fetching details");
        setLoading(false);
      });

    axios
      .get(`/apigateway/hrms/interview/alltech`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("---------------------");
        console.log(response.data);
        console.log("---------------------");
        setTechnology(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("---------------------");
        console.log(error);
        console.log("----------------------");
        toast.error(error.response.data.message || "Error fetching details");
      });

    axios
      .get(`/apigateway/hrms/interviewCandidate/allInterviewCandidate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCandidate(response.data.body.content);
        setData({
          ...data,
          emailId: response.data.body.content.emailId,
        });
      })
      .catch((error) => {
        toast.error(error.response.data.body.message);
      });

    axios
      .get(`/apigateway/hrms/interview/getAllPositionNew`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPosition(response.data.content);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, [id, id2, token]);

  const handleTechChange = (event) => {
    const selectedTech = technology.find(
      (tech) => tech.techId === parseInt(event.target.value)
    );
    setData({ ...data, techId: selectedTech });
  };

  const handleCandidateChange = (event) => {
    const selectedCandidate = candidate.find(
      (cand) => cand.candidateId === parseInt(event.target.value)
    );
    setEmail(selectedCandidate.emailId);
    setData({
      ...data,
      candidateId: selectedCandidate,
      candidateName: selectedCandidate.candidateName,
    });
  };

  const handlePositionChange = (event) => {
    const selectedPosition = position.find(
      (pos) => pos.positionId === parseInt(event.target.value)
    );
    setData({ ...data, positionId: selectedPosition });
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...data,
      techId: data.techId.techId,
      candidateId: data.candidateId.candidateId,
      positionId: data.positionId.positionId,
      candidateName: data.candidateName,
      emailId: data.emailId,
    };
    axios
      .put(`/apigateway/hrms/interview/updateInterviewByIdAndRound`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success("Interview details has been updated successfully.", {
          position: "top-center",
          theme: "colored",
        });
        navigate("/getinterviewdetails");
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message || "Error updating details");
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
            Edit Interview Details
          </Typography>
        </center>
        <Divider sx={{ color: "black", marginBottom: "5%" }} />
        <form onSubmit={handleSubmit}>
          <div>
            <label>Technology</label>
            <div>
              <select
                required
                onChange={handleTechChange}
                value={data.techId.techId || ""}
                id="techId"
                style={style}
              >
                <option defaultValue>Select Technology</option>
                {technology.map((tech) => (
                  <option key={tech.techId} value={tech.techId}>
                    {tech.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label>Position Name</label>
            <div>
              <select
                required
                onChange={handlePositionChange}
                value={data.positionId.positionId || ""}
                id="positionId"
                style={style}
              >
                <option defaultValue>Select Position Name</option>
                {position.map((pos) => (
                  <option key={pos.positionId} value={pos.positionId}>
                    {pos.positionName} ({pos.experienceInYear}yrs)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label>Marks</label>
            <div>
              <input
                type="number"
                id="marks"
                name="marks"
                value={data.marks || ""}
                onChange={handleChange}
                style={style}
              />
            </div>
          </div>

          <div>
            <label>Communication</label>
            <div>
              <input
                type="text"
                id="communication"
                name="communication"
                value={data.communication || ""}
                onChange={handleChange}
                style={style}
              />
            </div>
          </div>

          <div>
            <label>Enthusiasm</label>
            <div>
              <input
                type="text"
                id="enthusiasm"
                name="enthusiasm"
                value={data.enthusiasm || ""}
                onChange={handleChange}
                style={style}
              />
            </div>
          </div>

          <div>
            <label>Notes</label>
            <div>
              <textarea
                id="notes"
                name="notes"
                value={data.notes || ""}
                onChange={handleChange}
                style={style}
              />
            </div>
          </div>

          <div>
            <label>Offer Released</label>
            <div>
              <input
                type="text"
                id="offerReleased"
                name="offerReleased"
                value={data.offerReleased || ""}
                onChange={handleChange}
                style={style}
              />
            </div>
          </div>

          <div>
            <label>Work Experience (Years)</label>
            <div>
              <input
                type="number"
                id="workExInYears"
                name="workExInYears"
                value={data.workExInYears || ""}
                onChange={handleChange}
                style={style}
              />
            </div>
          </div>

          <div>
            <label>Interviewer Name</label>
            <div>
              <input
                type="text"
                id="interviewerName"
                name="interviewerName"
                value={data.interviewerName || ""}
                onChange={handleChange}
                style={style}
              />
            </div>
          </div>

          <div>
            <label>Source</label>
            <div>
              <input
                type="text"
                id="source"
                name="source"
                value={data.source || ""}
                onChange={handleChange}
                style={style}
              />
            </div>
          </div>

          <div>
            <label>Status</label>
            <div>
              <select
                id="status"
                value={data.status || ""}
                onChange={(e) => setData({ ...data, status: e.target.value })}
                style={style}
              >
                <option defaultValue>Select your status type</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div>
            <label>Date</label>
            <div>
              <input
                type="date"
                id="date"
                name="date"
                value={data.date || ""}
                onChange={handleChange}
                style={style}
              />
            </div>
          </div>

          <div>
            <label>Client Name</label>
            <div>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={data.clientName || ""}
                onChange={handleChange}
                style={style}
              />
            </div>
          </div>

          <div>
            <label>Rounds</label>
            <div>
              <input
                type="number"
                id="rounds"
                name="rouroundsnds"
                value={data.roundNumber || ""}
                readOnly
                style={style}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "5%", marginTop: "5%" }}>
            <strong>Type</strong>
            <div style={{ display: "flex", gap: "5%" }}>
              <input
                checked={data.type === "Inbound"}
                value={"Inbound" || ""}
                onChange={(e) => setData({ ...data, type: "Inbound" })}
                type="radio"
                name="inlineRadioOptions4"
                id="type"
              />
              <label>Inbound</label>
            </div>
            <div style={{ display: "flex", gap: "5%" }}>
              <input
                checked={data.type === "Outbound"}
                value={"Outbound" || ""}
                onChange={(e) => setData({ ...data, type: "Outbound" })}
                type="radio"
                name="inlineRadioOptions4"
                id="type"
              />
              <label>Outbound</label>
            </div>
          </div>

          <div style={{ display: "flex", gap: "5%", marginTop: "5%" }}>
            <strong>Offer Accepted</strong>
            <div style={{ display: "flex", gap: "5%" }}>
              <input
                checked={data.offerAccepted === true}
                value={true || ""}
                onChange={(e) => setData({ ...data, offerAccepted: true })}
                type="radio"
                name="inlineRadioOptions1"
                id="offerAccepted"
              />
              <label>Yes</label>
            </div>
            <div style={{ display: "flex", gap: "5%" }}>
              <input
                checked={data.offerAccepted === false}
                value={false || ""}
                onChange={(e) => setData({ ...data, offerAccepted: false })}
                type="radio"
                name="inlineRadioOptions1"
                id="offerAccepted"
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
            >
              Update
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default EditInterviewDetails;
