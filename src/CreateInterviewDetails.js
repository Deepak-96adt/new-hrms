import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import handleAuthError from "./CommonErrorHandling";
import { Link } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import { useSelector } from "react-redux";
import CandidateAutoSearch from "./CandidateAutoSearch";
import { Button, Divider, Paper, Typography } from "@mui/material";

const CreateInterview = () => {
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    interviewId: "",
    tech_id: "",
    position_id: "",
    candidate_id: "",
    marks: "",
    communication: "",
    enthusiasm: "",
    notes: "",
    offerReleased: "",
    workExInYears: "",
    interviewerName: "",
    source: "",
    offerAccepted: "",
    type: "",
    clientName: "",
    rounds: "",
    date: "",
    status: "",
    email: "",
  });
  const [technology, setTechnology] = useState([]);
  const [position, setPosition] = useState([]);
  const [candidate, setCandidate] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    axios
      .get(`/apigateway/hrms/interview/alltech`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTechnology(response.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
    axios
      .get(`/apigateway/hrms/interviewCandidate/allInterviewCandidate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data.body.content);
        setCandidate(response.data.body.content);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.data.body.content.message);
      });

    axios
      .get(`/apigateway/hrms/interview/getAllPositionNew`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("----------------------");
        console.log(response.data.content);
        setPosition(response.data.content);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  }, []);

  function submit(e) {
    e.preventDefault();
    setLoading(true);
    axios
      .post(
        `/apigateway/hrms/interview/saveInterviewNew`,
        {
          techId: parseInt(data.tech_id),
          marks: parseInt(data.marks),
          communication: parseInt(data.communication),
          enthusiasm: parseInt(data.enthusiasm),
          notes: data.notes,
          offerReleased: data.offerReleased,
          workExInYears: parseInt(data.workExInYears),
          interviewerName: data.interviewerName,
          source: data.source,
          offerAccepted: data.offerAccepted,
          type: data.type,
          clientName: data.clientName,
          roundNumber: parseInt(data.rounds),
          date: data.date,
          positionId: parseInt(data.position_id),
          candidateId: parseInt(data.candidate_id),
          status: data.status,
          email: data.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // console.log(response.data);
        toast.success(response.data, {
          position: "top-center",
          theme: "colored",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        toast.error(error.response.data.message);
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
  function radiobutton1(e) {
    console.log(str2bool(e.target.value));
    data.offerReleased = str2bool(e.target.value);
  }
  function radiobutton2(e) {
    console.log(str2bool(e.target.value));
    data.offerAccepted = str2bool(e.target.value);
  }

  function handle(e) {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    setData(newdata);
    console.log("----------------");
    console.log(newdata);
    console.log("----------------");
  }
  const handleSelection = (event) => {
    const selectedId = event.target.value;
    const selectedCandidate = candidate.find(
      (cand) => cand.candidateId === parseInt(selectedId)
    );
    if (selectedCandidate) {
      setEmail(selectedCandidate.emailId);
    } else {
      setEmail("");
    }
    const newData = { ...data, candidate_id: selectedId };
    setData(newData);
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
            Create New Interview
          </Typography>
        </center>
        <Divider sx={{ color: "black", marginBottom: "5%" }} />
        <form style={{ marginTop: "2%", gap: "5%" }}>
          <div style={{ display: "flex", gap: "5%" }}>
            <label>Type</label>
            <div style={{ display: "flex", gap: "5%" }}>
              <input
                onChange={(e) => {
                  handle(e);
                }}
                value="Inbound"
                type="radio"
                name="type"
                id="type"
              />
              <label>Inbound</label>
            </div>
            <div style={{ display: "flex", gap: "5%" }}>
              <input
                onChange={(e) => {
                  handle(e);
                }}
                value="Outbound"
                type="radio"
                name="type"
                id="type"
              />
              <label>Outbound</label>
            </div>
          </div>

          <div>
            <label name="candidate_id">Candidate Name</label>

            <CandidateAutoSearch
              data={data}
              setData={setData}
              candidate={candidate}
            />
          </div>
          <div>
            <label>Email</label>
            <div>
              <input
                required
                onChange={(e) => {
                  handle(e);
                }}
                value={data.email}
                type="text"
                placeholder="enter email"
                id="email"
                style={style}
              />
            </div>
          </div>

          <div>
            <label name="notes">Rounds</label>
            <div>
              <input
                required
                onChange={(e) => {
                  handle(e);
                }}
                value={data.rounds}
                type="text"
                placeholder="enter the number of  Rounds."
                id="rounds"
                style={style}
              />
            </div>
          </div>

          <div>
            <label name="tech_id">Technology</label>
            <div>
              <select
                required
                onChange={(e) => {
                  handle(e);
                }}
                value={technology.techId}
                id="tech_id"
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
            <label name="position_id">Position Name</label>
            <div>
              <select
                required
                onChange={(e) => {
                  handle(e);
                }}
                value={position.positionId}
                id="position_id"
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
            <label name="marks">Marks</label>
            <div>
              <input
                required
                onChange={(e) => {
                  handle(e);
                }}
                value={data.marks}
                type="text"
                placeholder="enter marks in number.."
                id="marks"
                style={style}
              />
            </div>
          </div>

          <div>
            <label name="communication">Communication (Marks)</label>
            <div>
              <input
                required
                onChange={(e) => {
                  handle(e);
                }}
                value={data.communication}
                type="text"
                placeholder="enter communication marks..."
                id="communication"
                style={style}
              />
            </div>
          </div>

          <div>
            <label name="enthusiasm">Enthusiasm (Marks)</label>
            <div>
              <input
                required
                onChange={(e) => {
                  handle(e);
                }}
                value={data.enthusiasm}
                type="text"
                placeholder="enter enthusiasm marks..."
                id="enthusiasm"
                style={style}
              />
            </div>
          </div>

          <div>
            <label name="notes">Notes</label>
            <div>
              <input
                required
                onChange={(e) => {
                  handle(e);
                }}
                value={data.notes}
                type="text"
                placeholder="enter your notes"
                id="notes"
                style={style}
              />
            </div>
          </div>

          <div>
            <label name="workExInYears">Work Exp In Years</label>
            <div>
              <input
                required
                onChange={(e) => {
                  handle(e);
                }}
                value={data.workExInYears}
                type="text"
                placeholder="enter your work experience in years."
                id="workExInYears"
                style={style}
              />
            </div>
          </div>
          <div>
            <label name="interviewerName">Interviewer Name</label>
            <div>
              <input
                required
                onChange={(e) => {
                  handle(e);
                }}
                value={data.interviewerName}
                type="text"
                placeholder="enter interviewer Name"
                id="interviewerName"
                style={style}
              />
            </div>
          </div>
          <div>
            <label name="source">Source</label>
            <div>
              <input
                required
                onChange={(e) => {
                  handle(e);
                }}
                value={data.source}
                type="text"
                placeholder="enter your source"
                id="source"
                style={style}
              />
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
                <option defaultValue>Select your status type</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
          <div>
            <label name="clientName">Client Name</label>
            <div>
              <input
                required
                onChange={(e) => {
                  handle(e);
                }}
                value={data.clientName}
                type="text"
                placeholder="enter client Name"
                id="clientName"
                style={style}
              />
            </div>
          </div>

          <div>
            <label name="date">Date</label>
            <div>
              <input
                onChange={(e) => {
                  handle(e);
                }}
                value={data.date}
                type="date"
                id="date"
                style={style}
              />
            </div>
          </div>
          <div>
            <div style={{ display: "flex", gap: "5%" }}>
              <label>Offer Released</label>
              <div style={{ display: "flex", gap: "5%" }}>
                <input
                  onChange={radiobutton1}
                  value="true"
                  type="radio"
                  name="offerReleased"
                  id="offerReleased"
                />
                <label>Yes</label>
              </div>
              <div style={{ display: "flex", gap: "5%" }}>
                <input
                  onChange={radiobutton1}
                  value="false"
                  type="radio"
                  name="offerReleased"
                  id="offerReleased"
                />
                <label>No</label>
              </div>
            </div>

            <div style={{ display: "flex", gap: "5%" }}>
              <label>Offer Accepted</label>
              <div style={{ display: "flex", gap: "5%" }}>
                <input
                  onChange={radiobutton2}
                  value="true"
                  type="radio"
                  name="offerAccepted"
                  id="offerAccepted"
                />
                <label>Yes</label>
              </div>
              <div style={{ display: "flex", gap: "5%" }}>
                <input
                  onChange={radiobutton2}
                  value="false"
                  type="radio"
                  name="offerAccepted"
                  id="offerAccepted"
                />
                <label>No</label>
              </div>
            </div>
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
              onClick={(e) => {
                submit(e);
              }}
            >
              Submit
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default CreateInterview;
