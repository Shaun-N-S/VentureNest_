export const API_ROUTES = {
  AUTH: {
    USER_SIGNUP: "/auth/users",
    USER_VERIFY_OTP: "/auth/users/verify-otp",
    USER_RESEND_OTP: "/auth/users/resend-otp",
    USER_FORGET_PASSWORD: "/auth/users/forget-password",
    USER_FORGET_VERIFY_OTP: "/auth/users/forget-password/verify-otp",
    USER_RESET_PASSWORD: "/auth/users/forget-password/reset-password",
    USER_LOGIN: "/auth/users/login",
    USER_GOOGLE_LOGIN: "/auth/users/google-login",

    INVESTOR_SIGNUP: "/auth/investors",
    INVESTOR_VERIFY_OTP: "/auth/investors/verify-otp",
    INVESTOR_RESEND_OTP: "/auth/investors/resend-otp",
    INVESTOR_LOGIN: "/auth/investors/login",
    INVESTOR_RESET_PASSWORD: "/auth/investors/forget-password/reset-password",
    INVESTOR_PROFILE_COMPLETION: "/auth/investor/profile-completion",
    INVESTOR_GOOGLE_LOGIN: "/auth/investors/google-login",

    ADMIN_LOGIN: "/auth/admin/login",

    REFRESH: "/auth/refresh",

    GET_PROFILEIMG: "/auth/users/get-profileImg/:id",

    USERS_LOGOUT: "/auth/users/logout",
  },

  ADMIN: {
    USERS: "/admin/users",
    USERS_UPDATE_STATUS: "/admin/users/update-status",
    INVESTORS: "/admin/investors",
    INVESTORS_UPDATE_STATUS: "/admin/investors/update-status",
    FETCH_USERS_KYC: "/admin/users/kyc",
    FETCH_INVESTORS_KYC: "/admin/investors/kyc",
    UPDATE_USERS_KYC: "/admin/users/update-kyc",
    UPDATE_INVESTORS_KYC: "/admin/investors/update-kyc",
  },

  INVESTOR: {
    PROFILE: {
      GET_PROFILE: "/investor/profile/:id",
      UPDATE: "/investor/profile-update",
    },
    KYC: {
      UPDATE: "/investor/kyc-update",
    },
  },

  USER: {
    PROFILE: {
      GET_PROFILE: "/user/profile/:id",
      UPDATE: "/user/profile-update",
    },
  },

  POST: {
    ADD: "/posts/add",
    FETCH_PERSONAL_POST: "/posts/personal",
    FEED: "/posts/feed",
    REMOVE: "/posts/remove/:id",
    LIKES: "/posts/likes/:postId",
  },

  PROJECT: {
    ADD: "/projects",
    UPDATE_PROJECT: "/projects/update/:projectId",
    FETCH_ALL_PROJECTS: "/projects",
    FETCH_PERSONAL_PROJECT: "/projects/personal",
    REMOVE_PROJECT: "/projects/remove/:projectId",
    FETCH_SINGLE_PROJECT: "/projects/:projectId",
    ADD_MONTHLY_REPORT: "/projects/monthly-report/:projectId",
    VERIFY_STARTUP: "/projects/verify/:projectId",
  },

  RELATIONSHIP: {
    GET_NETWORK_USERS: "/relations/relationship",
    CONNECTION_REQ: "/relations/connection-req/:toUserId",
    GET_PERSONAL_CONNECTION_REQ: "/relations/personal/connection-req",
    CONNECTION_STATUS_UPDATE: "/relations/update/connection-req",
  },

  COMMENT: {
    ADD_COMMENT: "/comment/add",
    FETCH_COMMENT: "/comment/fetch/:postId",
    LIKE_COMMENT: "/comment/likes/:commentId",
  },

  REPLY: {
    ADD_REPLY: "/replies",
    FETCH_REPLY: "/replies/:commentId",
    LIKE_REPLY: "/replies/likes/:replyId",
  },
};
