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
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import Navbar from "../HeaderFiles/Navbar.js";
import Category from "../HomeLayouts/Category.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/seller/sellerSlice.js";

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

const SellerProfileEdit = () => {
  const [saveFlag, setSaveFlag] = useState(true);
  const [resetFlag, setResetFlag] = useState(true);
  const { currentSeller } = useSelector((state) => state.seller);
  const navigate = useNavigate();
  const imageData = currentSeller?.data?.sellerAvatar?.buffer;
  const initialDataUrl = `data:${
    currentSeller?.data?.sellerAvatar?.mimetype
  };base64,${imageData?.toString("base64")}`;
  const [sellerDetails, setSellerDetails] = useState({
    ...currentSeller.data,
    dataUrl: initialDataUrl,
  });
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({
    sellerName: "",
    sellerShop: "",
    sellerEmail: "",
    sellerMobile: "",
    sellerDoor: "",
    sellerStreet: "",
    sellerCity: "",
    sellerDistrict: "",
    sellerState: "",
    sellerCountry: "",
    sellerZipCode: "",
  });

  const validationSchema = Yup.object().shape({
    sellerName: Yup.string()
      .min(3, "Seller name must be at least 3 characters")
      .required("Seller name Required !"),
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
    sellerDoor: Yup.string().required("Door Required !"),
    sellerStreet: Yup.string().required("Street Required !"),
    sellerCity: Yup.string().required("City Required !"),
    sellerDistrict: Yup.string().required("District Required !"),
    sellerState: Yup.string().required("State Required !"),
    sellerCountry: Yup.string().required("Country Required !"),
    sellerZipCode: Yup.number()
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

                setSellerDetails((prevData) => ({
                  ...prevData,
                  sellerDoor:
                    addressComponents.find((component) =>
                      component.types.includes("premise")
                    )?.long_name || "",
                  sellerStreet:
                    addressComponents.find((component) =>
                      component.types.includes("political")
                    )?.long_name || "",
                  sellerCity:
                    addressComponents.find((component) =>
                      component.types.includes("locality")
                    )?.long_name || "",
                  sellerDistrict:
                    addressComponents.find((component) =>
                      component.types.includes("administrative_area_level_3")
                    )?.long_name || "",
                  sellerState:
                    addressComponents.find((component) =>
                      component.types.includes("administrative_area_level_1")
                    )?.long_name || "",
                  sellerCountry:
                    addressComponents.find((component) =>
                      component.types.includes("country")
                    )?.long_name || "",
                  sellerZipCode:
                    addressComponents.find((component) =>
                      component.types.includes("postal_code")
                    )?.long_name || "",
                  sellerCords: {
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
    const cityInput = document.getElementById("sellerCity");

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
        console.log(place);

        setSellerDetails((prevData) => ({
          ...prevData,
          sellerCity: place.name,
          sellerDistrict:
            place.address_components.find((component) =>
              component.types.includes("administrative_area_level_3")
            )?.long_name || "",
          sellerState:
            place.address_components.find((component) =>
              component.types.includes("administrative_area_level_1")
            )?.long_name || "",
          sellerCountry:
            place.address_components.find((component) =>
              component.types.includes("country")
            )?.long_name || "",
          sellerZipCode:
            place.address_components.find((component) =>
              component.types.includes("postal_code")
            )?.long_name || "",
          sellerCords: {
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
        "google-maps-api3"
      );
    };
    loadGoogleMapsScript();
  }, []);

  const onChange = (e) => {
    setSellerDetails((prevSellerDetails) => ({
      ...prevSellerDetails,
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

  const Reset = () => {
    setSellerDetails({
      ...currentSeller.data,
      dataUrl: initialDataUrl,
    });
  };

  useEffect(() => {
    convertAddressToLatLng();
  }, []);

  const convertAddressToLatLng = async () => {
    const fullAddress = `${sellerDetails.sellerDoor}, ${sellerDetails.sellerStreet}, ${sellerDetails.sellerCity}, ${sellerDetails.sellerState}, ${sellerDetails.sellerDistrict}, ${sellerDetails.sellerCountry}`;
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
        setSellerDetails((prevData) => ({
          ...prevData,
          sellerCords: {
            lat: location.lat,
            lng: location.lng,
          },
        }));
        console.log(sellerDetails);
        console.log("locationsssss", location);
      }
      console.log("ccccc", sellerDetails);
    } catch (error) {
      console.error("Error converting address to coordinates:", error);
    }
  };

  const Save = async () => {
    try {
      console.log("Seller Shop Value:", sellerDetails?.sellerShopImages);

      const sellerDetailsObj = {
        sellerName: sellerDetails.sellerName,
        sellerEmail: sellerDetails.sellerEmail,
        sellerMobile: sellerDetails.sellerMobile,
        sellerDoor: sellerDetails.sellerDoor,
        sellerStreet: sellerDetails.sellerStreet,
        sellerCity: sellerDetails.sellerCity,
        sellerDistrict: sellerDetails.sellerDistrict,
        sellerState: sellerDetails.sellerState,
        sellerCountry: sellerDetails.sellerCountry,
        sellerZipCode: sellerDetails.sellerZipCode,
        sellerShop: sellerDetails.sellerShop,
      };

      console.log("Seller Details Object:", sellerDetailsObj);

      const detailsFormData = new FormData();

      for (const [key, value] of Object.entries(sellerDetailsObj)) {
        const sanitizedValue = value !== undefined ? value : "";
        detailsFormData.append(key, sanitizedValue);
      }

      if (sellerDetails.sellerCords !== null) {
        detailsFormData.append("sellerCords", [
          sellerDetails.sellerCords.lat,
          sellerDetails.sellerCords.lng,
        ]);
      }

      if (sellerDetails.sellerAvatar instanceof File) {
        detailsFormData.append("sellerAvatar", sellerDetails.sellerAvatar);
      }

      dispatch(signInStart());

      const formDataObject = {};
      for (const [key, value] of detailsFormData.entries()) {
        formDataObject[key] = value;
      }

      console.log("FormData:", formDataObject);

      const res = await axios.post(
        `http://localhost:8080/seller/edit/details/${sellerDetails._id}`,
        detailsFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 200) {
        dispatch(signInSuccess(res.data));
        setSellerDetails(res.data);
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
        navigate("/sellerprofile");
      } else if (res.status === 409) {
        Swal.fire({
          title: "Error",
          text: res.data?.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Update Failed!",
          text:
            res.data?.message ||
            "An error occurred while updating. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
        dispatch(signInFailure(res.data?.message));
      }
    } catch (err) {
      dispatch(
        signInFailure(
          "An error occurred while updating. Please try again later."
        )
      );
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
    }
  };

  useEffect(() => {
    if (
      sellerDetails.sellerName === currentSeller.data.sellerName &&
      sellerDetails.sellerAvatar === currentSeller.data.sellerAvatar &&
      sellerDetails.sellerEmail === currentSeller.data.sellerEmail &&
      sellerDetails.sellerMobile === currentSeller.data.sellerMobile &&
      sellerDetails.sellerDoor === currentSeller.data.sellerDoor &&
      sellerDetails.sellerStreet === currentSeller.data.sellerStreet &&
      sellerDetails.sellerCity === currentSeller.data.sellerCity &&
      sellerDetails.sellerDistrict === currentSeller.data.sellerDistrict &&
      sellerDetails.sellerState === currentSeller.data.sellerState &&
      sellerDetails.sellerCountry === currentSeller.data.sellerCountry &&
      sellerDetails.sellerZipCode === currentSeller.data.sellerZipCode &&
      sellerDetails.sellerShop === currentSeller.data.sellerShop &&
      sellerDetails.sellerShopImages === currentSeller.data.sellerShopImages
    ) {
      setSaveFlag(false);
      setResetFlag(false);
    } else {
      setSaveFlag(true);
      setResetFlag(true);
    }
  }, [sellerDetails]);

  const inputRef = useRef(null);

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const dataUrl = URL.createObjectURL(file);
      setSellerDetails({
        ...sellerDetails,
        sellerAvatar: file,
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

  useEffect(() => {
    console.log(sellerDetails);
  }, []);

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
          onClick={() => navigate("/sellerprofile")}
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
                <label htmlFor="sellerAvatar">
                  <input
                    type="file"
                    accept="image/*"
                    className="sellerAvatar"
                    id="sellerAvatar"
                    onChange={handleFileChange}
                    ref={inputRef}
                    hidden
                  />
                  <Avatar
                    alt="Seller Profile"
                    src={sellerDetails.dataUrl}
                    sx={{
                      margin: "1rem",
                      width: "100px",
                      height: "100px",
                      flexBasis: "40%",
                    }}
                  />
                </label>
                <Avatar
                  style={{
                    position: "absolute",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    left: 69,
                    textAlign: "center",
                    width: "100px",
                    height: "100px",
                    margin: "1rem",
                  }}
                >
                  <IconButton size="small" onClick={handleImageClick} sx={{}}>
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
                    {currentSeller.data.sellerName}
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
                      <ListItemText primary="Shop name:" />
                      <ListItemText sx={{ textAlign: "end" }}>
                        <TextField
                          value={sellerDetails.sellerShop}
                          name="sellerShop"
                          error={!!errors.sellerShop}
                          helperText={errors.sellerShop}
                          onChange={(e) => {
                            onChange(e);
                          }}
                          sx={{ "& input": { padding: "5px 10px" } }}
                        />
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Owner name:" />
                      <ListItemText sx={{ textAlign: "end" }}>
                        <TextField
                          value={sellerDetails.sellerName}
                          name="sellerName"
                          error={!!errors.sellerName}
                          helperText={errors.sellerName}
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
                          value={sellerDetails.sellerEmail}
                          name="sellerEmail"
                          onChange={(e) => {
                            onChange(e);
                          }}
                          error={!!errors.sellerEmail}
                          helperText={errors.sellerEmail}
                          sx={{ "& input": { padding: "5px 10px" } }}
                        />
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Mobile" />
                      <ListItemText sx={{ textAlign: "end" }}>
                        <TextField
                          value={sellerDetails.sellerMobile}
                          name="sellerMobile"
                          error={!!errors.sellerMobile}
                          helperText={errors.sellerMobile}
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
                        sx={{ textAlign: "center", flexBasis: "70%" }}
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
                          value={sellerDetails.sellerDoor}
                          name="sellerDoor"
                          error={!!errors.sellerDoor}
                          helperText={errors.sellerDoor}
                          onChange={(e) => {
                            onChange(e);
                          }}
                          sx={{
                            "& input": { padding: "5px 10px" },
                          }}
                        />
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Street" />
                      <ListItemText sx={{ textAlign: "end" }}>
                        <TextField
                          value={sellerDetails.sellerStreet}
                          name="sellerStreet"
                          error={!!errors.sellerStreet}
                          helperText={errors.sellerStreet}
                          onChange={(e) => {
                            onChange(e);
                          }}
                          sx={{
                            "& input": { padding: "5px 10px" },
                          }}
                        />
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="City / Town / Village" />
                      <ListItemText sx={{ textAlign: "end" }}>
                        <TextField
                          value={sellerDetails.sellerCity}
                          name="sellerCity"
                          id="sellerCity"
                          error={!!errors.sellerCity}
                          helperText={errors.sellerCity}
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
                          value={sellerDetails.sellerDistrict}
                          name="sellerDistrict"
                          error={!!errors.sellerDistrict}
                          helperText={errors.sellerDistrict}
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
                          value={sellerDetails.sellerState}
                          name="sellerState"
                          error={!!errors.sellerState}
                          helperText={errors.sellerState}
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
                            value={sellerDetails.sellerCountry}
                            name="sellerCountry"
                            error={!!errors.sellerCountry}
                            helperText={errors.sellerCountry}
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
                            value={sellerDetails.sellerZipCode}
                            name="sellerZipCode"
                            error={!!errors.sellerZipCode}
                            helperText={errors.sellerZipCode}
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

export default SellerProfileEdit;
