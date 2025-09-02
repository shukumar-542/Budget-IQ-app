import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.10.20.72:5000/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token; // ✅ get token from Redux
      if (token) {
        headers.set("authorization", `${token}`);
      }
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
    verifyCode: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-code",
        method: "POST",
        body: data,
      }),
    }),
    resentOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),
    deleteUser: builder.mutation({
      query: (data) => ({
        url: "/users/delete-user",
        method: "DELETE",
        body: data,
      }),
    }),
    userInfoUpdate: builder.mutation({
      query: (data) => ({
        url: "/users/update-user",
        method: "PATCH",
        body: data,
      }),
    }),
    userGetMe: builder.query({
      query: () => ({
        url: "/users/get-me",
        method: "GET",
      }),
    }),
    getAllMemberShipPlan: builder.query({
      query: () => ({
        url: "/membership-plan",
        method: "GET",
      }),
    }),
    getMembership: builder.mutation({
      query: (id) => ({
        url: `/membership/${id}`, // dynamic URL
        method: "POST",
      }),
    }),
    getAllCategories: builder.query({
      query: (type) => ({
        url: `/category?type=${type}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        const resultWithFullImage = response.result.map((cat) => ({
          ...cat,
          categoryImage: `http://10.10.20.72:5000${cat.categoryImage}`, // prepend server
        }));
        return { ...response, result: resultWithFullImage };
      },
    }),
    getAllCategoriesWithSum: builder.query({
      query: () => ({
        url: "/category/with-sum",
        method: "GET",
      }),
      transformResponse: (response) => {
        const resultWithFullImage = response.result.map((cat) => ({
          ...cat,
          categoryImage: `http://10.10.20.72:5000${cat.categoryImage}`, // prepend server
        }));
        return { ...response, result: resultWithFullImage };
      },
    }),
    createTransaction: builder.mutation({
      query: (data) => ({
        url: "/transaction/create",
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
  useVerifyCodeMutation,
  useResentOtpMutation,
  useDeleteUserMutation,
  useUserInfoUpdateMutation,
  useUserGetMeQuery,
  useGetAllMemberShipPlanQuery,
  useGetMembershipMutation,
  useGetAllCategoriesQuery,
  useGetAllCategoriesWithSumQuery,
  useCreateTransactionMutation,
} = api;
