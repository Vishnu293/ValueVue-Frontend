import React, { useEffect, useState } from "react";
import logo from "../../Assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Tabs,
  Tab,
  Button,
  Toolbar,
  useMediaQuery,
  useTheme,
  Avatar,
  Box,
  Paper,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "../MyTheme";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import Drawerbar from "./Drawerbar";
import { useSelector } from "react-redux";
import GetLocation from "./GetLocation";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState("one");
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  const { currentUser } = useSelector((state) => state.user);
  const { currentLocation } = useSelector((state) => state.location);
  const { currentSeller } = useSelector((state) => state.seller);
  const [currentPage, setCurrentPage] = useState(window.location.href);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setValue("one");
    } else if (location.pathname === "/about") {
      setValue("two");
    } else if (location.pathname === "/contact") {
      setValue("three");
    } else if (
      location.pathname === "/userprofile" ||
      location.pathname === "/sellerprofile" ||
      location.pathname === "/userprofile/edit" ||
      location.pathname === "/sellerprofile/edit"
    ) {
      setValue("four");
    }
  }, [location.pathname]);

  const handleNavigateToProfile = () => {
    setValue(currentUser || currentSeller ? "four" : "one");
    navigate(currentUser ? "/userprofile" : "/sellerprofile");
  };

  let imageData;
  let dataUrl;
  if (currentUser) {
    imageData = currentUser?.data?.userAvatar;
    dataUrl = `data:${
      currentUser?.data?.userAvatar?.mimetype
    };base64,${imageData?.buffer?.toString("base64")}`;
  } else if (currentSeller) {
    imageData = currentSeller?.data?.sellerAvatar;
    dataUrl = `data:${
      currentSeller?.data?.sellerAvatar?.mimetype
    };base64,${imageData?.buffer?.toString("base64")}`;
  }

  return (
    <ThemeProvider theme={lightTheme}>
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
        }}
      >
        <AppBar sx={{ position: "fixed" }}>
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.5rem",
              backgroundColor: (theme) => theme.palette.primary.main,
            }}
          >
            <Box style={{ marginRight: "1rem" }}>
              <img
                src={logo}
                width={"135px"}
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              />
            </Box>
            {currentUser ? (
              currentPage.length === 22 ? (
                <GetLocation />
              ) : (
                ""
              )
            ) : null}
            {isMatch ? (
              <>
                <Drawerbar />
              </>
            ) : (
              <>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  textColor=""
                  sx={{
                    "& button.Mui-selected": {
                      color: (theme) => theme.palette.secondary.main,
                    },
                    margin: "0 auto",
                    "& button.MuiTab-root": {
                      fontWeight: (theme) => theme.typography.fontWeightBold,
                      fontSize: "12px",
                      letterSpacing: "1px",
                    },
                  }}
                >
                  <Tab
                    value="one"
                    label="Home"
                    onClick={() => navigate("/")}
                    disableRipple
                  />
                  <Tab
                    value="two"
                    label="About"
                    onClick={() => {
                      navigate("/about");
                    }}
                    disableRipple
                  />
                  <Tab
                    value="three"
                    label="Contact Us"
                    onClick={() => {
                      navigate("/contact");
                    }}
                    disableRipple
                  />
                  {currentUser || currentSeller ? (
                    <Tab
                      value="four"
                      label="Your Profile"
                      onClick={handleNavigateToProfile}
                      disableRipple
                    />
                  ) : null}
                </Tabs>
                {location.pathname !== "/signin" &&
                  location.pathname !== "/signup" &&
                  (currentUser || currentSeller) && (
                    <Box sx={{ marginRight: "60px" }}>
                      <Paper
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "10px",
                          gap: 1.2,
                          borderRadius: "20px",
                          fontWeight: "500",
                          backgroundColor: (theme) =>
                            theme.palette.secondary.main,
                        }}
                      >
                        <LocationCityIcon />
                        {currentUser
                          ? currentUser?.data?.userCity
                          : currentSeller?.data?.sellerCity}
                      </Paper>
                    </Box>
                  )}
                {currentUser || currentSeller ? (
                  <Avatar
                    src={dataUrl}
                    onClick={handleNavigateToProfile}
                    sx={{ cursor: "pointer" }}
                  />
                ) : (
                  location.pathname !== "/signin" &&
                  location.pathname !== "/signup" && (
                    <Button
                      variant="text"
                      sx={{
                        marginLeft: "0 auto",
                        color: "white",
                        fontWeight: (theme) => theme.typography.fontWeightBold,
                        fontSize: "12px",
                        letterSpacing: "1px",
                        padding: "10px",
                        border: "0px",
                        "&:hover": {
                          color: (theme) => theme.palette.primary.main,
                          backgroundColor: (theme) =>
                            theme.palette.secondary.main,
                        },
                      }}
                      onClick={() => {
                        navigate("/signin");
                      }}
                      disableRipple
                    >
                      Sign In
                    </Button>
                  )
                )}
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
};

export default Navbar;
