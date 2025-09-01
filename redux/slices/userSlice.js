import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import { api } from "../services/api";

// =======================
// Async thunk to update user info
// =======================
export const updateUserInfo = createAsyncThunk(
  "user/updateUserInfo",
  async ({ formData, triggerUpdateUserApi }, { rejectWithValue }) => {
    try {
      // Call your existing API mutation
      const response = await triggerUpdateUserApi(formData).unwrap();

      // Save non-image data in SecureStore
      await SecureStore.setItemAsync("userFullName", formData.get("fullName"));
      await SecureStore.setItemAsync("userEmail", formData.get("email"));
      await SecureStore.setItemAsync("userContactNo", formData.get("contactNo"));

      // Save image URI locally
      if (formData.get("file")) {
        await SecureStore.setItemAsync("userImage", formData.get("file").uri);
      }

      return {
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        contactNo: formData.get("contactNo"),
        imageUrl: formData.get("file") ? formData.get("file").uri : null,
      };
    } catch (error) {
      return rejectWithValue(error.data?.message || error.message);
    }
  }
);

// =======================
// Async thunk to delete user info
// =======================
export const deleteUserInfo = createAsyncThunk(
  "user/deleteUserInfo",
  async ({ triggerDeleteUserApi }, { rejectWithValue }) => {
    try {
      // Call your existing API delete mutation
      await triggerDeleteUserApi().unwrap();

      // Clear user data from SecureStore
      await SecureStore.deleteItemAsync("userFullName");
      await SecureStore.deleteItemAsync("userEmail");
      await SecureStore.deleteItemAsync("userContactNo");
      await SecureStore.deleteItemAsync("userImage");

      return true; // success flag
    } catch (error) {
      return rejectWithValue(error.data?.message || error.message);
    }
  }
);

// =======================
// User slice
// =======================
const userSlice = createSlice({
  name: "user",
  initialState: {
    fullName: null,
    email: null,
    contactNo: null,
    imageUrl: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.fullName = action.payload.fullName;
      state.email = action.payload.email;
      state.contactNo = action.payload.contactNo;
      state.imageUrl = action.payload.imageUrl;
    },
    clearUserData: (state) => {
      state.fullName = null;
      state.email = null;
      state.contactNo = null;
      state.imageUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update cases
      .addCase(updateUserInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.fullName = action.payload.fullName;
        state.email = action.payload.email;
        state.contactNo = action.payload.contactNo;
        state.imageUrl = action.payload.imageUrl;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Delete cases
      .addCase(deleteUserInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUserInfo.fulfilled, (state) => {
        state.status = "succeeded";
        state.fullName = null;
        state.email = null;
        state.contactNo = null;
        state.imageUrl = null;
      })
      .addCase(deleteUserInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
