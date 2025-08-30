import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api";
import authReducer from "./slices/authSlice";
import subscriptionSlice from "./slices/SubscriptionSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    subscription: subscriptionSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
