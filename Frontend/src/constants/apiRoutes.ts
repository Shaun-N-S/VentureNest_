export const API_ROUTES = {
  AUTH: {
    USER_SIGNUP: "/auth/users",
    USER_VERIFY_OTP: "/auth/users/verify-otp",
    USER_RESEND_OTP: "/auth/users/resend-otp",
    USER_FORGET_PASSWORD: "/auth/users/forget-password",
    USER_FORGET_VERIFY_OTP: "/auth/users/forget-password/verify-otp",
    USER_RESET_PASSWORD: "/auth/users/forget-password/reset-password",
    USER_LOGIN: "/auth/users/login",

    INVESTOR_SIGNUP: "/auth/investors",
    INVESTOR_VERIFY_OTP: "/auth/investors/verify-otp",
    INVESTOR_RESEND_OTP: "/auth/investors/resend-otp",
    INVESTOR_LOGIN: "/auth/investors/login",

    ADMIN_LOGIN: "/auth/admin/login",
  },

  ADMIN: {
    USERS: "/admin/users",
    USERS_UPDATE_STATUS: "/admin/users/update-status",
    INVESTORS: "/admin/investors",
    INVESTORS_UPDATE_STATUS: "/admin/investors/update-status",
  },
};
