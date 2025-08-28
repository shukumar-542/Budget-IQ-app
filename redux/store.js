import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
