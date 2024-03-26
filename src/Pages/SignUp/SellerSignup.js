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

const SellerSignup = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [openAddress, setOpenAddress] = useState(false);
  const [sellerCordsPassed, setUserCordsPassed] = useState(false);
  const [signUpClicked, setSignUpClicked] = useState(false);
  const [getLocationClicked, setGetLocationClicked] = useState(false);

  const formik = useFormik({
    initialValues: {
      sellerName: "",
      sellerShop: "",
      sellerMobile: "",
      sellerEmail: "",
      sellerPassword: "",
      sellerCPassword: "",
      sellerDoor: "",
      sellerStreet: "",
      sellerCity: "",
      sellerDistrict: "",
      sellerState: "",
      sellerCountry: "",
      sellerZipCode: "",
      sellerCords: {
        lat: "",
        lng: "",
      },
    },
    validationSchema: Yup.object({
      sellerName: Yup.string()
        .min(3, "Owner name must be at least 3 characters")
        .required("Owner name Required !"),
      sellerShop: Yup.string()
        .min(3, "Shop name must be at least 3 characters")
        .required("Shop name Required !"),
      sellerMobile: Yup.number()
        .typeError("Mobile must be a number")
        .required("Mobile Number Required !")
        .test(
          "len",
          "Must be exactly 10 digits",
          (val) => val && val.toString().length === 10
        ),
      sellerEmail: Yup.string()
        .email("Invalid email address")
        .required("Email Required !"),
      sellerPassword: Yup.string()
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
          "Password must contain at least 6 characters, one uppercase letter, one lowercase letter, one number and one special character"
        )
        .required("Password Required !"),
      sellerCPassword: Yup.string()
        .oneOf([Yup.ref("sellerPassword"), null], "Passwords must match")
        .required("Confirm Password Required !"),
      sellerDoor: Yup.string().required("Door Required !"),
      sellerStreet: Yup.string().required("Street Required !"),
      sellerCity: Yup.string().required("City Required !"),
      sellerDistrict: Yup.string().required("District Required !"),
      sellerState: Yup.string().required("State Required !"),
      sellerCountry: Yup.string().required("Country Required !"),
      sellerZipCode: Yup.number()
        .typeError("Zip Code must be a number")
        .required("Zipcode Required !"),
      sellerCords: Yup.object().shape({
        lat: Yup.number().optional(),
        lng: Yup.number().optional(),
      }),
    }),
  });

  const convertAddressToLatLng = async () => {
    const fullAddress = `${formik.values.sellerDoor}, ${formik.values.sellerStreet}, ${formik.values.sellerCity}, ${formik.values.sellerState}, ${formik.values.sellerDistrict}, ${formik.values.sellerCountry}`;
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
        formik.setFieldValue("sellerCords.lat", parseFloat(latitude));
        formik.setFieldValue("sellerCords.lng", parseFloat(longitude));
      }
      setUserCordsPassed(true);
    } catch (error) {
      console.error("Error converting address to coordinates:", error);
    }
  };

  useEffect(() => {
    const cityInput = document.getElementById("sellerCity");

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

        formik.setFieldValue("sellerCity", place.name);
        formik.setFieldValue(
          "sellerDistrict",
          place.address_components.find((component) =>
            component.types.includes("administrative_area_level_3")
          )?.long_name || ""
        );
        formik.setFieldValue(
          "sellerState",
          place.address_components.find((component) =>
            component.types.includes("administrative_area_level_1")
          )?.long_name || ""
        );
        formik.setFieldValue(
          "sellerCountry",
          place.address_components.find((component) =>
            component.types.includes("country")
          )?.long_name || ""
        );
        formik.setFieldValue(
          "sellerZipCode",
          place.address_components.find((component) =>
            component.types.includes("postal_code")
          )?.long_name || ""
        );
        formik.setFieldValue("sellerCords.lat", parseFloat(latitude));
        formik.setFieldValue("sellerCords.lng", parseFloat(longitude));
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
                  "sellerDoor",
                  addressComponents.find((component) =>
                    component.types.includes("premise")
                  )?.long_name || ""
                );
                formik.setFieldValue(
                  "sellerStreet",
                  addressComponents.find((component) =>
                    component.types.includes("political")
                  )?.long_name || ""
                );
                formik.setFieldValue(
                  "sellerCity",
                  addressComponents.find((component) =>
                    component.types.includes("locality")
                  )?.long_name || ""
                );
                formik.setFieldValue(
                  "sellerDistrict",
                  addressComponents.find((component) =>
                    component.types.includes("administrative_area_level_3")
                  )?.long_name || ""
                );
                formik.setFieldValue(
                  "sellerState",
                  addressComponents.find((component) =>
                    component.types.includes("administrative_area_level_1")
                  )?.long_name || ""
                );
                formik.setFieldValue(
                  "sellerCountry",
                  addressComponents.find((component) =>
                    component.types.includes("country")
                  )?.long_name || ""
                );
                formik.setFieldValue(
                  "sellerZipCode",
                  addressComponents.find((component) =>
                    component.types.includes("postal_code")
                  )?.long_name || ""
                );
                formik.setFieldValue("sellerCords.lat", parseFloat(latitude));
                formik.setFieldValue("sellerCords.lng", parseFloat(longitude));
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

  const signUp = () => {
    convertAddressToLatLng();
    setSignUpClicked(true);
  };

  useEffect(() => {
    if (sellerCordsPassed && signUpClicked) {
      axios
        .post("http://localhost:8080/seller/add", formik.values)
        .then((res) => {
          Swal.fire({
            title: "Signup Successful!",
            icon: "success",
            confirmButtonText: "OK",
          });
          navigate("/signin", { state: { userType: "seller" } });
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
  }, [sellerCordsPassed, signUpClicked, formik.values, navigate]);

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
            margin: "5% auto",
            textAlign: "center",
          }}
        >
          {openAddress === false ? (
            <>
              <Grid item xs={12}>
                <TextField
                  label="Shop Name"
                  placeholder="Shop Name Recommended"
                  variant="standard"
                  helperText={
                    formik.touched.sellerShop && formik.errors.sellerShop
                  }
                  value={formik.values.sellerShop}
                  style={{ width: "100%" }}
                  name="sellerShop"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.sellerShop &&
                    Boolean(formik.errors.sellerShop)
                  }
                  required
                  inputRef={inputRef}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Owner Name"
                  placeholder="Owner Name Recommended"
                  variant="standard"
                  helperText={
                    formik.touched.sellerName && formik.errors.sellerName
                  }
                  value={formik.values.sellerName}
                  style={{ width: "100%" }}
                  name="sellerName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.sellerName &&
                    Boolean(formik.errors.sellerName)
                  }
                  required
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
                    formik.touched.sellerMobile && formik.errors.sellerMobile
                  }
                  value={formik.values.sellerMobile}
                  style={{ width: "100%" }}
                  name="sellerMobile"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.sellerMobile &&
                    Boolean(formik.errors.sellerMobile)
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  placeholder="Enter Your Email"
                  helperText={
                    formik.touched.sellerEmail && formik.errors.sellerEmail
                  }
                  value={formik.values.sellerEmail}
                  variant="standard"
                  style={{ width: "100%" }}
                  name="sellerEmail"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.sellerEmail &&
                    Boolean(formik.errors.sellerEmail)
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  placeholder="Enter Password"
                  helperText={
                    formik.touched.sellerPassword &&
                    formik.errors.sellerPassword
                  }
                  value={formik.values.sellerPassword}
                  type={formik.values.showPassword ? "text" : "password"}
                  variant="standard"
                  style={{ width: "100%" }}
                  name="sellerPassword"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.sellerPassword &&
                    Boolean(formik.errors.sellerPassword)
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
                    formik.touched.sellerCPassword &&
                    formik.errors.sellerCPassword
                  }
                  value={formik.values.sellerCPassword}
                  type={formik.values.showCPassword ? "text" : "password"}
                  variant="standard"
                  style={{ width: "100%" }}
                  name="sellerCPassword"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.sellerCPassword &&
                    Boolean(formik.errors.sellerCPassword)
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
                      formik.values.sellerName &&
                      formik.values.sellerShop &&
                      formik.values.sellerMobile &&
                      formik.values.sellerEmail &&
                      formik.values.sellerPassword &&
                      formik.values.sellerCPassword
                    )
                  }
                >
                  Next
                </Button>
              </Grid>
            </>
          ) : (
            <>
              <div style={{ height: "fit-content" }}>
                <IconButton
                  variant="contained"
                  onClick={handleNext}
                  sx={{ position: "absolute", top: 10, left: 10 }}
                >
                  <ArrowBackIcon sx={{ fontSize: "20px" }} />
                </IconButton>
              </div>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  justifyContent: "center",
                  alignItems: "center",
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
                  helperText={
                    formik.touched.sellerDoor && formik.errors.sellerDoor
                  }
                  value={formik.values.sellerDoor}
                  style={{ width: "100%" }}
                  name="sellerDoor"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.sellerDoor &&
                    Boolean(formik.errors.sellerDoor)
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
                    formik.touched.sellerStreet && formik.errors.sellerStreet
                  }
                  value={formik.values.sellerStreet}
                  style={{ width: "100%" }}
                  name="sellerStreet"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.sellerStreet &&
                    Boolean(formik.errors.sellerStreet)
                  }
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="City"
                  variant="standard"
                  helperText={
                    formik.touched.sellerCity && formik.errors.sellerCity
                  }
                  value={formik.values.sellerCity}
                  style={{ width: "100%" }}
                  name="sellerCity"
                  id="sellerCity"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.sellerCity &&
                    Boolean(formik.errors.sellerCity)
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
                    formik.touched.sellerDistrict &&
                    formik.errors.sellerDistrict
                  }
                  value={formik.values.sellerDistrict}
                  style={{ width: "100%" }}
                  name="sellerDistrict"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.sellerDistrict &&
                    Boolean(formik.errors.sellerDistrict)
                  }
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="State"
                  variant="standard"
                  helperText={
                    formik.touched.sellerState && formik.errors.sellerState
                  }
                  value={formik.values.sellerState}
                  style={{ width: "100%" }}
                  name="sellerState"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.sellerState &&
                    Boolean(formik.errors.sellerState)
                  }
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Zip Code"
                  variant="standard"
                  helperText={
                    formik.touched.sellerZipCode && formik.errors.sellerZipCode
                  }
                  value={formik.values.sellerZipCode}
                  style={{ width: "100%" }}
                  name="sellerZipCode"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.sellerZipCode &&
                    Boolean(formik.errors.sellerZipCode)
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Country"
                  variant="standard"
                  helperText={
                    formik.touched.sellerCountry && formik.errors.sellerCountry
                  }
                  value={formik.values.sellerCountry}
                  style={{ width: "100%" }}
                  name="sellerCountry"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.sellerCountry &&
                    Boolean(formik.errors.sellerCountry)
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

export default SellerSignup;
