import {
  Box,
  Card,
  List,
  ListItem,
  Avatar,
  ListItemText,
  Divider,
  Button,
  Tabs,
  Tab,
  TextField,
  Icon,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "../MyTheme";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useState } from "react";
import Navbar from "../HeaderFiles/Navbar.js";
import Category from "../HomeLayouts/Category.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  signOutStart,
  signOutSuccess,
  signOutFailure,
} from "../../redux/seller/sellerSlice.js";
import SellerQR from "./SellerQR.js";
import Cookies from "js-cookie";

const SellerProfile = () => {
  const { currentSeller } = useSelector((state) => state.seller);
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [sellerDetails, setSellerDetails] = useState("");
  const dispatch = useDispatch();
  const validationSchema = Yup.object().shape({
    sellerPassword: Yup.string()
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
        "Password must contain at least 6 characters, one uppercase letter, one lowercase letter, one number and one special character"
      )
      .required("Password Required !"),
    sellerCPassword: Yup.string()
      .oneOf([Yup.ref("sellerPassword")], "Passwords must match")
      .required("Confirm Password Required !"),
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSignOut = (e) => {
    dispatch(signOutStart());
    axios
      .get("http://localhost:8080/seller/signout")
      .then((res) => {
        if (res.data.success === false) {
          dispatch(signOutFailure(res.message));
          return;
        }
        dispatch(signOutSuccess(res));
        const currentTime = new Date();
        const expirationTime = new Date(currentTime.getTime() + 5000);
        Cookies.remove("sellerLogin", { path: "", expires: expirationTime });
        navigate("/signin");
      })
      .catch((err) => {
        dispatch(signOutFailure(err.message));
        console.log(err);
      });
  };

  const Save = async (values, formikProps) => {
    dispatch(signInStart());

    const sellerDetailsObj = {
      sellerPassword: values.sellerPassword,
      sellerCPassword: values.sellerCPassword,
    };

    const res = await axios.post(
      `http://localhost:8080/seller/edit/details/${currentSeller.data._id}`,
      sellerDetailsObj
    );

    dispatch(signInSuccess(res));
    setSellerDetails({ sellerPassword: "", sellerCPassword: "" });
    Swal.fire({
      title: "Update Successful!",
      icon: "success",
      confirmButtonText: "OK",
    });
    if (res.success === false) {
      dispatch(signInFailure(res.message));
      return;
    }
    navigate("/sellerprofile");
    formikProps.resetForm();
  };

  const imageData = currentSeller?.data?.sellerAvatar?.buffer;
  const dataUrl = `data:${
    currentSeller?.data?.sellerAvatar?.mimetype
  };base64,${imageData?.toString("base64")}`;

  return (
    <ThemeProvider theme={lightTheme}>
      <Box>
        <Navbar />
        <Category />
        <Icon
          sx={{
            cursor: "pointer",
            marginLeft: "1.5rem",
            marginBottom: "0.5rem",
            marginTop: "1rem",
            color: "black",
            fontSize: "1.5rem",
          }}
          onClick={() => navigate("/")}
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
                sx={{
                  margin: "1rem",
                  marginBottom: "0",
                  flexBasis: "80%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Avatar
                  alt="Seller Profile"
                  src={dataUrl}
                  sx={{
                    margin: "1rem",
                    width: "100px",
                    height: "100px",
                    flexBasis: "40%",
                  }}
                />
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
            <Card
              sx={{
                backgroundColor: "white",
                flexBasis: "70%",
              }}
            >
              <List sx={{ width: "100%" }}>
                <ListItem
                  sx={{
                    fontWeight: (theme) => theme.typography.fontWeightBold,
                    fontSize: "16px",
                    gap: 2,
                    paddingTop: "1rem",
                    paddingLeft: "1rem",
                  }}
                >
                  <PersonIcon sx={{ fontSize: "2rem" }} />
                  ACCOUNT SETTINGS
                </ListItem>
                <List>
                  <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    sx={{
                      padding: "0px",
                      width: "100",
                      "& .MuiTab-root": {
                        fontSize: "14px",
                        disableRipple: true,
                        "&:hover": {
                          backgroundColor: (theme) =>
                            `${theme.palette.primary.main}10`,
                        },
                        "&.Mui-selected": {
                          backgroundColor: (theme) =>
                            `${theme.palette.primary.main}10`,
                        },
                      },
                      "& .MuiTabs-indicator": {
                        width: "0.25rem",
                      },
                    }}
                  >
                    <Tab
                      label="Personal Details"
                      sx={{ fontSize: "14px", padding: "0px" }}
                      disableRipple
                    />
                    <Tab
                      label="Change Password"
                      sx={{ fontSize: "14px", padding: "0px" }}
                      disableRipple
                    />
                    <Tab
                      label="Your QR Code"
                      sx={{ fontSize: "14px", padding: "0px" }}
                      disableRipple
                    />
                  </Tabs>
                </List>
              </List>
              <Divider />
              <ListItem sx={{ padding: "0", margin: "1rem 0" }}>
                <Button
                  variant="text"
                  onClick={handleSignOut}
                  disableRipple
                  sx={{
                    color: "black",
                    width: "100%",
                    gap: 2,
                    "&:hover": {
                      color: "red",
                    },
                    display: "flex",
                    justifyContent: "flex-start",
                    paddingLeft: "1.1rem",
                  }}
                >
                  <PowerSettingsNewIcon sx={{ fontSize: "2rem" }} />
                  <Typography sx={{ fontSize: "16px", fontWeight: "600" }}>
                    Signout
                  </Typography>
                </Button>
              </ListItem>
              <Divider />
            </Card>
          </Box>
          <Card sx={{ flexBasis: "80%", padding: "1rem" }}>
            {value === 0 && (
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
                    gap: 2,
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
                        <ListItemText
                          secondary={currentSeller.data.sellerShop}
                          sx={{ textAlign: "end" }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Owner name:" />
                        <ListItemText
                          secondary={currentSeller.data.sellerName}
                          sx={{ textAlign: "end" }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Email" />
                        <ListItemText
                          secondary={currentSeller.data.sellerEmail}
                          sx={{ textAlign: "end" }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Mobile" />
                        <ListItemText
                          secondary={currentSeller.data.sellerMobile}
                          sx={{ textAlign: "end" }}
                        />
                      </ListItem>
                    </List>
                  </Box>
                  <Divider orientation="vertical" variant="middle" flexItem />
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
                        <ListItemText
                          secondary={currentSeller.data.sellerDoor}
                          sx={{ textAlign: "end" }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Street" />
                        <ListItemText
                          secondary={currentSeller.data.sellerStreet}
                          sx={{ textAlign: "end" }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="City" />
                        <ListItemText
                          secondary={currentSeller.data.sellerCity}
                          sx={{ textAlign: "end" }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="District" />
                        <ListItemText
                          secondary={currentSeller.data.sellerDistrict}
                          sx={{ textAlign: "end" }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="State" />
                        <ListItemText
                          secondary={currentSeller.data.sellerState}
                          sx={{ textAlign: "end" }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Country" />
                        <ListItemText
                          secondary={currentSeller.data.sellerCountry}
                          sx={{ textAlign: "end" }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Zip Code" />
                        <ListItemText
                          secondary={currentSeller.data.sellerZipCode}
                          sx={{ textAlign: "end" }}
                        />
                      </ListItem>
                    </List>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => {
                      navigate("/sellerprofile/edit");
                    }}
                    sx={{
                      fontWeight: "600",
                      "&:hover": {
                        color: (theme) => theme.palette.secondary.main,
                        backgroundColor: (theme) => theme.palette.primary.dark,
                      },
                      margin: "2rem auto",
                    }}
                  >
                    Edit
                  </Button>
                </Box>
              </Box>
            )}
            {value === 1 && (
              <Box
                sx={{ flexBasis: "80%", height: "100%", position: "relative" }}
              >
                <Typography
                  sx={{
                    textAlign: "center",
                    margin: "15px auto",
                    fontSize: "1.5rem",
                    fontWeight: (theme) => theme.typography.fontWeightBold,
                  }}
                >
                  Change Password
                </Typography>
                <Formik
                  initialValues={{
                    sellerPassword: "",
                    sellerCPassword: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={(values, formikProps) => {
                    Save(values, formikProps);
                  }}
                >
                  {(formikProps) => (
                    <Form>
                      <List>
                        <ListItem>
                          <ListItemText primary="Password:" />
                          <ListItemText sx={{ textAlign: "end" }}>
                            <TextField
                              name="sellerPassword"
                              placeholder="Enter the new password"
                              type={
                                formikProps.values.showPassword
                                  ? "text"
                                  : "password"
                              }
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() =>
                                        formikProps.setValues({
                                          ...formikProps.values,
                                          showPassword:
                                            !formikProps.values.showPassword,
                                        })
                                      }
                                      edge="end"
                                    >
                                      {formikProps.values.showPassword ? (
                                        <VisibilityOff />
                                      ) : (
                                        <Visibility />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              error={
                                formikProps.errors.sellerPassword &&
                                formikProps.touched.sellerPassword
                              }
                              helperText={
                                formikProps.errors.sellerPassword &&
                                formikProps.touched.sellerPassword &&
                                formikProps.errors.sellerPassword
                              }
                              sx={{
                                "& input": { padding: "5px 10px" },
                                width: "400px",
                              }}
                              {...formikProps.getFieldProps("sellerPassword")}
                            />
                          </ListItemText>
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Confirm Password:" />
                          <ListItemText sx={{ textAlign: "end" }}>
                            <TextField
                              name="sellerCPassword"
                              placeholder="Re-enter the new password"
                              type={
                                formikProps.values.showCPassword
                                  ? "text"
                                  : "password"
                              }
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() =>
                                        formikProps.setValues({
                                          ...formikProps.values,
                                          showCPassword:
                                            !formikProps.values.showCPassword,
                                        })
                                      }
                                      edge="end"
                                    >
                                      {formikProps.values.showCPassword ? (
                                        <VisibilityOff />
                                      ) : (
                                        <Visibility />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              error={
                                formikProps.errors.sellerCPassword &&
                                formikProps.touched.sellerCPassword
                              }
                              helperText={
                                formikProps.errors.sellerCPassword &&
                                formikProps.touched.sellerCPassword &&
                                formikProps.errors.sellerCPassword
                              }
                              sx={{
                                "& input": { padding: "5px 10px" },
                                width: "400px",
                              }}
                              {...formikProps.getFieldProps("sellerCPassword")}
                            />
                          </ListItemText>
                        </ListItem>
                      </List>
                      <Typography
                        sx={{
                          textAlign: "center",
                          marginTop: "2rem",
                        }}
                      >
                        <b>Important Notice:</b> To protect your account, we
                        recommend regularly changing your password.
                      </Typography>
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: "2.7rem",
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={() => {
                              Save(formikProps.values, formikProps);
                            }}
                            disabled={
                              !formikProps.isValid || !formikProps.dirty
                            }
                            sx={{
                              fontWeight: "600",
                              "&:hover": {
                                color: (theme) => theme.palette.secondary.main,
                                backgroundColor: (theme) =>
                                  theme.palette.primary.dark,
                              },
                            }}
                          >
                            Save
                          </Button>
                        </Box>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Box>
            )}
            {value === 2 && (
              <Box sx={{ flexBasis: "80%", height: "76vh", overflowY: "auto" }}>
                <Typography
                  sx={{
                    textAlign: "center",
                    margin: "15px auto",
                    fontSize: "1.5rem",
                    fontWeight: (theme) => theme.typography.fontWeightBold,
                  }}
                >
                  Your QR Code
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    We recommend using this QR code in your shop to provide easy
                    access to available products for customers.
                  </Typography>
                  <SellerQR
                    sellerId={currentSeller?.data?._id}
                    sellerName={currentSeller?.data?.sellerShop}
                    dataUrl={dataUrl}
                  />
                </Box>
              </Box>
            )}
          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SellerProfile;
