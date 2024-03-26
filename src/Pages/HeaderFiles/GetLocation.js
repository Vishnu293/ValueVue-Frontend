import { Box, Button } from "@mui/material";
import GoogleAutoComplete from "./GoogleAutoComplete";
import React, { useEffect, useState } from "react";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { useDispatch } from "react-redux";
import { selectLocation } from "../../redux/location/locationSlice";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "../MyTheme";

const GetLocation = () => {
  const dispatch = useDispatch();
  const [location, setLocation] = React.useState(null);

  const handleGeolocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const geolocation = new window.google.maps.LatLng(
            latitude,
            longitude
          );

          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: geolocation }, (results, status) => {
            if (status === "OK") {
              if (results[0]) {
                const addressComponents = results[0].address_components;
                if (
                  Array.isArray(addressComponents) &&
                  addressComponents.find
                ) {
                  const city = addressComponents.find((component) =>
                    component.types.includes("locality")
                  );
                  const state = addressComponents.find((component) =>
                    component.types.includes("administrative_area_level_1")
                  );
                  const country = addressComponents.find((component) =>
                    component.types.includes("country")
                  );

                  const formattedAddress = `${city ? city.long_name : ""}${
                    state ? `, ${state.long_name}` : ""
                  }${country ? `, ${country.long_name}` : ""}`;

                  const newLocation = {
                    description: formattedAddress,
                    lat: latitude,
                    lng: longitude,
                  };
                  console.log(newLocation)
                  setLocation(newLocation);
                  dispatch(selectLocation(newLocation));
                }
              }
            }
          });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser");
    }
  };

  const handleChangeLocation = (newLocation) => {
    setLocation(newLocation);
    dispatch(selectLocation(newLocation));
  };

  useEffect(() => {
    console.log("Location changed:", location);
  }, [location]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", position: "relative" }}>
      <ThemeProvider theme={lightTheme}>
        <GoogleAutoComplete
          location={location}
          onChangeLocation={handleChangeLocation}
        />
        <Button
          variant="contained"
          onClick={handleGeolocationClick}
          sx={{
            border: 0,
            margin: 0,
            position: "absolute",
            right: -70,
            padding: "0.7rem",
            width: "3.5vw",
            minWidth: "3vw",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
            borderRadius: "20px",
            backgroundColor: (theme) => theme.palette.primary.dark,
          }}
        >
          <MyLocationIcon
            sx={{
              color: (theme) => theme.palette.secondary.main,
              fontSize: "20px",
            }}
          />
        </Button>
      </ThemeProvider>
    </Box>
  );
};

export default GetLocation;
