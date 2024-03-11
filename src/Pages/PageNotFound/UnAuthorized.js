import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import Loading from "../Loading";

const UnAuthorized = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const delay = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(delay);
  }, []);

  const handleNavigateSignin = () => {
    navigate("/signin");
  };

  if (loading) {
    return <Loading />;
  }

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
        <b style={{ fontSize: "1200%" }}>401</b>
      </Typography>
      <Typography sx={{ textAlign: "center" }}>
        <b style={{ fontSize: "180%" }}>Unauthorized Access</b>
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
          You are not authorized to view this page. <br /> Go to sign in page,
          by clicking below.
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
          onClick={handleNavigateSignin}
        >
          Sign in
        </Button>
      </Box>
    </Box>
  );
};
export default UnAuthorized;
