export const Errors = {
  INVALID_CREDENTIALS: "Invalid email or password",
  OTP_MISSING: "OTP expired or OTP not found",
  DATA_MISSING: "Data is missing check email , userName and password",
  OTP_VERIFICATION_FAILED: "Otp verification failed",
  OTP_ERROR: "Error while sending otp",
  INVALID_OTP: "Invalid otp ",
  OTP_RESEND_ERROR: "Error while resending otp",
  INVALID_EMAIL: "Please provide a valid email",
  PASSWORD_REQUIRED: "Password requried",
  INVALID_USERDATA: "Invalid user data ",
  INVALID_DATA: "Invalid data format",
  OTP_EXPIRED: "Otp expired or invalid otp",
  TOKEN_EXPIRED: "Token expired",
  TOKEN_MISMATCH: "Token not matching ",
  INVALID_PAGINATION_PARAMETERS: "Invalid pagination parameters",
  FAILED_USER_FETCHING: "Failed to Fetch Users",
  REFRESH_TOKEN_EXPIRED: "Refresh Token expired !",
  INVALID_TOKEN: "Invalid Token !",
  ERROR_IN_LOGOUT: "Error while logging out !",
  ERROR_CREATING_ACCESS_TOKEN: "Error while creating access token !",
  ERROR_IN_RESETING_PASSWORD: "Error while reseting password !",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  AUTHENTICATION_CODE_MISSING: "Authentication code missing",
  INVALID_ROLE: "Invalid role !",
  TOKEN_DATA_MISSING: "Token data is missing",
  INVALID_LOGIN_TYPE: "Invalid login type",
  PASSWORD_NOT_MATCHING: "Password not matching",
  ACCESS_TOKEN_MISSING: "Access Token missing !",
  REFRESH_TOKEN_MISSING: "Refresh Token missing !",
  ACCESS_TOKEN_CREATION_FAILED: "Failed to create access token",
  REFRESH_TOKEN_CREATION_FAILED: "Failed to create refresh token",
  ACCESS_TOKEN_SECRETKEY_MISSING: "Access token secret key not found",
  REFRESH_TOKEN_SECRETKEY_MISSING: "Refresh token secret key not found",
  UPLOAD_ERROR: "Error while uploading",
  CONVERSTION_ERROR: "Error while converting file",
  NO_KYC_FOUND: "No kyc application found",
  UNAUTHORIZED_ACCESS: "Your are not authorized !",
  NO_STATUS_FOUND: "No status found",
  INVALID_STATUS_TRANSITION: "Invalid status transition",
  INVALID_STRIPE_WEBHOOK_SIGNATURE: "Invalid Stripe webhook signature",
  NOT_ALLOWED: "Not allowed!",
  KYC_NOT_VERIFIED: "Your kyc verification is not completed!",
  ADMIN_NOT_FOUND: "Platform admin not found",
  INVALID_AMOUNT: "Invalid amount",
};

export const USER_ERRORS = {
  USER_ALREADY_EXISTS: "User with this email already exists",
  USER_INACTIVE: "User is inactive",
  USER_BLOCKED: "User is blocked ",
  USER_NOT_FOUND: "User not found !",
  USER_INVALIDATION: "Error while validating user !",
  NO_USERS_FOUND: "No users found",
  NO_PROFILE_FOUND: "No profile img found",
};

export const INVESTOR_ERRORS = {
  INVESTOR_ALREADY_EXISTS: "Investor already exists",
  INVESTOR_BLOKED: "Investor is blocked",
  INVESTOR_NOT_FOUND: "Investor not found !",
  INVESTOR_INVALIDATION: "Error while validating investor !",
  NO_INVESTORS_FOUND: "No investors found",
  PROFILE_UPDATION_FAILED: "Failed to update investor profile",
};

export const POST_ERRORS = {
  NO_POST_FOUND: "No posts found",
};

export const RELATIONSHIP_ERRORS = {
  NO_RELATIONSHIP_EXIST: "No relationship existing !",
  CONNECTION_ALREADY_PENDING: "Connection request is already pending !",
  ALREADY_CONNECTED: "Users are already connected !",
  INVALID_RELATIONSHIP_TYPE: "Invalid relationship type !",
};

export const COMMENT_ERRORS = {
  NO_COMMENT_FOUND: "No Comment Found !",
};

export const REPLY_ERRORS = {
  INVALID_REPLY_DATA: "Invalid reply data !",
  NO_REPLY_FOUND: "No Replies found !",
};

export const PROJECT_ERRORS = {
  NO_PROJECTS_FOUND: "No projects found!",
  PROJECT_REGISTRATION_NOT_FOUND: "Project registration not found!",
  INVALID_PROJECT_REGISTRATION_STATUS: "Invalid project registration status!",
  PROJECT_NOT_ELIGIBLE_FOR_EQUITY: "Project not eligible for equity allocation",
  EQUITY_OVERALLOCATION: "Equity overallocation detected",
  CAPTBLE_IMBALANCE: "Cap table imbalance detected",
};

export const REPORT_ERRORS = {
  NO_REPORT_FOUND: "No report found !",
  ALREADY_REPORTED: "You have already reported this item",
};

export const PLAN_ERRORS = {
  PLAN_NOT_FOUND: "Plan not found!",
  INACTIVE_PLAN: "Plan is not active!",
  PLAN_ID_MISSING: "Plan ID is missing!",
};

export const TICKET_ERRORS = {
  TICKET_NOT_FOUND: "Ticket not found!",
};

export const SESSION_ERRORS = {
  SESSION_NOT_FOUND: "Session not found",
  SESSION_ALREADY_CANCELLED: "Session already cancelled",
  CANNOT_FEEDBACK_CANCELLED_SESSION: "Adding feedback cancelled!",
  FEEDBACK_ALREADY_SUBMITTED: "Feedback already added!",
};

export const PITCH_ERRORS = {
  NOT_FOUND: "Pitch not found!",
  ALREADY_RESPONDED: "Already responded",
};

export const OFFER_ERRORS = {
  NOT_FOUND: "Investment offer not found !",
  ALREADY_PROCESSED: "Offer already processed",
  EXPIRED: "Offer expired",
  UNABLE_TO_ACCEPT: "Unable to accept offer",
  INVALID_STATUS: "Invalid Status!",
  REJECTION_REASON_REQUIRED: "Rejection reason required!",
};

export const WALLET_ERRORS = {
  NOT_FOUND: "Wallet not found",
  INVALID_TOPUP_AMOUNT: "Invalid topup amount!",
  WITHDRAWAL_REASON_TOO_SHORT: "Withdrawal reason must be at least 3 characters long",
  WITHDRAWAL_AMOUNT_INVALID: "Withdrawal amount required",
  WITHDRAWAL_UNAUTHORIZED_ACCESS: "You are not authorized to request withdrawal for this project",
  WITHDRAWAL_INSUFFICIENT_BALANCE: "Insufficient balance for withdrawal",
  WITHDRAWAL_ALREADY_PROCESSED: "This withdrawal request has already been processed",
  WITHDRAWAL_NOT_FOUND: "Withdrawal request not found",
  INSUFFICIENT_BALANCE: "Insufficient balance in wallet",
};

export const CHAT_ERRORS = {
  CONVERSATION_NOT_FOUND: "Conversation not found",
};

export const DEAL_ERRORS = {
  DEAL_NOT_FOUND: "Deal not found!",
  DEAL_ALREADY_COMPLETED: "Deal is already completed!",
  INVALID_INSTALLMENT_AMOUNT: "Invalid installment amount!",
  UNAUTHORIZED_DEAL_ACCESS: "You are not authorized to access this deal!",
  UNSUPPORTED_PAYMENT_METHOD: "Unsupported payment method!",
};

export const INSTALLMENT_ERRORS = {
  INSUFFICIENT_BALANCE: "Insufficient wallet balance!",
};

export const SUBSCRIPTION_ERRORS = {
  NO_ACTIVE_SUBSCRIPTION: "No active subscription found",
  INVALID_PLAN: "Invalid plan",
  ACTION_NOT_ALLOWED: "Action not allowed in your plan",
  PROJECT_LIMIT_EXCEEDED: "Project creation limit exceeded for this month",
  PROPOSAL_LIMIT_EXCEEDED: "Proposal sending limit exceeded for this month",
  INVESTMENT_OFFER_LIMIT_EXCEEDED: "Investment offer sending limit exceeded for this month",
};

export const STRIPE_ERRORS = {
  STRIPE_ACCOUNT_CREATION_FAILED: "Failed to create Stripe account",
  STRIPE_ONBOARDING_LINK_CREATION_FAILED: "Failed to create Stripe onboarding link",
  STRIPE_PAYOUT_FAILED: "Failed to create Stripe payout",
  ACCOUNT_NOT_FOUND: "Stripe account not found",
  NOT_CONNECTED: "Stripe not connected",
  NOT_ONBOARDED: "Stripe onboarding not completed",
};
