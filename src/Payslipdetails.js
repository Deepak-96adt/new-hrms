import React, { useState } from 'react';
import axios from 'axios';
import './Hrmscss/PaySlip.css';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Button, Paper, Box, Container } from '@mui/material';
import LoadingPage from './LoadingPage';

function PaySlip() {
    const token = useSelector((state) => state.auth.token);
    const empID = useSelector((state) => state.auth.empId);

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(); // Month
    const [year, setYear] = useState(); // Year
    const [month, setMonth] = useState({}); // Payslip Details

    const handleMonth = (event) => setData(event.target.value);
    const handleYear = (event) => setYear(event.target.value);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!data || !year) {
            toast.error('Please select both month and year!', { position: 'top-center' });
            return;
        }

        setLoading(true);
        axios
            .get(`/apigateway/payroll/viewPay?empId=${empID}&month=${data}&year=${year}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setMonth(response.data);
                toast.success(response.data ||'Payslip details fetched successfully', { position: 'top-center', theme: 'colored', style: {
                    backgroundColor: 'var(--red)',
                    color: 'white',         
                  }, });
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || 'Error fetching details!', { position: 'top-center' });
                setLoading(false);
            });
    };

    return (
        <div className="d-flex ">
            <Paper
                sx={{
                    height: "auto",
                    width: "70%",
                    marginLeft: "15%",
                    padding: "5%",
                    marginTop: "5%",
                    marginBottom: "10%",
                    paddingTop: "3%",
                }}
            >
                {loading && <LoadingPage />}

                {/* Search Section */}
                <div className="d-flex flex-column align-items-center">
                    <h1 className="Heading1" style={{ backgroundColor: "var(--red)", color: "var(--white)" }}>View Payslip</h1>
                    <form onSubmit={handleSubmit} className="w-75">
                        <div className="d-flex justify-content-between align-items-center mb-4 gap-3" > 
                            <select
                                className="form-select"
                                value={year}
                                onChange={handleYear}
                                aria-label="Select Year"
                                width='100%'
                            >
                                <option defaultValue>Year</option>
                                {Array.from({ length: 10 }, (_, i) => 2021 + i).map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="form-select"
                                value={data}
                                onChange={handleMonth}
                                aria-label="Select Month"
                                width='100%'
                            >
                                <option defaultValue>Month</option>
                                {[
                                    'January',
                                    'February',
                                    'March',
                                    'April',
                                    'May',
                                    'June',
                                    'July',
                                    'August',
                                    'September',
                                    'October',
                                    'November',
                                    'December',
                                ].map((month) => (
                                    <option key={month} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <Button
                                    type="submit"
                                    sx={{
                                        backgroundColor: 'var(--red)',
                                        color: 'var(--white)',
                                        transition: "transform",
                                        "&:hover": {
                                            backgroundColor: "var(--red)",
                                            transform: "scale(1.03)",
                                        }, marginTop: "20px"
                                    }}
                                >
                                    Search
                                </Button></Box>
                        </div>
                    </form>
                </div>
                {/* Employee Details */}
               <hr style={{marginBottom: "-5px", marginTop: "-10px"}}></hr>
                <div className="row mb-4"  width='70%'>
                    {[
                        { label: 'Employee Name', value: month.empName },
                        { label: 'Designation', value: month.designation },
                        { label: 'Present Date', value: month.creditedDate },
                        { label: 'Account No', value: month.accountNo },
                        { label: 'Bank Name', value: month.bankName },
                    ].map(({ label, value }) => (
                        <div key={label} className="col-md-6 mb-3"> {/* Two columns per row */}
                            <div>
                                <span className="fw-bold">{label}:</span>{' '}
                                <small className="ms-4">{value || 'N/A'}</small>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Salary Details Table */}
                <ul className="list-group " style={{ paddingRight: "5%" }} >
                    {[
                        { label: 'Pay Periods', value: month.payPeriods },
                        { label: 'Present Days', value: month.empTotalWorkingDays },
                        { label: 'Total Working Days', value: month.officeTotalWorkingDays },
                        { label: 'Absent Days', value: month.leavesTaken },
                        { label: 'ADHOC', value: month.adhoc },
                        { label: 'Medical Amount', value: month.medicalAmt },
                        { label: 'Gross Salary', value: month.grossSalary },
                        { label: 'Net Amount Payable', value: month.netAmountPayable },
                    ].map(({ label, value }) => (
                        <li key={label} className="list-group-item d-flex justify-content-between  align-items-center" >
                            <span className="fw-bold" style={{
                                flex: '0 0 30%',
                                whiteSpace: 'nowrap',
                            }}>{label}:</span>
                            <span style={{
                                flex: '0 0 40%',
                                textAlign: 'right',
                            }}>{value || 'N/A'}</span>
                        </li>
                    ))}
                </ul>
                
            </Paper>
        </div>
        
    );
}

export default PaySlip;
