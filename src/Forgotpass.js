import React,{useState} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Hrmscss/FPF.css";
import { toast } from "react-toastify";
import LoadingPage from './LoadingPage'

function ForgotPassword1() {
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setLoading(true); 
        const response = await fetch(
          `/apigateway/api/auth/password/resetlink`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ email: values.email }),
          }
        );
        const result = await response.json();
        console.log(result);
        toast.success("Email reset link successfully sent", {
          position: "top-center",
          theme: "colored",
        });
        setLoading(false); 
      } catch (error) {
        console.error(error);
        toast.error( error.response.data.message || "Error updating details" );
        setLoading(false); 
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="forgot-password-container" style={{ margin: "0px 15rem" }}>
      {loading ? <LoadingPage/> : ''}
      <div className="forgot-password-box">
        <h2 className="forgot-password-title">Forgot Password <i className="fas fa-lock"></i></h2>
        <form onSubmit={formik.handleSubmit}>
          <input  style={{ fontSize: "0.8em", padding: "0.5em 1em" }} 
            id="email"
            placeholder='Enter email id'
            className={`forgot-password-input ${
              formik.touched.email && formik.errors.email ? "is-invalid" : ""
            }`}
            type="email"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="invalid-feedback">{formik.errors.email}</div>
          ) : null}
          <button
            className="btn btn-outline-success py-2 px-4 mt-4"
            type="submit"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword1;
