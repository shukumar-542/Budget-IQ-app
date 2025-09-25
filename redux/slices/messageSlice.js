// redux/slices/messageSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  success: null,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    saveApiSuccess(state, action) {
      state.success = action.payload;
    },
    removeApiSuccess(state) {
      state.success = null; // reset to initial state
    },
  },
});

export const { saveApiSuccess, removeApiSuccess } = messageSlice.actions;
export const selectApiSuccess = (state) => state.message.success;
export default messageSlice.reducer;
