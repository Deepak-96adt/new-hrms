import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Card from '@mui/material/Card';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Hrmscss/VarColors.css";
import LoadingPage from './LoadingPage';

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TimeSheet = () => {
  const [checkindisable, setcheckinDisable] = useState(false);
  const [checkoutdisable, setcheckoutDisable] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [earlycheckoutdisable, setearlycheckoutDisable] = useState(false);
  const [getDate, setNewDate] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState(null);
  const [earlyReason, setEarlyReason] = useState("");
  const [earlyType, setEarlyType] = useState("");
  const [showModal, setShowModal] = useState(false); // For managing modal visibility


  // const token = localStorage.getItem("response-token");
  // const empId = localStorage.getItem("EmpID");
  const  token = useSelector((state) => state.auth.token);
  const  empId = useSelector((state) => state.auth.empId);
  const permission = useSelector((state)=>state.auth.permissions);

  const [date, setDate] = useState({
    fromDate: "",
    toDate: "",
  });
  //HRMS-94
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
     // console.log(position);
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  }, []);

  const handleOpenEarlyPopUp = () => setShowModal(true); // Function to show the modal
  const handleCloseModal = () => setShowModal(false); // Function to close the modal

  const handleEarlyCheckOut = () => {
    setLoading(true);
    axios
      .put(
        `/apigateway/payroll/timeSheet/earlyCheckOut/${empId}?Latitude=${latitude}&Longitude=${longitude}&reason=${earlyReason}&type=${earlyType}`,
        { reason: earlyReason, type: earlyType },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      )
      .then((response) => {
        toast.success(response.data, {
          position: "top-center",
          theme: "colored",
        });
        setearlycheckoutDisable(true);
        setLoading(false);
        handleCloseModal(); // Close the modal upon successful submission
      })
      .catch((error) => {
        toast.error(error.response.data.message || "Error during early checkout");
        console.log(error);
        setLoading(false);
      });
  };


  const checkIn = (e) => {
    e.preventDefault();
    setLoading(true); 
    axios.post(
        `/apigateway/payroll/timeSheet/checkIn/${empId}?Latitude=${latitude}&Longitude=${longitude}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        toast.success(response.data, {
          position: "top-center",
          theme: "colored",
        });
        setcheckinDisable(true);
        setLoading(false);
      })
      .catch((error) => {
        toast.error( error.response.data.message || "Error while checkin" );
        // alert(latitude,longitude)
        console.log(error);
        setLoading(false);
      });
  };

  const checkOut = (e) => { 
    e.preventDefault();
    setLoading(true); 
    axios
      .put(
        `/apigateway/payroll/timeSheet/checkOut/${empId}?Latitude=${latitude}&Longitude=${longitude}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        toast.success(response.data, {
          position: "top-center",
          theme: "colored",
        });
        setcheckoutDisable(true);
        setLoading(false);
      })
      .catch((error) => {
        toast.error( error.response.data.message || "Error while checkout" );
        console.log(error);
        setLoading(false);
      });
  };

  const handleClick = () => {
    setLoading(true); 
    const apiUrl = isPaused
      ? `/apigateway/payroll/timeSheet/resume/${empId}`
      : `/apigateway/payroll/timeSheet/pause/${empId}`;
    const method = isPaused ? "patch" : "put";
    axios
      .request({
        method: method,
        url: apiUrl,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setIsPaused(!isPaused);
        toast.success(response.data, {
          position: "top-center",
          theme: "colored",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error( error.response.data.message);
        setLoading(false);
      });
  };
  

  function submit(e) {
    e.preventDefault();
    setLoading(true); 
    axios
      .get(
        `/apigateway/payroll/timeSheet/empAttendence?fromDate=${date.fromDate}&toDate=${date.toDate}&empId=${empId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setNewDate(response.data);
        setGraphData(prepareGraphData(response.data)); 
        console.log(response.data);
        toast.success("Data found successfully.", {
          position: "top-center",
          theme: "colored",
          color:"#014E4E",
          bgcolor:"#014E4E"
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.response.data);
        toast.error( error.response.data.message || "Error while fetching details." );
        setLoading(false);
      });
  }

  function handle(e) {
    const newdate = { ...date };
    newdate[e.target.id] = e.target.value;
    setDate(newdate);
    console.log(newdate);
  }
 
  const prepareGraphData = (data) => {
      const dates = data.map((entry) => entry.date);
      const workingHours = data.map((entry) => {
        if(entry.workingHour){
          const [hours, minutes, seconds] = entry.workingHour.split(':').map(Number);
          const totalHours = hours + (minutes / 60) + (seconds / 3600);
          return parseFloat(totalHours.toFixed(2));
        }else{
          return 0;
        }
   });    
      return {
        labels: dates,
        datasets: [
          {
            label: 'Working Performance',
            data: workingHours,
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
          },
        ],
      };
    };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const todayDate = formatDate(new Date());

  return (
    <Container style={{width:"100vw"}}>
      {loading && <LoadingPage />}
      <Box sx={{ my: { xs: 2, sm: 3, md: 4 } }}>
        <Card variant="outlined" style={{padding:"10px 80px",marginLeft:"70px"}}
           sx={{
            boxShadow:4
          }}
        >
          <div style={{width:"auto",padding:"30px 20px"}}>
        {(permission.includes("BASIC_HRMS")) && <>
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          
          {['CHECK IN', 'CHECK OUT', isPaused ? "Play" : "Pause", 'EARLY CHECK OUT'].map((label, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Button
              id="timeSheetBtnNew"
                variant="outlined"
                fullWidth
                disabled={
                  (label === 'CHECK IN' && checkindisable) ||
                  (label === 'CHECK OUT' && checkoutdisable) ||
                  (label === 'EARLY CHECK OUT' && earlycheckoutdisable)
                }
                onClick={
                  label === 'CHECK IN' ? checkIn :
                  label === 'CHECK OUT' ? checkOut :
                  label === 'EARLY CHECK OUT' ? handleOpenEarlyPopUp :
                  handleClick
                }
                // sx={{
                //   // transition: 'all 0.3s ease',
                //   '&:hover': {
                //     backgroundColor: '#014E4E',
                //     color: 'white',
                //     borderColor: 'white', 
                //   },
                //   borderColor: 'var(--deepRed)',
                //   color:'var(--deepRed)',
                // }}

                sx={{
                  marginTop: "5%",
                  backgroundColor: "var(--red)",
                  color: "var(--white)",
                  transition: "transform",
                  borderRadius:"none",
                  "&:hover": {
                    backgroundColor: "var(--red)",
                    transform: "scale(1.03)",
                    border:"none"
                  },
                }}
              >
                {label}
              </Button>
            </Grid>
          ))}
        </Grid>

        <Grid container justifyContent="center" spacing={2} sx={{ mb: 4 }}>
          
          <Grid item xs={12} sm={6} md={4}>
          <Button
           id="timeSheetBtnNew"
            component={Link}
            to="/GetEmpLeavesDetails"
            variant="outlined"
            fullWidth
            sx={{
              marginTop: "5%",
              backgroundColor: "var(--red)",
              color: "var(--white)",
              transition: "transform",
              borderRadius:"none",
              "&:hover": {
                backgroundColor: "var(--red)",
                transform: "scale(1.03)",
                border:"none"
              },
            }}
          >
            LeaveRequest
          </Button>
        </Grid>
          
          
          <Grid item xs={12} sm={6} md={4}>
            <Button
              id="timeSheetBtnNew"
              component={Link}
              to={{
                pathname: "/PriorTimeAdj",
                state: { latitude: latitude, longitude: longitude },
              }}
              variant="outlined"
              fullWidth
              sx={{
                marginTop: "5%",
                backgroundColor: "var(--red)",
                color: "var(--white)",
                transition: "transform",
                borderRadius:"none",
                "&:hover": {
                  backgroundColor: "var(--red)",
                  transform: "scale(1.03)",
                  border:"none"
                },
              }}
            >
              Prior Time Request
            </Button>
          </Grid>
        </Grid>
        </>
         }
        <Box component="form" onSubmit={submit} sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                id="fromDate"
                label="From Date"
                type="date"
                value={date.fromDate}
                onChange={handle}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: todayDate }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                id="toDate"
                label="To Date"
                type="date"
                value={date.toDate}
                onChange={handle}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: todayDate }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button 
              sx={{
                marginTop: "5%",
                backgroundColor: "white",
                color: "var(--red)",
                border:'1px solid var(--red)',
                transition: "transform",
                borderRadius:"none",
                "&:hover": {
                  backgroundColor: "var(--red)",
                  transform: "scale(1.08)",
                  color:'white'
                },
              }} 
              type="submit" variant="contained" fullWidth>Get</Button>
            </Grid>
          </Grid>
        </Box>
        <TableContainer component={Paper} sx={{ mb: 4, overflowX: 'auto',maxHeight:'500px' }}>
          <Table sx={{ minWidth: isMobile ? 300 : 650 }} aria-label="timesheet table">
              <TableHead sx={{position:'sticky',top:0}}>
                <TableRow>
                  {['DATE', 'STATUS', 'WORKING HOUR','CHECKIN', 'CHECKOUT', 'LEAVEINTERVAL','DAY'].map((header, index) => (
                    <TableCell key={index} sx={{ whiteSpace: 'nowrap',backgroundColor: 'var(--warmGrey)',borderColor:'white',color:'white', fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
            <TableBody>
            {getDate.map((date, rowIndex) => (
                <TableRow key={rowIndex}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f5f5f5', // Change background color on hover
                    cursor: 'pointer', // Change cursor to pointer when hovering
                  },
                  transition: 'background-color 0.3s ease', // Smooth transition for background color
                }}
                >
                  {Object.entries(date).map(([key, value], cellIndex) => {
                    if (key !== 'employeeId') {
                      return (
                        <TableCell key={cellIndex} sx={{ whiteSpace: 'nowrap', fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>
                          {value}
                        </TableCell>
                      );
                    }
                    return null;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {graphData && (
          <Box sx={{ mt: 4 }}>
            <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
              Graphical Representation (Hour/Date)
            </Typography>
            <Paper elevation={3} sx={{ p: { xs: 1, sm: 2 } }}>
              <Line data={graphData} options={{ responsive: true, maintainAspectRatio: false, aspectRatio: isMobile ? 1 : 2 }} />
            </Paper>
          </Box>
        )}

        <Modal
          open={showModal}
          onClose={handleCloseModal}
          aria-labelledby="early-checkout-modal"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: { xs: 2, sm: 4 },
          }}>
            <Typography id="early-checkout-modal" variant="h6" component="h2" gutterBottom>
              Early Check Out
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="early-type-label">Type of Early Check Out</InputLabel>
              <Select
                labelId="early-type-label"
                value={earlyType}
                label="Type of Early Check Out"
                onChange={(e) => setEarlyType(e.target.value)}
              >
                <MenuItem value=""><em>Select type for early check out</em></MenuItem>
                <MenuItem value="medical reason">Medical Reason</MenuItem>
                <MenuItem value="personal reason">Personal Reason</MenuItem>
                <MenuItem value="urgent work">Urgent Work</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              sx={{ mb: 2 }}
              label="Reason for Early Check Out"
              value={earlyReason}
              onChange={(e) => setEarlyReason(e.target.value)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                onClick={() => {
                  handleEarlyCheckOut();
                  handleCloseModal();
                }} 
                variant="contained"
              >
                Request
              </Button>
            </Box>
          </Box>
        </Modal>
        </div>
        </Card>
      {/* </div> */}
      </Box>
    </Container>
  );
};

export default TimeSheet;



