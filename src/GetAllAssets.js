import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import "react-toastify/dist/ReactToastify.css";
import ManageAsset from './ManageAsset';
import { useSelector } from 'react-redux';
import ManageUserAsset from "./ManageUserAsset";
import Divider from "@mui/material/Divider";
import ViewAssets from './ViewAssets'
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import Grid from "@mui/material/Grid";



export default function GetAllAssets() {
  const  token = useSelector((state) => state.auth.token);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);

  const [assetTypeData, setAssetTypeData] = useState([]);

  useEffect(() => {
    fetchAssetTypeData();
  }, []);

  const fetchAssetTypeData = async () => {
    try {
      setLoading(false);
      const response = await axios.get(
        `/apigateway/hrms/masterAsset/getAllAssetType`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssetTypeData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching asset type data", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch asset type data"
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginLeft:"100px",
        marginTop:"-40px"
      }}
    > 
      <Box
        gap="20px"
        display="flex"
        justifyContent="flex"
        alignItems="center"
        height="30vh"
        marginRight='5vh'
        marginLeft="20px"
        marginBottom="-50px"
      >
       <ManageAsset assetTypeData={assetTypeData} fetchAssetTypeData={fetchAssetTypeData} setAssetTypeData={setAssetTypeData}/>
       <ManageUserAsset assetTypeData={assetTypeData} fetchAssetTypeData={fetchAssetTypeData} setAssetTypeData={setAssetTypeData}/>
       </Box>
      <Divider sx={{  width: '95%', bgcolor: 'grey.700', marginBottom:'10px' , marginLeft:"20px"}} />
      <ViewAssets assetTypeData={assetTypeData} fetchAssetTypeData={fetchAssetTypeData} setAssetTypeData={setAssetTypeData}/>
      
    </div>
  );
}
