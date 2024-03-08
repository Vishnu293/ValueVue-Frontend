import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  TextField,
  Icon,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice.js";
import { selectLocation } from "../../redux/location/locationSlice.js";
import Cookies from "js-cookie";

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const { loading, error } = useSelector((state) => state.user);

  const formik = useFormik({
    initialValues: {
      userEmail: "",
      userPassword: "",
    },
    validationSchema: Yup.object({
      userEmail: Yup.string()
        .email("Invalid email address")
        .required("Email Required !"),
      userPassword: Yup.string().required("Password Required !"),
    }),
  });

  const signIn = (values) => {
    dispatch(signInStart());
    axios
      .post("http://localhost:8080/user/get", values)
      .then((response) => {
        Cookies.set("login", true);
        if (response.success === false) {
          dispatch(signInFailure(response.message));
          return;
        }
        dispatch(signInSuccess(response));
        const location = {
          description: response?.data?.userCity,
          lat: response?.data?.userCords.lat,
          lng: response?.data?.userCords.lng,
        };
        dispatch(selectLocation(location));
        navigate("/");
      })
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <Box>
      <Grid
        container
        spacing={3}
        alignItems="center"
        justifyContent="flex-start"
        sx={{
          height: "100%",
          width: "80%",
          margin: "5% auto",
          textAlign: "center",
        }}
      >
        <Grid item xs={12}>
          <TextField
            label="Email"
            placeholder="Enter Your Email"
            variant="standard"
            helperText={formik.touched.userEmail && formik.errors.userEmail}
            value={formik.values.userEmail}
            style={{ width: "100%" }}
            name="userEmail"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.userEmail && Boolean(formik.errors.userEmail)}
            required
            inputRef={inputRef}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Password"
            placeholder="Enter Your Password"
            type={formik.values.showPassword ? "text" : "password"}
            variant="standard"
            helperText={
              formik.touched.userPassword && formik.errors.userPassword
            }
            value={formik.values.userPassword}
            style={{ width: "100%" }}
            name="userPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.userPassword && Boolean(formik.errors.userPassword)
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
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={() => {
              signIn(formik.values);
            }}
            disabled={formik.isSubmitting}
            sx={{ fontWeight: "600", "&:hover": { color: "gold" } }}
          >
            Sign In
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Signin;
