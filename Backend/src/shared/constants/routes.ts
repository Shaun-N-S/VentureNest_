export const ROUTES = {
  AUTH: {
    CHANGE_PASSWORD: {
      REQUEST_OTP: "/change-password/request-otp",
      VERIFY_OTP: "/change-password/verify-otp",
      RESET: "/change-password/reset",
    },
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
      CHANGE_PASSWORD: {
        REQUEST_OTP: "/users/change-password/request-otp",
        VERIFY_OTP: "/users/change-password/verify-otp",
        RESET: "/users/change-password/reset",
      },
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
      CHANGE_PASSWORD: {
        REQUEST_OTP: "/investors/change-password/request-otp",
        VERIFY_OTP: "/investors/change-password/verify-otp",
        RESET: "/investors/change-password/reset",
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
    PLANS: "/plans",
    PLAN_BY_ID: "/plans/:planId",
    PLAN_STATUS: "/plans/:planId/status",
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
    PERSONAL_POST_BY_ID: "/personal/:userId",
    FEED: "/feed",
    REMOVE: "/remove/:id",
    LIKE: "/likes/:postId",
    LIKES: "/:postId/likes",
  },

  PROJECT: {
    CREATE: "/",
    UPDATE: "/update/:projectId",
    FETCH_PROJECTS: "/",
    PERSONAL_PROJECTS: "/personal",
    PERSONAL_PROJECT_BY_ID: "/personal/:userId",
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
    REMOVE_CONNECTION: "/remove/connection/:userId",
    GET_RELATIONSHIP_STATUS: "/status/:userId",
    GET_USER_CONNECTIONS_PEOPLE: "/users/:userId/connections",
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

  PLANS: {
    AVAILABLE_PLANS: "/available",
  },

  SUBSCRIPTION: {
    CHECKOUT: "/checkout",
    CURRENT: "/current",
  },

  TICKET: {
    CREATE: "/investor/tickets",
    INVESTOR_TICKETS: "/investor",
    FOUNDER_TICKETS: "/founder",
    TICKET_BY_ID: "/:ticketId",
  },

  SESSION: {
    CANCEL_SESSOIN: "/:sessionId/cancel",
    ADD_FEEDBACK: "/:sessionId/feedback",
  },

  PITCH: {
    CREATE: "/pitch",
    RECEIVED: "/received",
    SENT: "/sent",
    GET_BY_ID: "/:pitchId",
    RESPOND: "/:id/respond",
  },

  OFFER: {
    CREATE: "/investment-offer",
    SENT: "/sent",
    RECEIVED: "/received",
    GET_BY_ID: "/:offerId",
    ACCEPT: "/:offerId/accept",
    REJECT: "/:offerId/reject",
  },

  WALLET: {
    ME: "/me",
    PROJECT: "/project/:projectId",
    TOPUP_CHECKOUT: "/topup/checkout",
  },

  TRANSACTION: {
    MY_WALLET: "/",
  },

  NOTIFICATION: {
    ME: "/me",
    MARK_READ: "/:id/read",
    MARK_ALL_READ: "/read-all",
  },

  CHAT: {
    CREATE_CONVERSATION: "/conversation",
    GET_CONVERSATIONS: "/conversations",
    GET_MESSAGES: "/messages/:conversationId",
    SEND_MESSAGE: "/message",
    MARK_READ: "/read/:conversationId",
    UNREAD_COUNT: "/unread-count",
  },

  DEAL: {
    MY: "/my",
    GET_BY_ID: "/:dealId",
    GET_INSTALLMENTS: "/:dealId/installments",
    INSTALLMENT_CHECKOUT: "/deals/:dealId/installment-checkout",
  },
};
