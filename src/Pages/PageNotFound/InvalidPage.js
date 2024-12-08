import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

const InvalidPage = () => {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography sx={{ textAlign: "center", lineHeight: 1.2 }}>
        <b style={{ fontSize: "1200%" }}>404</b>
      </Typography>
      <Typography sx={{ textAlign: "center" }}>
        <b style={{ fontSize: "180%" }}>Page Not Found</b>
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body3"
          color="text.secondary"
          gutterBottom
          sx={{ marginTop: "5vh", textAlign: "center", fontSize: "110%" }}
        >
          Oops, Invalid URL Address... <br />
          The page you are trying to access can't be reached.
        </Typography>
        <Button
          variant="contained"
          sx={{
            fontWeight: "600",
            marginTop: "2vh",
            "&:hover": {
              color: "gold",
            },
          }}
          onClick={handleNavigateHome}
        >
          Back To Home
        </Button>
      </Box>
    </Box>
  );
};
export default InvalidPage;
