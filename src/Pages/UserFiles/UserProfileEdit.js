import {
  Box,
  Card,
  List,
  ListItem,
  Avatar,
  ListItemText,
  Divider,
  Button,
  TextField,
  IconButton,
  Icon,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "../MyTheme";
import React, { useEffect, useState, useRef } from "react";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Navbar from "../HeaderFiles/Navbar.js";
import Category from "../HomeLayouts/Category.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { selectLocation } from "../../redux/location/locationSlice.js";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice.js";

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

const UserProfileEdit = () => {
  const [saveFlag, setSaveFlag] = useState(true);
  const [resetFlag, setResetFlag] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const imageData = currentUser?.data?.userAvatar?.buffer;
  const initialDataUrl = `data:${
    currentUser?.data?.userAvatar?.mimetype
  };base64,${imageData?.toString("base64")}`;
  const [userDetails, setUserDetails] = useState({
    ...currentUser.data,
    dataUrl: initialDataUrl,
  });
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({
    userName: "",
    userEmail: "",
    userMobile: "",
    userDoor: "",
    userStreet: "",
    userCity: "",
    userDistrict: "",
    userState: "",
    userCountry: "",
    userZipCode: "",
  });

  const validationSchema = Yup.object().shape({
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
  });

  const getCurrentLocation = () => {
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

                setUserDetails((prevData) => ({
                  ...prevData,
                  userDoor:
                    addressComponents.find((component) =>
                      component.types.includes("premise")
                    )?.long_name || "",
                  userStreet:
                    addressComponents.find((component) =>
                      component.types.includes("political")
                    )?.long_name || "",
                  userCity:
                    addressComponents.find((component) =>
                      component.types.includes("locality")
                    )?.long_name || "",
                  userDistrict:
                    addressComponents.find((component) =>
                      component.types.includes("administrative_area_level_3")
                    )?.long_name || "",
                  userState:
                    addressComponents.find((component) =>
                      component.types.includes("administrative_area_level_1")
                    )?.long_name || "",
                  userCountry:
                    addressComponents.find((component) =>
                      component.types.includes("country")
                    )?.long_name || "",
                  userZipCode:
                    addressComponents.find((component) =>
                      component.types.includes("postal_code")
                    )?.long_name || "",
                  userCords: {
                    lat: parseFloat(latitude),
                    lng: parseFloat(longitude),
                  },
                }));
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

  useEffect(() => {
    const cityInput = document.getElementById("userCity");

    if (cityInput && window.google && window.google.maps) {
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
        console.log(place.geometry.location.lat());

        setUserDetails((prevData) => ({
          ...prevData,
          userCity: place.name,
          userDistrict:
            place.address_components.find((component) =>
              component.types.includes("administrative_area_level_3")
            )?.long_name || "",
          userState:
            place.address_components.find((component) =>
              component.types.includes("administrative_area_level_1")
            )?.long_name || "",
          userCountry:
            place.address_components.find((component) =>
              component.types.includes("country")
            )?.long_name || "",
          userZipCode:
            place.address_components.find((component) =>
              component.types.includes("postal_code")
            )?.long_name || "",
          userCords: {
            lat: parseFloat(latitude),
            lng: parseFloat(longitude),
          },
        }));
      });
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

  const onChange = (e) => {
    setUserDetails((prevUserDetails) => ({
      ...prevUserDetails,
      [e.target.name]: e.target.value,
    }));

    validateField(e.target.name, e.target.value);
  };

  const validateField = async (fieldName, value) => {
    try {
      await Yup.reach(validationSchema, fieldName).validate(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: "",
      }));
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: error.message,
      }));
    }
  };

  const location = {
    description: currentUser?.data?.userCity,
    lat: currentUser?.data?.userCords.lat,
    lng: currentUser?.data?.userCords.lng,
  };
  dispatch(selectLocation(location));

  const Reset = () => {
    setUserDetails({
      ...currentUser.data,
      dataUrl: initialDataUrl,
    });
  };

  useEffect(() => {
    convertAddressToLatLng();
  }, []);

  const convertAddressToLatLng = async () => {
    const fullAddress = `${userDetails.userDoor}, ${userDetails.userStreet}, ${userDetails.userCity}, ${userDetails.userState}, ${userDetails.userDistrict}, ${userDetails.userCountry}`;
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          fullAddress
        )}&key=${YOUR_API_KEY}`
      );
      const results = response.data.results;
      console.log("resultssssss", results);
      if (results.length > 0) {
        const location = results[0].geometry.location;
        console.log("lat", location.lat);
        setUserDetails((prevData) => ({
          ...prevData,
          userCords: {
            lat: location.lat,
            lng: location.lng,
          },
        }));
        console.log(userDetails);
        console.log("locationsssss", location);
      }
      console.log("ccccc", userDetails);
    } catch (error) {
      console.error("Error converting address to coordinates:", error);
    }
  };

  const Save = async () => {
    /*     await convertAddressToLatLng();*/
    const userDetailsObj = {
      userName: userDetails.userName,
      userEmail: userDetails.userEmail,
      userMobile: userDetails.userMobile,
      userDoor: userDetails.userDoor,
      userStreet: userDetails.userStreet,
      userCity: userDetails.userCity,
      userDistrict: userDetails.userDistrict,
      userState: userDetails.userState,
      userCountry: userDetails.userCountry,
      userZipCode: userDetails.userZipCode,
    };

    console.log("bbbb", userDetails, userDetailsObj);
    if (userDetails.userCords !== null) {
      userDetailsObj.userCords = [
        userDetails.userCords.lat,
        userDetails.userCords.lng,
      ];
    }

    const detailsFormData = new FormData();

    for (const [key, value] of Object.entries(userDetailsObj)) {
      const sanitizedValue = value !== undefined ? value : "";
      detailsFormData.append(key, sanitizedValue);
    }

    /*     if (userDetails.userCords !== null) {
      detailsFormData.append("userCords", [
        userDetails.userCords.lat,
        userDetails.userCords.lng,
      ]);
    } */

    if (userDetails.userAvatar instanceof File) {
      detailsFormData.append("userAvatar", userDetails.userAvatar);
    }

    dispatch(signInStart());
    await axios
      .post(
        `http://localhost:8080/user/edit/details/${userDetails._id}`,
        detailsFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        dispatch(signInSuccess(res.data));
        setUserDetails(res.data);
        Swal.fire({
          title: "Update Successful!",
          icon: "success",
          confirmButtonText: "OK",
        });
        if (res.success === false) {
          dispatch(signInFailure(res.message));
          return;
        }
        dispatch(signInSuccess(res));
      })
      .catch((err) => {
        dispatch(signInFailure(err.message));
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
    navigate("/userprofile");
  };

  useEffect(() => {
    if (
      userDetails.userName === currentUser.data.userName &&
      userDetails.userAvatar === currentUser.data.userAvatar &&
      userDetails.userEmail === currentUser.data.userEmail &&
      userDetails.userMobile === currentUser.data.userMobile &&
      userDetails.userDoor === currentUser.data.userDoor &&
      userDetails.userStreet === currentUser.data.userStreet &&
      userDetails.userCity === currentUser.data.userCity &&
      userDetails.userDistrict === currentUser.data.userDistrict &&
      userDetails.userState === currentUser.data.userState &&
      userDetails.userCountry === currentUser.data.userCountry &&
      userDetails.userZipCode === currentUser.data.userZipCode
    ) {
      setSaveFlag(false);
      setResetFlag(false);
    } else {
      setSaveFlag(true);
      setResetFlag(true);
    }
  }, [userDetails]);

  const inputRef = useRef(null);

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const dataUrl = URL.createObjectURL(file);
      setUserDetails({
        ...userDetails,
        userAvatar: file,
        dataUrl: dataUrl,
      });
    } else {
      Swal.fire({
        title: "Invalid Image Format",
        text: "Please select a valid image file.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Box>
        <Navbar />
        <Category />
        <Icon
          style={{
            cursor: "pointer",
            marginLeft: "1.5rem",
            marginBottom: "0.5rem",
            marginTop: "1rem",
            color: "black",
            fontSize: "1.5rem",
          }}
          onClick={() => navigate("/userprofile")}
        >
          <ArrowBackIcon sx={{ fontSize: "22.5px" }} />
        </Icon>
        <Box
          sx={{
            height: "80vh",
            width: "93vw",
            margin: "0 auto",
            display: "flex",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexBasis: "20%",
              gap: 2,
            }}
          >
            <Card
              sx={{
                backgroundColor: "white",
                flexBasis: "30%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                style={{
                  margin: "1rem",
                  marginBottom: "0",
                  flexBasis: "80%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <label htmlFor="userAvatar">
                  <input
                    type="file"
                    accept="image/*"
                    className="userAvatar"
                    id="userAvatar"
                    onChange={handleFileChange}
                    ref={inputRef}
                    hidden
                  />
                  <Avatar
                    alt="User Profile"
                    src={userDetails.dataUrl}
                    sx={{
                      margin: "1rem",
                      width: "100px",
                      height: "100px",
                      flexBasis: "40%",
                    }}
                  />
                </label>
                <Avatar
                  sx={{
                    position: "absolute",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    left: 69,
                    textAlign: "center",
                    width: "100px",
                    height: "100px",
                    margin: "1rem",
                  }}
                >
                  <IconButton size="small" onClick={handleImageClick}>
                    <PhotoCameraIcon
                      sx={{ color: "white", fontSize: "20px" }}
                    />
                  </IconButton>
                </Avatar>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexBasis: "60%",
                  }}
                >
                  <Typography sx={{ fontSize: "12px" }}>Hello,</Typography>
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: (theme) => theme.typography.fontWeightBold,
                    }}
                  >
                    {currentUser.data.userName}
                  </Typography>
                </Box>
              </Box>
            </Card>
            <Card sx={{ flexBasis: "70%" }}></Card>
          </Box>
          <Card sx={{ flexBasis: "80%", padding: "1rem" }}>
            <Box style={{ flexBasis: "80%", height: "72vh" }}>
              <Typography
                sx={{
                  textAlign: "center",
                  margin: "15px auto",
                  fontSize: "1.5rem",
                  fontWeight: (theme) => theme.typography.fontWeightBold,
                }}
              >
                Personal Details
              </Typography>
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Box
                  sx={{
                    width: "50%",
                  }}
                >
                  <List
                    sx={{
                      marginRight: "10px",
                      marginBottom: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <ListItem>
                      <ListItemText primary="User name:" />
                      <ListItemText sx={{ textAlign: "end" }}>
                        <TextField
                          value={userDetails.userName}
                          name="userName"
                          error={!!errors.userName}
                          helperText={errors.userName}
                          onChange={(e) => {
                            onChange(e);
                          }}
                          sx={{ "& input": { padding: "5px 10px" } }}
                        />
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Email" />
                      <ListItemText sx={{ textAlign: "end" }}>
                        <TextField
                          value={userDetails.userEmail}
                          name="userEmail"
                          onChange={(e) => {
                            onChange(e);
                          }}
                          error={!!errors.userEmail}
                          helperText={errors.userEmail}
                          sx={{ "& input": { padding: "5px 10px" } }}
                        />
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Mobile" />
                      <ListItemText sx={{ textAlign: "end" }}>
                        <TextField
                          value={userDetails.userMobile}
                          name="userMobile"
                          error={!!errors.userMobile}
                          helperText={errors.userMobile}
                          onChange={(e) => {
                            onChange(e);
                          }}
                          sx={{ "& input": { padding: "5px 10px" } }}
                        />
                      </ListItemText>
                    </ListItem>
                    <Box
                      sx={{
                        display: "flex",
                        margin: "1rem 0.5rem 0 0.5rem",
                        gap: 1,
                      }}
                    >
                      <Button
                        onClick={getCurrentLocation}
                        variant="contained"
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          flexBasis: "30%",
                          margin: "0.5rem auto",
                        }}
                      >
                        <MyLocationIcon sx={{ fontSize: "20px" }} />
                      </Button>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ textAlign: "center" }}
                      >
                        We recommend double clicking the button for{" "}
                        <b>ACCURATE LOCATION</b>, OR you can enter the details
                        manually.
                      </Typography>
                    </Box>
                  </List>
                </Box>
                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  sx={{ height: "50vh" }}
                />
                <Box
                  sx={{
                    width: "50%",
                  }}
                >
                  <List
                    sx={{
                      marginRight: "10px",
                      marginBottom: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <ListItem>
                      <ListItemText primary="Door" />
                      <ListItemText sx={{ textAlign: "end" }}>
                        <TextField
                          value={userDetails.userDoor}
                          name="userDoor"
                          error={!!errors.userDoor}
                          helperText={errors.userDoor}
                          onChange={(e) => {
                            onChange(e);
                          }}
                          sx={{ "& input": { padding: "5px 10px" } }}
                        />
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Street" />
                      <ListItemText sx={{ textAlign: "end" }}>
                        <TextField
                          value={userDetails.userStreet}
                          name="userStreet"
                          error={!!errors.userStreet}
                          helperText={errors.userStreet}
                          onChange={(e) => {
                            onChange(e);
                          }}
                          sx={{ "& input": { padding: "5px 10px" } }}
                        />
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="City" />
                      <ListItemText sx={{ textAlign: "end" }}>
                        <TextField
                          value={userDetails.userCity}
                          name="userCity"
                          id="userCity"
                          error={!!errors.userCity}
                          helperText={errors.userCity}
                          onChange={(e) => {
                            onChange(e);
                          }}
                          sx={{ "& input": { padding: "5px 10px" } }}
                        />
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="District" />
                      <ListItemText sx={{ textAlign: "end" }}>
                        <TextField
                          value={userDetails.userDistrict}
                          name="userDistrict"
                          error={!!errors.userDistrict}
                          helperText={errors.userDistrict}
                          onChange={(e) => {
                            onChange(e);
                          }}
                          sx={{ "& input": { padding: "5px 10px" } }}
                        />
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="State" />
                      <ListItemText sx={{ textAlign: "end" }}>
                        <TextField
                          value={userDetails.userState}
                          name="userState"
                          error={!!errors.userState}
                          helperText={errors.userState}
                          onChange={(e) => {
                            onChange(e);
                          }}
                          sx={{ "& input": { padding: "5px 10px" } }}
                        />
                      </ListItemText>
                    </ListItem>
                    <Box sx={{ display: "flex", width: "100%" }}>
                      <ListItem sx={{ display: "flex", width: "50%" }}>
                        <ListItemText primary="Country" sx={{ width: "40%" }} />
                        <ListItemText sx={{ textAlign: "end", width: "60%" }}>
                          <TextField
                            value={userDetails.userCountry}
                            name="userCountry"
                            error={!!errors.userCountry}
                            helperText={errors.userCountry}
                            onChange={(e) => {
                              onChange(e);
                            }}
                            sx={{ "& input": { padding: "5px 10px" } }}
                          />
                        </ListItemText>
                      </ListItem>
                      <ListItem sx={{ display: "flex", width: "50%" }}>
                        <ListItemText
                          primary="Zip Code"
                          sx={{ width: "50%" }}
                        />
                        <ListItemText sx={{ textAlign: "end", width: "50%" }}>
                          <TextField
                            value={userDetails.userZipCode}
                            name="userZipCode"
                            error={!!errors.userZipCode}
                            helperText={errors.userZipCode}
                            onChange={(e) => {
                              onChange(e);
                            }}
                            sx={{ "& input": { padding: "5px 10px" } }}
                          />
                        </ListItemText>
                      </ListItem>
                    </Box>
                  </List>
                </Box>
              </Box>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 15,
                  marginTop: "2rem",
                }}
              >
                <Button
                  disabled={!resetFlag}
                  variant="contained"
                  onClick={() => {
                    Reset();
                  }}
                  color="error"
                  sx={{ fontWeight: "600", "&:hover": { color: "gold" } }}
                >
                  Reset
                </Button>
                <Button
                  disabled={!saveFlag}
                  variant="contained"
                  onClick={() => {
                    Save();
                  }}
                  sx={{ fontWeight: "600", "&:hover": { color: "gold" } }}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default UserProfileEdit;
