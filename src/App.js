import React from "react";
import Approuter from "./Approuter";
import { ToastContainer } from "react-toastify";
import useInactivityLogout from "./useInactivityLogout";
import "./Hrmscss/App.css";
export default function App() {
  useInactivityLogout(900000);
  return (
    <div className="App">
      <Approuter></Approuter>
      <ToastContainer />
    </div>
  );
}
