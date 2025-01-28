import * as Yup from "yup";
export const CandidateSchema = Yup.object().shape({
  candidateName: Yup.string().required("Candidate name is required"),
  emailId: Yup.string()
    .email("Invalid email address")
    .required("Email address is required"),
  contactNo: Yup.string()
    .matches(/^\d+$/, "Contact number must be numeric")
    .required("Contact number is required"),
  address: Yup.string().required("Address is required"),
  highestQualification: Yup.string().required(
    "Highest qualification is required"
  ),
  workExperience: Yup.string().required("Work experience is required"),
  technicalStack: Yup.string().required("Technical stack is required"),
  cvShortlisted: Yup.boolean().required("CV shortlisted is required"),
  lastCTC: Yup.string().required("Last CTC is required"),
  noticePeriod: Yup.string().required("Notice period is required"),
});
