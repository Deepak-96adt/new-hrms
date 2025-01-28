
import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import { useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import axios from "axios";
import { toast } from 'react-toastify';
import LoadingPage from './LoadingPage'

const PasswordForm = ({ token, email, type }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    password: "",
    confirmPassword: ""
  }

  const validationSchema = Yup.object({
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Confirm password is required")
  })

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");
    setLoading(true); 
    axios
      .post(`/apigateway/api/auth/password/reset`, {
        email: email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        token: token
      })
      .then((response) => {
        console.log(response.data);
        toast.success("Password change successfully.", { position: "top-center", theme: "colored" })
        navigate('/Login');
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error( error.response.data.message || "Error creating details" );
        setLoading(false);
      })
      .finally(() => {
        setSubmitting(false);
        resetForm();
      });
  };


  return (
    <Container> 
       {loading ? <LoadingPage/> : ''}
      <Row>   
        <Col md={{ span: 6, offset: 3 }}  style={{ margin:'100px' ,width:'810px'}}>
          <h3>{type === "new-password" ? "Create" : "Reset"} Password</h3>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ isSubmitting, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="password">
                  <Form.Label>New Password</Form.Label>
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    className="form-control"
                  />
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    className="form-control"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group controlId="showPassword">
                  <Form.Check
                    type="checkbox"
                    label="Show password"
                    name="showPassword"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" style={{ marginTop: "10px" }} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default PasswordForm;
