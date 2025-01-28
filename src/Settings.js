import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Switch,
  Tab,
  Tabs,
} from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import MailLockIcon from "@mui/icons-material/MailLock";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("one");
  const token = useSelector((state) => state.auth.token);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const IOSSwitch = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#65C466",
          opacity: 1,
          border: 0,
          ...theme.applyStyles("dark", {
            backgroundColor: "#2ECA45",
          }),
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.grey[100],
        ...theme.applyStyles("dark", {
          color: theme.palette.grey[600],
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.7,
        ...theme.applyStyles("dark", {
          opacity: 0.3,
        }),
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: "#E9E9EA",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
      ...theme.applyStyles("dark", {
        backgroundColor: "#39393D",
      }),
    },
  }));

  const [state, setState] = React.useState({
    Email: false,
    Microsoft: false,
  });

  const handleSubmit = () => {};

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <div>
      <Box
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container>
          <Box sx={{ borderBottom: 2, borderColor: "divider", width: "100%" }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="Tabs example"
            >
              <Tab value="one" label="Security" />
              <Tab value="two" label="Others" />
            </Tabs>
          </Box>
          <Container
            sx={{
              marginLeft: "20%",
              marginTop: "10%",
            }}
          >
            {activeTab === "one" && (
              <Card
                sx={{
                  height: "auto",
                  borderRadius: "5%",
                  boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.5)",
                }}
              >
                <h3
                  style={{
                    marginLeft: "15%",
                    marginTop: "5%",
                  }}
                >
                  Enable Two Factor Authentication
                </h3>
                <Divider />
                <Container
                  sx={{
                    display: "flex",
                    marginTop: "2%",
                    gap: "20px",
                  }}
                >
                  <Card
                    sx={{
                      height: "30vh",
                      width: "30ch",
                      marginTop: "5%",
                      borderRadius: "5%",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.5)",
                      ":hover": {
                        transform: "scale(1.05)",
                        cursor: "pointer",
                      },
                      backdropFilter: "blur(4px)",
                      overflow: "hidden"
                    }}
                  >
                    <FormControl
                      component="fieldset"
                      variant="standard"
                      sx={{
                        marginLeft: "5%",
                        marginTop: "5%",
                      }}
                    >
                      <FormLabel component="legend">Email</FormLabel>
                      <FormGroup>
                        <FormControlLabel
                          sx={{
                            marginLeft: "1px",
                          }}
                          control={
                            <>
                              <MailLockIcon />
                              <Switch
                                checked={state.Email}
                                onChange={handleChange}
                                name="Email"
                              />
                            </>
                          }
                        />
                      </FormGroup>
                      <FormHelperText>
                        Turn on Email/Gmail authentication for your login security, this
                        will enable OTP based athentication while login
                      </FormHelperText>
                    </FormControl>
                  </Card>
                  <Card
                    sx={{
                      height: "30vh",
                      width: "30ch",
                      marginTop: "5%",
                      justifyContent: "center",
                      borderRadius: "5%",
                      alignItems: "center",
                      boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.5)",
                      ":hover": {
                        transform: "scale(1.05)",
                        cursor: "pointer",
                      },
                    }}
                  >
                    <FormControl
                      component="fieldset"
                      variant="standard"
                      sx={{
                        marginLeft: "5%",
                        marginTop: "5%",
                      }}
                    >
                      <FormLabel component="legend">Microsoft</FormLabel>
                      <FormGroup>
                        <FormControlLabel
                          sx={{
                            marginLeft: "1px",
                          }}
                          control={
                            <>
                              <MicrosoftIcon />
                              <Switch
                                checked={state.Microsoft}
                                onChange={handleChange}
                                name="Microsoft"
                              />
                            </>
                          }
                        />
                      </FormGroup>
                      <FormHelperText>
                        Turn on Microsoft authentication for your login security, this
                        will enable OTP based authentication while login
                      </FormHelperText>
                    </FormControl>
                  </Card>
                </Container>
                <Container sx={{display: "flex", marginBottom: "10%"
                }}>
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="success"
                    sx={{
                      marginLeft: "0%",
                      marginTop: "5%",
                      width: "inherit"
                    }}
                    disabled={
                      !state.Email&&
                      !state.Microsoft
                    }
                  >
                    Submit
                  </Button>
                </Container>
              </Card>
            )}
          </Container>
        </Container>
      </Box>
    </div>
  );
}
