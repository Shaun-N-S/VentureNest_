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
    PROJECTS: "/admin/projects",
    PROJECTS_UPDATE_STATUS: "/admin/projects/update-status",
    REPORTED_POSTS: "/admin/reports/posts",
    REPORTED_POST: "/admin/reports/posts/:postId",
    REPORTED_PROJECTS: "/admin/reports/projects",
    REPORTED_PROJECT: "/admin/reports/projects/:projectId",
    UPDATE_REPORT_STATUS: "/admin/reports/:reportId/status",
    POST_BY_ID: "/admin/content/posts/:postId",
    PROJECT_BY_ID: "/admin/content/projects/:projectId",
    PLANS: "/admin/plans",
    PLAN_BY_ID: "/admin/plans/:planId",
    PLAN_STATUS: "/admin/plans/:planId/status",
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
    FETCH_PERSONAL_POST_BY_ID: "/posts/personal/:userId",
    FEED: "/posts/feed",
    REMOVE: "/posts/remove/:id",
    LIKES: "/posts/likes/:postId",
    LIKED_BY: "/posts/:postId/likes",
  },

  PROJECT: {
    ADD: "/projects",
    UPDATE_PROJECT: "/projects/update/:projectId",
    FETCH_ALL_PROJECTS: "/projects",
    FETCH_PERSONAL_PROJECT: "/projects/personal",
    FETCH_PERSONAL_PROJECT_BY_ID: "/projects/personal/:userId",
    REMOVE_PROJECT: "/projects/remove/:projectId",
    FETCH_SINGLE_PROJECT: "/projects/:projectId",
    ADD_MONTHLY_REPORT: "/projects/monthly-report/:projectId",
    VERIFY_STARTUP: "/projects/verify/:projectId",
    LIKES: "/projects/likes/:projectId",
  },

  RELATIONSHIP: {
    GET_NETWORK_USERS: "/relations/relationship",
    CONNECTION_REQ: "/relations/connection-req/:toUserId",
    GET_PERSONAL_CONNECTION_REQ: "/relations/personal/connection-req",
    CONNECTION_STATUS_UPDATE: "/relations/update/connection-req",
    GET_CONNECTIONS_PEOPLE: "/relations/connections-people-list",
    REMOVE_CONNECTION: "/relations/remove/connection/:userId",
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

  REPORT: {
    CREATE: "/reports",
  },

  PLANS: {
    AVAILABLE_PLANS: "/plans/available",
  },

  SUBSCRIPTION: {
    CHECKOUT: "/subscriptions/checkout",
  },

  TICKET: {
    CREATE: "/tickets/investor/tickets",
    GET_BY_INVESTOR: "/tickets/investor",
    GET_BY_FOUNDER: "/tickets/founder",
  },

  SESSION: {
    CANCEL_SESSION: "/sessions/:sessionId/cancel",
    ADD_FEEDBACK: "/sessions/:sessionId/feedback",
  },

  PITCH: {
    CREATE: "/pitches/pitch",
    RECEIVED: "/pitches/received",
    SENT: "/pitches/sent",
    RESPOND: "/pitches/:pitchId/respond",
  },

  OFFERS: {
    CREATE: "/offers/investment-offer",
  },
};
