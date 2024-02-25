import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentSeller: null,
    error: null,
    loading: false,
}

const sellerSlice = createSlice({
    name: 'seller',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentSeller = action.payload;
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
            state.error = null;
            state.loading = false;
        },
        signOutFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
})

export const { signInStart, signInSuccess, signInFailure, signOutStart, signOutSuccess, signOutFailure } = sellerSlice.actions;

export default sellerSlice.reducer;