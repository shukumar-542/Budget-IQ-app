import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.10.20.72:5000/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token; // ✅ get token from Redux
      console.log("Token sent in header:", token); // debug
      if (token) {
        headers.set("authorization", `${token}`);
      }
      console.log(headers);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (data) => ({
        url: "/users/sign-up",
        method: "POST",
        body: data,
      }),
    }),
    verifyRegistration: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-registration",
        method: "POST",
        body: data,
      }),
    }),
    signIn: builder.mutation({
      query: (data) => ({
        url: "/auth/sign-in",
        method: "POST",
        body: data,
      }),
    }),
    logIn: builder.mutation({
      query: (data) => ({
        url: "/auth/sign-in",
        method: "POST",
        body: data,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: data,
      }),
    }),
    iqBuddy: builder.mutation({
      query: (data) => ({
        url: "/iqbuddy",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useVerifyRegistrationMutation,
  useIqBuddyMutation,
  useSignInMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
} = api;
