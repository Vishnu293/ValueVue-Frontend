import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    lat: null,
    lng: null,
    description: null,
}

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        selectLocation: (state, action) => {
            if (action.payload) {
                state.lat = action.payload.lat || null;
                state.lng = action.payload.lng || null;
                state.description = action.payload.description || null;
            }
        },
        clearLocation: (state) => {
            return initialState;
        },
    }
})

export const { selectLocation, clearLocation } = locationSlice.actions;

export default locationSlice.reducer;