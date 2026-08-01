import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  // baseUrl: "http://localhost:5001/api/auth",
baseUrl:"https://production-ready-multi-method.onrender.com/api/auth",
  credentials: "include",

  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // Make the original request
  let result = await baseQuery(args, api, extraOptions);

  // If access token expired
  if (result.error && result.error.status === 401) {
    console.log("Access token expired. Refreshing...");

    // Request a new access token
    const refreshResult = await baseQuery(
      {
        url: "/refresh-token",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.data?.accessToken) {
      // Save new access token
      localStorage.setItem(
        "accessToken",
        refreshResult.data.accessToken
      );

      console.log("Access token refreshed successfully");

      // Retry the original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log("Refresh token expired. Logging out...");

      localStorage.removeItem("accessToken");

      // Redirect to login page
      window.location.href = "/login";
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),

    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    resendOtp: builder.mutation({
      query: (email) => ({
        url: "/resend-otp",
        method: "POST",
        body: { email },
      }),
    }),

    setPassword: builder.mutation({
      query: (data) => ({
        url: "/set-password",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),

    getMe: builder.query({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: "/refresh-token",
        method: "POST",
      }),
    }),

    sendEmailLoginOtp: builder.mutation({
  query: (email) => ({
    url: "/login/email-otp/send",
    method: "POST",
    body: { email },
  }),
}),

verifyEmailLoginOtp: builder.mutation({
  query: (data) => ({
    url: "/login/email-otp/verify",
    method: "POST",
    body: data,
  }),
}),

sendPhoneLoginOtp: builder.mutation({
  query: (phone) => ({
    url: "/login/phone-otp/send",
    method: "POST",
    body: { phone },
  }),
}),

verifyPhoneLoginOtp: builder.mutation({
  query: (data) => ({
    url: "/login/phone-otp/verify",
    method: "POST",
    body: data,
  }),
}),

forgotPassword: builder.mutation({
  query: (email) => ({
    url: "/forgot-password",
    method: "POST",
    body: { email },
  }),
}),

verifyForgotOtp: builder.mutation({
  query: (data) => ({
    url: "/verify-forgot-otp",
    method: "POST",
    body: data,
  }),
}),

resetPassword: builder.mutation({
  query: (data) => ({
    url: "/reset-password",
    method: "POST",
    body: data,
  }),
}),

  }),
});

export const {
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useSetPasswordMutation,
  useLoginMutation,
  useGetMeQuery,
  useLogoutMutation,
  useRefreshTokenMutation,
  
  useSendEmailLoginOtpMutation,
  useVerifyEmailLoginOtpMutation,
  
  useSendPhoneLoginOtpMutation,
  useVerifyPhoneLoginOtpMutation,

  useForgotPasswordMutation,
  useVerifyForgotOtpMutation,
  useResetPasswordMutation,
} = authApi;