import { Card, Box, Typography, Divider, Button } from "@mui/material";
import React, { useRef, useState } from "react";
import Logo from "../../Assets/logo.png";
import QRCode from "react-qr-code";
//import QRCode from "qrcode.react";
import html2canvas from "html2canvas";

const SellerQR = ({ sellerId, sellerName, dataUrl }) => {
  const qrCodeUrl = `https://valuevue.in/seller/details/${sellerId}`;

  const cardRef = useRef(null);
  const downloadImage = () => {
    html2canvas(cardRef.current, {
      scale: 10,
    }).then(function (canvas) {
      var link = document.createElement("a");
      link.download = "QRCode.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 auto",
        marginBottom: "1rem",
      }}
    >
      <Card
        ref={cardRef}
        sx={{
          width: "360px",
          height: "800px",
          margin: "0 auto",
          backgroundColor: "#1e88e5",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
          }}
        >
          <img
            src={Logo}
            width={"250px"}
            style={{ padding: "2rem 0 1rem 0" }}
          />
          <Box
            sx={{
              backgroundColor: "gold",
              padding: "1.5rem 0 2rem 0",
              borderRadius: "5%",
              width: "90%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  maxWidth: "250px",
                  textAlign: "center",
                }}
              >
                <b style={{ fontSize: "24px" }}>{sellerName}</b>
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                backgroundColor: "white",
                borderRadius: "10%",
                paddingTop: "1.5rem",
                paddingBottom: "2rem",
                margin: "0 auto",
                marginTop: "1rem",
                width: "250px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "15px",
                }}
              >
                To view our products
              </Typography>
              <QRCode value={qrCodeUrl} size={180} />
              <Typography
                sx={{
                  fontSize: "15px",
                }}
              >
                SCAN THIS
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            gap: 0.5,
            backgroundColor: "white",
            position: "absolute",
            bottom: 0,
            paddingBottom: "1.5rem",
            paddingTop: "1.5rem",
          }}
        >
          <Typography
            sx={{
              fontSize: "15px",
            }}
          >
            Powered by:
          </Typography>
          <img src={Logo} width={"120px"} />
        </Box>
      </Card>
      <Button
        variant="contained"
        color="primary"
        onClick={downloadImage}
        sx={{
          marginTop: "1rem",
          "&:hover": {
            color: "gold",
          },
          fontWeight: "600"
        }}
      >
        Download
      </Button>
    </Box>
  );
};

export default SellerQR;
