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
      FORGET_PASSWORD: {
        REQUEST: "/investors/forget-password",
        VERIFY_OTP: "/investors/forget-password/verify-otp",
        RESET_PASSWORD: "/investors/forget-password/reset-password",
      },
    },
    ADMIN: {
      BASE: "/admin",
      LOGIN: "/admin/login",
    },
  },
  ADMIN: {
    BASE: "",
    USERS: "/users",
    INVESTORS: "/investors",
    UPDATE_USER_STATUS: "/users/update-status",
    UPDATE_INVESTOR_STATUS: "/investors/update-status",
  },
};
