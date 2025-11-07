export const ROUTES = {
  AUTH: {
    USER: {
      BASE: "/users",
      VERIFY_OTP: "/users/verify-otp",
      RESEND_OTP: "/users/resend-otp",
      LOGIN: "/users/login",
      REFRESH: "/refresh",
      LOGOUT: "/users/logout",
      GOOGLE_LOGIN: "/users/google-login",
      FORGET_PASSWORD: {
        REQUEST: "/users/forget-password",
        VERIFY_OTP: "/users/forget-password/verify-otp",
        RESET_PASSWORD: "/users/forget-password/reset-password",
      },
      GET_PROFILE_IMG: "/users/get-profileImg/:id",
      SET_INTERESTED_TOPICS: "/users/interested-topics",
    },
    INVESTOR: {
      BASE: "/investors",
      VERIFY_OTP: "/investors/verify-otp",
      RESEND_OTP: "/investors/resend-otp",
      LOGIN: "/investors/login",
      GOOGLE_LOGIN: "/investors/google-login",
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

  USERS: {
    PROFILE: {
      FETCH_DATA: "/profile/:id",
      UPDATE: "/profile-update",
    },
  },

  INVESTORS: {
    PROFILE: {
      COMPLETION: "/investor/profile-completion",
      FETCH_DATA: "/profile/:id",
      UPDATE: "/profile-update",
    },
  },
};
