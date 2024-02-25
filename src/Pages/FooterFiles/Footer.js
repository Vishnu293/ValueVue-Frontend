import { Box, Divider, Grid, List, Typography } from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import MailIcon from '@mui/icons-material/Mail';
import GitHubIcon from '@mui/icons-material/GitHub';
import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../Assets/logo.png"

const Footer = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{backgroundColor: "black", color: "white", padding: "2vh"}}>
      <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "40%", margin: "0 auto"}}>
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} >
          <Grid item xs={6} md={6} sx={{textAlign: "left"}}>
            <Typography variant="h6">Quick Links</Typography>
            <div style={{color: "gold", marginLeft: "0.7rem"}}>
              <Typography variant="body2" sx={{cursor: "pointer"}} onClick={() => navigate("/")}>Home</Typography>
              <Typography variant="body2" sx={{cursor: "pointer"}} onClick={() => navigate("/about")}>About Us</Typography>
              <Typography variant="body2" sx={{cursor: "pointer"}} onClick={() => navigate("/contact")}>Contact Us</Typography>
              <Typography variant="body2" sx={{cursor: "pointer"}} onClick={() => navigate("/help")}>Help</Typography>
            </div>
          </Grid>
          <Grid item xs={6} md={6} sx={{textAlign: "right"}}>
          <Typography variant="h6">Follow Us on</Typography>
            <div style={{ color: "gold", marginRight: "0.7rem", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3}}>
              <FacebookIcon sx={{cursor: "pointer", fontSize: 18}} onClick={() => window.location.href = 'https://www.facebook.com/Vishnu293'}/>
              <XIcon sx={{cursor: "pointer", fontSize: 18}} onClick={() => window.location.href = 'https://x.com/vishnuu_here'}/>
              <MailIcon sx={{cursor: "pointer", fontSize: 18}} onClick={() => window.location.href = 'mailto:vishnuyadav2932002@gmail.com'}/>
              <GitHubIcon sx={{cursor: "pointer", fontSize: 18}} onClick={() => window.location.href = 'https://x.com/Vishnu293'}/>
            </div>
          </Grid>
        </Grid>
      </Box>
      <Divider color="white" sx={{marginTop: "1rem"}}/>
      <Box sx={{textAlign: "center"}}>
        <img src={Logo} width="200px"/>
      </Box>
      <Box>
      <Typography variant="body2" sx={{textAlign: "center"}}>
          Designed by Vishnu C © {new Date().getFullYear()} ValueVue. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
