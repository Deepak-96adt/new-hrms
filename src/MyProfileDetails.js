import React, { useState, useEffect } from "react";
import { Tabs, Tab, Container, Box } from "@mui/material";
import EmpPersonalDetail from "./EmpPersonalDetail";
import EmpPayrollDetail from "./EmpPayrollDetails";
import EmpDocuments from "./EmpDocuments";
import AssetList from "./AssetList";
import { useSelector } from "react-redux";

export default function MyProfileDetails() {
  const [activeTab, setActiveTab] = useState("one");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const permission = useSelector((state) => state.auth.permissions);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
    <Container>
      <Box sx={{ borderBottom: 2, borderColor: "divider", width: "100%" }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab value="one" label="Personal Details" />
          <Tab value="two" label="Payroll Details" />
          <Tab value="three" label="Documents" />
          <Tab value="four" label="Asset List" />
        </Tabs>
      </Box>
      <Container>
        {/* Content for each tab */}
        {activeTab === "one" && <EmpPersonalDetail />}
        {activeTab === "two" && <EmpPayrollDetail />}
        {activeTab === "three" && <EmpDocuments />}
        {activeTab === "four" && <AssetList />}
      </Container>
    </Container>
  );
}
