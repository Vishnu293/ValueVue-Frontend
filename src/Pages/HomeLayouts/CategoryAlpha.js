import { Box, Card, Tabs, Tab, Button, Divider, Paper } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "../MyTheme";

const CategoryAlpha = () => {
  const navigate = useNavigate();
  return (
    <ThemeProvider theme={lightTheme}>
      <Paper
        sx={{
          height: "fit-content",
          marginTop: "0.1rem",
          backgroundColor: (theme) => theme.palette.secondary.main,
          position: "fixed",
          zIndex: 2,
        }}
      >
        <Tabs sx={{ display: "flex", width: "100vw", alignItems: "center" }}>
          <Tab
            label="Electronics"
            sx={{
              color: "black",
              fontSize: "12px",
              fontWeight: "600",
              width: "16.6vw",
              "&: hover": {
                color: (theme) => theme.palette.primary.main,
              }
            }}
            onClick={() => navigate("/electronics")}
          />
          <Tab
            label="Grocery and Food"
            sx={{
              color: "black",
              fontSize: "12px",
              fontWeight: "600",
              width: "16.6vw",
              "&: hover": {
                color: (theme) => theme.palette.primary.main,
              }
            }}
            onClick={() => navigate("/groceryandfood")}
          />
          <Tab
            label="Beauty and Personal Care"
            sx={{
              color: "black",
              fontSize: "12px",
              fontWeight: "600",
              width: "16.6vw",
              "&: hover": {
                color: (theme) => theme.palette.primary.main,
              }
            }}
            onClick={() => navigate("/beautyandpersonalcare")}
          />
          <Tab
            label="Health and Wellness"
            sx={{
              color: "black",
              fontSize: "12px",
              fontWeight: "600",
              width: "16.6vw",
              "&: hover": {
                color: (theme) => theme.palette.primary.main,
              }
            }}
            onClick={() => navigate("/healthandwellness")}
          />
          <Tab
            label="Office and Stationery"
            sx={{
              color: "black",
              fontSize: "12px",
              fontWeight: "600",
              width: "16.6vw",
              "&: hover": {
                color: (theme) => theme.palette.primary.main,
              }
            }}
            onClick={() => navigate("/officeandstationery")}
          />
          <Tab
            label="Others"
            sx={{
              color: "black",
              fontWeight: "600",
              fontSize: "12px",
              width: "16.6vw",
              "&: hover": {
                color: (theme) => theme.palette.primary.main,
              }
            }}
            onClick={() => navigate("/others")}
          />
        </Tabs>
      </Paper>
    </ThemeProvider>
  );
};

export default CategoryAlpha;
