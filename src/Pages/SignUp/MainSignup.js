import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SellerSignup from "./SellerSignup";
import Signup from "./Signup";
import logo from "../../Assets/logo.png";
import { useNavigate } from "react-router-dom";
import Category from "../HomeLayouts/Category.js";
import Navbar from "../HeaderFiles/Navbar.js";
import { Box, Button, Card, Paper, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "../MyTheme";

let MainSignup = () => {
  const [value, setValue] = React.useState("customer");
  const navigate = useNavigate();

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
              You're Sigining Up <br /> As
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
                style={{
                  display: "flex",
                  width: "100%",
                  maxWidth: "500%",
                  margin: "0 auto",
                  fontWeight: "600",
                }}
              >
                {<Signup />}
              </Tab>
              <Tab
                value="seller"
                label="Seller"
                style={{
                  display: "flex",
                  width: "100%",
                  maxWidth: "500%",
                  margin: "0 auto",
                  fontWeight: "600",
                }}
              >
                {<SellerSignup />}
              </Tab>
            </Tabs>
          </Box>
          <Box
            style={{
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
              Already have an account?
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
                  navigate(`/signin`);
                }}
              >
                Sign In
              </Button>
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "white",
              flexBasis: "65%",
              position: "relative",
              maxHeight: "100vh",
              height: "100vh"
            }}
          >
            {value === "customer" ? <Signup /> : <SellerSignup />}
          </Box>
        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default MainSignup;
