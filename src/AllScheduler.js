import * as React from 'react';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import Alert from '@mui/material/Alert';
import "./Hrmscss/VarColors.css";

import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  MenuItem,
  Modal,
  Select,
  InputLabel,
  FormControl,
  Divider,
} from "@mui/material";

export default function AllScheduler() {
  const [data, setData] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [scheduler, setScheduler] = useState([]);
  const [schedulerName, setSchedulerName] = useState("");
  const [cronExpressionTime, setCronExpressionTime] = useState("");
  const [status, setStatus] = useState("");
  const [schedulerId, setSchedulerId] = useState("");
  const [loading, setloading] = useState(false);
  const [schedulerModal, setSchedulerModal] = useState(false);

  useEffect(() => {
    GetAllScheduler();
  }, [])

  const GetAllScheduler = async () => {
    setloading(true);
    await axios
      .get(`apigateway/payroll/cronScheduling/getAllCronScheduling`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data.data);
        setData(response.data.data);
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
      });
  }

  const DeleteScheduler = (id) => {
    var confirmation = confirm("Are you sure you want to delete?");

    if (confirmation) {
      setloading(true);
      axios
        .delete(`apigateway/payroll/cronScheduling/deleteCronSchedulingBySchedulerId/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setloading(false);
          // console.log(response.data.message);
          setSuccessMessage(response.data.message);
          setTimeout(() => {
            setSuccessMessage("");
          }, 5000);
        })
        .catch((error) => {
          //  console.log("error in deletion");
          setloading(false);
          setErrorMessage("Error in deletion");
          setTimeout(() => {
            setErrorMessage("");
          }, 5000);
        });
    }
  }

  const EditScheduler = (row) => {
    setSchedulerModal(true);


    console.log(row);
    console.log(row.schedulerStatus);
    setSchedulerId(row.schedulerId);
    setSchedulerName(row.schedulerName);
    setCronExpressionTime(row.cronExpressionTime);
    setStatus(row.schedulerStatus);
  }

  const handleCloseModal = () => {
    setSchedulerModal(false);
  }

  const UpdateScheduler = () => {
    console.log(schedulerName);
    console.log(cronExpressionTime);
    console.log(status);
    setloading(true);
    axios
      .put(`apigateway/payroll/cronScheduling/updateCronSchedulingBySchedulerId/${schedulerId}`, {}, {
        params: {
          schedulerName: schedulerName,
          cronExpressionTime: cronExpressionTime,
          schedulerStatus: status,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setloading(false);
        setSchedulerModal(false);
        console.log(response.data.message);
        setSuccessMessage(response.data.message);
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      })
      .catch((error) => {
        // setloading(false);
        console.log(error);
        // setErrorMessage("Error in deletion");
        // setTimeout(() => {
        //   setErrorMessage("");
        // }, 5000);
      });
  }

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "var(--warmGrey)",
      color: "var(--white)",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  return (<>
    <div style={{ width: '90vw', height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1
        className="Heading1"
        style={{ backgroundColor: "var(--red)", color: "var(--white)" }}
      >
        Schedulers
      </h1>
      {loading && <LoadingPage />}
      {(successMessage) &&
        <Alert style={{ height: '50px', width: '70vw', marginTop: '20px' }} severity="success">{successMessage}</Alert>
      }
      {(errorMessage) &&
        <Alert style={{ height: '50px', width: '70vw', marginTop: '20px' }} severity="error">{errorMessage}</Alert>
      }
      {/* <h4 style={{width: '70vw',marginTop:'40px',marginBottom:'5px',padding:'10px 20px',backgroundColor:'#d8e9f7',fontFamily:'system-ui'}}>Schedulers</h4> */}
      {/* <center><Typography sx={{fontSize:'25px'}}>Schedulers</Typography>
      <Divider sx={{marginBottom:'10px',width:'50%',color:'#000000',borderWidth:'2px'}}/></center> */}
      <TableContainer component={Paper} sx={{ maxHeight: '80vh', width: '70vw',marginTop:'20px' }}>
        <Table aria-label="customized table">
          <TableHead sx={{ position: 'sticky', top: '0px', backgroundColor: 'red' }}>
            <TableRow>
              <StyledTableCell sx={{ width: '60px' }}>Id</StyledTableCell>
              <StyledTableCell>Scheduler Name</StyledTableCell>
              <StyledTableCell align="">Time</StyledTableCell>
              <StyledTableCell align="">Status</StyledTableCell>
              <StyledTableCell align="">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <StyledTableRow key={row.name}>
                <StyledTableCell align="center" sx={{ width: '60px' }}>{row.schedulerId}</StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {row.schedulerName}
                </StyledTableCell>
                <StyledTableCell align="">{row.cronExpressionTime}</StyledTableCell>
                <StyledTableCell align="">{row.schedulerStatus}</StyledTableCell>
                <StyledTableCell align="">
                  <DeleteTwoToneIcon sx={{ cursor: 'pointer' }} onClick={() => DeleteScheduler(row.schedulerId)} />
                  <EditTwoToneIcon onClick={() => EditScheduler(row)} data-toggle="modal" data-target="#schedulerModal" sx={{ marginLeft: '20px', cursor: 'pointer' }} />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <Modal
        open={schedulerModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      ><Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: 600, overflowY: 'auto', padding: '20px', mt: 5, ml: 5, minHeight: '400px', borderRadius: '15px', backgroundColor: '#efefef' }}>

            <div class="modal-content">
              <div class="modal-header">
                <h5 style={{ margin: '10px' }} class="modal-title" id="exampleModalLabel">Edit Scheduler</h5>
              </div>
              <div class="modal-body">
                <Paper elevation={3} sx={{ padding: '50px' }} >
                  <Box marginBottom={2}>
                    <input type="text" disabled value={schedulerName} onChange={(e) => setSchedulerName(e.target.value)} placeholder="Scheduler name" style={{ borderRadius: '0px' }} />
                  </Box>
                  <Box marginBottom={2}>
                    <input type="text" value={cronExpressionTime} onChange={(e) => setCronExpressionTime(e.target.value)} placeholder="Cron expression time" style={{ borderRadius: '0px' }} />
                  </Box>
                  <Box marginBottom={2}>
                    <select value={status} style={{ borderRadius: '0px', width: '100%', height: '45px' }} onChange={(e) => setStatus(e.target.value)}>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </Box>
                  <Button type="submit" variant="contained"
                    onClick={UpdateScheduler}
                    style={{ borderRadius: '0px', backgroundColor: '#ab2217', marginTop: '20px', width: '100%' }}
                    fullWidth
                  >
                    Update
                  </Button>
                </Paper>
              </div>
              <div class="modal-footer">
                <button style={{ marginTop: "10px" }} onClick={() => setSchedulerModal(false)} type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>

          </Box>
        </Box>
      </Modal>


    </div>
  </>)
}
