import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../src/Hrmscss/ExampleTable.css';
import LoadingPage from './LoadingPage';
const GetEmpLeavesDetails = () => {

  const empId = useSelector((state) => state.auth.empId);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [leave, setLeave] = useState([]);  // Initialize as an empty array
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchEmpLeaveData(page + 1);
  }, [page, rowsPerPage]);

  const fetchEmpLeaveData = (page) => {
    setLoading(true);
    axios.get(`/apigateway/payroll/leave/getAllLeaveByEmpId/${empId}`, {
      params: {
        page: page - 1,
        size: rowsPerPage,
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      setLeave(response.data.content || []);  // Ensure `leave` is always an array
      setTotalPages(response.data.totalPages || 0);
      setLoading(false);
    }).catch(error => {
      console.log(error);
      toast.error(error.response?.data?.message || "Error fetching details");
      setLoading(false);
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClick = () => {
    navigate('/leave'); 
  };

  return (
    <div style={{ marginLeft: "30%", width:"100%" , display:"flex", justifyContent: "center",flexDirection:"column", marginTop:"5%"}}>
      {loading ? <LoadingPage /> : ''}
        <h1 className="Heading1 mb-4" style={{ backgroundColor: "var(--red)", color: "var(--white)" }}>Employee Leave Details</h1>
        <div style={{justifyContent:"center", display:"flex", marginBottom:"25px"}}>
          <Button sx={{
            backgroundColor: "var(--warmGrey)",
            color: "var(--white)",
            transition: "transform",
            "&:hover": {
              backgroundColor: "var(--red)",
              transform: "scale(1.03)",
            },
            width: "fit-content",
          }}
          onClick={handleClick}>

            New Leave Request
          </Button>
        </div>
        <Paper sx={{ width: "100ch", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table classname="striped custom-table">

              <TableHead>
                <TableRow >
                  <TableCell sx={{ backgroundColor: "var(--warmGrey)", color: "var(--white)" }}>LeaveType</TableCell>
                  <TableCell sx={{ backgroundColor: "var(--warmGrey)", color: "var(--white)" }}>LeaveReason</TableCell>
                  <TableCell sx={{ backgroundColor: "var(--warmGrey)", color: "var(--white)" }}>Status</TableCell>
                  <TableCell sx={{ backgroundColor: "var(--warmGrey)", color: "var(--white)" }}>LeaveDate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(leave) && leave.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="4" className="text-center">
                      <strong>No leave data found</strong>
                    </TableCell>
                  </TableRow>
                ) : (
                  leave.map((leave, index) => (
                    <TableRow key={index}>
                      <TableCell>{leave.leaveType}</TableCell>
                      <TableCell>{leave.leaveReason}</TableCell>
                      <TableCell>{leave.status}</TableCell>
                      <TableCell>{leave.leavedate.join(', ')}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            sx={{ backgroundColor: "rgb(114, 108, 108)", color: "#fff" }}
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={totalPages * rowsPerPage}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
    </div>
  );
}

export default GetEmpLeavesDetails;




