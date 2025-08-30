import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import { api } from "../services/api";

// Async thunk to update user info via RTK Query mutation
export const updateUserInfo = createAsyncThunk(
  "user/updateUserInfo",
  async ({ formData, triggerUpdateUserApi }, { rejectWithValue }) => {
    try {
      // Call your existing API mutation
      const response = await triggerUpdateUserApi(formData).unwrap();

      // Save data in SecureStore
      await SecureStore.setItemAsync("userFullName", formData.get("fullName"));
      await SecureStore.setItemAsync("userEmail", formData.get("email"));
      await SecureStore.setItemAsync("userContactNo", formData.get("contactNo"));

      return {
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        contactNo: formData.get("contactNo"),
      };
    } catch (error) {
      return rejectWithValue(error.data?.message || error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    fullName: null,
    email: null,
    contactNo: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.fullName = action.payload.fullName;
      state.email = action.payload.email;
      state.contactNo = action.payload.contactNo;
    },
    clearUserData: (state) => {
      state.fullName = null;
      state.email = null;
      state.contactNo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.fullName = action.payload.fullName;
        state.email = action.payload.email;
        state.contactNo = action.payload.contactNo;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
