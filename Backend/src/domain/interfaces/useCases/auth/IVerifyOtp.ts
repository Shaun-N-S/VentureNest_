export interface IVerifyOtpUseCase {
  verifyOtp(email: string, otp: string): Promise<boolean>;
}
