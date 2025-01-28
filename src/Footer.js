import React from "react";
import "./Hrmscss/App.css";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--deepRed)", marginRight: 0 }}>
      <div style={{ display: "flex", marginTop: "0%", gap: "3%" }}>
        <div
          style={{
            marginTop: "2%",
            color: "var(--white)",
            width: "30%",
            marginLeft: "2%",
          }}
        >
          <h5>Alphadot Technologies</h5>
          <p>Java | SpringBoot | Microservices | Backend Development </p>
        </div>

        <div style={{ color: "var(--white)", marginTop: "2%", width: "33%" , marginLeft: "8%"}}>
          <h5>Services</h5>
          <ul style={{ listStyleType: "none", padding: "0" }}>
            <li>Application Development</li>
            <li>Technology Consulting</li>
            <li>Cloud Transformation</li>
          </ul>
        </div>
        <div style={{ marginTop: "2%", color: "var(--white)", width: "25%" }}>
          <h5>Contact Us</h5>
          <ul style={{ listStyleType: "none", padding: "0" }}>
            <li>
              <CallIcon />
              <i /> 0731-4201664{" "}
            </li>
            <li>
              <EmailIcon />
              &nbsp;
              <i />
              contact@alphadottech.com
            </li>
            <li>
              <BusinessIcon />
              <i />{" "}
              <a
                style={{ textDecoration: "none", color: "white" }}
                href="https://maps.app.goo.gl/sKVWHZgcjQX1dFNs8"
              >
                Ground Floor, Left Wing, MPSEDC STP Building, Electronic
                Complex, Sukhlia, Indore, Madhya Pradesh 452003
              </a>
            </li>
          </ul>
        </div>
      </div>
      <center>
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            color: "var(--white)",
          }}
        >
          © 2022 Copyright:
          <a style={{ textDecoration: "none" }}> Alphadot Technologies</a>
        </div>
      </center>
    </footer>
  );
}
