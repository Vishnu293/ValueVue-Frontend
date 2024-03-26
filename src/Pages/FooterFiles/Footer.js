import { Box, Divider, Grid, List, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "../MyTheme";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import MailIcon from "@mui/icons-material/Mail";
import GitHubIcon from "@mui/icons-material/GitHub";
import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../Assets/logo.png";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <ThemeProvider theme={lightTheme}>
      <Box sx={{ backgroundColor: "black", color: "white", padding: "2vh" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: "40%",
            margin: "0 auto",
          }}
        >
          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6} md={6} sx={{ textAlign: "left" }}>
              <Typography variant="h6">QUICK LINKS</Typography>
              <Box sx={{ marginLeft: "0.7rem" }}>
                <Typography
                  variant="body2"
                  sx={{
                    cursor: "pointer",
                    color: (theme) => theme.palette.secondary.main,
                    "&: hover": {
                      color: (theme) => theme.palette.secondary.dark,
                    },
                  }}
                  onClick={() => navigate("/")}
                >
                  Home
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    cursor: "pointer",
                    color: (theme) => theme.palette.secondary.main,
                    "&: hover": {
                      color: (theme) => theme.palette.secondary.dark,
                    },
                  }}
                  onClick={() => navigate("/about")}
                >
                  About Us
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    cursor: "pointer",
                    color: (theme) => theme.palette.secondary.main,
                    "&: hover": {
                      color: (theme) => theme.palette.secondary.dark,
                    },
                  }}
                  onClick={() => navigate("/contact")}
                >
                  Contact Us
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    cursor: "pointer",
                    color: (theme) => theme.palette.secondary.main,
                    "&: hover": {
                      color: (theme) => theme.palette.secondary.dark,
                    },
                  }}
                  onClick={() => navigate("/help")}
                >
                  Help
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={6} sx={{ textAlign: "right" }}>
              <Typography variant="h6">FOLLOW US ON</Typography>
              <Box
                sx={{
                  marginRight: "0.7rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 0.5,
                }}
              >
                <FacebookIcon
                  sx={{
                    color: (theme) => theme.palette.secondary.main,
                    cursor: "pointer",
                    fontSize: 18,
                    "&: hover": {
                      color: (theme) => theme.palette.secondary.dark,
                    },
                  }}
                  onClick={() =>
                    (window.location.href =
                      "https://www.facebook.com/Vishnu293")
                  }
                />
                <XIcon
                  sx={{
                    color: (theme) => theme.palette.secondary.main,
                    cursor: "pointer",
                    fontSize: 18,
                    "&: hover": {
                      color: (theme) => theme.palette.secondary.dark,
                    },
                  }}
                  onClick={() =>
                    (window.location.href = "https://x.com/vishnuu_here")
                  }
                />
                <MailIcon
                  sx={{
                    color: (theme) => theme.palette.secondary.main,
                    cursor: "pointer",
                    fontSize: 18,
                    "&: hover": {
                      color: (theme) => theme.palette.secondary.dark,
                    },
                  }}
                  onClick={() =>
                    (window.location.href =
                      "mailto:vishnuyadav2932002@gmail.com")
                  }
                />
                <GitHubIcon
                  sx={{
                    color: (theme) => theme.palette.secondary.main,
                    cursor: "pointer",
                    fontSize: 18,
                    "&: hover": {
                      color: (theme) => theme.palette.secondary.dark,
                    },
                  }}
                  onClick={() =>
                    (window.location.href = "https://x.com/Vishnu293")
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Divider color="white" sx={{ marginTop: "1rem" }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            marginTop: "1rem",
            gap: 2,
          }}
        >
          <img src={Logo} width="200px" />
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            Designed by Vishnu C © {new Date().getFullYear()} ValueVue, All
            rights reserved.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Footer;
