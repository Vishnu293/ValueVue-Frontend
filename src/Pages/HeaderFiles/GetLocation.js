import { Box, Button } from "@mui/material";
import GoogleAutoComplete from "./GoogleAutoComplete";
import React, { useEffect, useState } from "react";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { useDispatch } from "react-redux";
import { selectLocation } from "../../redux/location/locationSlice";

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
  }, [location])

  return (
    <Box sx={{ display: "flex" }}>
      <GoogleAutoComplete
        location={location}
        onChangeLocation={
          handleChangeLocation
        }
      />
      <Button
        variant="contained"
        onClick={handleGeolocationClick}
        sx={{
          border: 0,
          margin: 0,
          padding: 0,
          width: "3.5vw",
          minWidth: "3vw",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
            backgroundColor: "gold",
          },
          color: "#1976d2",
          borderRadius: "10px",
          backgroundColor: "gold",
        }}
      >
        <MyLocationIcon />
      </Button>
    </Box>
  );
};

export default GetLocation;
