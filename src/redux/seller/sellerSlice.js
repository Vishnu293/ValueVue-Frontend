import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  currentSeller: null,
  isAuthenticated: false,
  error: null,
  loading: false,
};

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentSeller = action.payload;
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
      state.currentSeller = null;
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
} = sellerSlice.actions;

export default sellerSlice.reducer;

export const checkAuthentication = () => (dispatch, getState) => {
  const { isAuthenticated } = getState().seller;
  const loginCookie = Cookies.get("sellerLogin");

  if (!loginCookie || !isAuthenticated) {
    dispatch(signOutStart());
    dispatch(signOutSuccess());
  }
};
