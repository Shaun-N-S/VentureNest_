// src/infrastructure/constants/routes.ts

export const ROUTES = {
  AUTH: {
    USER: {
      BASE: "/users",
      VERIFY_OTP: "/users/verify-otp",
      RESEND_OTP: "/users/resend-otp",
      LOGIN: "/users/login",
      FORGET_PASSWORD: {
        REQUEST: "/users/forget-password",
        VERIFY_OTP: "/users/forget-password/verify-otp",
        RESET_PASSWORD: "/users/forget-password/reset-password",
      },
    },
    INVESTOR: {
      BASE: "/investors",
      VERIFY_OTP: "/investors/verify-otp",
      RESEND_OTP: "/investors/resend-otp",
      LOGIN: "/investors/login",
    },
    ADMIN: {
      LOGIN: "/admin/login",
      USERS: "/admin/users",
    },
  },
};
