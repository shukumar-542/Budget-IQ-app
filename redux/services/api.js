import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://budgetiq.net/api/v1",
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
      transformResponse: (response) => {
        if (response.success && response.data?.profileImageUrl) {
          return {
            ...response,
            data: {
              ...response.data,
              profileImageUrl: `${response.data.profileImageUrl}`,
            },
          };
        }
        return response;
      },
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
    getSpecificTransactionRecent: builder.query({
      query: ({ type, limit }) => ({
        url: `/transaction/recent-cost?type=${type}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        // Map through the result and prepend the server URL to categoryImage
        const resultWithFullImage = response.result.map((tx) => ({
          ...tx,
          category: {
            ...tx.category,
            categoryImage: tx.category?.categoryImage
              ? `${tx.category.categoryImage}`
              : null,
          },
        }));
        return { ...response, result: resultWithFullImage };
      },
    }),

    getAllCategories: builder.query({
      query: (type) => ({
        url: `/category?type=${type}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        const resultWithFullImage = response.result.map((cat) => ({
          ...cat,
          categoryImage: `${cat.categoryImage}`, // prepend server
        }));
        return { ...response, result: resultWithFullImage };
      },
    }),
    getAllCategoriesWithSum: builder.query({
      query: ({ type, time, savedCategory } = {}) => {
        const params = new URLSearchParams();
        if (type) params.append("type", type);
        if (time) params.append("time", time);

        // Handle savedCategory array
        if (savedCategory && Array.isArray(savedCategory)) {
          // Option 1: encode as JSON string
          params.append("savedCategory", JSON.stringify(savedCategory));

          // Option 2: multiple params (uncomment if your backend expects this)
          // savedCategory.forEach(id => params.append("savedCategory", id));
        }

        const queryString = params.toString();
        return {
          url: `/category/with-sum${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response) => {
        const resultWithFullImage = response.result.map((cat) => ({
          ...cat,
          categoryImage: `${cat.categoryImage}`,
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
    getPrivacyPolicy: builder.query({
      query: () => ({
        url: "/policy-term/policy",
        method: "GET",
      }),
    }),
    getTermsAndConditions: builder.query({
      query: () => ({
        url: "/policy-term/terms",
        method: "GET",
      }),
    }),
    getMessageWithTotalTransaction: builder.query({
      query: () => ({
        url: "/motivational-message/message",
        method: "GET",
      }),
    }),
    getUpdateTransaction: builder.mutation({
      query: (data) => ({
        url: `/transaction/update`,
        method: "PATCH",
        body: data, // data contains { amount, transactionId }
      }),
    }),
    getReviewTheApp: builder.mutation({
      query: (data) => ({
        url: "/review/create",
        method: "POST",
        body: data,
      }),
    }),
    currency: builder.mutation({
      query: (data) => ({
        url: "/users/choose-currency",
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
  useGetSpecificTransactionRecentQuery,
  useGetPrivacyPolicyQuery,
  useGetTermsAndConditionsQuery,
  useGetMessageWithTotalTransactionQuery,
  useLazyGetMessageWithTotalTransactionQuery,
  useGetUpdateTransactionMutation,
  useGetReviewTheAppMutation,
  useCurrencyMutation,
} = api;
