import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SellerSignin from "./SellerSignin";
import Signin from "./Signin";
import logo from "../../Assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import Category from "../HomeLayouts/Category.js";
import Navbar from "../HeaderFiles/Navbar.js";
import { Box, Button, Card, Paper, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "../MyTheme";

let MainSignin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userType = location?.state?.userType || "customer";
  const [value, setValue] = React.useState(
    userType === "seller" ? "seller" : "customer"
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Box>
        <Navbar />
        <Category />
        <Card
          sx={{
            width: "75vw",
            height: "85vh",
            margin: "0 auto",
            marginTop: "2.4vh",
            display: "flex",
            position: "relative",
          }}
        >
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.secondary.main,
              flexBasis: "35%",
            }}
          >
            <Paper
              sx={{
                backgroundColor: (theme) => theme.palette.primary.main,
                textAlign: "center",
              }}
            >
              <img
                src={logo}
                style={{
                  margin: "10%",
                }}
                width="60%"
              />
            </Paper>
            <Typography
              sx={{
                fontWeight: "600",
                fontSize: "200%",
                padding: "20px",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              You're Sigining In <br /> As
            </Typography>
            <Tabs
              value={value}
              orientation="vertical"
              onChange={handleChange}
              sx={{
                fontWeight: "600",
                "& .MuiTabs-indicator": {
                  width: "0.25rem",
                },
              }}
            >
              <Tab
                value="customer"
                label="Customer"
                sx={{
                  display: "flex",
                  width: "100%",
                  maxWidth: "500%",
                  margin: "0 auto",
                  fontWeight: "600",
                }}
              >
                {<Signin />}
              </Tab>
              <Tab
                value="seller"
                label="Seller"
                sx={{
                  display: "flex",
                  width: "100%",
                  maxWidth: "500%",
                  margin: "0 auto",
                  fontWeight: "600",
                }}
              >
                {<SellerSignin />}
              </Tab>
            </Tabs>
          </Box>
          <Box sx={{ backgroundColor: "white", flexBasis: "65%" }}>
            {value === "customer" ? <Signin /> : <SellerSignin />}
            <Box
              sx={{
                position: "absolute",
                bottom: "0",
                left: "0",
                textAlign: "right",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "600",
                  fontSize: "100%",
                  padding: "20px",
                  marginLeft: "1rem",
                  textAlign: "center",
                }}
              >
                Don't have an account?
                <Button
                  variant="text"
                  sx={{
                    fontWeight: "600",
                    marginBottom: "1.5px",
                    "&: hover": {
                      backgroundColor: (theme) => theme.palette.secondary.main,
                      color: (theme) => theme.palette.secondary.dark,
                    },
                  }}
                  onClick={() => {
                    navigate(`/signup`);
                  }}
                  disableRipple
                >
                  Sign Up
                </Button>
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default MainSignin;
