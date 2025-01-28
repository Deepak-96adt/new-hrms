import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import { Button } from '@mui/material';


function RegeneratePayslip({ show, onHide, salaryInfo, fetchSalaryDetails }) {
  const token = useSelector((state) => state.auth.token);
  const [showModal, setShowModal] = useState(false);
  const [monthlyDetails, setMonthlySalaryDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    empId: '',
    basic: '',
    hra: '',
    employerEsic: '',
    employeeEsic: '',
    bonus: '',
    employeePf: '',
    employerPf: '',
    medicalAmount: '',
    absentDeduction: '',
    grossDeduction: '',
    ajdustment: '',
    grossSalary:'',
    adhoc: '',
    netPay: '',
    year: '',
    month: '',
    comment: '',
    employeeName:'',
    bankName:'',
    accountNo:'',
  });

  useEffect(() => {
    console.log(salaryInfo);
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
        year: salaryInfo.year || '',
        month: salaryInfo.month || '',
        grossSalary:salaryInfo.grossSalary|| 0,
        comment: '',
        employeeName:'',
        bankName:'',
        accountNo:'',
      });
    }
  }, [salaryInfo]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = (e) => {
    setLoading(true);
    e.preventDefault();
    console.log('Form Data:', formData);
    axios
      .post(
        `/apigateway/payroll/validateData`,
        {
          empId: formData.empId,
          basic: parseFloat(formData.basic || 0),
          houseRentAllowance: parseFloat(formData.hra || 0),
          employerESICAmount: parseFloat(formData.employerEsic || 0),
          employeeESICAmount: parseFloat(formData.employeeEsic || 0),
          bonus: parseFloat(formData.bonus || 0),
          employeePFAmount: parseFloat(formData.employeePf || 0),
          employerPFAmount: parseFloat(formData.employerPf || 0),
          medicalInsurance: parseFloat(formData.medicalAmount || 0),
          absentDeduction: parseFloat(formData.absentDeduction || 0),
          grossDeduction: parseFloat(formData.grossDeduction || 0),
          grossSalary: parseFloat(formData.grossSalary || 0),
          adjustment: parseFloat(formData.ajdustment || 0),
          adhoc: parseFloat(formData.adhoc || 0),
          netPay: parseFloat(formData.netPay || 0),
          salaryYear: formData.year || '',
          month: formData.month || '',
          comment: '',
          employeeName:'',
          bankName:'',
          accountNo:'',
        },
        
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        toast.success(response.data);
        console.log("Initial response:", response.data);
       // setLoading(false);
        const userConfirmed = window.confirm("Are you sure you want to proceed with this calculated net amount: "+ response.data.netSalary);
        if (userConfirmed) {
          console.log(monthlyDetails);
          //setLoading(true);
          axios.post(`/apigateway/payroll/regeneratePayslip`, response.data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            })
          .then(response => {
            toast.success(response.data ||"Payslip generated successfully.");    
            setLoading(false);
            onHide(true);
            fetchSalaryDetails();
          })
          .catch(error => {
            toast.error(error.response.data||"Error getting while generating payslip.");
            setLoading(false);  
          });
        } else {
          console.log('User cancelled the action');
        }
        //setNetSalaryConfirmation(userConfirmed);
        console.log("response is here after userConfirmation", response.data)
        //  handleConfirmation
        setShowModal(false);
        setLoading(false);  
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data || "Error updating details");
        setLoading(false);  
      });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
       {loading ? <LoadingPage /> : ""}
      <Modal.Header closeButton>
      <div style={{ width: "100%", textAlign: "center" }}>
      <h1 className="Heading1" style={{backgroundColor:"var(--red)", color:"var(--white)"}}>Update Payslip</h1>
      </div>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSaveChanges}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridName">
              <Form.Label style={{ color: 'black' }}>Basic</Form.Label>
              <Form.Control
                type="number"
                name="basic"
                value={formData.basic}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridDate">
              <Form.Label style={{ color: 'black' }}>HRA</Form.Label>
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
              <Form.Label style={{ color: 'black' }}>Employer Esic</Form.Label>
              <Form.Control
                type="number"
                name="employerEsic"
                value={formData.employerEsic}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridSalary">
              <Form.Label style={{ color: 'black' }}>Employee Esic</Form.Label>
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
              <Form.Label style={{color : 'black' }}>Employer PF</Form.Label>
              <Form.Control
                type="number"
                name="employerPf"
                value={formData.employerPf}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridRewardType">
              <Form.Label style={{ color: 'black' }}>Employee PF</Form.Label>
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
              <Form.Label style={{ color: 'black' }}>ADHOC</Form.Label>
              <Form.Control
                type="number"
                name="adhoc"
                value={formData.adhoc}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridBonus">
              <Form.Label style={{ color: 'black' }}>Bonus</Form.Label>
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
              <Form.Label style={{ color: 'black' }}>Medical Amount</Form.Label>
              <Form.Control
                type="number"
                name="medicalAmount"
                value={formData.medicalAmount}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridBonus">
              <Form.Label style={{ color: 'black' }}>Gross Deduction</Form.Label>
              <Form.Control
                type="number"
                name="grossDeduction"
                value={formData.grossDeduction}
                onChange={handleChange}
                placeholder="Enter Amount"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridRewardType">
              <Form.Label style={{ color: 'black' }}>Absent Deduction</Form.Label>
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
              <Form.Label style={{ color: 'black' }}>Adjustment</Form.Label>
              <Form.Control
                type="number"
                name="ajdustment"
                value={formData.ajdustment}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridVariable">
              <Form.Label style={{ color: 'black' }}> Gross Salary</Form.Label>
              <Form.Control
                type="number"
                name="grossSalary"
                value={formData.grossSalary}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridBonus">
              <Form.Label style={{ color: 'black' }}>Net Salary</Form.Label>
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
              <Form.Label style={{ color: 'black' }}>comment</Form.Label>
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
          <div style={{ width: "100%", textAlign: "center" }}>
            {/* <Button variant="secondary" onClick={onHide}>Close</Button> */}
            <Button 
            sx={{
                   backgroundColor: "var(--red)",
                  color: "var(--white)",
                  transition: "transform",
                            "&:hover": {
                              backgroundColor: "var(--red)",
                              transform: "scale(1.03)",
                            }
                 }} type="submit" onChange={handleSaveChanges}>Submit</Button></div>
         </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>

  );
};
export default RegeneratePayslip;
