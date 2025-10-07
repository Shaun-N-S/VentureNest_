export interface ForgetPasswordVerifyOtpRequestDTO {
  email: string;
  otp: string;
}

export interface ForgetPasswordResetPasswordRequestDTO {
  email: string;
  token: string;
  password: string;
}
