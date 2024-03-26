import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import parse from "autosuggest-highlight/parse";
import { debounce } from "@mui/material/utils";
import { useDispatch, useSelector } from "react-redux";
import { selectLocation } from "../../redux/location/locationSlice";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "../MyTheme";

const GOOGLE_MAPS_API_KEY = "AIzaSyC-7H1dWirXia_4m4I2drN1ID9SVFIE3Sk";
//AIzaSyC-7H1dWirXia_4m4I2drN1ID9SVFIE3Sk
//AIzaSyCNAFWcEGz59qyWo9-UU2VhDVriQJdpDlM

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };

export default function GoogleAutoComplete({ location, onChangeLocation }) {
  const [value, setValue] = React.useState(location);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const loaded = React.useRef(false);
  const dispatch = useDispatch();
  const selectedLocation = useSelector((state) => state.location);
  const selectedUser = useSelector((state) => state.user);
  //console.log("uuuuuuuuuuuuuu",selectedUser?.currentUser?.data?.userCords[0])
  const newLocation = {
    description: selectedUser?.currentUser?.data?.userCity,
    lat: selectedUser?.currentUser?.data?.userCords[0],
    lng: selectedUser?.currentUser?.data?.userCords[1],
  };

  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#google-maps")) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
        document.querySelector("head"),
        "google-maps"
      );
    }
    loaded.current = true;
  }

  const fetch = React.useMemo(
    () =>
      debounce((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 400),
    []
  );

  const handleSelect = async (selectedValue) => {
    if (
      selectedValue &&
      typeof selectedValue === "object" &&
      selectedValue.description
    ) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { address: selectedValue.description },
        (results, status) => {
          if (status === "OK" && results && results.length > 0) {
            const { lat, lng } = results[0].geometry.location;
            onChangeLocation({
              description: selectedValue.description,
              lat: lat(),
              lng: lng(),
            });
          } else {
            console.error("Error converting address to coordinates:", status);
          }
        }
      );
    } else {
      onChangeLocation(selectedValue);
    }
    dispatch(selectLocation(selectedValue));
  };

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }
    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }
    const autocompleteOptions = {
      input: inputValue,
      componentRestrictions: { country: "IN" },
    };

    fetch(autocompleteOptions, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }
        if (results) {
          newOptions = [...newOptions, ...results];
        }
        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  React.useEffect(() => {
    setValue(location);
  }, [location]);

  React.useEffect(() => {
    if (selectedLocation === null) {
      setValue(null);
      setInputValue("");
    }
  }, [selectedLocation]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      dispatch(selectLocation(newLocation));
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dispatch]);

  return (
    <ThemeProvider theme={lightTheme}>
      <Autocomplete
        id="google-map-demo"
        sx={{ width: 400 }}
        disableUnderline
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.description
        }
        filterOptions={(x) => x}
        options={options}
        autoComplete
        includeInputInList
        filterSelectedOptions
        value={value}
        noOptionsText="No locations"
        onChange={(event, newValue) => {
          setOptions(newValue ? [newValue, ...options] : options);
          setValue(newValue);
          dispatch(selectLocation(newValue));
          handleSelect(newValue);
          onChangeLocation(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
          if (newInputValue === "") {
            onChangeLocation(null);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Add a Location"
            variant="outlined"
            fullWidth
            InputLabelProps={{
              style: {
                color: "gold",
                fontWeight: "600",
                fontSize: "13px",
              },
            }}
            sx={{
              "& input": {
                color: "white",
                fontSize: "13px",
                height: 14,
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "transparent",
                  borderRadius: "10px",
                },
                "&:hover fieldset": {
                  borderColor: "transparent",
                },
              },
              backgroundColor: (theme) => theme.palette.primary.dark,
              borderRadius: "10px",
              width: "100%",
              marginLeft: "5rem",
            }}
          />
        )}
        renderOption={(props, option) => {
          const matches =
            option.structured_formatting?.main_text_matched_substrings || [];

          const parts = parse(
            option.structured_formatting?.main_text,
            matches.map((match) => [match.offset, match.offset + match.length])
          );

          return (
            <li key={option.uniqueIdentifier} {...props}>
              <Grid container alignItems="center">
                <Grid item sx={{ display: "flex", width: 44 }}>
                  <LocationOnIcon sx={{ color: "text.secondary" }} />
                </Grid>
                <Grid
                  item
                  sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
                >
                  {parts.map((part, index) => (
                    <Box
                      key={index}
                      component="span"
                      sx={{ fontWeight: part.highlight ? "bold" : "regular" }}
                    >
                      {part.text}
                    </Box>
                  ))}
                  <Typography variant="body2" color="text.secondary">
                    {option.structured_formatting?.secondary_text || ""}
                  </Typography>
                </Grid>
              </Grid>
            </li>
          );
        }}
      />
    </ThemeProvider>
  );
}
