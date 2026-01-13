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
    PROJECTS: "/projects",
    UPDATE_USER_STATUS: "/users/update-status",
    UPDATE_INVESTOR_STATUS: "/investors/update-status",
    UPDATE_PROJECT_STATUS: "/projects/update-status",
    FETCH_USER_KYC: "/users/kyc",
    FETCH_INVESTOR_KYC: "/investors/kyc",
    UPDATE_USER_KYC: "/users/update-kyc",
    UPDATE_INVESTOR_KYC: "/investors/update-kyc",
    REPORTED_POSTS: "/reports/posts",
    REPORTED_POST_DETAILS: "/reports/posts/:postId",
    REPORTED_PROJECTS: "/reports/projects",
    REPORTED_PROJECT_DETAILS: "/reports/projects/:projectId",
    UPDATE_REPORT_STATUS: "/reports/:reportId/status",
    POST_BY_ID: "/content/posts/:postId",
    PROJECT_BY_ID: "/content/projects/:projectId",
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

  KYC: {
    UPDATE: "/kyc-update",
  },

  POST: {
    ADD: "/add",
    PERSONAL_POST: "/personal",
    FEED: "/feed",
    REMOVE: "/remove/:id",
    LIKE: "/likes/:postId",
  },

  PROJECT: {
    CREATE: "/",
    UPDATE: "/update/:projectId",
    FETCH_PROJECTS: "/",
    PERSONAL_PROJECTS: "/personal",
    REMOVE: "/remove/:projectId",
    SINGLE_PROJECT: "/:projectId",
    ADD_MONTHLY_REPORT: "/monthly-report/:projectId",
    VERIFY_PROJECT: "/verify/:projectId",
    LIKE: "/likes/:projectId",
  },

  RELATIONSHIP: {
    GET_USERS: "/relationship",
    CONNECTION_REQ: "/connection-req/:toUserId",
    GET_PERSONAL_CONNECTION_REQ: "/personal/connection-req",
    UPDATE_CONNECTION_REQ: "/update/connection-req/:fromUserId/:status",
    GET_CONNECTIONS_PEOPLE: "/connections-people-list",
  },

  COMMENT: {
    ADD_COMMENT: "/add/:postId",
    FETCH_COMMENTS: "/fetch/:postId",
    REMOVE_COMMENT: "/remove",
    LIKE_COMMENT: "/likes/:commentId",
  },

  REPLIES: {
    ADD_REPLIES: "/:commentId",
    FETCH_REPLIES: "/:commentId",
    REMOVE_REPLIES: "/remove",
    LIKE_REPLIES: "/likes/:replyId",
  },

  REPORTS: {
    CREATE: "/",
    REPORTED_POSTS: "/reported-posts",
    REPORTED_PROJECTS: "/reported-projects",
  },
};
