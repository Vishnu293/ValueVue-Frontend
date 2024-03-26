import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  TextField,
  Icon,
  Typography,
  InputAdornment,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "../MyTheme";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const YOUR_API_KEY = "AIzaSyC-7H1dWirXia_4m4I2drN1ID9SVFIE3Sk";

function loadScript(src, position, id) {
  return new Promise((resolve, reject) => {
    if (!position) {
      reject(new Error("Invalid position"));
      return;
    }

    const script = document.createElement("script");
    script.setAttribute("async", "");
    script.setAttribute("id", id);
    script.src = src;

    script.onload = resolve;
    script.onerror = reject;

    position.appendChild(script);
  });
}

const Signup = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [openAddress, setOpenAddress] = useState(false);
  const [userCordsPassed, setUserCordsPassed] = useState(false);
  const [signUpClicked, setSignUpClicked] = useState(false);
  const [getLocationClicked, setGetLocationClicked] = useState(false);

  const formik = useFormik({
    initialValues: {
      userName: "",
      userMobile: "",
      userEmail: "",
      userPassword: "",
      userCPassword: "",
      userDoor: "",
      userStreet: "",
      userCity: "",
      userDistrict: "",
      userState: "",
      userCountry: "",
      userZipCode: "",
      userCords: {
        lat: "",
        lng: "",
      },
    },
    validationSchema: Yup.object({
      userName: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required("Username Required !"),
      userMobile: Yup.number()
        .typeError("Mobile must be a number")
        .required("Mobile Number Required !")
        .test(
          "len",
          "Must be exactly 10 digits",
          (val) => val && val.toString().length === 10
        ),
      userEmail: Yup.string()
        .email("Invalid email address")
        .required("Email Required !"),
      userPassword: Yup.string()
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
          "Password must contain at least 6 characters, one uppercase letter, one lowercase letter, one number and one special character"
        )
        .required("Password Required !"),
      userCPassword: Yup.string()
        .oneOf([Yup.ref("userPassword"), null], "Passwords must match")
        .required("Confirm Password Required !"),
      userDoor: Yup.string().required("Door Required !"),
      userStreet: Yup.string().required("Street Required !"),
      userCity: Yup.string().required("City Required !"),
      userDistrict: Yup.string().required("District Required !"),
      userState: Yup.string().required("State Required !"),
      userCountry: Yup.string().required("Country Required !"),
      userZipCode: Yup.number()
        .typeError("Zip Code must be a number")
        .required("Zipcode Required !"),
      userCords: Yup.object().shape({
        lat: Yup.number().optional(),
        lng: Yup.number().optional(),
      }),
    }),
  });

  const convertAddressToLatLng = async () => {
    const fullAddress = `${formik.values.userDoor}, ${formik.values.userStreet}, ${formik.values.userCity}, ${formik.values.userState}, ${formik.values.userDistrict}, ${formik.values.userCountry}`;
    console.log("Full Address:", fullAddress);
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          fullAddress
        )}&key=${YOUR_API_KEY}`
      );
      const results = response.data.results;
      console.log(results);
      if (results.length > 0) {
        const location = results[0].geometry.location;
        console.log(location);
        console.log(formik);
        const latitude = location.lat;
        const longitude = location.lng;
        console.log(parseFloat(latitude));
        formik.setFieldValue("userCords.lat", parseFloat(latitude));
        formik.setFieldValue("userCords.lng", parseFloat(longitude));
      }
      setUserCordsPassed(true);
    } catch (error) {
      console.error("Error converting address to coordinates:", error);
    }
  };

  useEffect(() => {
    const cityInput = document.getElementById("userCity");

    if (cityInput && window.google && window.google.maps) {
      console.log("Autocomplete: Initializing...");
      const autocomplete = new window.google.maps.places.Autocomplete(
        cityInput,
        {
          types: ["(cities)"],
          componentRestrictions: { country: "IN" },
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();
        console.log("Autocomplete: Place changed", place);

        formik.setFieldValue("userCity", place.name);
        formik.setFieldValue(
          "userDistrict",
          place.address_components.find((component) =>
            component.types.includes("administrative_area_level_3")
          )?.long_name || ""
        );
        formik.setFieldValue(
          "userState",
          place.address_components.find((component) =>
            component.types.includes("administrative_area_level_1")
          )?.long_name || ""
        );
        formik.setFieldValue(
          "userCountry",
          place.address_components.find((component) =>
            component.types.includes("country")
          )?.long_name || ""
        );
        formik.setFieldValue(
          "userZipCode",
          place.address_components.find((component) =>
            component.types.includes("postal_code")
          )?.long_name || ""
        );
        formik.setFieldValue("userCords.lat", parseFloat(latitude));
        formik.setFieldValue("userCords.lng", parseFloat(longitude));
      });
    } else {
      console.error(
        "Autocomplete: Could not initialize - missing dependencies"
      );
    }
  }, []);

  useEffect(() => {
    const loadGoogleMapsScript = async () => {
      await loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${YOUR_API_KEY}&libraries=places`,
        document.head,
        "google-maps-api2"
      );
    };
    loadGoogleMapsScript();
  }, []);

  const getCurrentLocation = () => {
    setGetLocationClicked(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          axios
            .get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${YOUR_API_KEY}`
            )
            .then((response) => {
              const results = response.data.results;
              if (results.length > 0) {
                const addressComponents = results[0].address_components;

                formik.setFieldValue(
                  "userDoor",
                  addressComponents.find((component) =>
                    component.types.includes("premise")
                  )?.long_name || ""
                );
                formik.setFieldValue(
                  "userStreet",
                  addressComponents.find((component) =>
                    component.types.includes("political")
                  )?.long_name || ""
                );
                formik.setFieldValue(
                  "userCity",
                  addressComponents.find((component) =>
                    component.types.includes("locality")
                  )?.long_name || ""
                );
                formik.setFieldValue(
                  "userDistrict",
                  addressComponents.find((component) =>
                    component.types.includes("administrative_area_level_3")
                  )?.long_name || ""
                );
                formik.setFieldValue(
                  "userState",
                  addressComponents.find((component) =>
                    component.types.includes("administrative_area_level_1")
                  )?.long_name || ""
                );
                formik.setFieldValue(
                  "userCountry",
                  addressComponents.find((component) =>
                    component.types.includes("country")
                  )?.long_name || ""
                );
                formik.setFieldValue(
                  "userZipCode",
                  addressComponents.find((component) =>
                    component.types.includes("postal_code")
                  )?.long_name || ""
                );
                formik.setFieldValue("userCords.lat", parseFloat(latitude));
                formik.setFieldValue("userCords.lng", parseFloat(longitude));
              }
            })
            .catch((error) => {
              console.error("Error fetching geolocation data", error);
            });
        },
        (error) => {
          console.error("Error getting geolocation", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
    }
  };

  const signUp = async () => {
    await convertAddressToLatLng();
    setSignUpClicked(true);
  };

  useEffect(() => {
    if (userCordsPassed && signUpClicked) {
      axios
        .post("http://localhost:8080/user/add", formik.values)
        .then((res) => {
          Swal.fire({
            title: "Signup Successful!",
            icon: "success",
            confirmButtonText: "OK",
          });
          navigate("/signin");
        })
        .catch((err) => {
          if (err.response.request.status === 409) {
            Swal.fire({
              title: "Error",
              text: err.response.data.message,
              icon: "error",
              confirmButtonText: "OK",
            });
          } else {
            Swal.fire({
              title: "Update Failed!",
              text: err.message,
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        });
    }
  }, [userCordsPassed, signUpClicked, formik.values, navigate]);

  const handleNext = () => {
    setOpenAddress(!openAddress);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [openAddress, inputRef]);

  return (
    <ThemeProvider theme={lightTheme}>
      <Box sx={{ overflowY: "auto", maxHeight: "85vh", height: "100%" }}>
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="flex-start"
          sx={{
            width: "80%",
            margin: "3% auto",
            textAlign: "center",
          }}
        >
          {openAddress === false ? (
            <>
              <Grid item xs={12}>
                <TextField
                  label="Your Name"
                  placeholder="First & Last Name"
                  variant="standard"
                  helperText={formik.touched.userName && formik.errors.userName}
                  value={formik.values.userName}
                  style={{ width: "100%" }}
                  name="userName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.userName && Boolean(formik.errors.userName)
                  }
                  required
                  inputRef={inputRef}
                />
              </Grid>
              <Grid item xs={1.5}>
                <TextField
                  variant="standard"
                  value="+91"
                  style={{
                    width: "100%",
                    color: "black",
                    marginTop: "15.5px",
                    backgroundColor: "transparent",
                  }}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={10.5}>
                <TextField
                  label="Mobile Number"
                  placeholder="Enter Your Mobile No."
                  variant="standard"
                  helperText={
                    formik.touched.userMobile && formik.errors.userMobile
                  }
                  value={formik.values.userMobile}
                  style={{ width: "100%" }}
                  name="userMobile"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.userMobile &&
                    Boolean(formik.errors.userMobile)
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  placeholder="Enter Your Email"
                  helperText={
                    formik.touched.userEmail && formik.errors.userEmail
                  }
                  value={formik.values.userEmail}
                  variant="standard"
                  style={{ width: "100%" }}
                  name="userEmail"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.userEmail && Boolean(formik.errors.userEmail)
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  placeholder="Enter Password"
                  helperText={
                    formik.touched.userPassword && formik.errors.userPassword
                  }
                  value={formik.values.userPassword}
                  type={formik.values.showPassword ? "text" : "password"}
                  variant="standard"
                  style={{ width: "100%" }}
                  name="userPassword"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.userPassword &&
                    Boolean(formik.errors.userPassword)
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            formik.setValues({
                              ...formik.values,
                              showPassword: !formik.values.showPassword,
                            })
                          }
                          edge="end"
                        >
                          {formik.values.showPassword ? (
                            <VisibilityOff sx={{ fontSize: "20px" }} />
                          ) : (
                            <Visibility sx={{ fontSize: "20px" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Confirm Password"
                  placeholder="Enter Password Again"
                  helperText={
                    formik.touched.userCPassword && formik.errors.userCPassword
                  }
                  value={formik.values.userCPassword}
                  type={formik.values.showCPassword ? "text" : "password"}
                  variant="standard"
                  style={{ width: "100%" }}
                  name="userCPassword"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.userCPassword &&
                    Boolean(formik.errors.userCPassword)
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            formik.setValues({
                              ...formik.values,
                              showCPassword: !formik.values.showCPassword,
                            })
                          }
                          edge="end"
                        >
                          {formik.values.showCPassword ? (
                            <VisibilityOff sx={{ fontSize: "20px" }} />
                          ) : (
                            <Visibility sx={{ fontSize: "20px" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "20px" }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ fontWeight: "600", "&:hover": { color: "gold" } }}
                  disabled={
                    !(
                      formik.values.userName &&
                      formik.values.userMobile &&
                      formik.values.userEmail &&
                      formik.values.userPassword &&
                      formik.values.userCPassword
                    )
                  }
                >
                  Next
                </Button>
              </Grid>
            </>
          ) : (
            <>
              <Box sx={{ height: "fit-content" }}>
                <IconButton
                  variant="contained"
                  onClick={handleNext}
                  sx={{ position: "absolute", top: 10, left: 10 }}
                >
                  <ArrowBackIcon sx={{ fontSize: "20px" }} />
                </IconButton>
              </Box>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: "0",
                }}
              >
                <Button
                  onClick={getCurrentLocation}
                  variant="contained"
                  sx={{
                    height: "3rem",
                    width: "15rem",
                    "&: hover": {
                      color: "gold",
                    },
                  }}
                >
                  <MyLocationIcon sx={{ fontSize: "20px" }} />
                </Button>
                <Typography variant="body2" color="textSecondary">
                  We recommend double clicking the button for{" "}
                  <b>ACCURATE LOCATION</b>, or you can enter the details
                  manually.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  <Divider>OR</Divider>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Door No."
                  variant="standard"
                  helperText={formik.touched.userDoor && formik.errors.userDoor}
                  value={formik.values.userDoor}
                  style={{ width: "100%" }}
                  name="userDoor"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.userDoor && Boolean(formik.errors.userDoor)
                  }
                  required
                  inputRef={inputRef}
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  label="Street"
                  variant="standard"
                  helperText={
                    formik.touched.userStreet && formik.errors.userStreet
                  }
                  value={formik.values.userStreet}
                  style={{ width: "100%" }}
                  name="userStreet"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.userStreet &&
                    Boolean(formik.errors.userStreet)
                  }
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="City"
                  variant="standard"
                  helperText={formik.touched.userCity && formik.errors.userCity}
                  value={formik.values.userCity}
                  style={{ width: "100%" }}
                  name="userCity"
                  id="userCity"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.userCity && Boolean(formik.errors.userCity)
                  }
                  autoComplete="address-level2"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="District"
                  variant="standard"
                  helperText={
                    formik.touched.userDistrict && formik.errors.userDistrict
                  }
                  value={formik.values.userDistrict}
                  style={{ width: "100%" }}
                  name="userDistrict"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.userDistrict &&
                    Boolean(formik.errors.userDistrict)
                  }
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="State"
                  variant="standard"
                  helperText={
                    formik.touched.userState && formik.errors.userState
                  }
                  value={formik.values.userState}
                  style={{ width: "100%" }}
                  name="userState"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.userState && Boolean(formik.errors.userState)
                  }
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Zip Code"
                  variant="standard"
                  helperText={
                    formik.touched.userZipCode && formik.errors.userZipCode
                  }
                  value={formik.values.userZipCode}
                  style={{ width: "100%" }}
                  name="userZipCode"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.userZipCode &&
                    Boolean(formik.errors.userZipCode)
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Country"
                  variant="standard"
                  helperText={
                    formik.touched.userCountry && formik.errors.userCountry
                  }
                  value={formik.values.userCountry}
                  style={{ width: "100%" }}
                  name="userCountry"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.userCountry &&
                    Boolean(formik.errors.userCountry)
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "20px" }}>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={() => {
                    signUp(formik.values);
                  }}
                  sx={{ fontWeight: "600", "&:hover": { color: "gold" } }}
                  disabled={!formik.isValid}
                >
                  Sign Up
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Signup;
