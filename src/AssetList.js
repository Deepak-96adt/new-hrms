import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
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

export default function AssetList(){
    const [loading, setLoading] = useState(true);
    const token = useSelector((state) => state.auth.token);
    const [assets, setAssets] = useState([]);
    const  EmpId = useSelector((state) => state.auth.empId);
    const [adtId,setAdtId] = useState("");
    const [emptyMessage, setEmptyMesage] = useState("");

    const fetchADTId = async()=>{
        setLoading(true);
        await axios
          .get(`/apigateway/hrms/employee/getById/${EmpId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            // console.log("---------------");
        //    console.log(response.data.adtId);
           setAdtId(response.data.adtId);
            setLoading(false); 
          })
          .catch((error) => {
            console.log(error);
            toast.error( error.response.data.message || "Error fetching details" );
            setLoading(false); 
          });
       }
      
       //------------------------
      const fetchAssets=async()=>{
        setLoading(true); 
       await axios
          .get(`apigateway/hrms/masterAsset/getAssetsDataByEmpADTId?empId=${EmpId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            console.log("----------");
            console.log(response.data.data);
            console.log("----------");
            if(response.data.data!==null){
              setAssets(response.data.data);
              setEmptyMesage("");
              setLoading(false);
            }else{
              setAssets([]);
              setEmptyMesage("Assets not yet assigned to user");
              setLoading(false);
            }
 
          })
          .catch((error) => {
            console.log(error);
            // toast.error( error.response.data.message || "Error fetching details" );
            setEmptyMesage(error.response.data.message);
            console.log(error.response.data.message);
            setLoading(false); 
          });
      }

      useEffect(() => {
       fetchADTId(); 
      },[]);

    useEffect(() => {
        if (adtId) {
            fetchAssets(adtId); // Fetch assets only when adtId is updated
          }
      }, [adtId]);

      if (loading) return <LoadingPage />;

    return(<>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell>Asset AdtId</TableCell>
              <TableCell>Asset Name</TableCell>
              <TableCell>Asset Attributes</TableCell>
              <TableCell>Asset Status</TableCell>
              <TableCell>Assigned Date</TableCell>
              <TableCell>Unassigned Date</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
          {assets.map((asset) => (  
            <TableRow>
              <TableCell>{asset.assetADTId|| "N/A"}</TableCell>
              <TableCell>{asset.assetTypeName|| "N/A"}</TableCell>
              <TableCell>
                {asset.assetAttributeMappingList
                  .filter(
                    (attr) =>
                      attr.assetAttributeValue !== null &&
                      attr.assetAttributeValue !== "null" &&
                      attr.assetAttributeValue !== "NULL" &&
                      attr.assetAttributeValue !== ""
                  )
                  .map((attr, index) => (
                    <div key={index}>
                      <strong>{attr.assetAttributeName}:</strong>
                      {attr.assetAttributeValue}
                    </div>
                  ))}
              </TableCell>
              <TableCell>{asset.assetStatus|| "N/A"}</TableCell>
              <TableCell>{asset.assetAssignedDate|| "N/A"}</TableCell>
              <TableCell>{asset.assetDeassignedDate|| "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
        <span style={{margin:"20px",fontSize:"16px"}}>{emptyMessage}</span>
      </TableContainer>
    </>)
}
