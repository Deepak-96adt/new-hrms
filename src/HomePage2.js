import React from 'react'
import { Container, Row, Col, Card } from "react-bootstrap";
import './Hrmscss/homepage.css'
import './Hrmscss/App.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHourglassHalf, faUsers, faMoneyBillAlt, faCalendarAlt, faUmbrellaBeach  } from '@fortawesome/free-solid-svg-icons';
import Footer from './Footer';
import { Link } from 'react-router-dom';



function HomePage2() {
  return (
    <>
      <Container fluid className="d-flex flex-column min-vh-100 " style={{backgroundColor: "rgb(83 9 9)"}}>
        <Row className="header-section text-white py-3 mt-0" style={{backgroundColor: "rgb(83 9 9)"}}>
          <Col className="text-center">
            <h6 className="display-4">Welcome to the Human Resource Management System</h6>
            <p className="lead">Manage your employees and resources with ease</p>
          </Col>
        </Row>
        <Row className="body-section py-3">
          <Col>
            <h3 className="mb-4 features "></h3>

            <Row>
              <Col md={6} lg={3} className="mb-4">
              <Link to="/TimeSheet" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card className="leave-card">
                  <Card.Body>
                    <div className="leave-icon">
                    <FontAwesomeIcon icon={faHourglassHalf} />
                    </div>
                    <Card.Title className="leave-title" >Check In/Out</Card.Title>
                    <Card.Text className="center-text">
                    Punch in to start and out to end your shift, Track your work hours efficiently.
                    </Card.Text>
                  </Card.Body>
                </Card>
                </Link>
              </Col>
              <Col md={6} lg={3} className="mb-4">
              <Link to="/empfunc" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card className="leave-card">
                  <Card.Body>
                    <div className="leave-icon">
                    <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <Card.Title className="leave-title" >Employee Management</Card.Title>
                    <Card.Text className="center-text">
                    Manage employee info, performance, and track their training and development.
                    </Card.Text>
                  </Card.Body>
                </Card>
                </Link>
                </Col>
              <Col md={6} lg={3} className="mb-4">
              <Link to="/payslip" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card className="leave-card">
                  <Card.Body>
                    <div className="leave-icon">
                    <FontAwesomeIcon icon={faMoneyBillAlt} />
                    </div>
                    <Card.Title className="leave-title">Payroll Management</Card.Title>
                    <Card.Text className="center-text">
                      Streamline your payroll processes, including calculating salaries and wages, tracking employee deductions and benefits, and generating paychecks and reports.
                    </Card.Text>
                  </Card.Body>
                </Card>
                </Link>
              </Col>

              <Col md={6} lg={3} className="mb-4">
              <Link to="/GetAllEmpAttendance" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card className="leave-card">
                  <Card.Body>
                    <div className="leave-icon">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    </div>
                    <Card.Title className="leave-title">Attendance Management</Card.Title>
                    <Card.Text className="center-text">
                    Manage employee attendance, work hours, breaks, and absences while ensuring compliance with labor laws and regulations.
                    </Card.Text>
                  </Card.Body>
                </Card>
                </Link>
              </Col>
              <Col md={6} lg={3} className="mb-4">
              <Link to="/MyProfileDetails" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card className="leave-card">
                  <Card.Body>
                    <div className="leave-icon">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    </div>
                    <Card.Title className="leave-title">Employee Profile</Card.Title>
                    <Card.Text>
                    Access and update your personal profile details to ensure they are always current and accurate.
                    </Card.Text>
                  </Card.Body>
                </Card>
                </Link>
              </Col>
              <Col md={6} lg={3} className="mb-4">
              <Link to="/HolidayCalender" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card className="leave-card">
                  <Card.Body>
                    <div className="leave-icon">
                    <FontAwesomeIcon icon={faUmbrellaBeach} />
                    </div>
                    <Card.Title className="leave-title">Holiday Calender</Card.Title>
                    <Card.Text className="center-text">
                    View all upcoming holidays at a glance. Stay informed about company-wide breaks and special events.
                    </Card.Text>
                  </Card.Body>
                </Card>
                </Link>
              </Col>
            </Row>
        </Col>
        </Row>
      </Container>
    <Footer/>
    </>
  );


}

export default HomePage2;

