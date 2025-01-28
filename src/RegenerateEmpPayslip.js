import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";

function RegenerateEmpPayslip({
  show,
  onHide,
  salaryInfo,
}) {
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    empId: "",
    basic: "",
    hra: "",
    employerEsic: "",
    employeeEsic: "",
    bonus: "",
    employeePf: "",
    employerPf: "",
    medicalAmount: "",
    absentDeduction: "",
    grossDeduction: "",
    ajdustment: "",
    grossSalary: "",
    adhoc: "",
    netPay: "",
    year: "",
    month: "",
    comment: "",
    employeeName: "",
    bankName: "",
    accountNo: "",
  });

  useEffect(() => {
    if (salaryInfo) {
      setFormData({
        empId: salaryInfo.empId,
        basic: salaryInfo.basic || 0,
        hra: salaryInfo.hra || 0,
        employerEsic: salaryInfo.employerEsic || 0,
        employeeEsic: salaryInfo.employeeEsic || 0,
        bonus: salaryInfo.bonus || 0,
        employeePf: salaryInfo.employeePf || 0,
        employerPf: salaryInfo.employerPf || 0,
        medicalAmount: salaryInfo.medicalAmount || 0,
        absentDeduction: salaryInfo.absentDeduction || 0,
        grossDeduction: salaryInfo.grossDeduction || 0,
        ajdustment: salaryInfo.ajdustment || 0,
        adhoc: salaryInfo.adhoc || 0,
        netPay: salaryInfo.netPay || 0,
        year: salaryInfo.year || "",
        month: salaryInfo.month || "",
        grossSalary: salaryInfo.grossSalary || 0,
        comment: "",
        employeeName: "",
        bankName: "",
        accountNo: "",
      });
    }
  }, [salaryInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleSaveChanges = (e) => {
  //   setLoading(true);
  //   e.preventDefault();
  //   axios
  //     .post(`/apigateway/payroll/updateMonthlyPayslipByEmployee `, formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((response) => {
  //       toast.success(response.body || "Payslip generated successfully.");
  //       setLoading(false);
  //       onHide(true);
  //       fetchSalaryDetails();
  //     })
  //     .catch((error) => {
  //       toast.error(
  //         error.response.data || "Error getting while generating payslip."
  //       );
  //       setLoading(false);
  //     });
  //   // console.log("response is here after userConfirmation", response.data)
  //   setShowModal(false);
  //   setLoading(false);
  // };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post(
        `/apigateway/payroll/updateMonthlyPayslipByEmployee`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200 && response.data.body) {
        toast.success(response.data.body || "Payslip generated successfully.");
       // fetchSalaryDetails();
        onHide(true);
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.body ||
        error.response?.data ||
        error.message ||
        "Error occurred while generating the payslip.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {loading ? <LoadingPage /> : ""}
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" centered>
          Edit Payslip
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSaveChanges}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridName">
              <Form.Label style={{ color: "black" }}>Basic</Form.Label>
              <Form.Control
                type="number"
                name="basic"
                value={formData.basic}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridDate">
              <Form.Label style={{ color: "black" }}>HRA</Form.Label>
              <Form.Control
                type="number"
                name="hra"
                value={formData.hra}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridAmount">
              <Form.Label style={{ color: "black" }}>Employer Esic</Form.Label>
              <Form.Control
                type="number"
                name="employerEsic"
                value={formData.employerEsic}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridSalary">
              <Form.Label style={{ color: "black" }}>Employee Esic</Form.Label>
              <Form.Control
                type="number"
                name="employeeEsic"
                value={formData.employeeEsic}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridVariable">
              <Form.Label style={{ color: "black" }}>Employer PF</Form.Label>
              <Form.Control
                type="number"
                name="employerPf"
                value={formData.employerPf}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridRewardType">
              <Form.Label style={{ color: "black" }}>Employee PF</Form.Label>
              <Form.Control
                type="number"
                name="employeePf"
                value={formData.employeePf}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridVariable">
              <Form.Label style={{ color: "black" }}>ADHOC</Form.Label>
              <Form.Control
                type="number"
                name="adhoc"
                value={formData.adhoc}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridBonus">
              <Form.Label style={{ color: "black" }}>Bonus</Form.Label>
              <Form.Control
                type="number"
                name="bonus"
                value={formData.bonus}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridSalary">
              <Form.Label style={{ color: "black" }}>Medical Amount</Form.Label>
              <Form.Control
                type="number"
                name="medicalAmount"
                value={formData.medicalAmount}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridBonus">
              <Form.Label style={{ color: "black" }}>
                Gross Deduction
              </Form.Label>
              <Form.Control
                type="number"
                name="grossDeduction"
                value={formData.grossDeduction}
                onChange={handleChange}
                placeholder="Enter Amount"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridRewardType">
              <Form.Label style={{ color: "black" }}>
                Absent Deduction
              </Form.Label>
              <Form.Control
                type="number"
                name="absentDeduction"
                value={formData.absentDeduction}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridVariable">
              <Form.Label style={{ color: "black" }}>Adjustment</Form.Label>
              <Form.Control
                type="number"
                name="ajdustment"
                value={formData.ajdustment}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridVariable">
              <Form.Label style={{ color: "black" }}> Gross Salary</Form.Label>
              <Form.Control
                type="number"
                name="grossSalary"
                value={formData.grossSalary}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridBonus">
              <Form.Label style={{ color: "black" }}>Net Salary</Form.Label>
              <Form.Control
                type="number"
                name="netPay"
                value={formData.netPay}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridVariable">
              <Form.Label style={{ color: "black" }}>comment</Form.Label>
              <Form.Control
                type="text"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>
          </Row>
          <Modal.Footer>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
export default RegenerateEmpPayslip;
