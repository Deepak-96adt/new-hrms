import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { CandidateSchema } from "./Validations/Candidate";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import LoadingPage from "./LoadingPage";
import { Button, Divider, Paper, Typography } from "@mui/material";

export default function InterviewCandidate() {
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null); // State for the resume file
  const [candidateTypeDropdown, setCandidateTypeDropdown] = useState([]);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]); // Capture selected file
  };

  useEffect(() => {
    axios
      .get(`/apigateway/hrms/employee/candidate_type`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCandidateTypeDropdown(response.data);
      })
      .catch((error) => {
        toast.error(error || "Error fetching details");
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      candidateName: "",
      emailId: "",
      contactNo: "",
      address: "",
      highestQualification: "",
      workExperience: "",
      technicalStack: "",
      candidateType: "",
      cvShortlisted: false,
      lastCTC: "",
      expectedCTC: "",
      passingYear: "",
      noticePeriod: "",
      dob: "",
      resumeSubmissionDate: "",
    },
    validationSchema: CandidateSchema,
    onSubmit: async (values, action) => {
      if (!resume) {
        toast.error("Please upload a resume.");
        return;
      }

      setLoading(true);
      try {
        const formData = new FormData();
        formData.append(
          "candidateDetails",
          JSON.stringify({
            candidateName: values.candidateName,
            emailId: values.emailId,
            contactNo: values.contactNo,
            address: values.address,
            candidateType: values.candidateType,
            highestQualification: values.highestQualification,
            workExperience: parseFloat(values.workExperience),
            technicalStack: values.technicalStack,
            cvShortlisted: values.cvShortlisted,
            lastCTC: parseFloat(values.lastCTC),
            expectedCTC: parseFloat(values.expectedCTC),
            passingYear: values.passingYear,
            noticePeriod: parseInt(values.noticePeriod, 10),
            dob: values.dob,
            resumeSubmissionDate: values.resumeSubmissionDate,
          })
        );
        formData.append("resume", resume);

        const response = await axios.post(
          `/apigateway/hrms/interviewCandidate/saveInterviewCandidate`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "Candidate details successfully created !!" || response.data.message,
          {
            position: "top-center",
            theme: "colored",
          }
        );
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Error creating candidate."
        );
      } finally {
        setLoading(false);
        action.resetForm();
        setResume(null); // Reset file input
      }
    },
  });

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
              Add New Candidate
            </Typography>
          </center>
          <Divider sx={{ color: "black", marginBottom: "5%" }} />
          <form
            style={{ marginTop: "2%", gap: "5%" }}
            onSubmit={formik.handleSubmit}
          >
            <div>
              <label name="candidateName">Candidate Name</label>
              <div>
                <input
                  type="text "
                  id="candidateName"
                  name="candidateName"
                  step="0.1"
                  placeholder="Enter Your Name"
                  className={`form-control ${
                    formik.touched.candidateName && formik.errors.candidateName
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.candidateName}
                  style={style}
                />
                {formik.touched.candidateName && formik.errors.candidateName ? (
                  <div className="invalid-feedback">
                    {formik.errors.candidateName}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <label>Email Id</label>
              <div>
                <input
                  placeholder="Enter Email"
                  type="email"
                  id="emailId"
                  name="emailId"
                  className={`form-control ${
                    formik.touched.emailId && formik.errors.emailId
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.emailId}
                  style={style}
                />
                {formik.touched.emailId && formik.errors.emailId ? (
                  <div className="invalid-feedback">
                    {formik.errors.emailId}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <label>Contact Number</label>
              <div>
                <input
                  type="number "
                  id="contactNo"
                  name="contactNo"
                  step="0.1"
                  placeholder="Enter Number"
                  className={`form-control ${
                    formik.touched.contactNo && formik.errors.contactNo
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.contactNo}
                  style={style}
                />
                {formik.touched.contactNo && formik.errors.contactNo ? (
                  <div className="invalid-feedback">
                    {formik.errors.contactNo}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <label name="address">Address</label>
              <div>
                <input
                  type="text "
                  id="address"
                  name="address"
                  step="0.1"
                  placeholder="Enter Your Address"
                  className={`form-control ${
                    formik.touched.address && formik.errors.address
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address}
                  style={style}
                />
                {formik.touched.address && formik.errors.address ? (
                  <div className="invalid-feedback">
                    {formik.errors.address}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <label name="highestQualification">Highest Qualification</label>
              <div>
                <input
                  type="text "
                  id="highestQualification"
                  name="highestQualification"
                  step="0.1"
                  placeholder="Enter Your Highest Qualification"
                  className={`form-control ${
                    formik.touched.highestQualification &&
                    formik.errors.highestQualification
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.highestQualification}
                  style={style}
                />
                {formik.touched.highestQualification &&
                formik.errors.highestQualification ? (
                  <div className="invalid-feedback">
                    {formik.errors.highestQualification}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <label>Work Experience</label>
              <div>
                <input
                  type="number "
                  id="workExperience"
                  name="workExperience"
                  step="0.1"
                  placeholder="Enter Experience"
                  className={`form-control ${
                    formik.touched.workExperience &&
                    formik.errors.workExperience
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.workExperience}
                  style={style}
                />
                {formik.touched.workExperience &&
                formik.errors.workExperience ? (
                  <div className="invalid-feedback">
                    {formik.errors.workExperience}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <label name="technicalStack"> Technical Stack</label>
              <div>
                <input
                  type="text "
                  id="technicalStack"
                  name="technicalStack"
                  step="0.1"
                  placeholder="Enter Your Technical Stack"
                  className={`form-control ${
                    formik.touched.technicalStack &&
                    formik.errors.technicalStack
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.technicalStack}
                  style={style}
                />
                {formik.touched.technicalStack &&
                formik.errors.technicalStack ? (
                  <div className="invalid-feedback">
                    {formik.errors.technicalStack}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <label type="text" id="candidate_type" name="candidate_type">
                Candidate Type
              </label>
              <div>
                <select
                  id="candidateType"
                  name="candidateType"
                  value={formik.values.candidateType}
                  onChange={formik.handleChange}
                  style={style}
                >
                  <option value="">Select Candidate Type</option>{" "}
                  {candidateTypeDropdown.map((row) => (
                    <option key={row.id} value={row.name}>
                      {row.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10%" }}>
              <div style={{ width: "45%" }}>
                <label> Last CTC</label>
                <div>
                  <input
                    type="text"
                    id="lastCTC"
                    name="lastCTC"
                    placeholder="Enter Last CTC"
                    className={`form-control ${
                      formik.touched.lastCTC && formik.errors.lastCTC
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastCTC}
                    style={style}
                  />
                  {formik.touched.lastCTC && formik.errors.lastCTC ? (
                    <div className="invalid-feedback">
                      {formik.errors.lastCTC}
                    </div>
                  ) : null}
                </div>
              </div>
              <div style={{ width: "45%" }}>
                <label>Expected CTC</label>
                <div>
                  <input
                    type="text"
                    id="expectedCTC"
                    name="expectedCTC"
                    placeholder="Enter Expected CTC"
                    className={`form-control ${
                      formik.touched.expectedCTC && formik.errors.expectedCTC
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.expectedCTC}
                    style={style}
                  />
                  {formik.touched.expectedCTC && formik.errors.expectedCTC ? (
                    <div className="invalid-feedback">
                      {formik.errors.expectedCTC}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10%" }}>
              <div style={{ width: "45%" }}>
                <label>Passing Year</label>
                <div>
                  <input
                    type="text"
                    id="passingYear"
                    name="passingYear"
                    step="0.1"
                    placeholder="Enter Passing Year"
                    className={`form-control ${
                      formik.touched.passingYear && formik.errors.passingYear
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.passingYear}
                    style={style}
                  />
                  {formik.touched.passingYear && formik.errors.passingYear ? (
                    <div className="invalid-feedback">
                      {formik.errors.passingYear}
                    </div>
                  ) : null}
                </div>
              </div>
              <div style={{ width: "45%" }}>
                <label>Notice Period</label>
                <div>
                  <input
                    type="number "
                    id="noticePeriod"
                    name="noticePeriod"
                    step="0.1"
                    placeholder="Enter Notice Period"
                    className={`form-control ${
                      formik.touched.noticePeriod && formik.errors.noticePeriod
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.noticePeriod}
                    style={style}
                  />
                  {formik.touched.noticePeriod && formik.errors.noticePeriod ? (
                    <div className="invalid-feedback">
                      {formik.errors.noticePeriod}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10%" }}>
              <div style={{ width: "45%" }}>
                <label>dob</label>
                <div>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    className={`form-control ${
                      formik.touched.dob && formik.errors.dob
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.dob}
                    style={style}
                  />
                  {formik.touched.dob && formik.errors.dob ? (
                    <div className="invalid-feedback">{formik.errors.dob}</div>
                  ) : null}
                </div>
              </div>

              <div style={{ width: "45%" }}>
                <label>Resume Submission Date</label>
                <div>
                  <input
                    type="date"
                    id="resumeSubmissionDate"
                    name="resumeSubmissionDate"
                    className={`form-control ${
                      formik.touched.resumeSubmissionDate &&
                      formik.errors.resumeSubmissionDate
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.resumeSubmissionDate}
                    style={style}
                  />
                  {formik.touched.resumeSubmissionDate &&
                  formik.errors.resumeSubmissionDate ? (
                    <div className="invalid-feedback">
                      {formik.errors.resumeSubmissionDate}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div>
              <label>Resume</label>
              <div>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  className={`form-control ${
                    formik.touched.resume && formik.errors.resume
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={handleFileChange}
                  onBlur={formik.handleBlur}
                  style={style}
                />
                {formik.touched.resume && formik.errors.resume ? (
                  <div className="invalid-feedback">{formik.errors.resume}</div>
                ) : null}
              </div>
            </div>

            <div style={{ display: "flex", gap: "5%" }}>
              <label>CV Shortlisted</label>
              <div style={{ display: "flex", gap: "5%" }}>
                <input
                  onChange={() => {
                    formik.setFieldValue("cvShortlisted", true);
                  }}
                  onBlur={formik.handleBlur}
                  checked={formik.values.cvShortlisted === true}
                  className={`form-check-input ${
                    formik.touched.cvShortlisted && formik.errors.cvShortlisted
                      ? "is-invalid"
                      : ""
                  }`}
                  type="radio"
                  name="cvShortlisted"
                  id="cvShortlistedYes"
                />
                {formik.touched.cvShortlisted && formik.errors.cvShortlisted ? (
                  <div className="invalid-feedback">
                    {formik.errors.cvShortlisted}
                  </div>
                ) : null}
                <label>Yes</label>
              </div>

              <div style={{ display: "flex", gap: "5%" }}>
                <input
                  onChange={() => {
                    formik.setFieldValue("cvShortlisted", false);
                  }}
                  onBlur={formik.handleBlur}
                  checked={formik.values.cvShortlisted === false}
                  className={`form-check-input ${
                    formik.touched.cvShortlisted && formik.errors.cvShortlisted
                      ? "is-invalid"
                      : ""
                  }`}
                  type="radio"
                  name="cvShortlisted"
                  id="cvShortlistedNo"
                />
                {formik.touched.cvShortlisted && formik.errors.cvShortlisted ? (
                  <div className="invalid-feedback">
                    {formik.errors.cvShortlisted}
                  </div>
                ) : null}
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
                Submit
              </Button>
            </div>
          </form>
        </Paper>
      </div>
    </>
  );
}
