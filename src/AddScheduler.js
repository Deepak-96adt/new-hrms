import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import Alert from '@mui/material/Alert';
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
  } from "@mui/material";

export default function AddScheduler(){
  const token = useSelector((state)=>state.auth.token);
  const [schedulerName, setSchedulerName] = useState("");
  const [cronExpressionTime, setCronExpressionTime] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [successMessage,setSuccessMessage] = useState("");
  const [errorMessage,setErrorMessage] = useState("");
  const [loading,setLoading] = useState(false);

    const AddScheduler=()=>{
      console.log(schedulerName);
      console.log(cronExpressionTime);
      console.log(status);
      setLoading(true);
             axios
                  .post(`apigateway/payroll/cronScheduling/addCronScheduling`,
                    {
                      "schedulerName": schedulerName,
                      "cronExpressionTime": cronExpressionTime,
                      "schedulerStatus": status,
                    },
                    {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
                  .then((response) => {
                    setLoading(false);
                    setSuccessMessage("Added Successfully");
                    setSchedulerName("");
                    setCronExpressionTime("");
                    setStatus("");
                    setTimeout(() => {
                      setSuccessMessage("");
                    }, 5000);
                  })
                  .catch((error) => {
                    setLoading(false);
                    setErrorMessage("Error Occur");
                    setTimeout(() => {
                      setErrorMessage("");
                    }, 5000);
                  });
    }
    
    return(<>
    <div style={{display:'flex',justifyContent:'center',width:'90vw'}}>
     <Box
      sx={{
        display: 'flex',
        flexDirection:'column',
        flexWrap: 'wrap',
        '& > :not(style)': {
          width: 700,
          height: 400,
          marginTop:'20px'
        },
      }}
    >
      {(successMessage)&&
      <Alert style={{height:'50px'}} severity="success">{successMessage}</Alert>
      }
      {(errorMessage)&&
      <Alert style={{height:'50px'}} severity="error">{errorMessage}</Alert>
      }
      <h4 style={{marginTop:'40px',marginBottom:'5px',padding:'10px 20px',backgroundColor:'#d8e9f7',fontFamily:'system-ui',height:'48px'}}>Add New Scheduler</h4>
      {loading && <LoadingPage/>}
      <Paper elevation={3} sx={{padding:'50px', marginTop:'0px'}} >
       <Box marginBottom={2}>
       <input type="text" onChange={(e)=>setSchedulerName(e.target.value)} placeholder="Scheduler name" style={{borderRadius:'0px'}}/>
       </Box>
       <Box marginBottom={2}>
       <input type="text" onChange={(e)=>setCronExpressionTime(e.target.value)} placeholder="Cron expression time" style={{borderRadius:'0px'}}/>
       </Box>
       <Box marginBottom={2}>
       <select style={{borderRadius:'0px',width:'100%',height:'45px'}} onChange={(e)=>setStatus(e.target.value)}>
        <option>ACTIVE</option>
        <option>INACTIVE</option> 
       </select>
       </Box>
       <Button type="submit" variant="contained" 
          onClick={AddScheduler}
          style={{borderRadius:'0px',backgroundColor:'#ab2217',marginTop:'20px',width:'100%'}} 
          fullWidth
          >
         Add
       </Button>
       </Paper>
    </Box>
    </div>
    </>)
}
