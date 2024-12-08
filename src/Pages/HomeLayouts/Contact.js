import React, { useState, useRef, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "../MyTheme";
import emailjs from "@emailjs/browser";
import {
  Button,
  Card,
  TextField,
  Box,
  FormControl,
  Grid,
  Typography,
} from "@mui/material";
import Navbar from "../HeaderFiles/Navbar";
import { Category } from "@mui/icons-material";

const Contact = () => {
  const form = useRef();
  const firstInputRef = useRef();

  useEffect(() => {
    firstInputRef.current.focus();
  }, []);

  const [formData, setFormData] = useState({
    your_name: "",
    your_email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_k8i6b5v",
        "template_2jryl28",
        e.target,
        "ng7iZ0vBtaazy-ind",
        { from_email: formData.your_email }
      )
      .then(
        (result) => {
          console.log(result.text);
          alert("Mail Sent Successfully");
          setFormData({
            your_name: "",
            your_email: "",
            message: "",
          });
          window.scrollTo(0, 0);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <Box>
      <ThemeProvider theme={lightTheme}>
        <Navbar />
        <Category />
        <Card
          sx={{
            height: "85vh",
            width: "98vw",
            backgroundColor: "white",
            padding: "1.5rem",
            margin: "0 auto",
            marginTop: "10vh",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: "1.5rem",
              fontWeight: (theme) => theme.typography.fontWeightBold,
            }}
          >
            Contact Us
          </Typography>
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <FormControl
              onSubmit={sendEmail}
              component="form"
              className="contactform"
            >
              <Grid
                container
                spacing={3}
                alignItems="center"
                justifyContent="flex-start"
                sx={{
                  width: "80%",
                  margin: "1rem auto",
                  textAlign: "center",
                }}
              >
                <Grid item xs={12}>
                  <TextField
                    label="Enter Your Name"
                    fullWidth
                    required
                    name="your_name"
                    value={formData.your_name}
                    onChange={handleChange}
                    inputRef={firstInputRef}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Enter Your Email"
                    fullWidth
                    required
                    name="your_email"
                    value={formData.your_email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Enter Information"
                    variant="outlined"
                    multiline
                    width="400px"
                    rows={8}
                    fullWidth
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      marginTop: "1rem",
                      fontSize: "14px",
                      fontWeight: (theme) => theme.typography.fontWeightBold,
                      backgroundColor: (theme) => theme.palette.secondary.main,
                      color: (theme) => theme.palette.primary.main,
                      "&: hover": {
                        color: "white",
                        backgroundColor: (theme) =>
                          theme.palette.secondary.dark,
                      },
                    }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </FormControl>
          </Box>
        </Card>
      </ThemeProvider>
    </Box>
  );
};

export default Contact;
