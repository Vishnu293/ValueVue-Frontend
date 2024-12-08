import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "../MyTheme";
import React from "react";
import Logo from "../../Assets/logo.png";
import Navbar from "../HeaderFiles/Navbar";
import { Category } from "@mui/icons-material";

const About = () => {
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
            About Us
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardMedia>
              <img src={Logo} width={"300px"} />
            </CardMedia>
            <Typography
              variant="h1"
              sx={{
                fontWeight: "bold",
                fontSize: "2rem",
                textAlign: "center",
                marginTop: "1rem",
              }}
            >
              Welcome to ValueVue
            </Typography>
            <Typography>
              <br />
              We understand the pulse of the modern consumer, and ValueVue is
              tailored to meet your contemporary shopping needs with
              unparalleled convenience and affordability.
              <br />
              🌐 Discover, Compare, and Save ValueVue empowers registered
              customers to effortlessly discover the best prices for their
              desired products. Our platform goes beyond by helping users
              compare prices across nearby shops in real-time, ensuring informed
              purchasing decisions. No more guesswork—just clear and concise
              information at your fingertips.
              <br />
              📍 Locate Nearby Shops with Ease, ValueVue identifies your current
              location, providing instant access to the nearest shops offering
              the products you're searching for. It's about convenience—find
              what you need, where you need it, effortlessly.
              <br />
              🔒 Personalized Experience with Robust Authentication Enjoy a
              personalized experience with ValueVue's robust authentication
              system. It's about creating a seamless and secure environment for
              both consumers and businesses.
              <br />
              🚀 Dynamic and Responsive Interface Navigate effortlessly through
              product listings, compare prices, and locate nearby shops with our
              user-friendly interface prioritizing simplicity and efficiency.
              <br />
              🔄 Ensures real-time updates of product prices and shop locations.
              Stay informed with the latest and most accurate information during
              your search—because we believe in keeping you updated.
              <br />
              🛒 Transforming the Shopping Experience ValueVue transforms the
              traditional shopping experience by offering a tool for informed
              decisions based on price and proximity. Simultaneously, it
              provides shop owners with increased visibility and engagement.
              Bridging the digital gap between consumers and local businesses,
              ValueVue emerges as a comprehensive solution for today's dynamic
              retail landscape.
              <br />
              <br />
              Embark on a new era of shopping with ValueVue—where convenience,
              information, and affordability converge for a seamless and
              empowered consumer journey. Join us now on this exciting venture
              and redefine the way you shop!
            </Typography>
          </Box>
        </Card>
      </ThemeProvider>
    </Box>
  );
};

export default About;
