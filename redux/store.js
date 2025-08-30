import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api";
import authReducer from "./slices/authSlice";
import subscriptionSlice from "./slices/SubscriptionSlice";
import userSlice from "./slices/userSlice";
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    subscription: subscriptionSlice,
    user: userSlice, // add user reducer here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
