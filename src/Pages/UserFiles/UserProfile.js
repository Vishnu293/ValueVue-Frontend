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
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
} from "../../redux/user/userSlice.js";

const UserProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [userDetails, setUserDetails] = useState("");
  const dispatch = useDispatch();
  const validationSchema = Yup.object().shape({
    userPassword: Yup.string()
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
        "Password must contain at least 6 characters, one uppercase letter, one lowercase letter, one number and one special character"
      )
      .required("Password Required !"),
    userCPassword: Yup.string()
      .oneOf([Yup.ref("userPassword")], "Passwords must match")
      .required("Confirm Password Required !"),
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSignOut = (e) => {
    dispatch(signOutStart());
    axios
      .get("http://localhost:8080/user/signout")
      .then((res) => {
        if (res.data.success === false) {
          dispatch(signOutFailure(res.message));
          return;
        }
        dispatch(signOutSuccess(res));
        navigate("/signin");
      })
      .catch((err) => {
        dispatch(signOutFailure(err.message));
        console.log(err);
      });
  };

  const Save = async (values, formikProps) => {
    dispatch(signInStart());

    const userDetailsObj = {
      userPassword: values.userPassword,
      userCPassword: values.userCPassword,
    };

    const res = await axios.post(
      `http://localhost:8080/user/edit/details/${currentUser.data._id}`,
      userDetailsObj
    );

    dispatch(signInSuccess(res));
    setUserDetails({ userPassword: "", userCPassword: "" });
    Swal.fire({
      title: "Update Successful!",
      icon: "success",
      confirmButtonText: "OK",
    });
    if (res.success === false) {
      dispatch(signInFailure(res.message));
      return;
    }
    navigate("/userprofile");
    formikProps.resetForm();
  };

  const imageData = currentUser?.data?.userAvatar?.buffer;
  const dataUrl = `data:${
    currentUser?.data?.userAvatar?.mimetype
  };base64,${imageData?.toString("base64")}`;

  return (
    <Box>
      <Navbar />
      <Category />
      <Icon
        style={{
          cursor: "pointer",
          padding: "1.5rem",
          marginLeft: "1rem",
          marginBottom: "0.5rem",
          color: "black",
        }}
        onClick={() => navigate("/")}
      >
        <ArrowBackIcon />
      </Icon>
      <Card
        sx={{
          padding: "20px",
          margin: "15px",
          marginTop: "0",
          height: "70vh",
          width: "90vw",
          margin: "1.8rem auto",
          gap: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            flexBasis: "20%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            alt="User Profile"
            src={dataUrl}
            sx={{
              margin: "18.7% auto",
              width: "100px",
              height: "100px",
            }}
          />
          <p>{currentUser.data.userName}</p>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            sx={{
              width: "113%",
              marginTop: "20px",
            }}
          >
            <Tab label="Personal Details" />
            <Tab label="Change Password" />
          </Tabs>
        </div>
        <Divider orientation="vertical" variant="middle" flexItem />
        {value === 0 && (
          <div style={{ flexBasis: "80%", height: "72vh" }}>
            <h1
              style={{
                textAlign: "center",
                margin: "15px auto",
                fontSize: "20px",
                paddingBottom: "0.5rem",
              }}
            >
              Personal Details
            </h1>
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
                    <ListItemText primary="Username:" />
                    <ListItemText
                      secondary={currentUser.data.userName}
                      sx={{ textAlign: "end" }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Email" />
                    <ListItemText
                      secondary={currentUser.data.userEmail}
                      sx={{ textAlign: "end" }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Mobile" />
                    <ListItemText
                      secondary={currentUser.data.userMobile}
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
                      secondary={currentUser.data.userDoor}
                      sx={{ textAlign: "end" }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Street" />
                    <ListItemText
                      secondary={currentUser.data.userStreet}
                      sx={{ textAlign: "end" }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="City" />
                    <ListItemText
                      secondary={currentUser.data.userCity}
                      sx={{ textAlign: "end" }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="District" />
                    <ListItemText
                      secondary={currentUser.data.userDistrict}
                      sx={{ textAlign: "end" }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="State" />
                    <ListItemText
                      secondary={currentUser.data.userState}
                      sx={{ textAlign: "end" }}
                    />
                  </ListItem>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <ListItem sx={{ flexBasis: "50%" }}>
                      <ListItemText primary="Country" />
                      <ListItemText
                        secondary={currentUser.data.userCountry}
                        sx={{ textAlign: "end" }}
                      />
                    </ListItem>
                    <ListItem sx={{ flexBasis: "50%" }}>
                      <ListItemText primary="Zip Code" />
                      <ListItemText
                        secondary={currentUser.data.userZipCode}
                        sx={{ textAlign: "end" }}
                      />
                    </ListItem>
                  </Box>
                </List>
              </Box>
            </Box>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/userprofile/edit");
                }}
                sx={{
                  fontWeight: "600",
                  "&:hover": { color: "gold" },
                  margin: "20px auto",
                }}
              >
                Edit
              </Button>
            </div>
          </div>
        )}
        {value === 1 && (
          <Box
            style={{ flexBasis: "80%", height: "100%", position: "relative" }}
          >
            <h1
              style={{
                textAlign: "center",
                margin: "15px auto",
                fontSize: "20px",
                paddingBottom: "0.5rem",
              }}
            >
              Change Password
            </h1>
            <Formik
              initialValues={{
                userPassword: "",
                userCPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values, formikProps) => {
                Save(values, formikProps);
              }}
            >
              {(formikProps) => (
                <Form>
                  <List sx={{ margin: "20px" }}>
                    <ListItem>
                      <ListItemText primary="Password:" />
                      <ListItemText sx={{ textAlign: "end" }}>
                        <TextField
                          name="userPassword"
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
                            formikProps.errors.userPassword &&
                            formikProps.touched.userPassword
                          }
                          helperText={
                            formikProps.errors.userPassword &&
                            formikProps.touched.userPassword &&
                            formikProps.errors.userPassword
                          }
                          sx={{
                            "& input": { padding: "5px 10px" },
                            width: "400px",
                          }}
                          {...formikProps.getFieldProps("userPassword")}
                        />
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Confirm Password:" />
                      <ListItemText sx={{ textAlign: "end" }}>
                        <TextField
                          name="userCPassword"
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
                            formikProps.errors.userCPassword &&
                            formikProps.touched.userCPassword
                          }
                          helperText={
                            formikProps.errors.userCPassword &&
                            formikProps.touched.userCPassword &&
                            formikProps.errors.userCPassword
                          }
                          sx={{
                            "& input": { padding: "5px 10px" },
                            width: "400px",
                          }}
                          {...formikProps.getFieldProps("userCPassword")}
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
                      bottom: "0.65rem",
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
                        disabled={!formikProps.isValid || !formikProps.dirty}
                        sx={{
                          fontWeight: "600",
                          "&:hover": { color: "gold" },
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
      </Card>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleSignOut}
          sx={{ fontWeight: "600", "&:hover": { color: "gold" } }}
        >
          Signout
        </Button>
      </div>
    </Box>
  );
};

export default UserProfile;