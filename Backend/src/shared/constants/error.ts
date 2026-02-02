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
