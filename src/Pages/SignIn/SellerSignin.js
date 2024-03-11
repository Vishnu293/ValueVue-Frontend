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
} from "../../redux/seller/sellerSlice";
import Cookies from "js-cookie";

const SellerSignin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const { loading, error } = useSelector((state) => state.seller);

  const formik = useFormik({
    initialValues: {
      sellerEmail: "",
      sellerPassword: "",
    },
    validationSchema: Yup.object({
      sellerEmail: Yup.string()
        .email("Invalid email address")
        .required("Email Required !"),
      sellerPassword: Yup.string().required("Password Required !"),
    }),
  });

  const signIn = (values) => {
    dispatch(signInStart());
    axios
      .post("http://localhost:8080/seller/signin", values)
      .then((response) => {
        if (response.success === false) {
          dispatch(signInFailure(response.message));
          return;
        }
        dispatch(signInSuccess(response));
        Cookies.set("sellerLogin", true, { expires: 7 });
        navigate("/");
      });
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
            helperText={formik.touched.sellerEmail && formik.errors.sellerEmail}
            value={formik.values.sellerEmail}
            style={{ width: "100%" }}
            name="sellerEmail"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.sellerEmail && Boolean(formik.errors.sellerEmail)
            }
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
              formik.touched.sellerPassword && formik.errors.sellerPassword
            }
            value={formik.values.sellerPassword}
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

export default SellerSignin;
