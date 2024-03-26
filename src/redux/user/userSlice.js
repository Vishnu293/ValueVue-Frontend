import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOutStart: (state) => {
      state.loading = true;
    },
    signOutSuccess: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
    },
    signOutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signOutStart,
  signOutSuccess,
  signOutFailure,
} = userSlice.actions;

export default userSlice.reducer;

export const checkAuthentication = () => (dispatch, getState) => {
  const { isAuthenticated } = getState().user;
  const loginCookie = Cookies.get("login");

  if (!loginCookie || !isAuthenticated) {
    dispatch(signOutStart());
    dispatch(signOutSuccess());
  }
};