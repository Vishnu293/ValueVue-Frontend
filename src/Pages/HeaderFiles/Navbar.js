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
      location.pathname === "/sellerprofile"||
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
    imageData = currentUser.data.userAvatar;
    dataUrl = `data:${
      currentUser?.data?.userAvatar?.mimetype
    };base64,${imageData?.buffer?.toString("base64")}`;
  } else if (currentSeller) {
    imageData = currentSeller.data.sellerAvatar;
    dataUrl = `data:${
      currentSeller?.data?.sellerAvatar?.mimetype
    };base64,${imageData?.buffer?.toString("base64")}`;
  }

  return (
    <div>
      <AppBar sx={{ position: "fixed" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0.5rem",
          }}
        >
          <div style={{ marginRight: "1rem" }}>
            <img
              src={logo}
              width={"135px"}
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
          </div>
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
                  "& button.Mui-selected": { color: "gold" },
                  margin: "0 auto",
                  "& button.MuiTab-root": { fontWeight: "600" },
                }}
              >
                <Tab value="one" label="Home" onClick={() => navigate("/")} />
                <Tab
                  value="two"
                  label="About"
                  onClick={() => {
                    navigate("/about");
                  }}
                />
                <Tab
                  value="three"
                  label="Contact Us"
                  onClick={() => {
                    navigate("/contact");
                  }}
                />
                {currentUser || currentSeller ? (
                  <Tab
                    value="four"
                    label="Your Profile"
                    onClick={handleNavigateToProfile}
                  />
                ) : null}
              </Tabs>
              {location.pathname !== "/signin" && location.pathname !== "/signup" && (currentUser || currentSeller) && (
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
                    backgroundColor: "gold", //#1976d2
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
                location.pathname !== "/signin" && location.pathname !== "/signup" && (
                <Button
                  variant="contained"
                  sx={{ color: "gold", marginLeft: "0 auto" }}
                  onClick={() => {
                    navigate("/signin");
                  }}
                >
                  SIGN IN
                </Button>
                )
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
