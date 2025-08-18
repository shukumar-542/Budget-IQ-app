import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const api = createApi({
  reducerPath: 'api',   // key for caching
  baseQuery: fetchBaseQuery({ baseUrl: 'http://10.10.20.72:5000/api/v1' }), 
  endpoints: (builder) => ({
   
    // Example POST request
     signUp: builder.mutation({
      query: (data) => ({
        url: '/users/sign-up',  
        method: 'POST',
        body: data,
      }),
    }),
  }),
});


export const { useSignUpMutation } = api;
