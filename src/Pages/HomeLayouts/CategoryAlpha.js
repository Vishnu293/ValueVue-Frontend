import { Box, Card, Tabs, Tab, Button, Divider, Paper } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const CategoryAlpha = () => {
    const navigate = useNavigate();
  return (
    <Paper sx={{height: "3rem", marginTop: "0.1rem", backgroundColor: "gold", position: "fixed", zIndex: 1}}>
      <Tabs sx={{ display: "flex", width: "100vw", alignItems: "center" }}>
        <Tab label="Electronics" sx={{ color: "black", fontWeight: "600", marginLeft: "0px", width: "16.6vw" }} onClick={() => navigate("/electronics")}/>
        <Tab label="Grocery and Food" sx={{ color: "black", fontWeight: "600", width: "16.6vw" }} onClick={() => navigate("/groceryandfood")}/>
        <Tab label="Beauty and Personal Care" sx={{ color: "black", fontWeight: "600", width: "16.6vw" }} onClick={() => navigate("/beautyandpersonalcare")}/>
        <Tab label="Health and Wellness" sx={{ color: "black", fontWeight: "600", width: "16.6vw" }} onClick={() => navigate("/healthandwellness")}/>
        <Tab label="Office and Stationery" sx={{ color: "black", fontWeight: "600", width: "16.6vw" }} onClick={() => navigate("/officeandstationery")}/>
        <Tab label="Others" sx={{ color: "black", fontWeight: "600", marginRight: "10px", width: "16.6vw" }} onClick={() => navigate("/others")}/>
      </Tabs>
    </Paper>
  )
}

export default CategoryAlpha
