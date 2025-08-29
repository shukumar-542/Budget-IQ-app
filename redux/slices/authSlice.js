import { createSlice } from "@reduxjs/toolkit";
import { saveAuthData, deleteAuthData } from "../../utils/secureStore";


const authSlice = createSlice({
  name: "auth",
  initialState: { token: null },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      saveAuthData(action.payload); // persist securely
    },
    clearToken: (state) => {
      state.token = null;
      deleteAuthData(); // remove from SecureStore
    },
    loadTokenFromStorage: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { setToken, clearToken, loadTokenFromStorage } = authSlice.actions;
export default authSlice.reducer;
