import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Logo from "../../Assets/logo.png";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const AccessDialog = ({ open, handleClose }) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    // Handle sign in action
    navigate("/signin");
  };

  const handleSignUp = () => {
    // Handle sign up action
    navigate("/signup");
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={Logo}
            width="200px"
            style={{
              marginBottom: "1rem",
            }}
          />
          <b>
            You need to sign in to our website to view or access products near
            you.
          </b>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleClose} sx={{ fontWeight: "600" }}>
          Cancel
        </Button>
        <Button onClick={handleSignIn} sx={{ fontWeight: "600" }}>
          Sign In
        </Button>
        <Button onClick={handleSignUp} sx={{ fontWeight: "600" }}>
          Sign Up
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AccessDialogWrapper = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDialogOpen(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ backgroundColor: "#f0f0f0" }}>
      <AccessDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
      />
    </Box>
  );
};

export default AccessDialogWrapper;
