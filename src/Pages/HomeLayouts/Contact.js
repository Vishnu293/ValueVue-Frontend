import React, { useRef } from "react";
import "./Contact.css";
import emailjs from "@emailjs/browser";
import { Button, Card, TextField, Box } from "@mui/material";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import Navbar from "../HeaderFiles/Navbar";
import { Category } from "@mui/icons-material";

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_k8i6b5v",
        "template_2jryl28",
        form.current,
        "ng7iZ0vBtaazy-ind"
      )
      .then(
        (result) => {
          console.log(result.text);
          alert("Mail Sent Successfully");
          form.current.reset();
          window.scrollTo(0, 0);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <>
    <Box>
      <Navbar/>
      <Category/>
      <Card
        sx={{
          backgroundColor: "white",
          padding: "20px",
          margin: "15px",
          marginTop: "9vh"
        }}
      >
        <h1 className="contact-me">Contact Us</h1>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
            margin: "15px auto",
          }}
        >
          <div className="contact" id="Contact">
            <div className="cont-container">
              <form ref={form} onSubmit={sendEmail} className="contactform">
                <input
                  placeholder="Enter Your Name"
                  name="your_name"
                  className="contactinput"
                />
                <input
                  placeholder="Enter Your E-Mail"
                  name="your_email"
                  className="contactinput"
                />
                <textarea
                  placeholder="Enter Your Information"
                  width="400px"
                  name="message"
                  className="contactinput"
                />
                <Button
                  type="submit"
                  variant="contained"
                  value="send"
                  className="contactbtn"
                >
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Card>
    </Box>
    </>
  );
};

export default Contact;
