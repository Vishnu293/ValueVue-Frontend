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

let MainSignup = () => {
  const [value, setValue] = React.useState("customer");
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Navbar />
      <Category />
      <Card
        sx={{
          width: "55vw",
          height: "80vh",
          margin: "auto",
          marginTop: "5vh",
          display: "flex",
          position: "relative",
        }}
      >
        <Box sx={{ backgroundColor: "gold", flex: 2 }}>
          <Paper sx={{ backgroundColor: "#0288d1" }}>
            <img
              src={logo}
              style={{
                margin: "10%",
              }}
              width="80%"
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
            sx={{ fontWeight: "600" }}
          >
            <Tab
              value="customer"
              label="Customer"
              style={{
                display: "flex",
                width: "100%",
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
                margin: "0 auto",
                fontWeight: "600",
              }}
            >
              {<SellerSignup />}
            </Tab>
          </Tabs>
        </Box>
        <Box sx={{ backgroundColor: "white", flex: 3 }}>
          {value === "customer" ? <Signup /> : <SellerSignup />}
          <div
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
                textAlign: "center",
              }}
            >
              Already have an account?
              <Button
                sx={{ fontWeight: "600", marginBottom: "1.5px" }}
                onClick={() => {
                  navigate(`/signin`);
                }}
              >
                Sign In
              </Button>
            </Typography>
          </div>
        </Box>
      </Card>
    </Box>
  );
};

export default MainSignup;
